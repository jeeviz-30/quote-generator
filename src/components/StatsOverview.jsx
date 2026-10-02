import React from 'react';
import { BarChart3, Heart, History, Award, BookOpen, Layers } from 'lucide-react';

export default function StatsOverview({ stats, favorites, historyList }) {
  const totalFavs = favorites.length;
  const totalViews = historyList.length;

  const categoryCounts = {};
  favorites.forEach(f => {
    const cat = f.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const authorCounts = {};
  favorites.forEach(f => {
    const author = f.author || 'Unknown';
    authorCounts[author] = (authorCounts[author] || 0) + 1;
  });

  const sortedAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Header Glass Card */}
      <div className="glass-card p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          Quote Database Analytics & Insights
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-sans">
          Overview of your stored favorites, top authors, and reading habits
        </p>
      </div>

      {/* KPI Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="glass-card glass-card-hover p-6 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold border border-rose-500/20">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {totalFavs}
            </span>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Saved Favorites</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold border border-blue-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {totalViews}
            </span>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Quotes Viewed</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {Object.keys(categoryCounts).length}
            </span>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">Categories Explored</p>
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Authors Glass Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Top Favorited Authors
          </h3>

          {sortedAuthors.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 italic text-center">No favorites saved yet</p>
          ) : (
            <div className="space-y-3">
              {sortedAuthors.map(([author, count], idx) => (
                <div key={author} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-stone-200/40 dark:border-stone-700/40">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {idx + 1}. {author}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/20">
                    {count} {count === 1 ? 'quote' : 'quotes'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Distribution Glass Card */}
        <div className="glass-card p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Favorite Topics Breakdown
          </h3>

          {Object.keys(categoryCounts).length === 0 ? (
            <p className="text-xs text-stone-400 py-4 italic text-center">No categories logged yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / totalFavs) * 100);
                return (
                  <div key={cat} className="space-y-1.5 p-2 rounded-xl bg-white/40 dark:bg-stone-800/40 border border-stone-200/40 dark:border-stone-700/40">
                    <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                      <span>{cat}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-stone-200/60 dark:bg-stone-700/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
