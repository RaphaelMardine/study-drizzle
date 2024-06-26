import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema",
  out: "./db/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db/demo.db",
  },
};
