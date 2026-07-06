# 🏋️ Iron Log — Gym & Diet Tracker

A personal, offline-first gym and diet tracker. Mobile-first for use at the gym,
with a desktop dashboard layout. All data lives in your browser's `localStorage`
— **no backend, no login, no account.** Your data never leaves your device.

Built with **React + Vite**. Dark theme (`#0D1117`) with amber/gold accent
(`#F5B841`) and Barlow / Barlow Condensed fonts. Charts are hand-drawn with SVG,
so there are **no heavy dependencies** — the whole app is ~57 KB gzipped.

## Features

- **Today's Workout** — 6-day Push/Pull/Legs split that auto-selects the right
  day. Log weight + reps per set, tick sets done, and an automatic rest timer
  starts (90s compounds / 60s isolation). Expandable "how to do it" guides,
  a live session progress bar, and MET-based calories burned.
- **Progress** — line charts of weight lifted per exercise over time, plus a
  weekly training-volume summary.
- **Diet** — a customizable meal checklist with quantity steppers, a live
  protein ring vs your 160–175 g target, and a daily calorie estimate.
- **Body Stats** — weekly weight + waist log with charts and your rate of change
  vs the ~0.5 kg/week fat-loss goal.
- **Data** — edit your profile, and **export / import** all your data as a JSON
  file so you never lose your history (and can move it between devices).

## Run it locally

```bash
npm install     # install dependencies (first time only)
npm run dev      # start the dev server
```

Then open the URL it prints (usually http://localhost:5173).

To preview a production build:

```bash
npm run build    # creates the optimized app in dist/
npm run preview  # serves the built app
```

## Deploy to Netlify

This repo includes `netlify.toml`, so Netlify auto-detects everything:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Just connect the GitHub repo in Netlify and it deploys on every push. See the
step-by-step guide the assistant walked through, or Netlify's "Import from Git"
flow.

## Your data

Everything is stored under keys prefixed with `ironlog.` in `localStorage`.
Clearing your browser data will erase it — so use **Data → Export backup**
regularly. Import that JSON file anytime to restore.
