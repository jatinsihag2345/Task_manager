const StatTile = ({ icon: Icon, label, value, tone = 'neutral', hint }) => {
  return (
    <div className={`ai-tile tone-${tone}`}>
      <div className="ai-tile-top">
        <div className="ai-tile-icon" aria-hidden="true">
          <Icon size={18} />
        </div>
        <div className="ai-tile-label">{label}</div>
      </div>
      <div className="ai-tile-value">{value}</div>
      {hint ? <div className="ai-tile-hint">{hint}</div> : null}
    </div>
  );
};

export default StatTile;
