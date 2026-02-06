import { createError } from "../utils/httpError.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const ratingMap = {
  again: { easeDelta: -0.2, intervalMultiplier: 0.2, floorInterval: 1, correct: false },
  good: { easeDelta: 0, intervalMultiplier: 1, floorInterval: 1, correct: true },
  easy: { easeDelta: 0.15, intervalMultiplier: 1.35, floorInterval: 2, correct: true }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function computeMastery(review) {
  const attempts = review.reviewCount || 0;
  if (!attempts) {
    return 0;
  }

  const accuracy = (review.correctCount || 0) / attempts;
  const volumeBonus = Math.min(30, attempts * 3);
  return Math.round(clamp(accuracy * 70 + volumeBonus, 0, 100));
}

export function applyReview(item, rating) {
  const key = String(rating || "").toLowerCase();
  const policy = ratingMap[key];
  if (!policy) {
    throw createError(400, "rating must be one of again|good|easy");
  }

  const currentInterval = Math.max(1, Number(item.review?.intervalDays || 1));
  const currentEase = clamp(Number(item.review?.ease || 2.5), 1.3, 3.2);

  const nextEase = clamp(currentEase + policy.easeDelta, 1.3, 3.2);
  const rawInterval = Math.round(currentInterval * (nextEase * policy.intervalMultiplier));
  const nextInterval = key === "again" ? 1 : Math.max(policy.floorInterval, rawInterval);
  const dueDate = new Date(Date.now() + nextInterval * DAY_MS);

  item.review.intervalDays = nextInterval;
  item.review.ease = nextEase;
  item.review.lastReviewedAt = new Date();
  item.review.reviewCount = (item.review.reviewCount || 0) + 1;
  if (policy.correct) {
    item.review.correctCount = (item.review.correctCount || 0) + 1;
  }
  item.review.dueDate = dueDate;
  item.masteryLevel = computeMastery(item.review);

  return item;
}

export function getMasteryFromReview(review) {
  return computeMastery(review);
}
