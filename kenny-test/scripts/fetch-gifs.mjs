// Fetches one GIF URL per question from Giphy and writes src/gifs.js
// Run from kenny-test/: node scripts/fetch-gifs.mjs

const API_KEY = 'L4IUOC5mTtnrEw2VUqqsPfzefyuKQuaI'

// Hand-crafted search terms per question — chosen for max comedy
const searches = [
  "doctor office scared reaction",           // 1  incurable STD
  "therapy couch laying down",               // 2  daddy issues
  "graduation fail dropout",                 // 3  no high school diploma
  "sailor mouth bleeping swearing",          // 4  foul-mouthed
  "just say no drugs",                       // 5  heavy drug user
  "shocked jaw drop gasp",                   // 6  gangbang
  "phone contacts too many",                 // 7  deep roster
  "too many times again",                    // 8  more than 2 abortions
  "passport stamp travel",                   // 9  not born in US
  "body count wild past",                    // 10 promiscuous past
  "desperate clinging low standards",        // 11 super easy to get
  "camera recording awkward",               // 12 OnlyFans
  "stripper pole dance",                     // 13 stripper
  "party girl going out every night",        // 14 party girl
  "too much makeup caked",                   // 15 too much makeup
  "couch potato lazy netflix",               // 16 not going to gym
  "plastic surgery before after",            // 17 body-altering surgeries
  "next please moving on fast",              // 18 jumps relationship to relationship
  "unemployed broke searching",              // 19 unemployed
  "wine bottle entire",                      // 20 drinks a lot
  "suspicious jealous best friend",          // 21 too many guy friends
  "bus public transport struggle",           // 22 no car
  "regret tattoo laser removal",             // 23 tattoo of ex
  "awkward uncomfortable silence",           // 24 ex committed suicide
  "no motivation couch lazy",               // 25 no personal goals
  "basement mom son",                        // 26 lives at home after 25
  "flight attendant walking",                // 27 nurse bartender flight attendant
  "divorced again married",                  // 28 engaged or married more than 2 times
  "never grew up peter pan",                 // 29 never lived on own
  "spending money broke",                    // 30 financially irresponsible
  "born again church hallelujah",            // 31 overly religious after 30
  "stinky smell gross",                      // 32 poor hygiene
  "dog cat mean evil",                       // 33 rough with pets
  "hypocrite two faced",                     // 34 hypocrite
  "not my fault shrug",                      // 35 zero accountability
  "crazy ex girlfriend",                     // 36 bash all exes
  "still not over ex texting",               // 37 talk about ex constantly
  "ex texting late night",                   // 38 frequent contact with ex
  "no friends alone forever",                // 39 no long-term friendships
  "clingy possessive",                       // 40 isolate partner
  "slow down pump brakes too fast",          // 41 moves way too fast
  "family hates girlfriend disapproval",     // 42 friends and family don't like you
  "helicopter parent controlling",           // 43 parents too much control
  "competing couple rivalry",                // 44 competitive with partner
  "rude customer karen",                     // 45 rude to service workers
  "pinocchio lying nose grows",              // 46 pathological liar
  "main character energy",                   // 47 main character syndrome
  "jealous crazy eyes",                      // 48 severe jealousy
  "controlling relationship rules",          // 49 controlling
  "playing victim card",                     // 50 victim mentality
  "narcissist mirror selfie",                // 51 narcissistic tendencies
  "casino losing gambling",                  // 52 gambling issues
  "smashing breaking angry",                 // 53 physically violent
  "evil villain laugh",                      // 54 cruel
  "petty revenge small",                     // 55 petty
  "rain cloud gloom",                        // 56 constant pessimism
  "instagram phone scrolling",               // 57 public IG/FB
  "follower count going up",                 // 58 1500+ followers
  "hiding secret relationship",              // 59 hides relationship on social
  "hiding phone screen sneaky",              // 60 hiding phone screen
  "thirst trap like reaction",               // 61 likes thirst traps
  "selfie queen taking selfies",             // 62 constant selfies
  "fake life filter instagram",              // 63 misleading social media
  "ratio unbalanced following",              // 64 unbalanced followers
  "stalking ex on instagram",                // 65 exes on social
  "fake account catfish reveal",             // 66 multiple IG profiles
  "instagram highlights many",               // 67 more highlights than posts
  "private jet luxury",                      // 68 been on private jet
  "bikini photos beach too many",            // 69 5+ bikini pics
  "beauty filter facetune",                  // 70 lots of filtered pictures
  "being flown out travel exotic",           // 71 flown out exotic locations
  "luxury car porsche",                      // 72 knows Porsche 911 cup holder
  "how can she afford this lifestyle",       // 73 lifestyle doesn't match income
  "silent treatment ignoring",               // 74 silent treatment
  "gaslight manipulate reality",             // 75 gaslights
  "i dont care whatever",                    // 76 lacks empathy
  "never apologize never wrong",             // 77 refuses to apologize
  "rage flip table explode",                 // 78 explosive rage
  "hot cold mood swing bipolar",             // 79 emotionally volatile
  "oversharing trauma dump stranger",        // 80 trauma dumps on first dates
  "left on read no response",                // 81 barely initiates texts
  "pregnancy test shock surprised",          // 82 pregnancy scare prank
  "boss girl alpha female",                  // 83 calls herself alpha female
  "now you want me glowing up",              // 84 only noticed when accomplished
  "cooking disaster kitchen fire",           // 85 can't cook
  "messy house disaster filthy",             // 86 can't clean
  "disgusted food reaction yuck",            // 87 doesn't eat sushi
  "las vegas party neon",                    // 88 goes to Vegas
  "tinder swipe dating app",                 // 89 uses dating apps
  "phone contacts overflowing",              // 90 2000+ contacts
  "phone silent vibrate",                    // 91 phone always on silent
  "do not disturb notification off",         // 92 notifications off
  "two phones suspicious",                   // 93 more than 2 phones
  "confused math calculation",               // 94 can't do P&L
  "dutch treat who pays date",               // 95 never offers to pay
  "expensive fancy restaurant bill",         // 96 orders A5 wagyu/caviar first date
  "michelin star fancy food",                // 97 only eats Michelin star
  "starbucks basic coffee date",             // 98 refuses coffee/tea date
  "suspicious flowers from who",             // 99 flowers from unknown guys
  "age gap old man young woman",             // 100 been with guy older than dad
  "girls trip expensive vacation",           // 101 asks partner to pay for trips
  "sugar daddy money bags",                  // 102 sugar daddies
  "walk of shame morning after",             // 103 two guys in 24 hours
]

const delay = ms => new Promise(r => setTimeout(r, ms))

async function fetchGif(query, index) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=5&rating=pg-13&lang=en`
  const res = await fetch(url)
  const json = await res.json()
  const gifs = json.data || []
  if (gifs.length === 0) {
    console.log(`[${index + 1}] ❌ "${query}" → no results`)
    return null
  }
  // Pick a gif that isn't too large — prefer the first with a downsized_medium
  const gif = gifs[0]
  const src = gif.images?.downsized_medium?.url || gif.images?.fixed_height?.url || gif.images?.original?.url
  console.log(`[${index + 1}] ✓ "${query}" → ${gif.title.slice(0, 50)}`)
  return src || null
}

const results = []
for (let i = 0; i < searches.length; i++) {
  const url = await fetchGif(searches[i], i)
  results.push(url)
  if (i < searches.length - 1) await delay(300) // stay under rate limit
}

const output = `// Auto-generated by scripts/fetch-gifs.mjs — do not edit manually
// Each entry corresponds to the question at the same index in questions.js
const gifs = ${JSON.stringify(results, null, 2)}

export default gifs
`

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
writeFileSync(join(__dirname, '../src/gifs.js'), output)

const found = results.filter(Boolean).length
console.log(`\nDone: ${found}/${results.length} GIFs found → src/gifs.js written`)
