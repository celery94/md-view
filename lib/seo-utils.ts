export function generateMetaDescription(markdownContent: string): string {
  // Remove markdown syntax and get plain text
  const plainText = markdownContent
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (!plainText || plainText.length < 50) {
    return 'Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting and GitHub Flavored Markdown support.';
  }

  // Take first 150 characters and ensure it ends at a word boundary
  const excerpt = plainText.substring(0, 150);
  const lastSpace = excerpt.lastIndexOf(' ');
  const description = lastSpace > 100 ? excerpt.substring(0, lastSpace) : excerpt;
  
  return `${description}... | Free markdown editor with live preview and syntax highlighting.`;
}

export function generatePageTitle(markdownContent: string): string {
  // Extract first heading as potential title
  const headingMatch = markdownContent.match(/^#{1,6}\s+(.+)$/m);
  
  if (headingMatch && headingMatch[1]) {
    const title = headingMatch[1].trim();
    if (title.length > 0 && title.length < 60) {
      return `${title} | MD-View`;
    }
  }
  
  return 'MD-View - Real-time Markdown Editor & Live Preview';
}
