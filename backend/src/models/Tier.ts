import { Schema, model, Document } from 'mongoose';
import { buildSearchText, slugify } from '../utils/searchText';

export interface ITier extends Document {
  level: 1 | 2 | 3;
  name: string;
  slug: string;
  searchText: string;
  sortOrder: number;
  isActive: boolean;
}

const tierSchema = new Schema<ITier>(
  {
    level: { type: Number, required: true, enum: [1, 2, 3], unique: true },
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    searchText: { type: String, required: true, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

tierSchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name);
    this.searchText = buildSearchText(this.name, String(this.level));
  }
});

export const Tier = model<ITier>('Tier', tierSchema);
