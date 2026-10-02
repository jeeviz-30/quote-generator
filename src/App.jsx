import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuoteCard from './components/QuoteCard';
import FavoritesDrawer from './components/FavoritesDrawer';
import HistoryTimeline from './components/HistoryTimeline';
import CardStudio from './components/CardStudio';
import StatsOverview from './components/StatsOverview';
import ZenModeModal from './components/ZenModeModal';
import Toast from './components/Toast';

import {
  fetchRandomQuote,
  fetchDailyQuote,
  getFavorites,
  saveFavorite,
  deleteFavorite,
  getHistory,
  logHistory,
  clearHistoryDB,
  getStats
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [quote, setQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [bgTheme, setBgTheme] = useState('editorial'); // 'editorial' | 'cosmic' | 'misty' | 'minimal'

  // Automatically adjust default wallpaper theme based on dark mode toggle if user hasn't overridden
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (bgTheme === 'editorial') setBgTheme('cosmic');
    } else {
      document.documentElement.classList.remove('dark');
      if (bgTheme === 'cosmic') setBgTheme('editorial');
    }
  }, [isDark]);

  // Toast Trigger Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Load
  useEffect(() => {
    async function initData() {
      setIsLoading(true);
      const [favsData, histData, initialQuote] = await Promise.all([
        getFavorites(),
        getHistory(),
        fetchRandomQuote('All')
      ]);

      setFavorites(favsData || []);
      setHistoryList(histData || []);
      setQuote(initialQuote);
      setIsLoading(false);

      if (initialQuote) {
        logHistory(initialQuote);
      }
    }

    initData();
  }, []);

  // Fetch New Quote Function
  const handleNextQuote = async () => {
    setIsLoading(true);
    const newQuote = await fetchRandomQuote(selectedCategory);
    setQuote(newQuote);
    setIsLoading(false);

    if (newQuote) {
      logHistory(newQuote);
      const updatedHist = await getHistory();
      setHistoryList(updatedHist || []);
    }
  };

  // Category Change Handler
  const handleCategoryChange = async (cat) => {
    setSelectedCategory(cat);
    setIsLoading(true);
    const newQuote = await fetchRandomQuote(cat);
    setQuote(newQuote);
    setIsLoading(false);

    if (newQuote) {
      logHistory(newQuote);
    }
  };

  // Favorite Toggle Handler
  const handleToggleFavorite = async (quoteToToggle) => {
    const targetQuote = quoteToToggle || quote;
    if (!targetQuote) return;

    const isFav = favorites.some(f => f.quote === targetQuote.quote);

    if (isFav) {
      const existing = favorites.find(f => f.quote === targetQuote.quote);
      if (existing) {
        await deleteFavorite(existing.id);
        const updatedFavs = favorites.filter(f => f.quote !== targetQuote.quote);
        setFavorites(updatedFavs);
        showToast("Removed from favorites");
      }
    } else {
      const res = await saveFavorite(targetQuote);
      const updatedFavs = await getFavorites();
      setFavorites(updatedFavs);
      showToast("Saved to Favorites database!");
    }
  };

  // Delete Favorite Item
  const handleDeleteFavoriteItem = async (id) => {
    await deleteFavorite(id);
    const updatedFavs = await getFavorites();
    setFavorites(updatedFavs);
    showToast("Favorite quote deleted");
  };

  // Clear History Handler
  const handleClearHistory = async () => {
    await clearHistoryDB();
    setHistoryList([]);
    showToast("Quote history cleared");
  };

  // Select Quote from History/Favorites to display in main showcase
  const handleSelectQuoteToShow = (selectedQuote) => {
    setQuote(selectedQuote);
    setActiveTab('discover');
    showToast(`Loaded quote by ${selectedQuote.author}`);
  };

  // Open Studio with current quote
  const handleOpenStudio = (quoteForStudio) => {
    setQuote(quoteForStudio || quote);
    setActiveTab('studio');
  };

  const isCurrentFavorite = quote ? favorites.some(f => f.quote === quote.quote) : false;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans relative overflow-x-hidden ${
      isDark ? 'bg-stone-950 text-stone-100' : 'bg-[#FAF8F5] text-stone-900'
    }`}>
      
      {/* Background Image & Texture Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden transition-opacity duration-700">
        
        {/* Option 1: Editorial Waves Wallpaper Image */}
        {bgTheme === 'editorial' && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-20 transition-all duration-700 scale-105"
            style={{ backgroundImage: `url('/bg_editorial.jpg')` }}
          />
        )}

        {/* Option 2: Cosmic Nebula Wallpaper Image */}
        {bgTheme === 'cosmic' && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 dark:opacity-80 transition-all duration-700 scale-105"
            style={{ backgroundImage: `url('/bg_cosmic.jpg')` }}
          />
        )}

        {/* Option 3: Misty Ambient Mesh Orbs */}
        {bgTheme === 'misty' && (
          <div className="absolute inset-0">
            <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-300/40 dark:bg-amber-800/30 blur-[130px] ambient-blob-1"></div>
            <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-rose-300/40 dark:bg-rose-900/30 blur-[150px] ambient-blob-2"></div>
            <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-200/40 dark:bg-emerald-950/30 blur-[130px] ambient-blob-1"></div>
          </div>
        )}

        {/* Light Overlay Tint for Flawless Glass Card Contrast & Legibility */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDark 
            ? 'bg-stone-950/50 backdrop-blur-[2px]' 
            : 'bg-[#FAF8F5]/30 backdrop-blur-[2px]'
        }`} />

        {/* Subtle Paper Texture Grid */}
        <div className="absolute inset-0 subtle-paper-grid opacity-30 dark:opacity-10"></div>
      </div>

      {/* Top Navigation */}
      <div className="relative z-30">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          favCount={favorites.length}
          isDark={isDark}
          setIsDark={setIsDark}
          onToggleZen={() => setIsZenOpen(true)}
          bgTheme={bgTheme}
          setBgTheme={setBgTheme}
        />
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        
        {/* TAB 1: DISCOVER SHOWCASE */}
        {activeTab === 'discover' && quote && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Hero Subtitle */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100 drop-shadow-xs">
                Daily Inspiration & Wisdom
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium">
                Explore timeless quotes, save to backend database history, & create custom social graphics.
              </p>
            </div>

            {/* Main Showcase Quote Card */}
            <QuoteCard
              quoteObj={quote}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onNextQuote={handleNextQuote}
              onCopy={showToast}
              onOpenStudio={handleOpenStudio}
              isLoading={isLoading}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
            />

          </div>
        )}

        {/* TAB 2: FAVORITES DATABASE */}
        {activeTab === 'favorites' && (
          <div className="animate-fade-in">
            <FavoritesDrawer
              favorites={favorites}
              onDeleteFavorite={handleDeleteFavoriteItem}
              onCopy={showToast}
              onSelectQuote={handleSelectQuoteToShow}
            />
          </div>
        )}

        {/* TAB 3: VIEWING HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <HistoryTimeline
              historyList={historyList}
              onClearHistory={handleClearHistory}
              onSelectQuote={handleSelectQuoteToShow}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
            />
          </div>
        )}

        {/* TAB 4: CARD STUDIO */}
        {activeTab === 'studio' && (
          <div className="animate-fade-in">
            <CardStudio
              currentQuote={quote}
              onToast={showToast}
            />
          </div>
        )}

        {/* TAB 5: ANALYTICS & STATS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <StatsOverview
              stats={stats}
              favorites={favorites}
              historyList={historyList}
            />
          </div>
        )}

      </main>

      {/* Zen Ambient Audio Modal */}
      <ZenModeModal
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        quoteObj={quote}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />

    </div>
  );
}
