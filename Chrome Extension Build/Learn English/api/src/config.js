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
  dictionaryApiUrl: process.env.DICTIONARY_API_URL || "https://api.dictionaryapi.dev/api/v2/entries/en",
  cacheTtlDays: toNumber(process.env.CACHE_TTL_DAYS, 90)
};
