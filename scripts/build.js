/**
 * Hostinger-friendly build script.
 * Constructs DATABASE_URL from individual env vars, then runs the full
 * Prisma + Next.js build pipeline.
 */
const { execSync } = require("child_process");
const { ensureDatabaseUrl } = require("./db-url");

const url = ensureDatabaseUrl();

const steps = [
  "npx prisma generate",
  "npx prisma migrate deploy",
  "node prisma/seed.js",
  "npx next build",
];

for (const step of steps) {
  console.log(`\n> ${step}\n`);
  try {
    execSync(step, {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: url },
    });
  } catch {
    process.exit(1);
  }
}
