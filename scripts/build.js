/**
 * Hostinger-friendly build script.
 * Constructs DATABASE_URL from individual env vars, then runs the full
 * Prisma + Next.js build pipeline.
 */
const { execSync } = require("child_process");
const path = require("path");
const { ensureDatabaseUrl } = require("./db-url");

const url = ensureDatabaseUrl();

const binDir = path.join(__dirname, "..", "node_modules", ".bin");
const prisma = path.join(binDir, "prisma");
const next = path.join(binDir, "next");

const steps = [
  `"${prisma}" generate`,
  `"${prisma}" migrate deploy`,
  "node prisma/seed.js",
  `"${next}" build`,
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
