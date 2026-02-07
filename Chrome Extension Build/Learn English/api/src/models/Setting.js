import mongoose from "mongoose";
import {
  DEFAULT_DICTIONARY_PROVIDER,
  DICTIONARY_PROVIDERS
} from "../constants/dictionaryProviders.js";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    dictionaryProvider: {
      type: String,
      enum: Object.values(DICTIONARY_PROVIDERS),
      default: DEFAULT_DICTIONARY_PROVIDER
    },
    dailyReviewLimit: { type: Number, default: 20 },
    defaultIntervals: { type: [Number], default: [1, 3, 7, 14, 30] },
    enableAudio: { type: Boolean, default: true },
    keyboardShortcuts: {
      quickSave: { type: String, default: "Ctrl+Shift+S" }
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
