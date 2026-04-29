import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API_KEY = 'L4IUOC5mTtnrEw2VUqqsPfzefyuKQuaI'
const FALLBACK = 'https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif' // wendy williams clapping

// Manual overrides for questions where raw text won't search well
const overrides = {
  0:  'STD positive test reaction',
  1:  'daddy issues therapy',
  2:  'no diploma dropout',
  3:  'foul mouth soap',
  4:  'drug addict crackhead',
  5:  'oh no horrified disgusted reaction',
  6:  'player roster rotation dating',
  7:  'abortion clinic awkward',
  8:  'not american passport',
  9:  'high body count past',
  10: 'cheating caught red handed',
  11: 'onlyfans thirst trap',
  12: 'stripper pole dancing',
  13: 'party girl drunk',
  14: 'too much makeup cakey',
  15: 'couch potato lazy never gym',
  16: 'plastic surgery botched',
  17: 'relationship hopping serial dater',
  18: 'unemployed broke no job',
  19: 'drunk alcoholic wine mom',
  20: 'guy best friend suspicious',
  21: 'cant drive no car',
  22: 'tattoo of ex cringe',
  23: 'ex suicide red flag',
  24: 'no goals no ambition lazy',
  25: 'living with parents basement adult',
  26: 'flight attendant travel nurse bartender',
  27: 'divorced engaged twice',
  28: 'never lived alone',
  29: 'financially irresponsible broke debt',
  30: 'overly religious late in life',
  31: 'messy dirty hygiene gross',
  32: 'animal cruelty mean to pets',
  33: 'hypocrite double standards',
  34: 'no accountability gaslighting victim',
  35: 'bashing ex crazy',
  36: 'talking about ex obsessed',
  37: 'texting ex suspicious',
  38: 'no long term friends red flag',
  39: 'isolating partner controlling',
  40: 'moving too fast love bomb',
  41: 'family hates girlfriend',
  42: 'parents controlling adult child',
  43: 'competitive couple rivalry',
  44: 'rude to waiter server',
  45: 'pathological liar caught',
  46: 'main character entitled narcissist',
  47: 'jealous suspicious controlling',
  48: 'controlling relationship dictating',
  49: 'victim mentality never wrong',
  50: 'narcissist self absorbed mirror',
  51: 'gambling addiction casino',
  52: 'physically violent domestic abuse',
  53: 'mean cruel evil',
  54: 'petty petty revenge',
  55: 'pessimist negative attitude',
  56: 'instagram thirst trap public profile',
  57: '1500 followers social media influencer wanna be',
  58: 'hiding relationship social media secret',
  59: 'hiding phone screen guilty',
  60: 'liking thirst traps suspicious',
  61: 'attention seeker dramatic selfie',
  62: 'fake social media highlight reel',
  63: 'following followers ratio weird',
  64: 'keeping exes on social media',
  65: 'multiple instagram accounts suspicious',
  66: 'more highlights than posts instagram',
  67: 'private jet rich lifestyle',
  68: 'bikini pics instagram thot',
  69: 'filtered photos fake catfish',
  70: 'flown out sugar daddy travel',
  71: 'porsche 911 cup holder',
  72: 'lifestyle income mismatch living beyond means',
  73: 'silent treatment cold shoulder',
  74: 'gaslighting manipulation',
  75: 'lack of empathy cold',
  76: 'never apologizes stubborn',
  77: 'explosive anger rage overreaction',
  78: 'hot and cold emotional volatile',
  79: 'trauma dump first date oversharing',
  80: 'dry texter never initiates',
  81: 'pregnancy scare prank evil',
  82: 'alpha female cringe',
  83: 'only noticed when successful',
  84: 'cant cook disaster kitchen',
  85: 'cant clean messy house',
  86: 'no sushi disgusted food',
  87: 'las vegas party too much',
  88: 'dating app tinder swipe',
  89: 'too many contacts phone',
  90: 'phone always silent suspicious',
  91: 'notifications off hiding',
  92: 'two phones suspicious burner',
  93: 'no financial literacy confused',
  94: 'never pays dutch date',
  95: 'wagyu caviar gold digger',
  96: 'michelin star restaurant expensive',
  97: 'refusing coffee date high maintenance',
  98: 'flowers from secret admirer suspicious',
  99: 'dating older man sugar daddy',
  100: 'asking for money travel',
  101: 'sugar daddy kept woman',
  102: 'two guys one night walk of shame',
}

async function searchGiphy(query) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=5&rating=r&lang=en`
  const res = await fetch(url)
  if (res.status === 429) return { rateLimited: true }
  const json = await res.json()
  if (json.data?.length > 0) {
    const pick = json.data[Math.floor(Math.random() * Math.min(3, json.data.length))]
    return { url: pick.images.fixed_height.url, title: pick.title }
  }
  return { url: null }
}

const total = Object.keys(overrides).length
const gifs = new Array(total).fill(null)
let rateLimited = false

for (let i = 0; i < total; i++) {
  const term = overrides[i]
  process.stderr.write(`[${i + 1}/${total}] ${term}\n`)

  if (rateLimited) {
    gifs[i] = FALLBACK
    continue
  }

  const result = await searchGiphy(term)

  if (result.rateLimited) {
    process.stderr.write('  ⚠ rate limited — using fallback for remainder\n')
    rateLimited = true
    gifs[i] = FALLBACK
    continue
  }

  if (result.url) {
    process.stderr.write(`  ✓ ${result.title}\n`)
    gifs[i] = result.url
  } else {
    process.stderr.write(`  ✗ no result — using fallback\n`)
    gifs[i] = FALLBACK
  }

  if (i < total - 1) await new Promise(r => setTimeout(r, 650))
}

const outPath = join(__dirname, '../src/gifs.js')
const output = `const gifs = ${JSON.stringify(gifs, null, 2)}\n\nexport default gifs\n`
writeFileSync(outPath, output)

process.stderr.write(`\nDone! Saved ${total} entries to src/gifs.js\n`)
if (rateLimited) process.stderr.write('⚠ Hit rate limit — some entries use fallback\n')
