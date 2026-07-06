// ===========================================================================
// Diet page — a daily meal checklist you can fully customise.
// Tick meals as you eat them (with a quantity stepper for things like eggs).
// A protein ring shows your total vs your 160–175g target, plus a calorie
// estimate for the day.
// ===========================================================================
import { useMemo, useState } from 'react'
import { useLocalStorage, DEFAULT_PROFILE } from '../lib/useLocalStorage'
import { KEYS } from '../lib/storage'
import { todayKey, prettyDate } from '../lib/date'
import { DEFAULT_DIET_ITEMS } from '../lib/dietDefaults'
import ProgressRing from '../components/ProgressRing'

export default function Diet() {
  const [profile] = useLocalStorage(KEYS.profile, DEFAULT_PROFILE)
  const [items, setItems] = useLocalStorage(KEYS.dietTemplate, DEFAULT_DIET_ITEMS)
  const [log, setLog] = useLocalStorage(KEYS.dietLog, {})
  const [editing, setEditing] = useState(false)

  const dateKey = todayKey()
  const today = log[dateKey] || { qty: {} }

  // Quantity of a given item eaten today (0 if none).
  const qtyOf = (id) => today.qty[id] || 0

  function setQty(id, n) {
    const next = Math.max(0, n)
    setLog((prev) => {
      const day = prev[dateKey] || { qty: {} }
      return { ...prev, [dateKey]: { ...day, qty: { ...day.qty, [id]: next } } }
    })
  }

  // Totals for today.
  const totals = useMemo(() => {
    let protein = 0
    let calories = 0
    for (const it of items) {
      const q = qtyOf(it.id)
      protein += (Number(it.protein) || 0) * q
      calories += (Number(it.calories) || 0) * q
    }
    return { protein: Math.round(protein), calories: Math.round(calories) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, log])

  const target = profile.proteinMax || 175
  const minTarget = profile.proteinMin || 160
  const hitRange = totals.protein >= minTarget

  // --- Template editing helpers ---
  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)))
  }
  function deleteItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }
  function addItem() {
    const id = 'item-' + Date.now()
    setItems((prev) => [...prev, { id, name: 'New food', protein: 0, calories: 0 }])
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1><span className="accent">Diet</span></h1>
          <div className="sub">{prettyDate(dateKey)} · target {minTarget}–{target}g protein</div>
        </div>
        <button className="btn btn-sm" onClick={() => setEditing((e) => !e)}>
          {editing ? 'Done' : 'Edit meals'}
        </button>
      </div>

      {/* Summary: protein ring + calories */}
      <div className="card">
        <div className="row between wrap" style={{ gap: 20 }}>
          <ProgressRing
            value={totals.protein}
            target={target}
            label="protein"
            sublabel={`goal ${minTarget}–${target}g`}
          />
          <div style={{ flex: 1, minWidth: 160 }}>
            <div className="stat-label">Protein so far</div>
            <div className="big-num" style={{ color: hitRange ? 'var(--green)' : 'var(--accent)' }}>
              {totals.protein}<span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>g</span>
            </div>
            <div className="faint">
              {hitRange
                ? '✅ In your target range — great job.'
                : `${Math.max(0, minTarget - totals.protein)}g to go to reach your minimum.`}
            </div>
            <div className="divider" />
            <div className="stat-label">Calories (checked meals)</div>
            <div className="big-num" style={{ fontSize: '1.8rem' }}>
              {totals.calories}<span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}> kcal</span>
            </div>
            <div className="faint">
              Daily estimate target ~{profile.calorieTarget} kcal (moderate deficit)
            </div>
          </div>
        </div>
      </div>

      {/* Meal checklist */}
      <div className="card">
        <h3>Today's meals</h3>
        <div className="meal-list mt">
          {items.map((it) => {
            const q = qtyOf(it.id)
            const checked = q > 0
            return (
              <div className={'meal' + (checked ? ' checked' : '')} key={it.id}>
                {editing ? (
                  <div className="meal-edit">
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) => updateItem(it.id, 'name', e.target.value)}
                      aria-label="Food name"
                    />
                    <div className="row" style={{ gap: 8 }}>
                      <div className="field" style={{ flex: 1 }}>
                        <label>Protein g</label>
                        <input
                          type="number"
                          value={it.protein}
                          onChange={(e) => updateItem(it.id, 'protein', e.target.value)}
                        />
                      </div>
                      <div className="field" style={{ flex: 1 }}>
                        <label>Calories</label>
                        <input
                          type="number"
                          value={it.calories}
                          onChange={(e) => updateItem(it.id, 'calories', e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{ alignSelf: 'flex-end', color: 'var(--red)' }}
                        onClick={() => deleteItem(it.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className={'check' + (checked ? ' on' : '')}
                      onClick={() => setQty(it.id, checked ? 0 : 1)}
                      aria-pressed={checked}
                      aria-label={`Mark ${it.name} eaten`}
                    >
                      {checked ? '✓' : ''}
                    </button>
                    <div className="meal-info">
                      <div className="meal-name">{it.name}</div>
                      <div className="faint" style={{ fontSize: '0.8rem' }}>
                        {it.protein}g protein · {it.calories} kcal {q > 1 ? `· ×${q}` : ''}
                      </div>
                    </div>
                    <div className="qty">
                      <button className="qty-btn" onClick={() => setQty(it.id, q - 1)} aria-label="less">−</button>
                      <span className="qty-num">{q}</span>
                      <button className="qty-btn" onClick={() => setQty(it.id, q + 1)} aria-label="more">+</button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {editing && (
          <button className="btn btn-block mt" onClick={addItem}>
            + Add food item
          </button>
        )}
      </div>
    </div>
  )
}
