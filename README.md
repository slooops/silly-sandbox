# silly-sandbox

A place for silly projects with friends. The kind of stuff that happens when someone sends something unhinged to the group chat at midnight and you say "we should make an app for this."

## Projects

### The Kenny Test

A 103-question quiz app based on a real list of "red flags" compiled by a 40-year-old man named Kenny for evaluating dateability. Naturally, the friend group scored themselves. Score above 32? **Unmarriageable.** Below? **Super eligible.**

Features:
- Typeform-style mobile-first quiz with smooth transitions
- Emoji avatar selection
- Leaderboard with cutoff visualization
- Wendy Williams celebration GIF for passing
- Shame GIF for failing
- Returning user detection (skip straight to scoreboard)

**Run it:**
```bash
cd kenny-test
npm install
npm run dev
```

**Deploy:** Push to GitHub, connect to [Vercel](https://vercel.com), done.

**Optional database:** Add Supabase for a persistent leaderboard (see `kenny-test/.env.example`). Without it, scores use localStorage with hardcoded friend scores.
