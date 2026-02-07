import axios from "axios";
import { DictionaryCache } from "../models/DictionaryCache.js";
import { normalizeLookupTerm, normalizeTerm } from "../utils/normalize.js";
import { createError } from "../utils/httpError.js";

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function parseWordsApiPronunciation(pronunciation) {
  if (!pronunciation) {
    return "";
  }

  if (typeof pronunciation === "string") {
    return pronunciation;
  }

  if (typeof pronunciation === "object") {
    return (
      pronunciation.all ||
      pronunciation.noun ||
      pronunciation.verb ||
      pronunciation.adjective ||
      pronunciation.adverb ||
      ""
    );
  }

  return "";
}

function parseWordsApiPayload(payload = {}) {
  const results = Array.isArray(payload.results) ? payload.results : [];
  const meanings = results.map((result) => ({
    partOfSpeech: result?.partOfSpeech || "",
    definition: result?.definition || "",
    example: Array.isArray(result?.examples) ? result.examples[0] || "" : "",
    examples: uniqueStrings(result?.examples || []).slice(0, 5),
    synonyms: uniqueStrings(result?.synonyms || []).slice(0, 10)
  }));
  const examples = uniqueStrings(results.flatMap((result) => result?.examples || [])).slice(0, 5);
  const synonyms = uniqueStrings(results.flatMap((result) => result?.synonyms || [])).slice(0, 12);

  return {
    raw: payload,
    phonetic: parseWordsApiPronunciation(payload.pronunciation),
    audioUrl: "",
    meanings,
    examples,
    synonyms,
    shortDefinition: meanings[0]?.definition || "",
    example: examples[0] || ""
  };
}

function parsePayload(payload) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return parseWordsApiPayload(payload);
  }

  return {
    raw: payload,
    phonetic: "",
    audioUrl: "",
    meanings: [],
    examples: [],
    synonyms: [],
    shortDefinition: "",
    example: ""
  };
}

function collectWordsApiCandidates(term) {
  const normalized = normalizeTerm(term);
  const candidates = [];
  const push = (value) => {
    const next = normalizeTerm(value);
    if (!next || next === normalized || next.length < 3) {
      return;
    }
    candidates.push(next);
  };

  if (normalized.endsWith("ied") && normalized.length > 4) {
    push(`${normalized.slice(0, -3)}y`);
  }
  if (normalized.endsWith("ies") && normalized.length > 4) {
    push(`${normalized.slice(0, -3)}y`);
  }
  if (normalized.endsWith("ing") && normalized.length > 5) {
    const base = normalized.slice(0, -3);
    push(base);
    push(`${base}e`);
    if (base.length > 2 && base.at(-1) === base.at(-2)) {
      push(base.slice(0, -1));
    }
  }
  if (normalized.endsWith("ed") && normalized.length > 4) {
    const base = normalized.slice(0, -2);
    push(base);
    push(`${base}e`);
    if (base.endsWith("i")) {
      push(`${base.slice(0, -1)}y`);
    }
    if (base.length > 2 && base.at(-1) === base.at(-2)) {
      push(base.slice(0, -1));
    }
  }
  if (normalized.endsWith("es") && normalized.length > 4) {
    push(normalized.slice(0, -2));
  }
  if (normalized.endsWith("s") && normalized.length > 3) {
    push(normalized.slice(0, -1));
  }
  if (normalized.endsWith("er") && normalized.length > 4) {
    const base = normalized.slice(0, -2);
    push(base);
    push(`${base}e`);
  }
  if (normalized.endsWith("est") && normalized.length > 5) {
    const base = normalized.slice(0, -3);
    push(base);
    push(`${base}e`);
  }

  return uniqueStrings(candidates);
}

function cacheExpired(cacheDoc) {
  if (!cacheDoc?.expiresAt) {
    return false;
  }
  return new Date(cacheDoc.expiresAt).getTime() < Date.now();
}

export function createDictionaryService({
  rapidApiHost,
  rapidApiKey,
  wordsApiBaseUrl,
  cacheTtlDays,
  lookupTimeoutMs,
  missCacheTtlMinutes
}) {
  const wordsApiHeaders = {
    "x-rapidapi-host": rapidApiHost,
    "x-rapidapi-key": rapidApiKey
  };

  async function fetchWordsApiWord(word) {
    const response = await axios.get(`${wordsApiBaseUrl}/words/${encodeURIComponent(word)}`, {
      timeout: lookupTimeoutMs,
      headers: wordsApiHeaders
    });
    return response.data;
  }

  return {
    async lookupTerm(term) {
      if (!rapidApiKey) {
        throw createError(500, "RAPIDAPI_KEY is required");
      }

      const normalized = normalizeLookupTerm(term);
      if (!normalized) {
        throw createError(400, "term is required");
      }

      const positiveTtlMs = cacheTtlDays * 24 * 60 * 60 * 1000;
      const missTtlMs = Math.max(60 * 1000, missCacheTtlMinutes * 60 * 1000);

      const cached = await DictionaryCache.findOne({ term: normalized }).lean();
      if (cached && !cacheExpired(cached)) {
        if (cached.notFound) {
          throw createError(404, "No dictionary entry found");
        }

        const parsed = parsePayload(cached.definition);
        if (parsed.shortDefinition || parsed.meanings?.length || parsed.example || parsed.synonyms?.length) {
          const matchedTerm = parsed?.raw?.word && parsed.raw.word !== normalized ? parsed.raw.word : "";
          return {
            cached: true,
            term: normalized,
            matchedTerm,
            ...parsed
          };
        }
      }

      let payload;
      let parsed;
      let matchedTerm = "";

      try {
        payload = await fetchWordsApiWord(normalized);
        parsed = parseWordsApiPayload(payload);

        const isSingleToken = !normalized.includes(" ");
        if (!parsed.meanings.length && isSingleToken) {
          for (const candidate of collectWordsApiCandidates(normalized)) {
            try {
              const candidatePayload = await fetchWordsApiWord(candidate);
              const candidateParsed = parseWordsApiPayload(candidatePayload);
              if (candidateParsed.meanings.length) {
                payload = candidatePayload;
                parsed = candidateParsed;
                matchedTerm = candidate;
                break;
              }
            } catch (candidateError) {
              const status = candidateError?.response?.status;
              if (status && status !== 404) {
                throw candidateError;
              }
            }
          }
        }
      } catch (error) {
        if (cached) {
          const parsed = parsePayload(cached.definition);
          const matchedTerm = parsed?.raw?.word && parsed.raw.word !== normalized ? parsed.raw.word : "";
          return {
            cached: true,
            stale: true,
            term: normalized,
            matchedTerm,
            ...parsed
          };
        }

        const status = error?.response?.status;
        if (status === 404) {
          const missExpiresAt = new Date(Date.now() + missTtlMs);
          await DictionaryCache.findOneAndUpdate(
            { term: normalized },
            {
              term: normalized,
              definition: { word: normalized, results: [] },
              phonetic: "",
              audioUrl: "",
              notFound: true,
              cachedAt: new Date(),
              expiresAt: missExpiresAt
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          throw createError(404, "No dictionary entry found");
        }
        throw createError(502, "Dictionary API unavailable");
      }

      if (!matchedTerm && parsed?.raw?.word && parsed.raw.word !== normalized) {
        matchedTerm = parsed.raw.word;
      }

      const expiresAt = new Date(Date.now() + positiveTtlMs);

      await DictionaryCache.findOneAndUpdate(
        { term: normalized },
        {
          term: normalized,
          definition: payload,
          phonetic: parsed.phonetic,
          audioUrl: parsed.audioUrl,
          notFound: false,
          cachedAt: new Date(),
          expiresAt
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {
        cached: false,
        term: normalized,
        matchedTerm,
        ...parsed
      };
    }
  };
}
