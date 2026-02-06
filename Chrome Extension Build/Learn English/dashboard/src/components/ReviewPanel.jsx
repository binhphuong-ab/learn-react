export default function ReviewPanel({ items, onRate }) {
  const current = items[0];

  return (
    <section className="panel">
      <h3>Daily Review</h3>
      {!current ? (
        <p>No due items.</p>
      ) : (
        <article className="review-card">
          <h4>{current.term}</h4>
          <p>{current.meaning || "No meaning"}</p>
          <p className="review-context">Context: {current.context || "N/A"}</p>
          <div className="row-actions">
            <button onClick={() => onRate(current._id, "again")}>Again</button>
            <button onClick={() => onRate(current._id, "good")}>Good</button>
            <button onClick={() => onRate(current._id, "easy")}>Easy</button>
          </div>
        </article>
      )}
    </section>
  );
}
