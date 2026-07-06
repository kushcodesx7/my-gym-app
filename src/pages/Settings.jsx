// ===========================================================================
// Settings / Data page — edit your profile and, most importantly, back up your
// data. Export downloads a JSON file of everything; Import loads it back on any
// device or after clearing your browser. Nothing here talks to a server.
// ===========================================================================
import { useRef, useState } from 'react'
import { useLocalStorage, DEFAULT_PROFILE } from '../lib/useLocalStorage'
import { KEYS, exportAll, importAll, clearAll } from '../lib/storage'
import { todayKey } from '../lib/date'

export default function Settings() {
  const [profile, setProfile] = useLocalStorage(KEYS.profile, DEFAULT_PROFILE)
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null)

  function flash(text, kind = 'ok') {
    setMsg({ text, kind })
    setTimeout(() => setMsg(null), 3500)
  }

  function updateProfile(field, value) {
    setProfile((p) => ({ ...p, [field]: value }))
  }

  // Download all data as a JSON file.
  function handleExport() {
    const bundle = exportAll()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iron-log-backup-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('Backup downloaded ✓')
  }

  // Read a JSON file the user picks and load it in.
  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const bundle = JSON.parse(reader.result)
        importAll(bundle)
        flash('Backup restored — reloading…')
        setTimeout(() => window.location.reload(), 900)
      } catch (err) {
        flash(err.message || 'Could not read that file', 'err')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // allow re-importing the same file later
  }

  function handleReset() {
    if (!window.confirm('This erases ALL your logged data on this device. Export a backup first! Continue?')) return
    clearAll()
    flash('All data cleared — reloading…')
    setTimeout(() => window.location.reload(), 900)
  }

  const num = (v) => (v === '' ? '' : Number(v))

  return (
    <div>
      <div className="page-head">
        <div>
          <h1><span className="accent">Data</span> & Profile</h1>
          <div className="sub">Your details, and backup / restore</div>
        </div>
      </div>

      {msg && (
        <div className="card" style={{ borderColor: msg.kind === 'err' ? 'var(--red)' : 'var(--green)' }}>
          <span style={{ color: msg.kind === 'err' ? 'var(--red)' : 'var(--green)' }}>{msg.text}</span>
        </div>
      )}

      {/* Backup — most important, so it goes first */}
      <div className="card">
        <h3>Backup your data</h3>
        <p className="faint" style={{ fontSize: '0.85rem' }}>
          Everything is stored only in this browser. Export regularly so you never
          lose your history — and to move it to a new phone or laptop.
        </p>
        <div className="grid grid-2 mt">
          <button className="btn btn-primary btn-block" onClick={handleExport}>
            ⬇ Export backup (JSON)
          </button>
          <button className="btn btn-block" onClick={() => fileRef.current?.click()}>
            ⬆ Import backup
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>

      {/* Profile */}
      <div className="card">
        <h3>Profile</h3>
        <div className="grid grid-2 mt">
          <div className="field">
            <label>Height (cm)</label>
            <input type="number" value={profile.heightCm} onChange={(e) => updateProfile('heightCm', num(e.target.value))} />
          </div>
          <div className="field">
            <label>Weight (kg)</label>
            <input type="number" step="0.1" value={profile.weightKg} onChange={(e) => updateProfile('weightKg', num(e.target.value))} />
          </div>
          <div className="field">
            <label>Protein min (g)</label>
            <input type="number" value={profile.proteinMin} onChange={(e) => updateProfile('proteinMin', num(e.target.value))} />
          </div>
          <div className="field">
            <label>Protein max (g)</label>
            <input type="number" value={profile.proteinMax} onChange={(e) => updateProfile('proteinMax', num(e.target.value))} />
          </div>
          <div className="field">
            <label>Daily calorie target</label>
            <input type="number" value={profile.calorieTarget} onChange={(e) => updateProfile('calorieTarget', num(e.target.value))} />
          </div>
          <div className="field">
            <label>Training days / week</label>
            <input type="number" value={profile.daysPerWeek} onChange={(e) => updateProfile('daysPerWeek', num(e.target.value))} />
          </div>
        </div>
        <div className="field mt">
          <label>Goal</label>
          <input type="text" value={profile.goal} onChange={(e) => updateProfile('goal', e.target.value)} />
        </div>
        <p className="faint mt-s" style={{ fontSize: '0.8rem' }}>
          Your bodyweight feeds the calorie-burn estimate; protein targets drive
          the Diet ring. Changes save automatically.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'var(--border)' }}>
        <h3 style={{ color: 'var(--red)' }}>Danger zone</h3>
        <p className="faint" style={{ fontSize: '0.85rem' }}>
          Erase everything on this device. Make sure you've exported a backup first.
        </p>
        <button className="btn btn-block mt" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={handleReset}>
          Clear all data
        </button>
      </div>

      <p className="center faint mt" style={{ fontSize: '0.8rem' }}>
        Iron Log · offline-first · your data never leaves your device
      </p>
    </div>
  )
}
