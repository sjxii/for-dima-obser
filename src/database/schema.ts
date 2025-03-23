import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').notNull(),
    hashedPassword: text('hashed_password').notNull(),
  },
  ({ username }) => [index().on(username)],
);

export const categories = pgTable('categories', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const prioritiesEnum = pgEnum('priorities', ['High', 'Low']);
export const statusEnum = pgEnum('status', ['TODO', 'In Progress', 'Done']);

export const tasks = pgTable('tasks', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  priority: prioritiesEnum().notNull().default('Low'),
  status: statusEnum().notNull().default('TODO'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
