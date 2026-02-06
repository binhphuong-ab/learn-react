const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateKey(date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function computeStreak(items = []) {
  const reviewedDays = new Set(
    items
      .map((item) => item?.review?.lastReviewedAt)
      .filter(Boolean)
      .map((value) => formatDateKey(new Date(value)))
  );

  let streak = 0;
  let cursor = startOfDay(new Date());
  while (reviewedDays.has(formatDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  return streak;
}

export function computeLearningRate(items = []) {
  const now = Date.now();
  const oneDayAgo = now - DAY_MS;
  const sevenDaysAgo = now - 7 * DAY_MS;

  const dayCount = items.filter((item) => new Date(item.addedAt || item.createdAt).getTime() >= oneDayAgo).length;
  const weekCount = items.filter((item) => new Date(item.addedAt || item.createdAt).getTime() >= sevenDaysAgo).length;

  return {
    wordsPerDay: dayCount,
    wordsPerWeek: Number((weekCount / 7).toFixed(2))
  };
}

export function computeAccuracy(items = []) {
  const totalReviews = items.reduce((sum, item) => sum + (item.review?.reviewCount || 0), 0);
  const totalCorrect = items.reduce((sum, item) => sum + (item.review?.correctCount || 0), 0);

  if (!totalReviews) {
    return 0;
  }

  return Number(((totalCorrect / totalReviews) * 100).toFixed(2));
}
