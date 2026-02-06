export default function TimelineView({ items }) {
  return (
    <section className="panel">
      <h3>Timeline</h3>
      <div className="timeline-list">
        {items.length === 0 ? <p>No words yet.</p> : null}
        {items.map((item) => (
          <article className="timeline-item" key={item._id}>
            <div className="timeline-dot" />
            <div>
              <h4>{item.term}</h4>
              <p>{item.meaning || "No meaning"}</p>
              <small>Source: {item.sourceTitle || "Unknown source"}</small>
              <br />
              <small>
                Added {new Date(item.addedAt || item.createdAt).toLocaleString()} | Tags: {(item.tags || []).join(", ") || "none"}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
