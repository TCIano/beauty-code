import { CodeLanguage, CodeTheme } from './types';
import { vs2015, docco, dracula, atomOneDark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const LANGUAGES = [
  { label: 'JavaScript', value: CodeLanguage.JAVASCRIPT },
  { label: 'TypeScript', value: CodeLanguage.TYPESCRIPT },
  { label: 'Python', value: CodeLanguage.PYTHON },
  { label: 'Java', value: CodeLanguage.JAVA },
  { label: 'C++', value: CodeLanguage.CPP },
  { label: 'C#', value: CodeLanguage.CSHARP },
  { label: 'HTML', value: CodeLanguage.HTML },
  { label: 'CSS', value: CodeLanguage.CSS },
  { label: 'SQL', value: CodeLanguage.SQL },
  { label: 'JSON', value: CodeLanguage.JSON },
  { label: 'Bash', value: CodeLanguage.BASH },
];

export const THEMES: CodeTheme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    editorTheme: vs2015,
    textColor: '#e2e8f0'
  },
  {
    id: 'dracula',
    name: 'Vampire',
    background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
    editorTheme: dracula,
    textColor: '#f8f8f2'
  },
  {
    id: 'clean-light',
    name: 'Paper',
    background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
    editorTheme: docco,
    textColor: '#333'
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
    editorTheme: atomOneDark,
    textColor: '#abb2bf'
  },
  {
    id: 'forest',
    name: 'Forest',
    background: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    editorTheme: vs2015,
    textColor: '#e2e8f0'
  },
  {
    id: 'plain',
    name: 'Transparent',
    background: 'transparent',
    editorTheme: github,
    textColor: '#24292e'
  }
];

export const DEFAULT_CODE = `// Welcome to CodeSnap for WPS
// Paste your code here to beautify it!

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("PowerPoint"));`;