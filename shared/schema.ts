import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  originalPrompt: text("original_prompt"),
  originalDraft: text("original_draft"),
  tone: text("tone"),
  content: text("content").notNull(),
  variations: jsonb("variations").$type<{ content: string, provider: string, imageUrl?: string }[]>(), // Array of 3 objects
  suggestions: text("suggestions"),
  type: text("type").notNull(), // 'generate' or 'refine'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type GenerateRequest = {
  topic: string;
  tone: string;
};

export type RefineRequest = {
  draft: string;
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'generate' or 'improve'
  inputText: text("input_text").notNull(),
  outputs: jsonb("outputs").$type<{ content?: string, text?: string, image?: string, imageUrl?: string }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHistorySchema = createInsertSchema(history).omit({ id: true, createdAt: true });
export type History = typeof history.$inferSelect;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
