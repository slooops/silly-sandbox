// Cron keep-alive for Supabase free tier.
// Vercel runs this daily so the project never hits the 7-day inactivity pause.
module.exports = async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({ error: 'missing supabase env vars' })
  }

  const response = await fetch(`${url}/rest/v1/scores?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    return res.status(500).json({ error: 'supabase ping failed', status: response.status })
  }

  res.status(200).json({ ok: true, time: new Date().toISOString() })
}
