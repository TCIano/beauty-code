import React from 'react';
import { LANGUAGES, THEMES } from '../constants';
import { CodeLanguage, EditorSettings } from '../types';
import { Settings, Type, Palette, Layout, Hash, AppWindow } from 'lucide-react';

interface ToolbarProps {
  settings: EditorSettings;
  onUpdate: (newSettings: Partial<EditorSettings>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ settings, onUpdate }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
         <Settings className="w-3 h-3 text-gray-400" />
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visual Settings</span>
      </div>
      
      {/* Scrollable Container for Narrow Widths */}
      <div className="p-3 overflow-x-auto no-scrollbar">
        <div className="flex md:grid md:grid-cols-4 gap-4 min-w-max md:min-w-0">
          
          {/* Language */}
          <div className="flex flex-col gap-1 w-32 md:w-auto">
            <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 uppercase">
              <Type className="w-3 h-3" /> Language
            </label>
            <div className="relative">
              <select
                className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded hover:border-gray-300 px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                value={settings.language}
                onChange={(e) => onUpdate({ language: e.target.value as CodeLanguage })}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-2 pointer-events-none text-gray-400">
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="flex flex-col gap-1 w-32 md:w-auto">
            <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 uppercase">
              <Palette className="w-3 h-3" /> Theme
            </label>
            <div className="relative">
              <select
                className="w-full text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded hover:border-gray-300 px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                value={settings.themeId}
                onChange={(e) => onUpdate({ themeId: e.target.value })}
              >
                {THEMES.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
               <div className="absolute right-2 top-2 pointer-events-none text-gray-400">
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Padding */}
          <div className="flex flex-col gap-1 w-24 md:w-auto">
             <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 uppercase">
              <Layout className="w-3 h-3" /> Padding
            </label>
            <input
              type="range"
              min="16"
              max="64"
              step="8"
              value={settings.padding}
              onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
              className="w-full h-7 cursor-pointer accent-wps-primary"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-row md:flex-col gap-3 md:gap-1 justify-center min-w-[140px] md:min-w-0 border-l md:border-l-0 border-gray-200 pl-3 md:pl-0">
             <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none hover:text-gray-900">
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) => onUpdate({ showLineNumbers: e.target.checked })}
                className="rounded text-wps-primary focus:ring-red-500 w-3.5 h-3.5 border-gray-300"
              />
              <Hash className="w-3 h-3 opacity-50" />
              Nums
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none hover:text-gray-900">
              <input
                type="checkbox"
                checked={settings.windowControls}
                onChange={(e) => onUpdate({ windowControls: e.target.checked })}
                className="rounded text-wps-primary focus:ring-red-500 w-3.5 h-3.5 border-gray-300"
              />
              <AppWindow className="w-3 h-3 opacity-50" />
              Controls
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;