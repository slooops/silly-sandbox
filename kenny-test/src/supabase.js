const FALLBACK_SCORES = [
  { name: 'Jack', score: 40, emoji: '💀' },
  { name: 'Shreya', score: 28, emoji: '🦊' },
  { name: 'John', score: 26, emoji: '🐸' },
  { name: 'Kenny', score: 0, emoji: '👑' },
]

export async function saveScore(name, score, emoji = '👤') {
  try {
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score, emoji }),
    })
    if (!res.ok) throw new Error('save failed')
  } catch (e) {
    console.error('saveScore failed', e)
  }
}

export async function getScores() {
  try {
    const res = await fetch('/api/scores')
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch (e) {
    console.error('getScores failed, using fallback', e)
    return FALLBACK_SCORES.sort((a, b) => a.score - b.score)
  }
}
