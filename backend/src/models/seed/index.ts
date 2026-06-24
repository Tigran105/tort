import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  Category,
  Fruit,
  Nut,
  Filling,
  Size,
  Tier,
} from '../index';
import {
  seedCategories,
  seedFillings,
  seedFruits,
  seedNuts,
  seedSizes,
  seedTiers,
} from './data';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/tort-bakery';

async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const item of seedCategories) {
      await Category.findOneAndUpdate({ name: item.name }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedCategories.length} categories`);

    for (const item of seedFruits) {
      await Fruit.findOneAndUpdate({ name: item.name }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedFruits.length} fruits`);

    for (const item of seedNuts) {
      await Nut.findOneAndUpdate({ name: item.name }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedNuts.length} nuts`);

    for (const item of seedFillings) {
      await Filling.findOneAndUpdate({ name: item.name }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedFillings.length} fillings`);

    for (const item of seedSizes) {
      await Size.findOneAndUpdate({ code: item.code }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedSizes.length} sizes`);

    for (const item of seedTiers) {
      await Tier.findOneAndUpdate({ level: item.level }, item, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });
    }
    console.log(`Seeded ${seedTiers.length} tiers`);

    console.log('Database seed completed successfully');
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
