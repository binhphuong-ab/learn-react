import { Router } from "express";
import {
  DEFAULT_DICTIONARY_PROVIDER,
  normalizeDictionaryProvider
} from "../constants/dictionaryProviders.js";
import { Setting } from "../models/Setting.js";
import { createError } from "../utils/httpError.js";

const router = Router();

async function getOrCreateSettings() {
  let settings = await Setting.findOne({ key: "default" });
  if (!settings) {
    settings = await Setting.create({ key: "default" });
  }
  return settings;
}

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    if (!settings.dictionaryProvider) {
      settings.dictionaryProvider = DEFAULT_DICTIONARY_PROVIDER;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const payload = req.body || {};
    if ("dictionaryProvider" in payload) {
      const provider = normalizeDictionaryProvider(payload.dictionaryProvider);
      if (!provider) {
        throw createError(400, "dictionaryProvider must be one of: wordsapi, merriam");
      }
      payload.dictionaryProvider = provider;
    }

    const settings = await Setting.findOneAndUpdate(
      { key: "default" },
      { $set: { ...payload, key: "default" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!settings.dictionaryProvider) {
      settings.dictionaryProvider = DEFAULT_DICTIONARY_PROVIDER;
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;
