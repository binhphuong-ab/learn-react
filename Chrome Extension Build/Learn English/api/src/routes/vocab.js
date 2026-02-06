import { Router } from "express";
import { VocabItem } from "../models/VocabItem.js";
import { applyReview, getMasteryFromReview } from "../services/reviewService.js";
import { createError } from "../utils/httpError.js";
import { uniqueStrings } from "../utils/normalize.js";

const router = Router();

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery(query) {
  const {
    q,
    tag,
    due,
    dateFrom,
    dateTo,
    masteryMin,
    masteryMax
  } = query;

  const conditions = [];

  if (q) {
    const text = String(q).trim();
    conditions.push({
      $or: [
        { term: { $regex: text, $options: "i" } },
        { meaning: { $regex: text, $options: "i" } },
        { translation: { $regex: text, $options: "i" } },
        { context: { $regex: text, $options: "i" } },
        { tags: { $regex: text, $options: "i" } }
      ]
    });
  }

  if (tag) {
    conditions.push({ tags: String(tag) });
  }

  if (due === "true") {
    conditions.push({ "review.dueDate": { $lte: new Date() } });
  }

  if (dateFrom || dateTo) {
    const range = {};
    if (dateFrom) {
      range.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      range.$lte = new Date(dateTo);
    }
    conditions.push({
      $or: [
        { addedAt: range },
        {
          addedAt: { $exists: false },
          createdAt: range
        }
      ]
    });
  }

  if (masteryMin || masteryMax) {
    const mastery = {};
    if (masteryMin) {
      mastery.$gte = Number(masteryMin);
    }
    if (masteryMax) {
      mastery.$lte = Number(masteryMax);
    }
    conditions.push({ masteryLevel: mastery });
  }

  if (!conditions.length) {
    return {};
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return { $and: conditions };
}

function normalizePayload(payload = {}) {
  const tags = uniqueStrings(payload.tags);
  const examples = uniqueStrings(payload.examples);

  const review = payload.review || {};
  if (review?.reviewCount >= 0 && review?.correctCount >= 0) {
    payload.masteryLevel = getMasteryFromReview(review);
  }

  return {
    term: String(payload.term || "").trim(),
    pronunciation: String(payload.pronunciation || "").trim(),
    audioUrl: String(payload.audioUrl || "").trim(),
    translation: String(payload.translation || "").trim(),
    meaning: String(payload.meaning || "").trim(),
    examples,
    tags,
    difficulty: payload.difficulty || null,
    masteryLevel: payload.masteryLevel ?? 0,
    sourceUrl: String(payload.sourceUrl || "").trim(),
    sourceTitle: String(payload.sourceTitle || "").trim(),
    context: String(payload.context || "").trim(),
    review: payload.review || {}
  };
}

router.get("/vocab", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 30)));
    const where = buildQuery(req.query);

    const [items, total] = await Promise.all([
      VocabItem.find(where)
        .sort({ addedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      VocabItem.countDocuments(where)
    ]);

    res.json({
      page,
      limit,
      total,
      items
    });
  } catch (error) {
    next(error);
  }
});

router.get("/vocab/:id", async (req, res, next) => {
  try {
    const item = await VocabItem.findById(req.params.id);
    if (!item) {
      throw createError(404, "Vocab item not found");
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/vocab", async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body || {});
    if (!payload.term) {
      throw createError(400, "term is required");
    }

    const termRegex = new RegExp(`^${escapeRegex(payload.term)}$`, "i");
    const existing = await VocabItem.findOne({ term: termRegex }).sort({ addedAt: -1, createdAt: -1 });

    if (existing) {
      existing.addedAt = new Date();
      if (payload.sourceUrl) existing.sourceUrl = payload.sourceUrl;
      if (payload.sourceTitle) existing.sourceTitle = payload.sourceTitle;
      if (payload.context) existing.context = payload.context;
      if (!existing.meaning && payload.meaning) existing.meaning = payload.meaning;
      if (!existing.pronunciation && payload.pronunciation) existing.pronunciation = payload.pronunciation;
      if (!existing.audioUrl && payload.audioUrl) existing.audioUrl = payload.audioUrl;
      if (payload.examples?.length) {
        existing.examples = uniqueStrings([...(existing.examples || []), ...payload.examples]);
      }
      if (payload.tags?.length) {
        existing.tags = uniqueStrings([...(existing.tags || []), ...payload.tags]);
      }

      await existing.save();
      req.app.get("io").emit("vocab:changed", {
        type: "updated",
        item: existing
      });

      res.json(existing);
      return;
    }

    const item = await VocabItem.create({
      ...payload,
      addedAt: new Date()
    });
    req.app.get("io").emit("vocab:changed", {
      type: "created",
      item
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.put("/vocab/:id", async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body || {});
    const item = await VocabItem.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!item) {
      throw createError(404, "Vocab item not found");
    }

    req.app.get("io").emit("vocab:changed", {
      type: "updated",
      item
    });

    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/vocab/:id", async (req, res, next) => {
  try {
    const item = await VocabItem.findByIdAndDelete(req.params.id);
    if (!item) {
      throw createError(404, "Vocab item not found");
    }

    req.app.get("io").emit("vocab:changed", {
      type: "deleted",
      itemId: req.params.id
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/review/due", async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const items = await VocabItem.find({ "review.dueDate": { $lte: new Date() } })
      .sort({ "review.dueDate": 1 })
      .limit(limit)
      .lean();

    res.json({ items, total: items.length });
  } catch (error) {
    next(error);
  }
});

router.post("/review/:id", async (req, res, next) => {
  try {
    const item = await VocabItem.findById(req.params.id);
    if (!item) {
      throw createError(404, "Vocab item not found");
    }

    applyReview(item, req.body?.rating);
    await item.save();

    req.app.get("io").emit("vocab:changed", {
      type: "reviewed",
      item
    });

    res.json(item);
  } catch (error) {
    next(error);
  }
});

export default router;
