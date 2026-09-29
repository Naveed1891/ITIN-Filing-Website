/**
 * Hostinger-friendly application build.
 *
 * Database migrations and seeding are intentionally separate deployment
 * operations. Running them here makes every application build depend on
 * production database connectivity and can prevent an otherwise valid
 * release from being published.
 */
const { execSync } = require("child_process");
const path = require("path");

const binDir = path.join(__dirname, "..", "node_modules", ".bin");
const prisma = path.join(binDir, "prisma");
const next = path.join(binDir, "next");

const steps = [
  `"${prisma}" generate`,
  `"${next}" build --webpack`,
];

for (const step of steps) {
  console.log(`\n> ${step}\n`);
  try {
    execSync(step, {
      stdio: "inherit",
      env: process.env,
    });
  } catch {
    process.exit(1);
  }
}
