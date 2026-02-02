import mongoose, { Schema, Document } from 'mongoose';
import type { Product } from '@repo/shared';

export interface ProductDocument extends Omit<Product, '_id'>, Document {}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    specs: { type: Map, of: String, default: {} },
    price: { type: Number },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', summary: 'text', description: 'text' });

export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);
