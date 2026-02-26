function readLine(
  source: string,
  startIndex: number
): { line: string; nextIndex: number } {
  let i = startIndex;
  while (i < source.length && source[i] !== '\n' && source[i] !== '\r') {
    i += 1;
  }

  const line = source.slice(startIndex, i);
  if (i >= source.length) {
    return { line, nextIndex: i };
  }

  if (source[i] === '\r' && source[i + 1] === '\n') {
    return { line, nextIndex: i + 2 };
  }

  return { line, nextIndex: i + 1 };
}

function isFenceLine(line: string): boolean {
  return /^\s*---\s*$/.test(line);
}

function looksLikeYamlKeyValue(line: string): boolean {
  return /^[A-Za-z0-9_-]+\s*:/.test(line);
}

export function stripLeadingYamlFrontmatter(input: string): string {
  if (!input) return input;

  const startIndex = input.charCodeAt(0) === 0xfeff ? 1 : 0;
  const firstLine = readLine(input, startIndex);
  if (!isFenceLine(firstLine.line)) {
    return input;
  }

  let cursor = firstLine.nextIndex;
  let hasYamlKeyValue = false;
  let bodyStartIndex: number | null = null;

  while (cursor <= input.length) {
    const next = readLine(input, cursor);

    if (isFenceLine(next.line)) {
      bodyStartIndex = next.nextIndex;
      break;
    }

    if (looksLikeYamlKeyValue(next.line)) {
      hasYamlKeyValue = true;
    }

    if (next.nextIndex === cursor) {
      break;
    }

    cursor = next.nextIndex;
  }

  if (!hasYamlKeyValue || bodyStartIndex === null) {
    return input;
  }

  // Drop exactly one blank separator line between frontmatter and body.
  if (input.startsWith('\r\n', bodyStartIndex)) {
    bodyStartIndex += 2;
  } else if (
    input[bodyStartIndex] === '\n' ||
    input[bodyStartIndex] === '\r'
  ) {
    bodyStartIndex += 1;
  }

  return input.slice(bodyStartIndex);
}
