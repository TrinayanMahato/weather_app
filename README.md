# PlanBetter — Weather Dashboard

 Live App:[https://weather-app-ten-ruby-62.vercel.app]
GitHub:[https://github.com/TrinayanMahato/weather_app]
---

 About

**PlanBetter** is a real-time weather dashboard built with Next.js. Search any city to get current weather conditions, a 5-day forecast, humidity, wind speed, and UV index — with dynamic background effects that change based on the weather (rain animations, heat gradients).

---

## Features

- 🔍 **City Search** with recent search history
- 🌡️ **Current Weather** — temperature, feels like, condition
- 📅 **5-Day Forecast**
- 💧 **Metrics** — Humidity, Wind Speed, UV Index
- 🌧️ **Dynamic Backgrounds** — animated rain drops for rainy cities, red gradient for hot cities (30°C+), deep red for extreme heat (35°C+)
- 🔐 **Authentication** — Email/password sign-up and Google OAuth login
- 🌙 **Dark Mode** toggle with persistent preference
- 📱 **Responsive** — works on mobile and desktop
- ⚡ **Weather Caching** — 1-hour localStorage cache to reduce API calls

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Authentication:** NextAuth.js (Google OAuth + credentials)
- **Database:** MongoDB + Mongoose
- **Fonts & Icons:** Google Fonts (Outfit), Material Symbols
- **Deployment:** Vercel

---

## Folder Structure

```
weather_app/
├── components/
│   ├── ForecastCard.js       # 5-day forecast card UI
│   ├── Header.js             # Top navigation bar with dark mode toggle
│   ├── HomePage.js           # Main page layout & dynamic weather background
│   ├── LoginAlert.js         # Auth modal (email/password + Google OAuth)
│   ├── MetricCard.js         # Humidity, Wind Speed, UV Index cards
│   ├── SearchBar.js          # City search input with recent search history
│   └── WeatherCard.js        # Main current weather display card
├── lib/
│   └── mongoose.js           # MongoDB connection (cached for hot reloads)
├── models/
│   └── User.js               # Mongoose User schema
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].js  # NextAuth config (Google + credentials)
│   │   │   └── signup.js         # Email/password sign-up API route
│   │   └── weather.js            # Weather API route (OpenWeatherMap)
│   ├── _app.js               # Global app wrapper (SessionProvider)
│   ├── _document.js          # HTML shell (fonts, icons, body styles)
│   └── index.js              # Root route → renders HomePage
├── public/
│   └── favicon.ico
├── styles/
│   └── globals.css           # Global Tailwind base styles
├── utils/
│   └── weatherCache.js       # localStorage cache helpers (1-hour TTL)
├── .env.local                # Environment variables (not committed)
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/TrinayanMahato/weather_app.git
cd weather_app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following:

```env
# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweathermap_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> Get a free API key at [https://openweathermap.org/api](https://openweathermap.org/api)  
> Get Google OAuth credentials at [https://console.cloud.google.com](https://console.cloud.google.com)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

This app is deployed on **Vercel**. To deploy your own:

1. Push your code to a public GitHub repository
2. Import the repo on [https://vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Set `NEXTAUTH_URL` to your Vercel production URL
5. Add the Vercel callback URL to your Google OAuth credentials:
   ```
   https://weather-app-ten-ruby-62.vercel.app/api/auth/callback/google
   ```
