import axios from "axios";
import {
  DEFAULT_DICTIONARY_PROVIDER,
  DICTIONARY_PROVIDERS,
  normalizeDictionaryProvider
} from "../constants/dictionaryProviders.js";
import { DictionaryCache } from "../models/DictionaryCache.js";
import { normalizeLookupTerm, normalizeTerm, uniqueStrings } from "../utils/normalize.js";
import { createError } from "../utils/httpError.js";

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

function cleanMerriamText(value) {
  return String(value || "")
    .replace(/\{bc\}/g, ": ")
    .replace(/\{\/?(it|wi|phrase|parahw|dx|qword)\}/g, "")
    .replace(/\{[^{}|]+\|([^{}|]*)\|?([^{}|]*)\|?([^{}|]*)\}/g, (_match, first, second, third) => {
      return [first, second, third].find((part) => String(part || "").trim()) || "";
    })
    .replace(/\{[^{}]+\}/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function collectMerriamDt(dt = [], definitions, examples) {
  for (const row of dt) {
    if (!Array.isArray(row) || row.length < 2) {
      continue;
    }

    const [type, value] = row;

    if (type === "text") {
      const text = cleanMerriamText(value);
      if (text) {
        definitions.push(text);
      }
      continue;
    }

    if (type === "vis" && Array.isArray(value)) {
      for (const item of value) {
        const text = cleanMerriamText(item?.t || "");
        if (text) {
          examples.push(text);
        }
      }
    }
  }
}

function collectMerriamSense(node, definitions, examples) {
  if (!Array.isArray(node)) {
    return;
  }

  if (node[0] === "sense" && node[1] && typeof node[1] === "object") {
    const sense = node[1];
    collectMerriamDt(sense.dt || [], definitions, examples);
    if (sense.sdsense?.dt) {
      collectMerriamDt(sense.sdsense.dt, definitions, examples);
    }
  }

  for (const child of node) {
    collectMerriamSense(child, definitions, examples);
  }
}

function extractMerriamEntryData(entry) {
  const definitions = uniqueStrings((entry.shortdef || []).map((text) => cleanMerriamText(text))).slice(0, 8);
  const examples = [];

  for (const block of entry.def || []) {
    collectMerriamSense(block.sseq || [], definitions, examples);
  }

  if (Array.isArray(entry.suppl?.examples)) {
    for (const item of entry.suppl.examples) {
      const text = cleanMerriamText(item?.t || "");
      if (text) {
        examples.push(text);
      }
    }
  }

  const uniqueDefinitions = uniqueStrings(definitions).slice(0, 8);
  const uniqueExamples = uniqueStrings(examples).slice(0, 5);

  return {
    partOfSpeech: entry.fl || "",
    definition: uniqueDefinitions[0] || "",
    definitions: uniqueDefinitions,
    example: uniqueExamples[0] || "",
    examples: uniqueExamples
  };
}

function getMerriamAudioSubdirectory(audioCode) {
  const key = String(audioCode || "").trim().toLowerCase();
  if (!key) {
    return "";
  }
  if (key.startsWith("bix")) {
    return "bix";
  }
  if (key.startsWith("gg")) {
    return "gg";
  }

  const firstChar = key[0];
  if (/^[0-9]$/.test(firstChar)) {
    return "number";
  }
  if (/^[a-z]$/.test(firstChar)) {
    return firstChar;
  }

  return "symbols";
}

function getMerriamAudioUrl(entry, merriamAudioBaseUrl) {
  const pronunciations = Array.isArray(entry?.hwi?.prs) ? entry.hwi.prs : [];
  const withAudio = pronunciations.find((item) => item?.sound?.audio);
  const audioCode = String(withAudio?.sound?.audio || "").trim();
  if (!audioCode) {
    return "";
  }

  const subdirectory = getMerriamAudioSubdirectory(audioCode);
  if (!subdirectory) {
    return "";
  }

  const base = String(merriamAudioBaseUrl || "").replace(/\/+$/, "");
  return `${base}/${subdirectory}/${audioCode}.mp3`;
}

function parseMerriamPayload(payload = [], merriamAudioBaseUrl) {
  if (!Array.isArray(payload)) {
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

  const entries = payload.filter((item) => item && typeof item === "object" && !Array.isArray(item));

  if (!entries.length) {
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

  const meanings = [];
  const definitions = [];
  const examples = [];

  for (const entry of entries.slice(0, 5)) {
    const data = extractMerriamEntryData(entry);

    if (data.definition || data.example) {
      meanings.push({
        partOfSpeech: data.partOfSpeech,
        definition: data.definition,
        example: data.example,
        examples: data.examples,
        synonyms: []
      });
    }

    definitions.push(...data.definitions);
    examples.push(...data.examples);
  }

  const primaryEntry = entries[0] || {};
  const phonetic = String(primaryEntry?.hwi?.prs?.[0]?.mw || "").replace(/\*/g, "\u00b7");

  const uniqueDefinitions = uniqueStrings(definitions).slice(0, 8);
  const uniqueExamples = uniqueStrings(examples).slice(0, 5);

  return {
    raw: payload,
    phonetic,
    audioUrl: getMerriamAudioUrl(primaryEntry, merriamAudioBaseUrl),
    meanings,
    examples: uniqueExamples,
    synonyms: [],
    shortDefinition: uniqueDefinitions[0] || "",
    example: uniqueExamples[0] || ""
  };
}

function parsePayload(provider, payload, { merriamAudioBaseUrl }) {
  if (provider === DICTIONARY_PROVIDERS.MERRIAM) {
    return parseMerriamPayload(payload, merriamAudioBaseUrl);
  }

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

function hasLookupData(parsed) {
  return Boolean(
    parsed?.shortDefinition ||
      parsed?.example ||
      parsed?.meanings?.length ||
      parsed?.examples?.length ||
      parsed?.synonyms?.length
  );
}

function collectLookupCandidates(term) {
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

function getCacheKey(provider, normalizedTerm) {
  return `${provider}:${normalizedTerm}`;
}

function getMatchedTerm(provider, normalizedTerm, payload) {
  if (provider === DICTIONARY_PROVIDERS.WORDSAPI) {
    const word = String(payload?.word || "").trim().toLowerCase();
    return word && word !== normalizedTerm ? word : "";
  }

  if (provider === DICTIONARY_PROVIDERS.MERRIAM && Array.isArray(payload)) {
    for (const entry of payload) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        continue;
      }
      const id = String(entry?.meta?.id || "").trim().toLowerCase();
      if (!id) {
        continue;
      }
      const base = id.split(":")[0].trim();
      if (base && base !== normalizedTerm) {
        return base;
      }
    }
  }

  return "";
}

async function writeNotFoundCache({ provider, normalizedTerm, expiresAt }) {
  await DictionaryCache.findOneAndUpdate(
    { term: getCacheKey(provider, normalizedTerm) },
    {
      term: getCacheKey(provider, normalizedTerm),
      provider,
      definition: provider === DICTIONARY_PROVIDERS.MERRIAM ? [] : { word: normalizedTerm, results: [] },
      phonetic: "",
      audioUrl: "",
      notFound: true,
      cachedAt: new Date(),
      expiresAt
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export function createDictionaryService({
  rapidApiHost,
  rapidApiKey,
  wordsApiBaseUrl,
  merriamDictionaryApiKey,
  merriamDictionaryBaseUrl,
  merriamAudioBaseUrl,
  cacheTtlDays,
  lookupTimeoutMs,
  missCacheTtlMinutes
}) {
  const wordsApiHeaders = {
    "x-rapidapi-host": rapidApiHost,
    "x-rapidapi-key": rapidApiKey
  };

  async function fetchWord(provider, word) {
    if (provider === DICTIONARY_PROVIDERS.MERRIAM) {
      const response = await axios.get(`${merriamDictionaryBaseUrl}/${encodeURIComponent(word)}`, {
        timeout: lookupTimeoutMs,
        params: { key: merriamDictionaryApiKey }
      });
      return response.data;
    }

    const response = await axios.get(`${wordsApiBaseUrl}/words/${encodeURIComponent(word)}`, {
      timeout: lookupTimeoutMs,
      headers: wordsApiHeaders
    });
    return response.data;
  }

  return {
    async lookupTerm(term, options = {}) {
      const explicitProvider = String(options.provider || "").trim();
      const normalizedProvider = normalizeDictionaryProvider(explicitProvider);
      if (explicitProvider && !normalizedProvider) {
        throw createError(400, "Unsupported dictionary provider");
      }

      const provider = normalizedProvider || DEFAULT_DICTIONARY_PROVIDER;

      if (provider === DICTIONARY_PROVIDERS.WORDSAPI && !rapidApiKey) {
        throw createError(500, "RAPIDAPI_KEY is required");
      }

      if (provider === DICTIONARY_PROVIDERS.MERRIAM && !merriamDictionaryApiKey) {
        throw createError(500, "MERRIAM_DICTIONARY_KEY is required");
      }

      const normalized = normalizeLookupTerm(term);
      if (!normalized) {
        throw createError(400, "term is required");
      }

      const positiveTtlMs = cacheTtlDays * 24 * 60 * 60 * 1000;
      const missTtlMs = Math.max(60 * 1000, missCacheTtlMinutes * 60 * 1000);

      const cacheKey = getCacheKey(provider, normalized);
      const cached = await DictionaryCache.findOne({ term: cacheKey }).lean();
      const cacheProvider = normalizeDictionaryProvider(cached?.provider) || provider;

      if (cached && !cacheExpired(cached)) {
        if (cached.notFound) {
          throw createError(404, "No dictionary entry found");
        }

        const parsed = parsePayload(cacheProvider, cached.definition, { merriamAudioBaseUrl });
        if (hasLookupData(parsed)) {
          return {
            cached: true,
            provider: cacheProvider,
            term: normalized,
            matchedTerm: getMatchedTerm(cacheProvider, normalized, parsed.raw),
            ...parsed
          };
        }
      }

      let payload;
      let parsed;
      let matchedTerm = "";

      try {
        payload = await fetchWord(provider, normalized);
        parsed = parsePayload(provider, payload, { merriamAudioBaseUrl });

        const isSingleToken = !normalized.includes(" ");
        if (!hasLookupData(parsed) && isSingleToken) {
          for (const candidate of collectLookupCandidates(normalized)) {
            try {
              const candidatePayload = await fetchWord(provider, candidate);
              const candidateParsed = parsePayload(provider, candidatePayload, { merriamAudioBaseUrl });
              if (hasLookupData(candidateParsed)) {
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
          const staleParsed = parsePayload(cacheProvider, cached.definition, { merriamAudioBaseUrl });
          return {
            cached: true,
            stale: true,
            provider: cacheProvider,
            term: normalized,
            matchedTerm: getMatchedTerm(cacheProvider, normalized, staleParsed.raw),
            ...staleParsed
          };
        }

        const status = error?.response?.status;
        if (status === 404) {
          const missExpiresAt = new Date(Date.now() + missTtlMs);
          await writeNotFoundCache({
            provider,
            normalizedTerm: normalized,
            expiresAt: missExpiresAt
          });
          throw createError(404, "No dictionary entry found");
        }
        throw createError(502, "Dictionary API unavailable");
      }

      if (!hasLookupData(parsed)) {
        const missExpiresAt = new Date(Date.now() + missTtlMs);
        await writeNotFoundCache({
          provider,
          normalizedTerm: normalized,
          expiresAt: missExpiresAt
        });
        throw createError(404, "No dictionary entry found");
      }

      if (!matchedTerm) {
        matchedTerm = getMatchedTerm(provider, normalized, parsed.raw);
      }

      const expiresAt = new Date(Date.now() + positiveTtlMs);

      await DictionaryCache.findOneAndUpdate(
        { term: cacheKey },
        {
          term: cacheKey,
          provider,
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
        provider,
        term: normalized,
        matchedTerm,
        ...parsed
      };
    }
  };
}
