import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(currentDir, "../.env") });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: toNumber(process.env.PORT, 8083),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/learn_english",
  dashboardOrigin: process.env.DASHBOARD_ORIGIN || "http://localhost:8082",
  rapidApiHost: process.env.RAPIDAPI_HOST || "wordsapiv1.p.rapidapi.com",
  rapidApiKey: process.env.RAPIDAPI_KEY || "",
  wordsApiBaseUrl: process.env.WORDS_API_BASE_URL || "https://wordsapiv1.p.rapidapi.com",
  merriamDictionaryApiKey: process.env.MERRIAM_DICTIONARY_KEY || "",
  merriamThesaurusApiKey: process.env.MERRIAM_THESAURUS_KEY || "",
  merriamDictionaryBaseUrl:
    process.env.MERRIAM_DICTIONARY_BASE_URL ||
    "https://www.dictionaryapi.com/api/v3/references/collegiate/json",
  merriamAudioBaseUrl:
    process.env.MERRIAM_AUDIO_BASE_URL || "https://media.merriam-webster.com/audio/prons/en/us/mp3",
  cacheTtlDays: toNumber(process.env.CACHE_TTL_DAYS, 90),
  lookupTimeoutMs: toNumber(process.env.LOOKUP_TIMEOUT_MS, 4500),
  missCacheTtlMinutes: toNumber(process.env.MISS_CACHE_TTL_MINUTES, 360)
};
