// ===========================================================================
// Nav — the app navigation. On phones it's a fixed bottom tab bar (easy to
// reach one-handed). On desktop it becomes a left sidebar for a dashboard feel.
// We keep it simple: a list of tabs, the active one is highlighted.
// ===========================================================================

const TABS = [
  { id: 'workout', label: 'Workout', icon: '🏋️' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'diet', label: 'Diet', icon: '🍗' },
  { id: 'body', label: 'Body', icon: '⚖️' },
  { id: 'settings', label: 'Data', icon: '⚙️' },
]

export default function Nav({ current, onChange }) {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="nav-logo">IRON</span>
        <span className="nav-logo-accent">LOG</span>
      </div>
      <ul className="nav-tabs">
        {TABS.map((t) => (
          <li key={t.id}>
            <button
              className={'nav-tab' + (current === t.id ? ' active' : '')}
              onClick={() => onChange(t.id)}
              aria-current={current === t.id ? 'page' : undefined}
            >
              <span className="nav-icon">{t.icon}</span>
              <span className="nav-label">{t.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
