import mongoose, { Schema, Document } from 'mongoose';
import type { Category } from '@repo/shared';

export interface CategoryDocument extends Omit<Category, '_id'>, Document {}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = mongoose.model<CategoryDocument>('Category', CategorySchema);
