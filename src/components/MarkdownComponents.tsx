"use client"

import { type ComponentPropsWithoutRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Helper function to preprocess markdown content
export const processMarkdownNewlines = (content: string): string => {
    if (!content) return '';

    // Replace groups of 2 or more newlines with special markers
    return content
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, match => {
            // Insert non-breaking spaces with hard line breaks to preserve spacing
            return '\n\n' + Array(match.length - 1).fill('&nbsp;  ').join('\n') + '\n\n';
        });
};

const markdownComponents = {
    // Simplified pre component
    pre: (props: ComponentPropsWithoutRef<'pre'>) => {
        return (
            <pre
                className="max-w-full bg-gray-50 rounded-md p-3 my-4 overflow-x-auto"
                style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere'
                }}
                {...props}
            />
        );
    },

    // Code component handles syntax highlighting directly
    code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
        const isInline = !className?.includes('language-');

        if (isInline) {
            return (
                <code
                    className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                    {...props}
                >
                    {children}
                </code>
            );
        }

        // Extract language from className
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : 'text';
        const code = String(children);

        return (
            <div className="max-w-full">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                        borderRadius: '0.375rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        margin: '1rem 0',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap'
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                    codeTagProps={{
                        style: {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        );
    },

    // Enhanced paragraph component
    p: (props: ComponentPropsWithoutRef<'p'>) => {
        // Get the content as a string
        const content = props.children?.toString() || '';

        // Special handling for non-breaking space paragraphs
        if (content.trim() === '&nbsp;') {
            return <div className="h-4" aria-hidden="true" />;
        }

        return (
            <p
                className="max-w-full mb-4"
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
                {...props}
            />
        );
    },

    // Add styling for links with target="_blank"
    a: (props: ComponentPropsWithoutRef<'a'>) => (
        <a
            className="text-blue-600 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),

    // Enhanced handling for breaks to ensure they create vertical space
    br: () => <div className="h-4" aria-hidden="true" />,

    // Handle consecutive newlines in text nodes
    text: (props: { children?: React.ReactNode }) => {
        const content = props.children?.toString() || '';

        if (content.includes('&nbsp;')) {
            return <>{content.replace(/&nbsp;/g, ' ')}</>;
        }

        return <>{props.children}</>;
    },

    // Add list item component
    li: (props: ComponentPropsWithoutRef<'li'>) => (
        <li className="ml-6 mb-2" {...props} />
    ),

    // Add ordered list component
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
        <ol className="list-decimal pl-4 mb-4" {...props} />
    ),

    // Add unordered list component
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
        <ul className="list-disc pl-4 mb-4" {...props} />
    ),

    // Add heading components
    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
        <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
    ),
    h2: (props: ComponentPropsWithoutRef<'h2'>) => (
        <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
    ),
    h3: (props: ComponentPropsWithoutRef<'h3'>) => (
        <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
    ),
    h4: (props: ComponentPropsWithoutRef<'h4'>) => (
        <h4 className="text-base font-bold mt-3 mb-2" {...props} />
    ),
    h5: (props: ComponentPropsWithoutRef<'h5'>) => (
        <h5 className="text-sm font-bold mt-2 mb-1" {...props} />
    ),
    h6: (props: ComponentPropsWithoutRef<'h6'>) => (
        <h6 className="text-xs font-bold mt-2 mb-1" {...props} />
    ),

    // Add blockquote component
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
        <blockquote
            className="pl-4 border-l-4 border-gray-300 italic my-4 text-gray-700"
            {...props}
        />
    ),

    // Add table components for markdown tables
    table: (props: ComponentPropsWithoutRef<'table'>) => (
        <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200" {...props} />
        </div>
    ),
    thead: (props: ComponentPropsWithoutRef<'thead'>) => (
        <thead className="bg-gray-50" {...props} />
    ),
    tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
        <tbody className="bg-white divide-y divide-gray-200" {...props} />
    ),
    tr: (props: ComponentPropsWithoutRef<'tr'>) => (
        <tr className="hover:bg-gray-50" {...props} />
    ),
    th: (props: ComponentPropsWithoutRef<'th'>) => (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
    ),
    td: (props: ComponentPropsWithoutRef<'td'>) => (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" {...props} />
    ),

    // Add horizontal rule
    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
        <hr className="my-6 border-t border-gray-300" {...props} />
    )
};

export default markdownComponents;