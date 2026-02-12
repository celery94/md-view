import { NextResponse } from 'next/server';
import { importUrlToMarkdown, UrlImportError } from '../../../lib/url-import';
import type {
  UrlImportErrorResponse,
  UrlImportRequestBody,
  UrlImportSuccessResponse,
} from '../../../lib/url-import-types';

export const runtime = 'nodejs';

function jsonError(
  code: UrlImportErrorResponse['error']['code'],
  message: string,
  status: number
): NextResponse<UrlImportErrorResponse> {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request): Promise<NextResponse<UrlImportSuccessResponse | UrlImportErrorResponse>> {
  let body: unknown;
  try {
    body = (await request.json()) as UrlImportRequestBody;
  } catch {
    return jsonError('INVALID_URL', 'Request body must be valid JSON.', 400);
  }

  const rawUrl =
    typeof body === 'object' &&
    body !== null &&
    'url' in body &&
    typeof body.url === 'string'
      ? body.url
      : '';

  if (!rawUrl.trim()) {
    return jsonError('INVALID_URL', 'Please provide a valid URL.', 400);
  }

  try {
    const result = await importUrlToMarkdown(rawUrl);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof UrlImportError) {
      console.error(
        JSON.stringify({
          scope: 'api.import-url',
          code: error.code,
          message: error.message,
          inputUrl: rawUrl,
          timestamp: new Date().toISOString(),
        })
      );

      const status =
        error.code === 'INVALID_URL' || error.code === 'UNSUPPORTED_HOST'
          ? 400
          : error.code === 'FETCH_TIMEOUT'
            ? 504
            : error.code === 'UNSUPPORTED_CONTENT_TYPE' || error.code === 'CONTENT_TOO_LARGE'
              ? 422
              : error.code === 'PARSE_FAILED'
                ? 422
                : 500;

      return jsonError(error.code, error.message, status);
    }

    console.error(
      JSON.stringify({
        scope: 'api.import-url',
        code: 'INTERNAL_ERROR',
        message: 'Unhandled error while importing URL.',
        inputUrl: rawUrl,
        timestamp: new Date().toISOString(),
      })
    );

    return jsonError('INTERNAL_ERROR', 'Failed to import URL content.', 500);
  }
}
