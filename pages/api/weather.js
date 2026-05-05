const API_KEY = process.env.OPENWEATHER_API_KEY

function owmToMaterial(iconCode) {
  const map = { '01': 'wb_sunny', '02': 'partly_cloudy_day', '03': 'cloud', '04': 'cloud', '09': 'rainy', '10': 'rainy', '11': 'thunderstorm', '13': 'ac_unit', '50': 'foggy' }
  return map[iconCode?.slice(0, 2)] || 'wb_sunny'
}

function uvLabel(v) {
  if (v <= 2) return 'Low'; if (v <= 5) return 'Moderate'; if (v <= 7) return 'High'; if (v <= 10) return 'Very High'; return 'Extreme'
}

function buildDailyForecast(list = []) {
  const map = {}
  for (const item of list) {
    const date = new Date(item.dt * 1000)
    const key = date.toISOString().split('T')[0]
    const hour = date.getHours()
    if (!map[key] || Math.abs(hour - 12) < Math.abs(new Date(map[key].dt * 1000).getHours() - 12)) map[key] = item
  }
  return Object.values(map).slice(0, 5).map(item => ({
    day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    icon: owmToMaterial(item.weather[0]?.icon),
    highC: Math.round(item.main.temp_max),   // ← raw Celsius
    lowC: Math.round(item.main.temp_min),   // ← raw Celsius
  }))
}

function buildResponse(current, forecast, uv) {
  const uvValue = Math.round(uv.value ?? 0)
  return {
    city: `${current.name}, ${current.sys.country}`,
    tempC: Math.round(current.main.temp),         // ← raw Celsius
    feelsLikeC: Math.round(current.main.feels_like),   // ← raw Celsius
    description: current.weather[0].description.replace(/^\w/, c => c.toUpperCase()),
    weatherMain: current.weather[0].main,
    weatherIcon: owmToMaterial(current.weather[0]?.icon),
    humidity: `${current.main.humidity}%`,
    windSpeed: `${(current.wind.speed * 3.6).toFixed(1)} km/h`,
    uvIndex: `${uvValue} ${uvLabel(uvValue)}`,
    forecast: buildDailyForecast(forecast.list),
  }
}

export default async function handler(req, res) {
  const { city, lat, lon } = req.query
  if (!city && !(lat && lon)) return res.status(400).json({ error: 'Provide city or lat & lon' })

  try {
    const base = 'https://api.openweathermap.org/data/2.5'
    const q = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`

    const [cRes, fRes] = await Promise.all([
      fetch(`${base}/weather?${q}&appid=${API_KEY}&units=metric`),
      fetch(`${base}/forecast?${q}&appid=${API_KEY}&units=metric`),
    ])

    if (!cRes.ok) {
      const err = await cRes.json()
      return res.status(cRes.status).json({ error: err.message || 'Location not found' })
    }

    const [current, forecast] = await Promise.all([cRes.json(), fRes.json()])
    const { lat: cLat, lon: cLon } = current.coord

    const uvRes = await fetch(`${base}/uvi?lat=${cLat}&lon=${cLon}&appid=${API_KEY}`)
    const uv = await uvRes.json()

    res.status(200).json(buildResponse(current, forecast, uv))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
