import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { timestamp, uuid } from "drizzle-orm/pg-core";

const DATABASE_URL = process.env.DATABASE_URL!;

export const db = drizzle(DATABASE_URL);

export const base = {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  created: timestamp("created", { mode: "string" }).notNull().defaultNow(),
  updated: timestamp("updated", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
};
