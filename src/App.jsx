// ===========================================================================
// App — the top-level component. It remembers which tab you're on and shows
// the matching page. Navigation lives in <Nav />. That's the whole router —
// no extra library needed.
// ===========================================================================
import { useState } from 'react'
import Nav from './components/Nav'
import Workout from './pages/Workout'
import Progress from './pages/Progress'
import Diet from './pages/Diet'
import BodyStats from './pages/BodyStats'
import Settings from './pages/Settings'

const PAGES = {
  workout: Workout,
  progress: Progress,
  diet: Diet,
  body: BodyStats,
  settings: Settings,
}

export default function App() {
  const [tab, setTab] = useState('workout')
  const Page = PAGES[tab] || Workout

  return (
    <div className="app">
      <Nav current={tab} onChange={setTab} />
      <main className="main">
        <Page />
      </main>
    </div>
  )
}
