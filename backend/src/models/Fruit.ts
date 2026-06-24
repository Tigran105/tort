import { Schema, model, Document } from 'mongoose';
import { buildSearchText, slugify } from '../utils/searchText';

export interface IFruit extends Document {
  name: string;
  slug: string;
  searchText: string;
  sortOrder: number;
  isActive: boolean;
}

const fruitSchema = new Schema<IFruit>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    searchText: { type: String, required: true, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

fruitSchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name);
    this.searchText = buildSearchText(this.name);
  }
});

export const Fruit = model<IFruit>('Fruit', fruitSchema);
