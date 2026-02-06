import axios from "axios";
import { DictionaryCache } from "../models/DictionaryCache.js";
import { normalizeTerm } from "../utils/normalize.js";
import { createError } from "../utils/httpError.js";

function parseDictionaryPayload(payload = []) {
  const firstEntry = payload[0] || {};
  const phonetic = firstEntry.phonetic || firstEntry.phonetics?.find((item) => item?.text)?.text || "";
  const audioUrl = firstEntry.phonetics?.find((item) => item?.audio)?.audio || "";

  const meanings = (firstEntry.meanings || []).flatMap((meaning) =>
    (meaning.definitions || []).map((definition) => ({
      partOfSpeech: meaning.partOfSpeech || "",
      definition: definition.definition || "",
      example: definition.example || ""
    }))
  );

  return {
    raw: payload,
    phonetic,
    audioUrl,
    meanings,
    shortDefinition: meanings[0]?.definition || "",
    example: meanings.find((item) => item.example)?.example || ""
  };
}

function cacheExpired(cacheDoc) {
  if (!cacheDoc?.expiresAt) {
    return false;
  }
  return new Date(cacheDoc.expiresAt).getTime() < Date.now();
}

export function createDictionaryService({ dictionaryApiUrl, cacheTtlDays }) {
  return {
    async lookupTerm(term) {
      const normalized = normalizeTerm(term);
      if (!normalized) {
        throw createError(400, "term is required");
      }

      const cached = await DictionaryCache.findOne({ term: normalized }).lean();
      if (cached && !cacheExpired(cached)) {
        const parsed = parseDictionaryPayload(cached.definition);
        return {
          cached: true,
          term: normalized,
          ...parsed
        };
      }

      let response;
      try {
        response = await axios.get(`${dictionaryApiUrl}/${encodeURIComponent(normalized)}`, {
          timeout: 8000
        });
      } catch (error) {
        if (cached) {
          const parsed = parseDictionaryPayload(cached.definition);
          return {
            cached: true,
            stale: true,
            term: normalized,
            ...parsed
          };
        }

        const status = error?.response?.status;
        if (status === 404) {
          throw createError(404, "No dictionary entry found");
        }
        throw createError(502, "Dictionary API unavailable");
      }

      const parsed = parseDictionaryPayload(response.data);
      const ttlMs = cacheTtlDays * 24 * 60 * 60 * 1000;
      const expiresAt = new Date(Date.now() + ttlMs);

      await DictionaryCache.findOneAndUpdate(
        { term: normalized },
        {
          term: normalized,
          definition: response.data,
          phonetic: parsed.phonetic,
          audioUrl: parsed.audioUrl,
          cachedAt: new Date(),
          expiresAt
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {
        cached: false,
        term: normalized,
        ...parsed
      };
    }
  };
}
