export const normalizeTerm = (term) =>
  String(term || "")
    .trim()
    .toLowerCase();

export const uniqueStrings = (value) => {
  const list = Array.isArray(value) ? value : [];
  return [...new Set(list.map((item) => String(item || "").trim()).filter(Boolean))];
};
