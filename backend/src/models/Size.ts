import { Schema, model, Document } from 'mongoose';
import { buildSearchText, slugify } from '../utils/searchText';

export type SizeCode = 'S' | 'M' | 'L';

export interface ISize extends Document {
  code: SizeCode;
  name: string;
  guestRange: string;
  slug: string;
  searchText: string;
  sortOrder: number;
  isActive: boolean;
}

const sizeSchema = new Schema<ISize>(
  {
    code: { type: String, required: true, enum: ['S', 'M', 'L'], unique: true },
    name: { type: String, required: true, trim: true },
    guestRange: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    searchText: { type: String, required: true, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

sizeSchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(`${this.code}-${this.name}`);
    this.searchText = buildSearchText(this.code, this.name, this.guestRange);
  }
});

export const Size = model<ISize>('Size', sizeSchema);
