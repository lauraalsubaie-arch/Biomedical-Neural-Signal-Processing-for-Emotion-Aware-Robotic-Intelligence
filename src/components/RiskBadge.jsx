export default function RiskBadge({ level = "Stable" }) {
  return <span className={`risk-badge ${level.toLowerCase()}`}>{level}</span>;
}
