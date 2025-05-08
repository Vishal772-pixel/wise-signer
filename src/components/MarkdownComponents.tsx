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
    }
};

export default markdownComponents;