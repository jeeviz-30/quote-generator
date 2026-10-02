import React, { useState } from 'react';
import { Quote, Heart, History, Sparkles, Volume2, Palette, BarChart3, Sun, Moon, Image as ImageIcon } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, favCount, isDark, setIsDark, onToggleZen, bgTheme, setBgTheme }) {
  const [showBgMenu, setShowBgMenu] = useState(false);

  const bgOptions = [
    { id: 'editorial', name: 'Editorial Waves', icon: '🎨' },
    { id: 'cosmic', name: 'Cosmic Nebula', icon: '🌌' },
    { id: 'misty', name: 'Ambient Mesh', icon: '✨' },
    { id: 'minimal', name: 'Clean Paper', icon: '📜' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('discover')}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 backdrop-blur-md">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold tracking-tight flex items-center gap-1.5">
              AuraQuote
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                Glass
              </span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 -mt-1 font-sans">
              Editorial Quote & History Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/40 dark:bg-stone-800/40 p-1.5 rounded-full border border-stone-200/50 dark:border-stone-700/50 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'discover'
                ? 'bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white shadow-sm font-semibold border border-white/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Discover
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white shadow-sm font-semibold border border-white/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Favorites
            {favCount > 0 && (
              <span className="ml-0.5 bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-rose-500/20">
                {favCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white shadow-sm font-semibold border border-white/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-500" />
            History
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white shadow-sm font-semibold border border-white/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-purple-500" />
            Card Studio
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white shadow-sm font-semibold border border-white/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            Stats
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Background Wallpaper Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBgMenu(!showBgMenu)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-stone-300/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-700 transition-all backdrop-blur-md"
              title="Change Background Wallpaper"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Background</span>
            </button>

            {showBgMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl glass-card p-1.5 shadow-2xl z-50 animate-fade-in space-y-1">
                <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Select Wallpaper
                </span>
                {bgOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setBgTheme(opt.id);
                      setShowBgMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left ${
                      bgTheme === opt.id
                        ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zen Ambient Sound Button */}
          <button
            onClick={onToggleZen}
            title="Zen Ambient Audio Mode"
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-all backdrop-blur-md"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Zen Audio</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-full border border-stone-200/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-700 transition-all backdrop-blur-md"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-200/50 dark:border-stone-800/50 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md">
        <button onClick={() => setActiveTab('discover')} className={`text-xs px-2 py-1 rounded ${activeTab === 'discover' ? 'font-bold text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>Discover</button>
        <button onClick={() => setActiveTab('favorites')} className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'favorites' ? 'font-bold text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>
          Favorites {favCount > 0 && `(${favCount})`}
        </button>
        <button onClick={() => setActiveTab('history')} className={`text-xs px-2 py-1 rounded ${activeTab === 'history' ? 'font-bold text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>History</button>
        <button onClick={() => setActiveTab('studio')} className={`text-xs px-2 py-1 rounded ${activeTab === 'studio' ? 'font-bold text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>Studio</button>
        <button onClick={() => setActiveTab('analytics')} className={`text-xs px-2 py-1 rounded ${activeTab === 'analytics' ? 'font-bold text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>Stats</button>
      </div>
    </header>
  );
}
