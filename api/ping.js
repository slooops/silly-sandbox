const { neon } = require('@neondatabase/serverless')

// Cron keep-alive to warm Neon compute so the first real query of the day
// doesn't hit a cold start. Runs daily via vercel.json crons config.
module.exports = async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL)
  await sql`SELECT 1`
  res.status(200).json({ ok: true, time: new Date().toISOString() })
}
