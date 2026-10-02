import React, { useState } from 'react';
import { Heart, Copy, Volume2, RefreshCw, Share2, Sparkles, Download, Check, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuoteCard({
  quoteObj,
  isFavorite,
  onToggleFavorite,
  onNextQuote,
  onCopy,
  onOpenStudio,
  isLoading,
  selectedCategory,
  setSelectedCategory
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Wisdom', 'Inspiration', 'Technology', 'Philosophy', 'Success', 'Life', 'Mindfulness', 'Creative'];

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`"${quoteObj.quote}" by ${quoteObj.author}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(quoteObj);
    if (!isFavorite) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#f59e0b', '#d97706']
      });
    }
  };

  const handleCopyClick = () => {
    const textToCopy = `“${quoteObj.quote}” — ${quoteObj.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onCopy("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Category Pills Selector */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-amber-950 text-amber-50 dark:bg-amber-400 dark:text-amber-950 shadow-md font-semibold'
                : 'bg-white/60 dark:bg-stone-800/60 backdrop-blur-md text-stone-700 dark:text-stone-300 border border-stone-200/50 dark:border-stone-700/50 hover:bg-white/80 dark:hover:bg-stone-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glass Showcase Card */}
      <div className="relative group rounded-3xl p-8 sm:p-12 transition-all duration-300 glass-card">
        
        {/* Subtle Decorative Quotation Marks */}
        <div className="absolute top-6 left-8 text-amber-900/10 dark:text-amber-400/10 font-serif text-8xl pointer-events-none select-none leading-none">
          “
        </div>
        <div className="absolute bottom-6 right-8 text-amber-900/10 dark:text-amber-400/10 font-serif text-8xl pointer-events-none select-none leading-none">
          ”
        </div>

        {/* Top Card Badge Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/25 backdrop-blur-sm">
              {quoteObj.category || 'Wisdom'}
            </span>
            {quoteObj.source && (
              <span className="text-[11px] text-stone-400 dark:text-stone-500 font-sans italic">
                via {quoteObj.source}
              </span>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full border transition-all duration-200 backdrop-blur-md ${
              isFavorite
                ? 'bg-rose-50/80 border-rose-300 text-rose-600 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-400 scale-110 shadow-sm'
                : 'border-stone-200/70 dark:border-stone-800 text-stone-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Quote Content Text */}
        <div className="min-h-[160px] flex flex-col justify-center relative z-10 py-4">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-stone-300/40 dark:bg-stone-800/50 rounded-xl w-5/6 mx-auto"></div>
              <div className="h-6 bg-stone-300/40 dark:bg-stone-800/50 rounded-xl w-4/6 mx-auto"></div>
              <div className="h-4 bg-stone-300/40 dark:bg-stone-800/50 rounded-xl w-1/4 mx-auto mt-6"></div>
            </div>
          ) : (
            <blockquote className="space-y-6">
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 dark:text-stone-100 leading-relaxed font-normal tracking-wide text-center drop-shadow-xs">
                “{quoteObj.quote}”
              </p>
              
              <footer className="text-center pt-2">
                <div className="inline-flex items-center gap-2">
                  <span className="h-px w-8 bg-amber-600/40 dark:bg-amber-400/40"></span>
                  <cite className="not-italic font-sans text-sm sm:text-base font-semibold tracking-wider text-stone-700 dark:text-stone-300 uppercase">
                    {quoteObj.author}
                  </cite>
                  <span className="h-px w-8 bg-amber-600/40 dark:bg-amber-400/40"></span>
                </div>

                {quoteObj.tags && Array.isArray(quoteObj.tags) && quoteObj.tags.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {quoteObj.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400 bg-white/50 dark:bg-stone-800/50 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-stone-200/50 dark:border-stone-700/50">
                        <Tag className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </footer>
            </blockquote>
          )}
        </div>

        {/* Card Action Toolbar */}
        <div className="flex items-center justify-between pt-8 border-t border-stone-200/50 dark:border-stone-800/80 mt-6 relative z-10">
          
          {/* Audio & Copy Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeech}
              className={`p-2.5 rounded-full border transition-all backdrop-blur-md text-stone-600 dark:text-stone-300 ${
                isSpeaking
                  ? 'bg-amber-100/80 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200 animate-pulse'
                  : 'border-stone-200/60 dark:border-stone-800 hover:bg-white/80 dark:hover:bg-stone-800'
              }`}
              title="Listen to Quote (Speech Audio)"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyClick}
              className={`p-2.5 rounded-full border transition-all backdrop-blur-md text-stone-600 dark:text-stone-300 ${
                copied
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                  : 'border-stone-200/60 dark:border-stone-800 hover:bg-white/80 dark:hover:bg-stone-800'
              }`}
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onOpenStudio(quoteObj)}
              className="p-2.5 rounded-full border border-stone-200/60 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-800 transition-all backdrop-blur-md"
              title="Customize Card & Export Image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* New Quote Primary Action */}
          <button
            onClick={onNextQuote}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900/90 text-stone-50 dark:bg-amber-400 dark:text-stone-950 font-sans text-xs font-semibold tracking-wider uppercase hover:bg-amber-950 dark:hover:bg-amber-300 transition-all shadow-md active:scale-95 disabled:opacity-50 backdrop-blur-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Next Quote</span>
          </button>

        </div>

      </div>

    </div>
  );
}
