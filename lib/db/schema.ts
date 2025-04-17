import { pgTable, text, timestamp, uuid, boolean, jsonb, integer, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name'),
  bio: text('bio'),
  profilePhotoUrl: text('profile_photo_url'),
  planId: integer('plan_id').references(() => plans.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const plans = pgTable('plans', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  apiLimit: integer('api_limit').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  features: jsonb('features'),
});

export const apis = pgTable('apis', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['simple', 'relation'] }).notNull(),
  structure: jsonb('structure').notNull(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const apiDataSets = pgTable('api_data_sets', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id').references(() => apis.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
}); 