export default function StatsCards({ summary }) {
  const cards = [
    { label: "Total Words", value: summary?.totalWords ?? 0 },
    { label: "Mastered", value: summary?.mastered ?? 0 },
    { label: "In Progress", value: summary?.inProgress ?? 0 },
    { label: "Review Streak", value: summary?.reviewStreak ?? 0 },
    { label: "Words/Day", value: summary?.averageLearningRate?.wordsPerDay ?? 0 },
    { label: "Words/Week", value: summary?.averageLearningRate?.wordsPerWeek ?? 0 },
    { label: "Accuracy %", value: summary?.reviewAccuracy ?? 0 }
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => (
        <article className="stat-card" key={card.label}>
          <div className="stat-label">{card.label}</div>
          <div className="stat-value">{card.value}</div>
        </article>
      ))}
    </section>
  );
}
