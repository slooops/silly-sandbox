const { neon } = require('@neondatabase/serverless')

module.exports = async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL)

  if (req.method === 'GET') {
    const rows = await sql`SELECT name, score, emoji FROM scores ORDER BY score ASC`
    return res.status(200).json(rows)
  }

  if (req.method === 'POST') {
    const { name, score, emoji } = req.body
    if (!name || score === undefined) {
      return res.status(400).json({ error: 'name and score required' })
    }
    await sql`
      INSERT INTO scores (name, score, emoji)
      VALUES (${name}, ${score}, ${emoji})
      ON CONFLICT (lower(name))
      DO UPDATE SET score = ${score}, emoji = ${emoji}
    `
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'method not allowed' })
}
