interface FormatOptions {
  printWidth?: number;
  tabWidth?: number;
  useTabs?: boolean;
}

/**
 * Format markdown content with consistent spacing and structure
 */
export async function formatMarkdown(
  content: string, 
  options: FormatOptions = {}
): Promise<string> {
  try {
    const { printWidth = 80, tabWidth = 2, useTabs = false } = options;
    const indent = useTabs ? '\t' : ' '.repeat(tabWidth);
    
    // Split content into lines
    const lines = content.split('\n');
    const formattedLines: string[] = [];
    
    let inCodeBlock = false;
    let codeBlockLanguage = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Handle code blocks - don't format inside them
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLanguage = trimmedLine.substring(3).trim();
        } else {
          inCodeBlock = false;
          codeBlockLanguage = '';
        }
        formattedLines.push(line);
        continue;
      }
      
      if (inCodeBlock) {
        formattedLines.push(line);
        continue;
      }
      
      // Format different markdown elements
      if (trimmedLine === '') {
        // Preserve single empty lines, remove multiple consecutive empty lines
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1].trim() !== '') {
          formattedLines.push('');
        }
      } else if (trimmedLine.startsWith('#')) {
        // Headers - ensure single space after #
        const headerMatch = trimmedLine.match(/^(#{1,6})\s*(.*)$/);
        if (headerMatch) {
          const [, hashes, title] = headerMatch;
          formattedLines.push(`${hashes} ${title.trim()}`);
        } else {
          formattedLines.push(trimmedLine);
        }
      } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('+')) {
        // Unordered lists - ensure single space after marker
        const listMatch = trimmedLine.match(/^([-*+])\s*(.*)$/);
        if (listMatch) {
          const [, marker, content] = listMatch;
          formattedLines.push(`${marker} ${content.trim()}`);
        } else {
          formattedLines.push(trimmedLine);
        }
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        // Ordered lists - ensure single space after number
        const orderedListMatch = trimmedLine.match(/^(\d+\.)\s*(.*)$/);
        if (orderedListMatch) {
          const [, number, content] = orderedListMatch;
          formattedLines.push(`${number} ${content.trim()}`);
        } else {
          formattedLines.push(trimmedLine);
        }
      } else if (trimmedLine.startsWith('>')) {
        // Blockquotes - ensure single space after >
        const quoteMatch = trimmedLine.match(/^(>+)\s*(.*)$/);
        if (quoteMatch) {
          const [, markers, content] = quoteMatch;
          formattedLines.push(`${markers} ${content.trim()}`);
        } else {
          formattedLines.push(trimmedLine);
        }
      } else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        // Tables - format with consistent spacing
        const cells = trimmedLine.split('|').slice(1, -1); // Remove empty first/last
        const formattedCells = cells.map(cell => ` ${cell.trim()} `);
        formattedLines.push(`|${formattedCells.join('|')}|`);
      } else {
        // Regular paragraphs - wrap long lines if needed
        if (line.length > printWidth && !trimmedLine.startsWith('http') && !trimmedLine.includes('](')) {
          const wrapped = wrapText(trimmedLine, printWidth);
          formattedLines.push(...wrapped);
        } else {
          formattedLines.push(trimmedLine);
        }
      }
    }
    
    // Remove trailing empty lines and ensure single trailing newline
    while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1].trim() === '') {
      formattedLines.pop();
    }
    
    return formattedLines.join('\n') + '\n';
  } catch (error) {
    console.error('Error formatting markdown:', error);
    // Return original content if formatting fails
    return content;
  }
}

/**
 * Simple text wrapping function
 */
function wrapText(text: string, width: number): string[] {
  if (text.length <= width) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Check if markdown formatting is available
 */
export function canFormatMarkdown(): boolean {
  return true; // Our custom formatter is always available
}