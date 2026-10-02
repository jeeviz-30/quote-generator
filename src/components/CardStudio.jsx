import React, { useState, useRef } from 'react';
import { Palette, Download, Type, Sliders, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function CardStudio({ currentQuote, onToast }) {
  const cardRef = useRef(null);
  const [quoteText, setQuoteText] = useState(currentQuote ? currentQuote.quote : "The secret of getting ahead is getting started.");
  const [authorText, setAuthorText] = useState(currentQuote ? currentQuote.author : "Mark Twain");
  
  const [fontFamily, setFontFamily] = useState('serif');
  const [fontSize, setFontSize] = useState('text-2xl sm:text-3xl');
  const [themeStyle, setThemeStyle] = useState('editorial-warm');
  const [isExporting, setIsExporting] = useState(false);

  const themePalettes = {
    'editorial-warm': 'bg-[#F4EFE6]/90 text-stone-900 border border-[#E6DCCF] shadow-2xl backdrop-blur-xl',
    'midnight-ink': 'bg-stone-950/90 text-stone-100 border border-stone-800 shadow-2xl backdrop-blur-xl',
    'nordic-sage': 'bg-[#EBF2EA]/90 text-emerald-950 border border-[#CDE0CC] shadow-xl backdrop-blur-xl',
    'sunset-amber': 'bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-amber-100/90 text-amber-950 border border-amber-200/80 shadow-xl backdrop-blur-xl',
    'clean-white': 'bg-white/85 text-stone-900 border border-white/60 shadow-2xl backdrop-blur-xl'
  };

  const themeNames = [
    { id: 'editorial-warm', name: 'Warm Editorial', color: 'bg-[#F4EFE6]' },
    { id: 'midnight-ink', name: 'Midnight Ink', color: 'bg-stone-950 text-white' },
    { id: 'nordic-sage', name: 'Nordic Sage', color: 'bg-[#EBF2EA]' },
    { id: 'sunset-amber', name: 'Sunset Amber', color: 'bg-amber-100' },
    { id: 'clean-white', name: 'Minimal White', color: 'bg-white border' },
  ];

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `quote_${authorText.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      onToast("Quote image downloaded successfully!");
    } catch (err) {
      console.error('Failed to export PNG:', err);
      onToast("Error exporting image");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Glass Header */}
      <div className="glass-card p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Quote Card Studio & Exporter
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-sans">
            Customize typography, themes, layout & export high-res PNG for social sharing
          </p>
        </div>

        <button
          onClick={handleDownloadPNG}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-950 text-stone-50 dark:bg-amber-400 dark:text-stone-950 text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all shadow-md active:scale-95 disabled:opacity-50 backdrop-blur-sm"
        >
          <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Generating PNG...' : 'Download Image'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Glass Panel */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl space-y-6 shadow-sm">
          
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            Design Settings
          </h3>

          {/* Edit Text */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block">Quote Text</label>
            <textarea
              rows={3}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full p-3 text-xs rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block">Author Name</label>
            <input
              type="text"
              value={authorText}
              onChange={(e) => setAuthorText(e.target.value)}
              className="w-full p-3 text-xs rounded-2xl bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block">Color Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {themeNames.map(t => (
                <button
                  key={t.id}
                  onClick={() => setThemeStyle(t.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition-all ${
                    themeStyle === t.id
                      ? 'border-amber-600 ring-2 ring-amber-500/20 font-bold bg-white/70 dark:bg-stone-800/70'
                      : 'border-stone-200/60 dark:border-stone-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${t.color} border shadow-xs`}></span>
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Font */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block">Font Family</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontFamily('serif')}
                className={`flex-1 py-2 rounded-xl text-xs font-serif border ${fontFamily === 'serif' ? 'bg-amber-100/80 border-amber-400 text-amber-900 font-bold' : 'border-stone-200/60 dark:border-stone-800'}`}
              >
                Classic Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`flex-1 py-2 rounded-xl text-xs font-sans border ${fontFamily === 'sans' ? 'bg-amber-100/80 border-amber-400 text-amber-900 font-bold' : 'border-stone-200/60 dark:border-stone-800'}`}
              >
                Modern Sans
              </button>
            </div>
          </div>

        </div>

        {/* Right Canvas Preview */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-4">
          
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Live Preview (PNG Export Canvas)
          </span>

          <div
            ref={cardRef}
            className={`w-full max-w-xl p-10 sm:p-14 rounded-3xl transition-all duration-300 relative flex flex-col justify-between min-h-[340px] ${themePalettes[themeStyle]}`}
          >
            <div className="text-4xl opacity-20 font-serif leading-none select-none">“</div>
            
            <blockquote className="my-auto space-y-6">
              <p className={`text-center leading-relaxed tracking-wide ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${fontSize}`}>
                “{quoteText}”
              </p>

              <footer className="text-center pt-2">
                <div className="inline-flex items-center gap-3">
                  <span className="h-px w-6 bg-current opacity-30"></span>
                  <cite className="not-italic font-sans text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80">
                    {authorText}
                  </cite>
                  <span className="h-px w-6 bg-current opacity-30"></span>
                </div>
              </footer>
            </blockquote>

            <div className="flex items-center justify-between text-[10px] opacity-40 uppercase tracking-widest pt-4 border-t border-current/10">
              <span>AuraQuote Studio</span>
              <span>Curated Inspiration</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
