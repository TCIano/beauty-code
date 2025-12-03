import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { Copy, Download, Sparkles, Loader2, Code2, ClipboardCheck, Layout, MonitorPlay } from 'lucide-react';

import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import { enhanceCode, explainCode } from './services/geminiService';
import { insertImageToSlide, isWpsEnv } from './services/wpsService';
import { THEMES, DEFAULT_CODE } from './constants';
import { EditorSettings, CodeLanguage, CodeTheme } from './types';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isInWps, setIsInWps] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<EditorSettings>({
    language: CodeLanguage.JAVASCRIPT,
    themeId: 'midnight',
    padding: 32,
    showLineNumbers: false,
    title: 'script.js',
    windowControls: true,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const currentTheme: CodeTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];

  useEffect(() => {
    setIsInWps(isWpsEnv());
  }, []);

  const handleSettingsUpdate = (newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleAIAction = async () => {
    if (!code) return;
    setIsEnhancing(true);
    setExplanation(null);
    try {
      const enhanced = await enhanceCode(code, settings.language);
      setCode(enhanced);
      // Automatically switch to preview on mobile/taskpane after enhancement
      if (window.innerWidth < 768) setActiveTab('preview');
      
      const exp = await explainCode(enhanced);
      setExplanation(exp);
    } catch (error) {
      alert("Could not enhance code. Check API Key or Network.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateBlob = async () => {
    if (previewRef.current === null) return null;
    // Ensure preview is visible for capture (hack for mobile tab view where it might be hidden)
    const wasHidden = previewRef.current.offsetParent === null;
    // If hidden, we rely on the fact that we might need to mount it. 
    // In this React structure, if 'activeTab' is editor, Preview is unmounted or hidden.
    // For simplicity in this specialized plugin, we force rendering or user must be on preview tab to export.
    
    return await toBlob(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2, 
    });
  };

  const handleCopy = useCallback(async () => {
    setIsProcessing(true);
    try {
      const blob = await generateBlob();
      if (!blob) throw new Error("Switch to Preview tab to copy");

      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      
      setStatusMessage("Copied!");
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Could not copy. Please ensure you are on the Preview tab.');
    } finally {
      setIsProcessing(false);
    }
  }, [previewRef]);

  const handleDownload = useCallback(async () => {
    try {
      const blob = await generateBlob();
      if (!blob) return alert("Switch to Preview tab to download");
      
      const link = document.createElement('a');
      link.download = `codesnap-${Date.now()}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (err) {
      console.error(err);
    }
  }, [previewRef]);

  const handleWpsInsert = useCallback(async () => {
    setIsProcessing(true);
    setStatusMessage("Inserting...");
    try {
      // 1. We need to get the Base64 data. toBlob returns a Blob, we need to convert it.
      // Alternatively toPng returns dataUrl directly.
      const { toPng } = await import('html-to-image');
      if (previewRef.current === null) throw new Error("Preview not active");
      
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2 });
      await insertImageToSlide(dataUrl);
      
      setStatusMessage("Inserted!");
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to insert into Slide: ' + (err as Error).message);
      setStatusMessage(null);
    } finally {
      setIsProcessing(false);
    }
  }, [previewRef]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-gray-100">
      
      {/* HEADER / NAVIGATION (Visible on Mobile/TaskPane) */}
      <div className="md:hidden bg-white border-b border-gray-200 p-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-wps-primary font-bold">
          <Code2 className="w-5 h-5" />
          <span className="text-sm">CodeSnap</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'editor' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* EDITOR PANEL */}
      <div className={`w-full md:w-[400px] flex flex-col border-r border-gray-200 bg-white shadow-xl z-20 transition-all ${
        activeTab === 'editor' ? 'flex-1' : 'hidden md:flex h-full'
      }`}>
        <div className="hidden md:flex p-4 border-b border-gray-200 items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-wps-primary font-bold text-lg">
            <Code2 className="w-6 h-6" />
            <span>CodeSnap</span>
          </div>
          <div className="text-[10px] font-bold text-wps-primary bg-red-50 px-2 py-0.5 rounded border border-red-100">
            WPS PLUGIN
          </div>
        </div>

        <div className="flex-1 relative flex flex-col min-h-0">
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none focus:bg-gray-50 transition-colors text-gray-700 leading-relaxed"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleAIAction}
              disabled={isEnhancing || !code.trim()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-white text-xs font-bold transition-all ${
                isEnhancing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 active:scale-95'
              }`}
            >
              {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {isEnhancing ? 'Optimizing...' : 'AI Enhance'}
            </button>
          </div>
        </div>

        {explanation && (
          <div className="bg-blue-50 p-3 border-t border-blue-100 shrink-0">
             <h3 className="text-[10px] font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
               <MonitorPlay className="w-3 h-3"/> Slide Note
             </h3>
             <p className="text-xs text-blue-800 leading-snug line-clamp-3 hover:line-clamp-none cursor-pointer" title="Click to expand">{explanation}</p>
          </div>
        )}

        <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2 shrink-0">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Window Title</label>
            <input 
              type="text" 
              value={settings.title}
              onChange={(e) => handleSettingsUpdate({ title: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
              placeholder="e.g. app.js"
            />
          </div>
        </div>
      </div>

      {/* PREVIEW PANEL */}
      <div className={`flex-1 flex flex-col h-full relative bg-gray-100/50 ${
        activeTab === 'preview' ? 'flex h-full' : 'hidden md:flex'
      }`}>
        <div className="shrink-0">
           <Toolbar settings={settings} onUpdate={handleSettingsUpdate} />
        </div>
        
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
           <Preview 
             ref={previewRef} 
             code={code || "// Input code to see preview"} 
             settings={settings} 
             theme={currentTheme} 
           />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-3 bg-white border-t border-gray-200 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {isInWps ? (
             <button
             onClick={handleWpsInsert}
             disabled={isProcessing}
             className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold shadow-md transition-all ${
               isProcessing 
                 ? 'bg-gray-400' 
                 : 'bg-wps-primary hover:bg-red-700 hover:shadow-lg'
             }`}
           >
             {isProcessing ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <Layout className="w-4 h-4" />
             )}
             {statusMessage || "Insert to Slide"}
           </button>
          ) : (
             <button
              onClick={handleCopy}
              disabled={isProcessing}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold shadow-md transition-all ${
                isProcessing 
                  ? 'bg-green-600' 
                  : 'bg-wps-primary hover:bg-red-700 hover:shadow-lg'
              }`}
            >
              {isProcessing || statusMessage ? (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  {statusMessage || "Copied!"}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Image
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;