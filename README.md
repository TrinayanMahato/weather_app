# PlanBetter — Weather Dashboard

🌐 **Live App:** [https://weather-app-ten-ruby-62.vercel.app](https://weather-app-ten-ruby-62.vercel.app)

---

## About

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

## Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
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
   https://your-app.vercel.app/api/auth/callback/google
   ```
