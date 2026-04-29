import { useState, useEffect, useCallback, useRef } from 'react'
import questions from './questions'
import gifs from './gifs'
import { saveScore, getScores } from './supabase'

const CUTOFF = 32
const TOTAL = questions.length

const AVATAR_OPTIONS = ['😈', '👻', '🤡', '💀', '🦊', '🐸', '🌶️', '🍑', '🔥', '💅', '🧠', '🫣']

function getUser() {
  try {
    const raw = localStorage.getItem('kennyTestUser')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setUser(name, emoji, score) {
  localStorage.setItem('kennyTestUser', JSON.stringify({ name, emoji, score }))
}

function StartScreen({ onStart, onViewScoreboard }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('😈')
  const existingUser = getUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) onStart(name.trim(), emoji)
  }

  return (
    <div className="screen start-screen">
      <div className="start-content">
        <div className="flag-emoji">🚩</div>
        <h1>The Kenny Test</h1>
        <p className="subtitle">Can You Marry Kenny?</p>
        <p className="description">
          A comprehensive {TOTAL}-question evaluation based on the official
          red flags list curated by Kenny Tran and male peers.
        </p>
        <p className="disclaimer">
          "This is in no shape or form meant to categorize all women"
          <br />— Kenny, probably
        </p>

        <div className="emoji-picker-section">
          <label>Choose your avatar</label>
          <div className="emoji-grid">
            {AVATAR_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                className={`emoji-option ${emoji === e ? 'selected' : ''}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="name-form">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="off"
            autoCapitalize="words"
          />
          <button type="submit" disabled={!name.trim()}>
            Take the Test
          </button>
        </form>

        {existingUser && (
          <div className="returning-section">
            <p>Welcome back, {existingUser.emoji} {existingUser.name}!</p>
            <button
              type="button"
              className="returning-btn"
              onClick={() => onViewScoreboard(existingUser.name, existingUser.emoji, existingUser.score)}
            >
              View Scoreboard (your score: {existingUser.score})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Quiz({ name, emoji, onFinish }) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animating, setAnimating] = useState(false)
  const preloadRef = useRef(null)

  // Preload next GIF in the background
  useEffect(() => {
    const nextUrl = gifs[current + 1]
    if (nextUrl) {
      preloadRef.current = new Image()
      preloadRef.current.src = nextUrl
    }
  }, [current])

  const advance = useCallback((answer) => {
    if (animating) return
    setAnimating(true)

    const newScore = answer ? score + 1 : score
    if (answer) setScore(newScore)

    setDirection(answer ? 'exit-left' : 'exit-right')

    setTimeout(() => {
      if (current + 1 >= TOTAL) {
        onFinish(newScore)
      } else {
        setCurrent(c => c + 1)
        setDirection('enter')
        setTimeout(() => {
          setDirection(null)
          setAnimating(false)
        }, 300)
      }
    }, 300)
  }, [current, score, animating, onFinish])

  const progress = ((current + 1) / TOTAL) * 100
  const currentGif = gifs[current]

  return (
    <div className="screen quiz-screen">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="quiz-header">
        <span className="question-count">{current + 1} / {TOTAL}</span>
        <span className="running-score">🚩 {score}</span>
      </div>
      <div className="question-area">
        <div className={`question-card ${direction || ''}`}>
          {currentGif && (
            <div className="question-gif-wrap">
              <img
                className="question-gif"
                src={currentGif}
                alt=""
                loading="eager"
              />
            </div>
          )}
          <p className="question-text">{questions[current]}</p>
        </div>
      </div>
      <div className="button-row">
        <button
          className="answer-btn yes-btn"
          onClick={() => advance(true)}
          disabled={animating}
        >
          <span className="btn-emoji">🚩</span>
          YES
        </button>
        <button
          className="answer-btn no-btn"
          onClick={() => advance(false)}
          disabled={animating}
        >
          <span className="btn-emoji">✅</span>
          NO
        </button>
      </div>
    </div>
  )
}

function ScoreboardView({ name, emoji, score, onRetake }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getScores().then(all => {
      setScores(all)
      setLoading(false)
    })
  }, [])

  const maxScore = Math.max(TOTAL, ...scores.map(s => s.score))

  return (
    <div className="screen scoreboard-view">
      <div className="scoreboard-header">
        <h1>🚩 The Kenny Test</h1>
        <p>Scoreboard</p>
      </div>
      <div className="user-badge">
        <span>{emoji}</span>
        <span>{name}</span>
        <span>·</span>
        <span>Score: {score}</span>
      </div>
      <div className="scoreboard-section">
        <div className="cutoff-label">
          Cutoff: {CUTOFF} red flags = unmarriageable
        </div>
        {loading ? (
          <p className="loading">Loading scores...</p>
        ) : (
          <Scoreboard scores={scores} currentName={name} maxScore={maxScore} />
        )}
      </div>
      <div className="retake-link" onClick={onRetake}>
        Retake the quiz
      </div>
    </div>
  )
}

function Scoreboard({ scores, currentName, maxScore }) {
  return (
    <div className="scoreboard">
      {scores.map((entry, i) => {
        const isYou = entry.name.toLowerCase() === currentName.toLowerCase()
        const barWidth = Math.max(2, (entry.score / maxScore) * 100)
        const overCutoff = entry.score >= CUTOFF
        return (
          <div key={i} className={`score-row ${isYou ? 'you' : ''}`}>
            <div className="score-name">
              {entry.emoji || '👤'} {entry.name} {isYou && '(you)'}
            </div>
            <div className="score-bar-container">
              <div
                className={`score-bar ${overCutoff ? 'over' : 'under'}`}
                style={{ width: `${barWidth}%` }}
              />
              <div
                className="cutoff-line"
                style={{ left: `${(CUTOFF / maxScore) * 100}%` }}
              />
            </div>
            <div className="score-value">{entry.score}</div>
          </div>
        )
      })}
    </div>
  )
}

function Results({ name, emoji, score, onRetake }) {
  const [scores, setScores] = useState([])
  const [saving, setSaving] = useState(true)
  const passed = score < CUTOFF

  useEffect(() => {
    async function init() {
      await saveScore(name, score, emoji)
      setUser(name, emoji, score)
      const all = await getScores()
      setScores(all)
      setSaving(false)
    }
    init()
  }, [name, score, emoji])

  const maxScore = Math.max(TOTAL, ...scores.map(s => s.score))

  return (
    <div className={`screen results-screen ${passed ? 'passed' : 'failed'}`}>
      {passed && <Confetti />}
      {!passed && <DoomOverlay />}

      <div className="results-content">
        <div className="verdict-section">
          {passed ? (
            <>
              <div className="verdict-emoji">💍🎉🥂</div>
              <h1 className="verdict passed-verdict">SUPER ELIGIBLE</h1>
              <p className="verdict-sub">
                Kenny would be HONORED. You scored only <strong>{score}</strong> out of {TOTAL} red flags.
              </p>
              <div className="meme-container">
                <img
                  className="meme-gif"
                  src="https://media1.tenor.com/m/bqFfT9K5OQ4AAAAd/wendy-williams-clap.gif"
                  alt="Wendy Williams clapping in celebration"
                />
                <p className="meme-caption">Kenny-approved marriage material</p>
              </div>
            </>
          ) : (
            <>
              <div className="verdict-emoji">🚩🚩🚩</div>
              <h1 className="verdict failed-verdict">UNMARRIAGEABLE</h1>
              <p className="verdict-sub">
                You scored <strong>{score}</strong> out of {TOTAL} red flags.
                <br />Kenny has left the building.
              </p>
              <div className="meme-container">
                <img
                  className="meme-gif"
                  src="https://media1.tenor.com/m/S619LgsNUXEAAAAd/running-away-scared.gif"
                  alt="Man running away scared"
                />
                <p className="meme-caption">The math is not mathing and neither is this marriage</p>
              </div>
            </>
          )}
        </div>

        <div className="scoreboard-section">
          <h2>Scoreboard</h2>
          <div className="cutoff-label">
            Cutoff: {CUTOFF} red flags
          </div>
          {saving ? (
            <p className="loading">Loading scores...</p>
          ) : (
            <Scoreboard scores={scores} currentName={name} maxScore={maxScore} />
          )}
        </div>

        <button className="retake-btn" onClick={onRetake}>
          Retake the Test
        </button>
      </div>
    </div>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="confetti-piece"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
        backgroundColor: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#c084fc'][i % 6],
      }}
    />
  ))
  return <div className="confetti-container">{pieces}</div>
}

function DoomOverlay() {
  return <div className="doom-overlay" />
}

export default function App() {
  const [screen, setScreen] = useState('start')
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('😈')
  const [finalScore, setFinalScore] = useState(0)

  const handleStart = (playerName, playerEmoji) => {
    setName(playerName)
    setEmoji(playerEmoji)
    setScreen('quiz')
  }

  const handleViewScoreboard = (playerName, playerEmoji, playerScore) => {
    setName(playerName)
    setEmoji(playerEmoji)
    setFinalScore(playerScore)
    setScreen('scoreboard')
  }

  const handleFinish = (score) => {
    setFinalScore(score)
    setScreen('results')
  }

  const handleRetake = () => {
    setFinalScore(0)
    setScreen('start')
  }

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onStart={handleStart} onViewScoreboard={handleViewScoreboard} />
      )}
      {screen === 'quiz' && (
        <Quiz name={name} emoji={emoji} onFinish={handleFinish} />
      )}
      {screen === 'results' && (
        <Results name={name} emoji={emoji} score={finalScore} onRetake={handleRetake} />
      )}
      {screen === 'scoreboard' && (
        <ScoreboardView name={name} emoji={emoji} score={finalScore} onRetake={handleRetake} />
      )}
    </div>
  )
}
