import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import type {
  UrlImportErrorCode,
  UrlImportSuccessResponse,
} from './url-import-types';

const FETCH_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 3;
const MAX_CONTENT_BYTES = 3 * 1024 * 1024;

export class UrlImportError extends Error {
  readonly code: UrlImportErrorCode;

  constructor(code: UrlImportErrorCode, message: string) {
    super(message);
    this.name = 'UrlImportError';
    this.code = code;
  }
}

function stripIpv6Brackets(hostname: string): string {
  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    return hostname.slice(1, -1);
  }
  return hostname;
}

function toIpv4FromMappedIpv6(ip: string): string | null {
  const match = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  return match?.[1] ?? null;
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return true;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;
  if (normalized.startsWith('fe8')) return true;
  if (normalized.startsWith('fe9')) return true;
  if (normalized.startsWith('fea')) return true;
  if (normalized.startsWith('feb')) return true;
  if (normalized.startsWith('fc')) return true;
  if (normalized.startsWith('fd')) return true;
  return false;
}

function isUnsupportedIpAddress(address: string): boolean {
  const mappedIpv4 = toIpv4FromMappedIpv6(address);
  if (mappedIpv4) {
    return isPrivateIpv4(mappedIpv4);
  }

  const ipVersion = isIP(address);
  if (ipVersion === 4) return isPrivateIpv4(address);
  if (ipVersion === 6) return isPrivateIpv6(address);
  return false;
}

function validateUrl(rawUrl: string): URL {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new UrlImportError('INVALID_URL', 'Please enter a valid URL.');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new UrlImportError('INVALID_URL', 'Please enter a valid URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new UrlImportError('INVALID_URL', 'Only http(s) URLs are supported.');
  }

  return parsed;
}

async function ensureSupportedHost(url: URL): Promise<void> {
  const hostname = stripIpv6Brackets(url.hostname).toLowerCase();

  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '0.0.0.0' ||
    hostname === '::1'
  ) {
    throw new UrlImportError('UNSUPPORTED_HOST', 'This host is not allowed.');
  }

  const ipVersion = isIP(hostname);
  if (ipVersion > 0 && isUnsupportedIpAddress(hostname)) {
    throw new UrlImportError('UNSUPPORTED_HOST', 'Private or local addresses are not allowed.');
  }

  if (ipVersion > 0) {
    return;
  }

  try {
    const records = await lookup(hostname, { all: true, verbatim: true });
    if (records.some((record) => isUnsupportedIpAddress(record.address))) {
      throw new UrlImportError('UNSUPPORTED_HOST', 'Private or local addresses are not allowed.');
    }
  } catch (error) {
    if (error instanceof UrlImportError) {
      throw error;
    }
  }
}

async function fetchWithRedirects(
  initialUrl: URL,
  signal: AbortSignal
): Promise<{ response: Response; finalUrl: URL }> {
  let currentUrl = initialUrl;

  for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
    const response = await fetch(currentUrl.toString(), {
      method: 'GET',
      redirect: 'manual',
      signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'md-view-url-import/1.0 (+https://www.md-view.com/)',
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        throw new UrlImportError('INTERNAL_ERROR', 'Redirect response was missing location.');
      }
      if (i === MAX_REDIRECTS) {
        throw new UrlImportError('INTERNAL_ERROR', 'Too many redirects.');
      }
      const nextUrl = validateUrl(new URL(location, currentUrl).toString());
      await ensureSupportedHost(nextUrl);
      currentUrl = nextUrl;
      continue;
    }

    if (!response.ok) {
      throw new UrlImportError('INTERNAL_ERROR', `Unable to fetch URL (HTTP ${response.status}).`);
    }

    return { response, finalUrl: currentUrl };
  }

  throw new UrlImportError('INTERNAL_ERROR', 'Unable to fetch URL.');
}

async function readResponseTextWithLimit(response: Response): Promise<string> {
  if (!response.body) {
    const text = await response.text();
    const size = new TextEncoder().encode(text).byteLength;
    if (size > MAX_CONTENT_BYTES) {
      throw new UrlImportError('CONTENT_TOO_LARGE', 'The webpage is too large (max 3MB).');
    }
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_CONTENT_BYTES) {
      throw new UrlImportError('CONTENT_TOO_LARGE', 'The webpage is too large (max 3MB).');
    }
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return text;
}

function absolutizeAttributeValue(value: string, baseUrl: URL): string {
  if (!value) return value;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function normalizeExtractedHtml(html: string, baseUrl: URL): string {
  const dom = new JSDOM(`<main>${html}</main>`, { url: baseUrl.toString() });
  const document = dom.window.document;

  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    anchor.setAttribute('href', absolutizeAttributeValue(anchor.getAttribute('href') ?? '', baseUrl));
  });

  document
    .querySelectorAll<HTMLElement>('img[src],source[src],video[src],audio[src]')
    .forEach((element) => {
      const src = element.getAttribute('src');
      if (!src) return;
      element.setAttribute('src', absolutizeAttributeValue(src, baseUrl));
    });

  return document.querySelector('main')?.innerHTML ?? html;
}

function extractMarkdown(html: string, sourceUrl: URL): { markdown: string; title: string } {
  const dom = new JSDOM(html, { url: sourceUrl.toString() });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article?.content) {
    throw new UrlImportError('PARSE_FAILED', 'Could not extract readable content from this page.');
  }

  const normalizedHtml = normalizeExtractedHtml(article.content, sourceUrl);
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  const markdown = turndownService.turndown(normalizedHtml).trim();
  if (!markdown) {
    throw new UrlImportError('PARSE_FAILED', 'Could not convert page content to markdown.');
  }

  const title = (article.title || dom.window.document.title || sourceUrl.hostname).trim();
  return { markdown, title: title || sourceUrl.hostname };
}

function toPublicError(error: unknown): UrlImportError {
  if (error instanceof UrlImportError) {
    return error;
  }

  if (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  ) {
    return new UrlImportError('FETCH_TIMEOUT', 'Fetching the URL timed out after 12 seconds.');
  }

  return new UrlImportError('INTERNAL_ERROR', 'Failed to import URL content.');
}

export async function importUrlToMarkdown(rawUrl: string): Promise<UrlImportSuccessResponse> {
  const inputUrl = validateUrl(rawUrl);
  await ensureSupportedHost(inputUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const { response, finalUrl } = await fetchWithRedirects(inputUrl, controller.signal);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      throw new UrlImportError(
        'UNSUPPORTED_CONTENT_TYPE',
        'Only HTML pages can be imported from URL.'
      );
    }

    const html = await readResponseTextWithLimit(response);
    const { markdown, title } = extractMarkdown(html, finalUrl);

    return {
      markdown,
      title,
      sourceUrl: finalUrl.toString(),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw toPublicError(error);
  } finally {
    clearTimeout(timeout);
  }
}
