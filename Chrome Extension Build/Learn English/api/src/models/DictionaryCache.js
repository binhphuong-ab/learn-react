import mongoose from "mongoose";

const dictionaryCacheSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, unique: true, lowercase: true, trim: true },
    definition: { type: mongoose.Schema.Types.Mixed, required: true },
    phonetic: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    cachedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export const DictionaryCache = mongoose.model("DictionaryCache", dictionaryCacheSchema);
