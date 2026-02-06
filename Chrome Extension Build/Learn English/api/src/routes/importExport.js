import { Router } from "express";
import { stringify } from "csv-stringify/sync";
import { VocabItem } from "../models/VocabItem.js";
import { createError } from "../utils/httpError.js";

const router = Router();

router.get("/export", async (req, res, next) => {
  try {
    const format = String(req.query.format || "json").toLowerCase();
    const items = await VocabItem.find({}).sort({ addedAt: -1, createdAt: -1 }).lean();

    if (format === "csv") {
      const records = items.map((item) => ({
        id: item._id.toString(),
        term: item.term,
        pronunciation: item.pronunciation,
        translation: item.translation,
        meaning: item.meaning,
        examples: (item.examples || []).join(" | "),
        tags: (item.tags || []).join(" | "),
        masteryLevel: item.masteryLevel,
        sourceUrl: item.sourceUrl,
        sourceTitle: item.sourceTitle,
        context: item.context,
        addedAt: item.addedAt || item.createdAt,
        createdAt: item.createdAt,
        dueDate: item.review?.dueDate,
        intervalDays: item.review?.intervalDays,
        reviewCount: item.review?.reviewCount,
        correctCount: item.review?.correctCount
      }));

      const csv = stringify(records, { header: true });
      res.header("Content-Type", "text/csv");
      res.attachment("learn-english-export.csv");
      return res.send(csv);
    }

    res.header("Content-Type", "application/json");
    res.attachment("learn-english-export.json");
    return res.send(JSON.stringify(items, null, 2));
  } catch (error) {
    next(error);
  }
});

router.post("/import", async (req, res, next) => {
  try {
    const items = req.body?.items;
    if (!Array.isArray(items) || !items.length) {
      throw createError(400, "items must be a non-empty array");
    }

    let imported = 0;
    for (const incoming of items) {
      const payload = {
        term: incoming.term,
        pronunciation: incoming.pronunciation || "",
        audioUrl: incoming.audioUrl || "",
        translation: incoming.translation || "",
        meaning: incoming.meaning || "",
        examples: incoming.examples || [],
        tags: incoming.tags || [],
        difficulty: incoming.difficulty || null,
        masteryLevel: incoming.masteryLevel || 0,
        sourceUrl: incoming.sourceUrl || "",
        sourceTitle: incoming.sourceTitle || "",
        context: incoming.context || "",
        addedAt: incoming.addedAt || incoming.createdAt || new Date(),
        review: incoming.review || {}
      };

      if (!payload.term) {
        continue;
      }

      await VocabItem.create(payload);
      imported += 1;
    }

    if (imported > 0) {
      req.app.get("io").emit("vocab:changed", {
        type: "imported",
        imported
      });
    }

    res.json({ ok: true, imported });
  } catch (error) {
    next(error);
  }
});

export default router;
