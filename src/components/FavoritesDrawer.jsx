import React, { useState } from 'react';
import { Heart, Trash2, Copy, Search, Download, Sparkles, Filter, Grid, List, Check, Tag } from 'lucide-react';

export default function FavoritesDrawer({ favorites, onDeleteFavorite, onCopy, onSelectQuote }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', ...new Set(favorites.map(f => f.category || 'General'))];

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (item) => {
    const text = `“${item.quote}” — ${item.author}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    onCopy("Quote copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_favorite_quotes_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onCopy("Favorites exported as JSON file!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header & Controls Glass Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl shadow-sm">
        
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Favorited Quotes Database
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
              {favorites.length} Saved
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-sans">
            Persisted in SQLite database & synced locally
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportJSON}
            disabled={favorites.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-stone-200/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50 hover:bg-white/80 dark:hover:bg-stone-700/70 text-stone-700 dark:text-stone-300 transition-all backdrop-blur-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <div className="flex items-center border border-stone-200/60 dark:border-stone-700/60 rounded-full p-0.5 bg-white/40 dark:bg-stone-800/40 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs' : 'text-stone-400'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs' : 'text-stone-400'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search saved quotes by author or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl glass-card focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-stone-400 ml-1" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-950 text-stone-50 dark:bg-amber-400 dark:text-stone-950 font-semibold'
                    : 'bg-white/50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 backdrop-blur-xs border border-stone-200/50 dark:border-stone-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredFavorites.length === 0 && (
        <div className="text-center py-16 px-4 glass-card rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-stone-800 dark:text-stone-200">
              {favorites.length === 0 ? "No Saved Quotes Yet" : "No Quotes Match Your Search"}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1 font-sans">
              {favorites.length === 0
                ? "Click the heart icon on any quote while exploring to save it permanently to your database history."
                : "Try clearing your search query or selecting a different category filter."}
            </p>
          </div>
        </div>
      )}

      {/* Favorites Glass Display Grid */}
      {filteredFavorites.length > 0 && (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-4"}>
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="group relative glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/20">
                    {item.category || 'General'}
                  </span>
                  {item.created_at && (
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-sans">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p 
                  onClick={() => onSelectQuote(item)}
                  className="font-serif text-lg text-stone-800 dark:text-stone-100 leading-snug cursor-pointer hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                >
                  “{item.quote}”
                </p>

                <cite className="block not-italic font-sans text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                  — {item.author}
                </cite>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/50 dark:border-stone-800/80">
                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => onDeleteFavorite(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-all"
                  title="Delete from Database"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
