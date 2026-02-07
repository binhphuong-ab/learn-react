export const normalizeTerm = (term) =>
  String(term || "")
    .trim()
    .toLowerCase();

export const normalizeLookupTerm = (term) =>
  normalizeTerm(term)
    .replace(/\s+/g, " ")
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");

export const uniqueStrings = (value) => {
  const list = Array.isArray(value) ? value : [];
  return [...new Set(list.map((item) => String(item || "").trim()).filter(Boolean))];
};
