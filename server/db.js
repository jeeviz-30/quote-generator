const fs = require('fs');
const path = require('path');

const dbFilePath = path.resolve(__dirname, 'database.json');

// Initialize database structure
let dbData = {
  favorites: [],
  history: [],
  autoInc: {
    favorites: 1,
    history: 1
  }
};

// Load existing database file if present
function loadDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      dbData = {
        favorites: parsed.favorites || [],
        history: parsed.history || [],
        autoInc: parsed.autoInc || { favorites: 1, history: 1 }
      };
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('Error loading database file:', err.message);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database file:', err.message);
  }
}

// Initial Load
loadDatabase();

// DB SQL Query Simulator Helpers matching standard SQLite interface
async function dbRun(query, params = []) {
  loadDatabase();
  const trimmed = query.trim().toUpperCase();

  if (trimmed.startsWith('INSERT INTO FAVORITES')) {
    const [quote, author, category, tags] = params;
    const newId = dbData.autoInc.favorites++;
    const newItem = {
      id: newId,
      quote,
      author,
      category: category || 'General',
      tags: tags || '',
      created_at: new Date().toISOString()
    };
    dbData.favorites.push(newItem);
    saveDatabase();
    return { id: newId, changes: 1 };
  }

  if (trimmed.startsWith('INSERT INTO HISTORY')) {
    const [quote, author, category] = params;
    const newId = dbData.autoInc.history++;
    const newItem = {
      id: newId,
      quote,
      author,
      category: category || 'General',
      viewed_at: new Date().toISOString()
    };
    dbData.history.push(newItem);
    saveDatabase();
    return { id: newId, changes: 1 };
  }

  if (trimmed.startsWith('DELETE FROM FAVORITES')) {
    const [id] = params;
    const initialLen = dbData.favorites.length;
    dbData.favorites = dbData.favorites.filter(f => f.id !== Number(id));
    const changes = initialLen - dbData.favorites.length;
    saveDatabase();
    return { changes };
  }

  if (trimmed.startsWith('DELETE FROM HISTORY')) {
    const changes = dbData.history.length;
    dbData.history = [];
    saveDatabase();
    return { changes };
  }

  return { changes: 0 };
}

async function dbAll(query, params = []) {
  loadDatabase();
  const trimmed = query.trim().toUpperCase();

  if (trimmed.includes('FROM FAVORITES')) {
    let result = [...dbData.favorites];
    if (trimmed.includes('ORDER BY CREATED_AT DESC')) {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return result;
  }

  if (trimmed.includes('FROM HISTORY')) {
    let result = [...dbData.history];
    if (trimmed.includes('ORDER BY VIEWED_AT DESC')) {
      result.sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at));
    }
    return result;
  }

  return [];
}

async function dbGet(query, params = []) {
  loadDatabase();
  const trimmed = query.trim().toUpperCase();

  if (trimmed.includes('SELECT * FROM FAVORITES WHERE QUOTE = ? AND AUTHOR = ?')) {
    const [quote, author] = params;
    return dbData.favorites.find(f => f.quote === quote && f.author === author) || null;
  }

  if (trimmed.includes('SELECT * FROM FAVORITES WHERE ID = ?')) {
    const [id] = params;
    return dbData.favorites.find(f => f.id === Number(id)) || null;
  }

  if (trimmed.includes('SELECT COUNT(*) AS COUNT FROM FAVORITES')) {
    return { count: dbData.favorites.length };
  }

  if (trimmed.includes('SELECT COUNT(*) AS COUNT FROM HISTORY')) {
    return { count: dbData.history.length };
  }

  return null;
}

module.exports = {
  dbRun,
  dbAll,
  dbGet
};
