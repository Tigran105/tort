import { Schema, model, Document, Types } from 'mongoose';
import { buildSearchText, slugify } from '../utils/searchText';

export interface ICake extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: Types.ObjectId;
  searchText: string;
  isFeatured: boolean;
  isActive: boolean;
}

const cakeSchema = new Schema<ICake>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, trim: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    searchText: { type: String, required: true, index: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

cakeSchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name);
    this.searchText = buildSearchText(this.name, this.description);
  }
});

export const Cake = model<ICake>('Cake', cakeSchema);
