export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  CSHARP = 'csharp',
  HTML = 'html',
  CSS = 'css',
  SQL = 'sql',
  JSON = 'json',
  BASH = 'bash'
}

export interface CodeTheme {
  id: string;
  name: string;
  background: string; // The CSS background for the container (gradient or solid)
  editorTheme: any; // Syntax highlighter style object
  textColor: string;
}

export type ExportFormat = 'png' | 'svg' | 'copy';

export interface EditorSettings {
  language: CodeLanguage;
  themeId: string;
  padding: number;
  showLineNumbers: boolean;
  title: string;
  windowControls: boolean;
}

// WPS Global Types
declare global {
  interface Window {
    wps?: {
      WppApplication: () => any;
      FileSystem: {
        WriteDecodeBase64ToFile: (path: string, base64: string) => boolean;
      };
      Env: {
        GetTempPath: () => string;
      };
      // Fallback for some WPS versions
      oaassist?: any;
    };
  }
}