import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const HARDCODED_SCORES = [
  { name: 'Jack', score: 40, emoji: '💀' },
  { name: 'Shreya', score: 28, emoji: '🦊' },
  { name: 'John', score: 26, emoji: '🐸' },
  { name: 'Kenny', score: 0, emoji: '👑' },
]

export async function saveScore(name, score, emoji = '👤') {
  if (!supabase) {
    const local = JSON.parse(localStorage.getItem('kennyScores') || '[]')
    const existing = local.findIndex(s => s.name.toLowerCase() === name.toLowerCase())
    if (existing >= 0) {
      local[existing].score = score
      local[existing].emoji = emoji
    } else {
      local.push({ name, score, emoji })
    }
    localStorage.setItem('kennyScores', JSON.stringify(local))
    return
  }

  const { data: existing } = await supabase
    .from('scores')
    .select('id')
    .ilike('name', name)
    .limit(1)

  if (existing && existing.length > 0) {
    await supabase.from('scores').update({ score, emoji }).eq('id', existing[0].id)
  } else {
    await supabase.from('scores').insert({ name, score, emoji })
  }
}

export async function getScores() {
  if (!supabase) {
    const local = JSON.parse(localStorage.getItem('kennyScores') || '[]')
    const merged = [...HARDCODED_SCORES]
    for (const entry of local) {
      const idx = merged.findIndex(s => s.name.toLowerCase() === entry.name.toLowerCase())
      if (idx >= 0) {
        merged[idx].score = entry.score
        merged[idx].emoji = entry.emoji || merged[idx].emoji
      } else {
        merged.push(entry)
      }
    }
    return merged.sort((a, b) => b.score - a.score)
  }

  const { data } = await supabase
    .from('scores')
    .select('name, score, emoji')
    .order('score', { ascending: false })

  return data || []
}
