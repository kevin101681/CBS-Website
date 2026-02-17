import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:bg-primary-900 prose-pre:text-slate-100">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownView;