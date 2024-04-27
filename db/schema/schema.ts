import { text, sqliteTable, integer,  } from "drizzle-orm/sqlite-core";

export const user = sqliteTable('user', {
    id: text('id'),
    name: text('name'),
    email: text('email'),
    createdAt: integer('created_at'),
    updatedAt: integer('updated_at'),
    session_id: text('session_id'),
})

export const meals = sqliteTable('meals', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    nameFood: text('name'),
    description: text('description'),
    createdAt: integer('created_at'),
    updatedAt: integer('updated_at'),
    insideInDiet: integer('inside_in_diet', { mode: 'boolean' }),
    session_id: text('session_id'),
})

export type User = typeof user.$inferSelect;
export type Meals = typeof meals.$inferSelect;