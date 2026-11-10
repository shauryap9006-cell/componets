import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// Registry counters: how often each plate's code or prompt was copied.
export const plateStats = pgTable("plate_stats", {
  slug: varchar("slug", { length: 80 }).primaryKey(),
  codeCopies: integer("code_copies").notNull().default(0),
  promptCopies: integer("prompt_copies").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
