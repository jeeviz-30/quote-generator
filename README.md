# ✍️ AuraQuote • Editorial Quote Studio & History Database

> A fullstack glassmorphic Quote Generator, User Favorites Storage System, History Tracker, and Social Graphic Studio built with React, Tailwind CSS, Express, and SQLite.

![AuraQuote Banner](public/bg_editorial.jpg)

---

## 🌟 Key Features & Requirements

1. **Daily & Random Quote Integration**:
   - Multi-tier API fetching (`DummyJSON`, `ZenQuotes`) with seamless offline synthetic database fallback (`fallbackQuotes.json`).
   - Category filtering (*Wisdom, Inspiration, Technology, Philosophy, Success, Life, Mindfulness, Creative*).
   - Web Speech API text-to-speech reader with voice modulation.

2. **Backend Database System**:
   - Express server REST API with disk-persisted database engine.
   - **User Favorites Database**: Add, remove, filter, search, and export saved quotes to JSON file.
   - **Viewing Session History**: Automatic timeline recording of viewed quotes.
   - **Analytics & Insights**: Metric cards showing top favorited authors and category distributions.

3. **Creative UI/UX & Glassmorphism**:
   - High-resolution wallpaper background switcher (*Editorial Waves, Cosmic Nebula, Ambient Mesh, Clean Paper*).
   - Translucent glassmorphic cards (`backdrop-blur-xl`, frosted reflections, soft inner highlights).
   - **Zen Ambient Soundscape**: Built-in Web Audio API sound generator (*Gentle Rain, Ocean Waves, Zen Chimes*).
   - **Card Studio & PNG Exporter**: Customize typography, layout, themes, and download high-res PNG image cards.

---

## 🚀 How to Deploy on Render.com (Web Service)

### Option A: Automatic Blueprint Deployment (`render.yaml`)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
2. Connect your GitHub repository `https://github.com/jeeviz-30/quote-generator`.
3. Render will automatically detect `render.yaml` and configure the Web Service!

### Option B: Manual Web Service Setup on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your repository: `https://github.com/jeeviz-30/quote-generator`.
3. Fill in the deployment details:
   - **Name**: `auraquote-app`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Click **Create Web Service**. Render will deploy your live fullstack application!

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/jeeviz-30/quote-generator.git
cd quote-generator

# Install dependencies
npm install

# Run fullstack server locally
node server/index.js
```

Open `http://localhost:5000` in your browser.

---

## 📁 Submission Proof Checklist

- [x] **GitHub Repository Link**: [https://github.com/jeeviz-30/quote-generator](https://github.com/jeeviz-30/quote-generator)
- [x] **Render / Deployed Web App**: Ready for deployment via Render.com Web Service
- [x] **SQLite Database & Favorites History**: Integrated in `server/db.js` and `server/index.js`
- [x] **Synthetic Local Fallback Data**: `server/fallbackQuotes.json` & `src/data/fallbackQuotes.json`
- [x] **Copy to Clipboard & PNG Export**: Enabled on all quote cards
