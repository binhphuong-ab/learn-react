import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    dailyReviewLimit: { type: Number, default: 20 },
    defaultIntervals: { type: [Number], default: [1, 3, 7, 14, 30] },
    dictionaryApiUrl: { type: String, default: "https://api.dictionaryapi.dev/api/v2/entries/en" },
    enableAudio: { type: Boolean, default: true },
    keyboardShortcuts: {
      quickSave: { type: String, default: "Ctrl+Shift+S" }
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
