const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { dbRun, dbAll, dbGet } = require('./db');
const fallbackQuotes = require('./fallbackQuotes.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API 1: Fetch Random Quote from external API with multi-tier fallbacks
app.get('/api/quotes/random', async (req, res) => {
  const { category } = req.query;

  try {
    const fetchRes = await fetch('https://dummyjson.com/quotes/random');
    if (fetchRes.ok) {
      const data = await fetchRes.json();
      const quoteObj = {
        id: `dj-${data.id}`,
        quote: data.quote,
        author: data.author || 'Unknown',
        category: category && category !== 'All' ? category : 'Wisdom',
        source: 'Public API (DummyJSON)'
      };
      return res.json(quoteObj);
    }
  } catch (err) {
    console.log('Primary external API unavailable, using fallback strategy...');
  }

  try {
    const fetchRes = await fetch('https://zenquotes.io/api/random');
    if (fetchRes.ok) {
      const dataArr = await fetchRes.json();
      if (Array.isArray(dataArr) && dataArr.length > 0) {
        return res.json({
          id: `zq-${Date.now()}`,
          quote: dataArr[0].q,
          author: dataArr[0].a,
          category: category && category !== 'All' ? category : 'Inspiration',
          source: 'Public API (ZenQuotes)'
        });
      }
    }
  } catch (err) {
    console.log('Secondary external API unavailable, using local synthetic database...');
  }

  // Fallback: Local Synthetic Fallback Dataset
  let pool = fallbackQuotes;
  if (category && category !== 'All') {
    const filtered = pool.filter(q => q.category.toLowerCase() === category.toLowerCase());
    if (filtered.length > 0) pool = filtered;
  }
  const randomPick = pool[Math.floor(Math.random() * pool.length)];

  return res.json({
    ...randomPick,
    source: 'Local Synthetic Database'
  });
});

// API 2: Quote of the Day
app.get('/api/quotes/daily', (req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const dailyQuote = fallbackQuotes[dayOfYear % fallbackQuotes.length];
  
  res.json({
    ...dailyQuote,
    date: today.toISOString().split('T')[0],
    source: 'Daily Featured'
  });
});

// API 3: Get Favorites from Database
app.get('/api/favorites', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM favorites ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve favorites from database', details: err.message });
  }
});

// API 4: Save Favorite to Database
app.post('/api/favorites', async (req, res) => {
  const { quote, author, category, tags } = req.body;

  if (!quote || !author) {
    return res.status(400).json({ error: 'Quote text and author are required' });
  }

  try {
    const existing = await dbGet('SELECT * FROM favorites WHERE quote = ? AND author = ?', [quote, author]);
    if (existing) {
      return res.status(409).json({ message: 'Quote already in favorites', favorite: existing });
    }

    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
    const result = await dbRun(
      'INSERT INTO favorites (quote, author, category, tags) VALUES (?, ?, ?, ?)',
      [quote, author, category || 'General', tagsStr]
    );

    const newFav = await dbGet('SELECT * FROM favorites WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Favorite saved successfully', favorite: newFav });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save favorite to database', details: err.message });
  }
});

// API 5: Delete Favorite from Database
app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun('DELETE FROM favorites WHERE id = ?', [id]);
    res.json({ message: 'Favorite deleted successfully', id: Number(id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete favorite', details: err.message });
  }
});

// API 6: Get View History from Database
app.get('/api/history', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM history ORDER BY viewed_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve history', details: err.message });
  }
});

// API 7: Log viewed quote into History
app.post('/api/history', async (req, res) => {
  const { quote, author, category } = req.body;
  if (!quote || !author) {
    return res.status(400).json({ error: 'Quote text and author required' });
  }
  try {
    await dbRun(
      'INSERT INTO history (quote, author, category) VALUES (?, ?, ?)',
      [quote, author, category || 'General']
    );
    res.status(201).json({ message: 'History logged' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log history', details: err.message });
  }
});

// API 8: Clear View History
app.delete('/api/history', async (req, res) => {
  try {
    await dbRun('DELETE FROM history');
    res.json({ message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history', details: err.message });
  }
});

// API 9: Synthetic Fallback Records Endpoint
app.get('/api/fallback', (req, res) => {
  res.json(fallbackQuotes);
});

// API 10: Statistics Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const totalFavs = await dbGet('SELECT COUNT(*) as count FROM favorites');
    const totalHistory = await dbGet('SELECT COUNT(*) as count FROM history');
    const favsList = await dbAll('SELECT * FROM favorites');

    res.json({
      totalFavorites: totalFavs ? totalFavs.count : 0,
      totalHistoryViews: totalHistory ? totalHistory.count : 0,
      favorites: favsList
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute stats', details: err.message });
  }
});

// Serve Static Frontend Assets (dist) if available
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`AuraQuote Fullstack Server running on http://localhost:${PORT}`);
});
