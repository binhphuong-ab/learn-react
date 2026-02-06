import { Router } from "express";
import { VocabItem } from "../models/VocabItem.js";
import { computeAccuracy, computeLearningRate, computeStreak } from "../services/statsService.js";

const router = Router();

router.get("/timeline", async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const where = {};
    if (dateFrom || dateTo) {
      const range = {};
      if (dateFrom) {
        range.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        range.$lte = new Date(dateTo);
      }

      where.$or = [
        { addedAt: range },
        {
          addedAt: { $exists: false },
          createdAt: range
        }
      ];
    }

    const items = await VocabItem.find(where).sort({ addedAt: -1, createdAt: -1 }).lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const items = await VocabItem.find({}).lean();
    const total = items.length;
    const mastered = items.filter((item) => (item.masteryLevel || 0) >= 80).length;
    const inProgress = items.filter((item) => (item.masteryLevel || 0) < 80).length;

    const tagMap = new Map();
    for (const item of items) {
      for (const tag of item.tags || []) {
        if (!tag) continue;
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }

    const progressMap = new Map();
    for (const item of items) {
      const key = new Date(item.addedAt || item.createdAt).toISOString().slice(0, 10);
      progressMap.set(key, (progressMap.get(key) || 0) + 1);
    }

    const progress = [...progressMap.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const accuracyTrend = items
      .filter((item) => item.review?.reviewCount)
      .map((item) => ({
        term: item.term,
        accuracy: Number(((item.review.correctCount / item.review.reviewCount) * 100).toFixed(2)),
        reviews: item.review.reviewCount
      }))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 20);

    res.json({
      summary: {
        totalWords: total,
        mastered,
        inProgress,
        reviewStreak: computeStreak(items),
        averageLearningRate: computeLearningRate(items),
        reviewAccuracy: computeAccuracy(items)
      },
      charts: {
        progress,
        byTag: [...tagMap.entries()].map(([tag, value]) => ({ tag, value })),
        accuracyTrend
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
