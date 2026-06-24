import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { buildSearchText, slugify } from '../src/utils/searchText';
import {
  seedCategories,
  seedFillings,
  seedFruits,
  seedNuts,
  seedSizes,
  seedTiers,
} from '../src/models/seed/data';

async function seedDatabase(): Promise<void> {
  try {
    for (const item of seedCategories) {
      const data = {
        name: item.name,
        slug: slugify(item.name),
        searchText: buildSearchText(item.name),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.category.upsert({
        where: { name: item.name },
        create: data,
        update: {
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedCategories.length} categories`);

    for (const item of seedFruits) {
      const data = {
        name: item.name,
        slug: slugify(item.name),
        searchText: buildSearchText(item.name),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.fruit.upsert({
        where: { name: item.name },
        create: data,
        update: {
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedFruits.length} fruits`);

    for (const item of seedNuts) {
      const data = {
        name: item.name,
        slug: slugify(item.name),
        searchText: buildSearchText(item.name),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.nut.upsert({
        where: { name: item.name },
        create: data,
        update: {
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedNuts.length} nuts`);

    for (const item of seedFillings) {
      const data = {
        name: item.name,
        slug: slugify(item.name),
        searchText: buildSearchText(item.name),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.filling.upsert({
        where: { name: item.name },
        create: data,
        update: {
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedFillings.length} fillings`);

    for (const item of seedSizes) {
      const guestsCount = item.guestRange;
      const data = {
        code: item.code,
        name: item.name,
        guestsCount,
        slug: slugify(`${item.code}-${item.name}`),
        searchText: buildSearchText(item.code, item.name, guestsCount),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.size.upsert({
        where: { code: item.code },
        create: data,
        update: {
          name: data.name,
          guestsCount: data.guestsCount,
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedSizes.length} sizes`);

    for (const item of seedTiers) {
      const data = {
        count: item.level,
        name: item.name,
        slug: slugify(item.name),
        searchText: buildSearchText(item.name, String(item.level)),
        sortOrder: item.sortOrder,
        isActive: true,
      };

      await prisma.tier.upsert({
        where: { count: item.level },
        create: data,
        update: {
          name: data.name,
          slug: data.slug,
          searchText: data.searchText,
          sortOrder: data.sortOrder,
        },
      });
    }
    console.log(`Seeded ${seedTiers.length} tiers`);

    console.log('Database seed completed successfully');
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
