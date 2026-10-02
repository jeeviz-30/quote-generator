import React from 'react';
import { History, Trash2, Heart, ExternalLink, Clock } from 'lucide-react';

export default function HistoryTimeline({ historyList, onClearHistory, onSelectQuote, onToggleFavorite, favorites }) {

  const isFavorited = (quoteText) => {
    return favorites.some(f => f.quote === quoteText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header Glass Card */}
      <div className="flex items-center justify-between glass-card p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Recently Viewed Quote History
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {historyList.length} Sessions Logged
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-sans">
            Automatically recorded in SQLite backend history table
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-600 bg-rose-50/80 dark:bg-rose-950/60 hover:bg-rose-100/80 border border-rose-200/80 dark:border-rose-900 transition-all backdrop-blur-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      {/* Timeline List */}
      {historyList.length === 0 ? (
        <div className="text-center py-16 px-4 glass-card rounded-3xl space-y-3">
          <Clock className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-serif font-semibold text-stone-700 dark:text-stone-300">
            No History Records Found
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto font-sans">
            As you browse and generate new quotes, your viewing timeline will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-stone-300/40 dark:border-stone-800 space-y-6">
          {historyList.map((item, index) => {
            const favorited = isFavorited(item.quote);
            return (
              <div key={item.id || index} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-stone-900 group-hover:scale-125 transition-transform shadow-xs"></div>

                {/* Glass Timeline Card */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 border border-stone-200/50 dark:border-stone-700/50">
                        {item.category || 'General'}
                      </span>
                      {item.viewed_at && (
                        <span className="text-[10px] text-stone-400 font-sans flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.viewed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <p 
                      onClick={() => onSelectQuote(item)}
                      className="font-serif text-base text-stone-800 dark:text-stone-100 cursor-pointer hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                    >
                      “{item.quote}”
                    </p>

                    <cite className="block not-italic font-sans text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">
                      — {item.author}
                    </cite>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className={`p-2 rounded-full border transition-all ${
                        favorited 
                          ? 'bg-rose-50/80 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-800' 
                          : 'border-stone-200/70 dark:border-stone-800 text-stone-400 hover:text-rose-500'
                      }`}
                      title={favorited ? "Favorited" : "Add to Favorites"}
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => onSelectQuote(item)}
                      className="p-2 rounded-full border border-stone-200/70 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-800 transition-all"
                      title="View in Main Showcase"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
