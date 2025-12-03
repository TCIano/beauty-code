import React, { forwardRef } from 'react';
import LightSyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';

import { EditorSettings, CodeTheme } from '../types';

// Register languages to keep bundle small (light version)
LightSyntaxHighlighter.registerLanguage('javascript', js);
LightSyntaxHighlighter.registerLanguage('typescript', ts);
LightSyntaxHighlighter.registerLanguage('python', python);
LightSyntaxHighlighter.registerLanguage('java', java);
LightSyntaxHighlighter.registerLanguage('cpp', cpp);
LightSyntaxHighlighter.registerLanguage('csharp', csharp);
LightSyntaxHighlighter.registerLanguage('html', xml);
LightSyntaxHighlighter.registerLanguage('css', css);
LightSyntaxHighlighter.registerLanguage('sql', sql);
LightSyntaxHighlighter.registerLanguage('json', json);
LightSyntaxHighlighter.registerLanguage('bash', bash);

interface PreviewProps {
  code: string;
  settings: EditorSettings;
  theme: CodeTheme;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ code, settings, theme }, ref) => {
  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-100 flex items-center justify-center min-h-[400px]">
      {/* The Container that gets captured */}
      <div
        ref={ref}
        style={{
          background: theme.background,
          padding: `${settings.padding}px`,
        }}
        className="rounded-xl shadow-2xl transition-all duration-300 min-w-[300px] max-w-[90%] overflow-hidden relative group"
      >
        <div 
          className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10"
        >
          {/* Window Title Bar */}
          {(settings.windowControls || settings.title) && (
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
              {settings.windowControls && (
                <div className="flex gap-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
              )}
              {settings.title && (
                <div className="text-xs font-mono text-white/60 flex-1 text-center truncate mr-12">
                  {settings.title}
                </div>
              )}
            </div>
          )}

          {/* Syntax Highlighter */}
          <div className="text-sm md:text-base leading-relaxed">
            <LightSyntaxHighlighter
              language={settings.language}
              style={theme.editorTheme}
              showLineNumbers={settings.showLineNumbers}
              wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'transparent', // Let container bg show through or handle via theme
                fontSize: '14px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
              lineNumberStyle={{
                minWidth: '2em',
                paddingRight: '1em',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'right',
              }}
            >
              {code}
            </LightSyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;