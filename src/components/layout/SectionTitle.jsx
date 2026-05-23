export default function SectionTitle({ badge, title, subtitle }) {
  return (
    <div className="section-title">
      <span className="tag">{badge}</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}