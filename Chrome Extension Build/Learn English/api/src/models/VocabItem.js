import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    dueDate: { type: Date, default: () => new Date() },
    intervalDays: { type: Number, default: 1 },
    ease: { type: Number, default: 2.5 },
    lastReviewedAt: { type: Date, default: null },
    reviewCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 }
  },
  { _id: false }
);

const vocabItemSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, trim: true, index: true },
    addedAt: { type: Date, default: () => new Date(), index: true },
    pronunciation: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    translation: { type: String, default: "" },
    meaning: { type: String, default: "" },
    examples: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    difficulty: { type: Number, min: 1, max: 5, default: null },
    masteryLevel: { type: Number, min: 0, max: 100, default: 0, index: true },
    sourceUrl: { type: String, default: "" },
    sourceTitle: { type: String, default: "" },
    context: { type: String, default: "" },
    review: { type: reviewSchema, default: () => ({}) }
  },
  { timestamps: true }
);

vocabItemSchema.index({ term: "text", meaning: "text", translation: "text", context: "text" });
vocabItemSchema.index({ tags: 1 });
vocabItemSchema.index({ createdAt: -1 });
vocabItemSchema.index({ addedAt: -1 });
vocabItemSchema.index({ "review.dueDate": 1 });

export const VocabItem = mongoose.model("VocabItem", vocabItemSchema);
