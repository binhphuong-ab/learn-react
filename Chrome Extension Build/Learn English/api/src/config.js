import dotenv from "dotenv";

dotenv.config();

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
  cacheTtlDays: toNumber(process.env.CACHE_TTL_DAYS, 90),
  lookupTimeoutMs: toNumber(process.env.LOOKUP_TIMEOUT_MS, 4500),
  missCacheTtlMinutes: toNumber(process.env.MISS_CACHE_TTL_MINUTES, 360)
};
