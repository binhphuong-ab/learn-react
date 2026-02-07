import mongoose from "mongoose";
import {
  DEFAULT_DICTIONARY_PROVIDER,
  DICTIONARY_PROVIDERS
} from "../constants/dictionaryProviders.js";

const dictionaryCacheSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, unique: true, lowercase: true, trim: true },
    provider: {
      type: String,
      enum: Object.values(DICTIONARY_PROVIDERS),
      default: DEFAULT_DICTIONARY_PROVIDER
    },
    definition: { type: mongoose.Schema.Types.Mixed, required: true },
    phonetic: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    notFound: { type: Boolean, default: false },
    cachedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export const DictionaryCache = mongoose.model("DictionaryCache", dictionaryCacheSchema);
