import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:password@localhost:5432/postgres";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
