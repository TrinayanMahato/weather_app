/**
 * weatherCache.js
 *
 * localStorage cache for weather API responses.
 *
 * Storage structure (plain object as hash map):
 * {
 *   "london":        { data: {...}, expiresAt: 1714901234567 },
 *   "new york":      { data: {...}, expiresAt: 1714901234567 },
 *   "san francisco": { data: {...}, expiresAt: 1714901234567 },
 * }
 *
 * Why plain object instead of Map?
 *   - Map cannot be directly JSON.stringify'd → not suitable for localStorage
 *   - Plain object gives the same O(1) key lookups for string keys
 *   - Serialize/deserialize is trivial with JSON.parse / JSON.stringify
 */

const CACHE_KEY = 'skyglass_weather_cache'
const RECENT_SEARCHES_KEY = 'skyglass_recent_searches'
const EXPIRY_MS = 60 * 60 * 1000 // 1 hour in milliseconds

// ── Internal helpers ─────────────────────────────────────────────────────────

/** Read the entire cache map from localStorage */
function loadMap() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Write the entire cache map back to localStorage */
function saveMap(map) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(map))
  } catch {
    // Storage quota exceeded or SSR — fail silently
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns cached weather data for a city if it exists and hasn't expired.
 * Automatically removes stale entries.
 *
 * @param   {string}      city  - city name (case-insensitive)
 * @returns {object|null}       - weather data or null on cache miss / expiry
 */
export function getCached(city) {
  const key   = city.toLowerCase().trim()
  const map   = loadMap()
  const entry = map[key]

  if (!entry) return null // cache miss

  if (Date.now() > entry.expiresAt) {
    // Stale — evict this entry
    delete map[key]
    saveMap(map)
    return null
  }

  const remainingMin = Math.round((entry.expiresAt - Date.now()) / 60000)
  console.log(`[Cache HIT] "${city}" — expires in ${remainingMin} min`)
  return entry.data
}

/**
 * Saves weather data for a city with a 1-hour expiry.
 *
 * @param {string} city - city name (case-insensitive)
 * @param {object} data - weather data from the API
 */
export function setCached(city, data) {
  const key = city.toLowerCase().trim()
  const map = loadMap()

  map[key] = {
    data,
    expiresAt: Date.now() + EXPIRY_MS,
    cachedAt:  Date.now(),           // for debugging
  }

  saveMap(map)
  console.log(`[Cache SET] "${city}" — expires in 60 min`)
}

/**
 * Returns all cached cities and their expiry info (useful for debugging).
 */
export function debugCache() {
  const map = loadMap()
  return Object.entries(map).map(([city, entry]) => ({
    city,
    expiresIn: `${Math.round((entry.expiresAt - Date.now()) / 60000)} min`,
    expired:   Date.now() > entry.expiresAt,
  }))
}

/**
 * Clears the entire weather cache.
 */
export function clearCache() {
  localStorage.removeItem(CACHE_KEY)
}

// ── Recent Searches ──────────────────────────────────────────────────────────

/**
 * Returns the list of recent searches from localStorage.
 * @returns {string[]}
 */
export function getRecentSearches() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Adds a city to the recent searches list, keeping only the last 5.
 * @param {string} city 
 */
export function addRecentSearch(city) {
  if (typeof window === 'undefined') return
  const cleanCity = city.trim()
  if (!cleanCity) return

  let recent = getRecentSearches()
  
  // Remove if it already exists so we can bump it to the top
  recent = recent.filter(c => c.toLowerCase() !== cleanCity.toLowerCase())
  
  // Add to the front
  recent.unshift(cleanCity)
  
  // Keep only the last 5
  if (recent.length > 5) recent.pop()

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
  } catch {
    // Ignore
  }
}
