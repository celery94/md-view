'use client';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start typing your markdown here..."
      className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black font-mono text-sm leading-relaxed overflow-auto"
      spellCheck={false}
      aria-label="Markdown editor textarea"
      aria-describedby="editor-description"
      role="textbox"
      aria-multiline="true"
    />
  );
}
