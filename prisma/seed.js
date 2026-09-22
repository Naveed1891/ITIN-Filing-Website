require("../scripts/db-url").ensureDatabaseUrl();
const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");
// Single source of truth shared with the app runtime (see src/server/packages.ts).
const packages = require("../src/server/package-catalog.json");

const prisma = new PrismaClient();

// Mirror src/server/auth.ts hashPassword so seeded admins can log in via the app.
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

/**
 * Create a staff/admin account if it does not exist. Non-destructive: the
 * password is only set on create, so re-running the seed (every deploy) never
 * resets a password chosen in the app or overwrites an existing login.
 */
async function upsertStaff({ email, password, fullName, role }) {
  if (!email || !password) return null;
  if (password.length < 12) {
    console.warn(`[seed] ${role} password should be at least 12 characters.`);
  }
  const normalized = normalizeEmail(email);
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    await prisma.user.update({
      where: { email: normalized },
      data: { role, status: "ACTIVE", deletedAt: null, lockedUntil: null },
    });
    return existing.id;
  }
  const created = await prisma.user.create({
    data: {
      fullName: fullName || "ITINFiling Administrator",
      email: normalized,
      whatsapp: "+10000000000",
      country: "United States",
      passwordHash: hashPassword(password),
      role,
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
      termsAt: new Date(),
    },
  });
  console.log(`[seed] created ${role}: ${normalized}`);
  return created.id;
}

async function main() {
  // Packages.
  for (const pkg of packages) {
    await prisma.formPackage.upsert({
      where: { slug: pkg.slug },
      create: {
        slug: pkg.slug,
        name: pkg.name,
        description: pkg.description,
        priceCents: pkg.priceCents,
        currency: pkg.currency,
        featuresJson: JSON.stringify(pkg.features),
        isActive: true,
      },
      update: {
        name: pkg.name,
        description: pkg.description,
        priceCents: pkg.priceCents,
        currency: pkg.currency,
        featuresJson: JSON.stringify(pkg.features),
        isActive: true,
      },
    });
  }

  // Super-admin (full control incl. runtime credentials) and admin accounts.
  await upsertStaff({
    email: process.env.SEED_SUPERADMIN_EMAIL,
    password: process.env.SEED_SUPERADMIN_PASSWORD,
    fullName: "ITINFiling Super Admin",
    role: "SUPER_ADMIN",
  });
  await upsertStaff({
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    fullName: "ITINFiling Administrator",
    role: "ADMIN",
  });
}

main()
  .catch((error) => {
    console.error("Prisma seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
