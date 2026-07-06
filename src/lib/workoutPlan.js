// ===========================================================================
// workoutPlan.js — the Push / Pull / Legs training plan.
//
// Each exercise has:
//   id        unique short id (used to store your logged sets)
//   name      display name
//   type      'compound' or 'isolation' (decides the rest timer length)
//   rest      rest seconds after a set (90s compound, 60s isolation)
//   met       MET value = how hard it is, used to estimate calories burned
//   sets      how many sets
//   repLow/repHigh  target rep range
//   guide     short "how to do it" instructions
// ===========================================================================

const compoundRest = 90
const isoRest = 60

// Reusable set/rep defaults (3 sets, 10–12 reps as you asked).
const base = { sets: 3, repLow: 10, repHigh: 12 }

export const DAYS = {
  Push: {
    key: 'Push',
    label: 'Push Day',
    focus: 'Chest · Shoulders · Triceps',
    exercises: [
      {
        id: 'chest-press',
        name: 'Chest Press',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Sit with your back flat against the pad, handles at mid-chest height. Press forward until arms are almost straight (do not lock elbows), then lower slowly for 2 seconds. Keep shoulders down and back.',
      },
      {
        id: 'db-shoulder-press',
        name: 'DB Shoulder Press',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Dumbbells at shoulder height, palms facing forward. Press up until arms are nearly straight without clanging the weights together. Lower under control to ear level. Keep your core tight so you don’t arch your lower back.',
      },
      {
        id: 'incline-db-press',
        name: 'Incline DB Press',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Set the bench to about 30–45°. Press the dumbbells up and slightly together over your upper chest, then lower to the sides of your chest with a good stretch. This targets the upper chest.',
      },
      {
        id: 'lateral-raises',
        name: 'Lateral Raises',
        type: 'isolation',
        rest: isoRest,
        met: 4.0,
        ...base,
        guide:
          'Light dumbbells at your sides, tiny bend in the elbows. Raise out to the sides until arms are level with your shoulders — lead with the elbows, not the hands. Lower slowly. Go lighter than you think; form matters here.',
      },
      {
        id: 'tricep-rope-pushdown',
        name: 'Tricep Rope Pushdown',
        type: 'isolation',
        rest: isoRest,
        met: 3.8,
        ...base,
        guide:
          'Rope attachment on a high cable. Keep elbows pinned to your sides. Push down and spread the rope apart at the bottom, fully straightening the arms. Let it rise slowly back to chest height.',
      },
    ],
  },

  Pull: {
    key: 'Pull',
    label: 'Pull Day',
    focus: 'Back · Rear Delts · Biceps',
    exercises: [
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Grip the bar slightly wider than shoulders. Pull it down to your upper chest by driving your elbows down and back, squeezing your shoulder blades. Control the bar back up — don’t let it yank your arms straight.',
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Sit tall, slight bend in the knees. Pull the handle to your belly button, squeezing your shoulder blades together. Keep your torso mostly still — avoid rocking back and forth for momentum.',
      },
      {
        id: 'face-pulls',
        name: 'Face Pulls',
        type: 'isolation',
        rest: isoRest,
        met: 4.0,
        ...base,
        guide:
          'Rope on a high cable, at face height. Pull toward your forehead, splitting the rope and aiming your knuckles behind your ears. Great for posture and healthy shoulders. Keep it light and controlled.',
      },
      {
        id: 'db-bicep-curls',
        name: 'DB Bicep Curls',
        type: 'isolation',
        rest: isoRest,
        met: 3.8,
        ...base,
        guide:
          'Dumbbells at your sides, palms forward. Curl up without swinging your elbows forward or leaning back. Squeeze at the top, then lower slowly for a 2-second count.',
      },
      {
        id: 'hammer-curls',
        name: 'Hammer Curls',
        type: 'isolation',
        rest: isoRest,
        met: 3.8,
        ...base,
        guide:
          'Same as a curl but palms face each other (like holding a hammer). This hits the forearm and the outer bicep. Keep elbows tucked and control the lowering.',
      },
    ],
  },

  Legs: {
    key: 'Legs',
    label: 'Leg Day',
    focus: 'Quads · Hamstrings · Calves · Core',
    exercises: [
      {
        id: 'leg-press',
        name: 'Leg Press',
        type: 'compound',
        rest: compoundRest,
        met: 6.0,
        ...base,
        guide:
          'Feet shoulder-width on the platform. Lower until your knees reach about 90°, then press through your heels. Never lock your knees hard at the top, and don’t let your lower back round off the seat.',
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        type: 'isolation',
        rest: isoRest,
        met: 4.0,
        ...base,
        guide:
          'Pad rests on your lower shins. Straighten your legs fully, squeeze the quads at the top for a second, then lower slowly. Isolates the front of your thighs.',
      },
      {
        id: 'leg-curl',
        name: 'Leg Curl',
        type: 'isolation',
        rest: isoRest,
        met: 4.0,
        ...base,
        guide:
          'Curl the pad toward your glutes by bending the knees, squeeze the hamstrings, then lower under control. Works the back of your thighs.',
      },
      {
        id: 'calf-raises',
        name: 'Calf Raises',
        type: 'isolation',
        rest: isoRest,
        met: 4.0,
        ...base,
        guide:
          'Push up onto the balls of your feet as high as possible, pause at the top, then lower your heels slowly for a deep stretch. Full range beats bouncing.',
      },
      {
        id: 'plank',
        name: 'Plank',
        type: 'isolation',
        rest: isoRest,
        met: 3.3,
        sets: 3,
        repLow: 30,
        repHigh: 60,
        repUnit: 'sec',
        guide:
          'Forearms and toes on the floor, body in a straight line from head to heels. Squeeze your glutes and abs, don’t let your hips sag or pike up. Log the seconds you held in the reps box.',
      },
    ],
  },

  Rest: {
    key: 'Rest',
    label: 'Rest Day',
    focus: 'Recovery',
    exercises: [],
  },
}

// The weekly schedule: 6 training days + 1 rest.
// Index 0 = Sunday, 1 = Monday, … 6 = Saturday.
// Mon–Sat = Push/Pull/Legs twice, Sunday = Rest.
export const WEEK_SCHEDULE = [
  'Rest', // Sun
  'Push', // Mon
  'Pull', // Tue
  'Legs', // Wed
  'Push', // Thu
  'Pull', // Fri
  'Legs', // Sat
]

// Given a weekday index (0–6), return the day plan.
export function dayForWeekday(weekdayIdx) {
  return DAYS[WEEK_SCHEDULE[weekdayIdx]]
}

// Look up a single exercise's definition by its id (across all days).
export function findExercise(id) {
  for (const day of Object.values(DAYS)) {
    const found = day.exercises.find((e) => e.id === id)
    if (found) return found
  }
  return null
}
