export const DICTIONARY_PROVIDERS = Object.freeze({
  WORDSAPI: "wordsapi",
  MERRIAM: "merriam"
});

export const DEFAULT_DICTIONARY_PROVIDER = DICTIONARY_PROVIDERS.WORDSAPI;

export function normalizeDictionaryProvider(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === DICTIONARY_PROVIDERS.WORDSAPI || normalized === DICTIONARY_PROVIDERS.MERRIAM) {
    return normalized;
  }
  return "";
}
