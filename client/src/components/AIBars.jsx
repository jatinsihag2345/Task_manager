import { useMemo } from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const AIBars = ({ title = 'Overview', items }) => {
  const normalized = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];
    const maxVal = safeItems.reduce((m, it) => Math.max(m, Number(it.value) || 0), 0) || 1;
    return safeItems.map((it) => ({
      ...it,
      pct: clamp(((Number(it.value) || 0) / maxVal) * 100, 0, 100),
    }));
  }, [items]);

  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <div className="ai-panel-title">{title}</div>
        <div className="ai-panel-sub">Real-time distribution</div>
      </div>

      <div className="ai-bars">
        {normalized.map((it) => (
          <div key={it.key || it.label} className="ai-bar-row">
            <div className="ai-bar-meta">
              <span className="ai-bar-label">{it.label}</span>
              <span className="ai-bar-value">{it.value}</span>
            </div>
            <div className="ai-bar-track" role="progressbar" aria-valuenow={it.value} aria-valuemin={0} aria-valuemax={100}>
              <div className={`ai-bar-fill ${it.tone ? `tone-${it.tone}` : ''}`} style={{ width: `${it.pct}%` }} />
            </div>
          </div>
        ))}

        {normalized.length === 0 ? <div className="ai-empty">No data yet.</div> : null}
      </div>
    </div>
  );
};

export default AIBars;
