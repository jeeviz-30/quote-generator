import fallbackQuotes from '../data/fallbackQuotes.json';

const API_BASE = '/api';

/**
 * Fetch a random quote. First tries backend server, then external API, then local synthetic dataset.
 */
export async function fetchRandomQuote(category = 'All') {
  try {
    const res = await fetch(`${API_BASE}/quotes/random?category=${encodeURIComponent(category)}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend endpoint unreachable, trying client fallback...', err);
  }

  // Client-side fallback to public API or synthetic dataset
  try {
    const externalRes = await fetch('https://dummyjson.com/quotes/random');
    if (externalRes.ok) {
      const extData = await externalRes.json();
      return {
        id: `ext-${extData.id}`,
        quote: extData.quote,
        author: extData.author || 'Unknown Author',
        category: category !== 'All' ? category : 'Wisdom',
        source: 'Public API'
      };
    }
  } catch (extErr) {
    console.warn('External API call failed, using synthetic fallback database...');
  }

  // Local Synthetic Fallback Dataset
  let pool = fallbackQuotes;
  if (category && category !== 'All') {
    const filtered = pool.filter(q => q.category.toLowerCase() === category.toLowerCase());
    if (filtered.length > 0) pool = filtered;
  }
  const randomPick = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...randomPick,
    source: 'Synthetic Fallback Records'
  };
}

/**
 * Get Quote of the Day
 */
export async function fetchDailyQuote() {
  try {
    const res = await fetch(`${API_BASE}/quotes/daily`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using local daily quote...');
  }
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return {
    ...fallbackQuotes[dayOfYear % fallbackQuotes.length],
    source: 'Daily Inspiration'
  };
}

/**
 * Favorites Database API Calls
 */
export async function getFavorites() {
  try {
    const res = await fetch(`${API_BASE}/favorites`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using LocalStorage favorites fallback');
  }
  const local = localStorage.getItem('aura_favorites');
  return local ? JSON.parse(local) : [];
}

export async function saveFavorite(quoteObj) {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteObj)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Saving favorite to LocalStorage fallback...');
  }

  // LocalStorage Fallback
  const current = JSON.parse(localStorage.getItem('aura_favorites') || '[]');
  const exists = current.some(q => q.quote === quoteObj.quote);
  if (!exists) {
    const newFav = {
      id: Date.now(),
      ...quoteObj,
      created_at: new Date().toISOString()
    };
    current.unshift(newFav);
    localStorage.setItem('aura_favorites', JSON.stringify(current));
    return { favorite: newFav, message: 'Saved locally' };
  }
  return { message: 'Already favorited' };
}

export async function deleteFavorite(id) {
  try {
    const res = await fetch(`${API_BASE}/favorites/${id}`, { method: 'DELETE' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Deleting favorite from LocalStorage fallback...');
  }

  const current = JSON.parse(localStorage.getItem('aura_favorites') || '[]');
  const updated = current.filter(q => q.id !== id);
  localStorage.setItem('aura_favorites', JSON.stringify(updated));
  return { message: 'Deleted locally', id };
}

/**
 * History Database API Calls
 */
export async function getHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend history unavailable, using LocalStorage history');
  }
  const local = localStorage.getItem('aura_history');
  return local ? JSON.parse(local) : [];
}

export async function logHistory(quoteObj) {
  try {
    await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteObj)
    });
  } catch (err) {
    const history = JSON.parse(localStorage.getItem('aura_history') || '[]');
    history.unshift({ ...quoteObj, id: Date.now(), viewed_at: new Date().toISOString() });
    localStorage.setItem('aura_history', JSON.stringify(history.slice(0, 50)));
  }
}

export async function clearHistoryDB() {
  try {
    await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  } catch (err) {
    localStorage.removeItem('aura_history');
  }
}

/**
 * Statistics API
 */
export async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (res.ok) return await res.json();
  } catch (err) {
    const favs = JSON.parse(localStorage.getItem('aura_favorites') || '[]');
    const history = JSON.parse(localStorage.getItem('aura_history') || '[]');
    return {
      totalFavorites: favs.length,
      totalHistoryViews: history.length,
      categoriesBreakdown: [],
      topAuthors: []
    };
  }
}
