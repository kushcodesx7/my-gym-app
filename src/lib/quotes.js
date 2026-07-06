// ===========================================================================
// quotes.js — one short motivational line per day. We pick by day-of-year so
// it changes daily but stays the same all day (no random flicker on reload).
// ===========================================================================

const QUOTES = [
  'The only bad workout is the one that didn’t happen.',
  'Discipline beats motivation. Show up anyway.',
  'You don’t have to be extreme. Just consistent.',
  'Sore today. Strong tomorrow.',
  'One more rep than last time. That’s the whole game.',
  'The body achieves what the mind believes.',
  'Nobody ever regretted a workout.',
  'Small steps every day. Big change every month.',
  'Your future physique is built in today’s session.',
  'Fall in love with the process and results will follow.',
  'When you feel like quitting, remember why you started.',
  'Sweat is just fat crying.',
  'Strength doesn’t come from what you can do — it comes from doing what you thought you couldn’t.',
  'Champions train. Losers complain.',
  'It never gets easier. You just get stronger.',
  'Make yourself proud tonight.',
]

export function quoteOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date - start) / (1000 * 60 * 60 * 24))
  return QUOTES[dayOfYear % QUOTES.length]
}

// Time-of-day greeting.
export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 5) return 'Late night grind'
  if (h < 12) return 'Rise & grind'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Evening session'
  return 'Night owl mode'
}
