/**
 * Construct DATABASE_URL from individual Hostinger-style env vars.
 * Supports both formats:
 *   1. A single DATABASE_URL string (used as-is)
 *   2. Individual vars: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
 */

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.DB_HOST;
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD || "";
  const port = process.env.DB_PORT || "3306";

  if (!host || !name || !user) {
    throw new Error(
      "Database not configured. Set DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD in your environment variables."
    );
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

function ensureDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = buildDatabaseUrl();
  }
  return process.env.DATABASE_URL;
}

module.exports = { buildDatabaseUrl, ensureDatabaseUrl };
