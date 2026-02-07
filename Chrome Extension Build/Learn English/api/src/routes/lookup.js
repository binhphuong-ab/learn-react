import { Router } from "express";
import {
  DEFAULT_DICTIONARY_PROVIDER,
  normalizeDictionaryProvider
} from "../constants/dictionaryProviders.js";
import { Setting } from "../models/Setting.js";
import { createError } from "../utils/httpError.js";

const router = Router();

async function resolveLookupProvider(rawProvider) {
  const requested = String(rawProvider || "").trim();
  if (requested) {
    const provider = normalizeDictionaryProvider(requested);
    if (!provider) {
      throw createError(400, "provider must be one of: wordsapi, merriam");
    }
    return provider;
  }

  const settings = await Setting.findOne({ key: "default" }).lean();
  return normalizeDictionaryProvider(settings?.dictionaryProvider) || DEFAULT_DICTIONARY_PROVIDER;
}

router.get("/lookup", async (req, res, next) => {
  try {
    const term = String(req.query.term || "").trim();
    const provider = await resolveLookupProvider(req.query.provider);
    const dictionaryService = req.app.get("dictionaryService");
    const result = await dictionaryService.lookupTerm(term, { provider });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
