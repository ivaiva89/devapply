import fs from "node:fs";
import path from "node:path";

import { Polar } from "@polar-sh/sdk";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const CANDIDATE_BILLING_FIELDS = [
  "billingProvider",
  "billingCustomerId",
  "billingSubscriptionId",
  "billingProductId",
  "billingSubscriptionStatus",
  "billingCurrentPeriodEnd",
  "billingSyncedAt",
] as const;

let prisma: PrismaClient | null = null;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for the Prisma Neon adapter.");
  }

  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

type CandidateUser = {
  id: string;
  email: string;
  plan: "FREE" | "PRO";
  billingProvider: "POLAR" | null;
  billingCustomerId: string | null;
  billingSubscriptionId: string | null;
  billingProductId: string | null;
  billingSubscriptionStatus: string | null;
  billingCurrentPeriodEnd: Date | null;
  billingSyncedAt: Date | null;
};

type ScriptArgs = {
  allProMissing: boolean;
  confirmAllProMissing: boolean;
  help: boolean;
  userId: string | null;
  write: boolean;
};

function loadEnv() {
  const cwd = process.cwd();
  const envFiles = [".env.local", ".env"];

  for (const file of envFiles) {
    const fullPath = path.join(cwd, file);

    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  }
}

function parseArgs(argv: string[]): ScriptArgs {
  const args: ScriptArgs = {
    allProMissing: false,
    confirmAllProMissing: false,
    help: false,
    userId: null,
    write: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    switch (value) {
      case "--help":
      case "-h":
        args.help = true;
        break;
      case "--user-id":
        args.userId = argv[index + 1] ?? null;
        index += 1;
        break;
      case "--all-pro-missing":
        args.allProMissing = true;
        break;
      case "--write":
        args.write = true;
        break;
      case "--confirm-all-pro-missing":
        args.confirmAllProMissing = true;
        break;
      default:
        throw new Error(`Unknown argument: ${value}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Backfill missing Polar linkage for existing PRO users.

Usage:
  npm run billing:backfill-polar-linkage -- --user-id <userId>
  npm run billing:backfill-polar-linkage -- --user-id <userId> --write
  npm run billing:backfill-polar-linkage -- --all-pro-missing
  npm run billing:backfill-polar-linkage -- --all-pro-missing --write --confirm-all-pro-missing

Notes:
  - Dry run is the default.
  - Bulk writes require both --write and --confirm-all-pro-missing.
  - The script keeps User.plan unchanged and only backfills stored Polar linkage fields.
  `);
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function getPolarEnvironment() {
  return process.env.POLAR_ENVIRONMENT?.trim().toLowerCase() === "production"
    ? "production"
    : "sandbox";
}

function getMissingFields(user: CandidateUser) {
  return CANDIDATE_BILLING_FIELDS.filter((field) => user[field] == null);
}

function formatValue(value: Date | string | null) {
  if (value == null) {
    return "null";
  }

  return value instanceof Date ? value.toISOString() : value;
}

function getNextBillingValues(
  customerState: Awaited<ReturnType<Polar["customers"]["getStateExternal"]>>,
  productIdPro: string | null,
) {
  const matchingSubscription =
    (productIdPro
      ? customerState.activeSubscriptions.find(
          (subscription) => subscription.productId === productIdPro,
        )
      : null) ??
    customerState.activeSubscriptions[0] ??
    null;

  const values = {
    billingProvider: "POLAR" as const,
    billingCustomerId: customerState.id,
    billingSyncedAt: new Date(),
  };

  if (!matchingSubscription) {
    return values;
  }

  return {
    ...values,
    billingSubscriptionId: matchingSubscription.id,
    billingProductId: matchingSubscription.productId,
    billingSubscriptionStatus: matchingSubscription.status,
    billingCurrentPeriodEnd: matchingSubscription.currentPeriodEnd,
  };
}

function getChangedFields(
  user: CandidateUser,
  nextValues: ReturnType<typeof getNextBillingValues>,
) {
  return Object.entries(nextValues).filter(([key, value]) => {
    const currentValue = user[key as keyof CandidateUser];

    if (currentValue instanceof Date && value instanceof Date) {
      return currentValue.getTime() !== value.getTime();
    }

    return currentValue !== value;
  });
}

async function getCandidateUsers(
  prisma: PrismaClient,
  args: ScriptArgs,
): Promise<CandidateUser[]> {
  if (args.userId) {
    const user = await prisma.user.findUnique({
      where: { id: args.userId },
      select: {
        id: true,
        email: true,
        plan: true,
        billingProvider: true,
        billingCustomerId: true,
        billingSubscriptionId: true,
        billingProductId: true,
        billingSubscriptionStatus: true,
        billingCurrentPeriodEnd: true,
        billingSyncedAt: true,
      },
    });

    return user ? [user] : [];
  }

  return prisma.user.findMany({
    where: {
      plan: "PRO",
      OR: CANDIDATE_BILLING_FIELDS.map((field) => ({ [field]: null })),
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      email: true,
      plan: true,
      billingProvider: true,
      billingCustomerId: true,
      billingSubscriptionId: true,
      billingProductId: true,
      billingSubscriptionStatus: true,
      billingCurrentPeriodEnd: true,
      billingSyncedAt: true,
    },
  });
}

async function main() {
  loadEnv();

  prisma = createPrismaClient();

  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (
    (args.userId && args.allProMissing) ||
    (!args.userId && !args.allProMissing)
  ) {
    throw new Error(
      "Choose exactly one target mode: --user-id <id> or --all-pro-missing.",
    );
  }

  if (args.allProMissing && args.write && !args.confirmAllProMissing) {
    throw new Error(
      "Bulk write mode requires --confirm-all-pro-missing to avoid accidental updates.",
    );
  }

  const accessToken = getOptionalEnv("POLAR_ACCESS_TOKEN");
  const productIdPro = getOptionalEnv("POLAR_PRODUCT_ID_PRO");

  if (!accessToken) {
    throw new Error(
      "POLAR_ACCESS_TOKEN is required to query Polar customer state for backfill.",
    );
  }

  const polar = new Polar({
    accessToken,
    server: getPolarEnvironment(),
  });

  const candidates = await getCandidateUsers(prisma, args);

  if (candidates.length === 0) {
    console.log("No matching users found for Polar linkage backfill.");
    return;
  }

  console.log(
    `${args.write ? "Applying" : "Previewing"} Polar linkage backfill for ${candidates.length} user(s).`,
  );

  if (!productIdPro) {
    console.warn(
      "POLAR_PRODUCT_ID_PRO is not set. The script will use the first active Polar subscription when multiple-product disambiguation is unavailable.",
    );
  }

  let updatedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;

  for (const user of candidates) {
    const missingFields = getMissingFields(user);

    try {
      const customerState = await polar.customers.getStateExternal({
        externalId: user.id,
      });

      const nextValues = getNextBillingValues(customerState, productIdPro);
      const changedFields = getChangedFields(user, nextValues);

      if (changedFields.length === 0) {
        unchangedCount += 1;
        console.log(`UNCHANGED ${user.id} (${user.email})`);
        continue;
      }

      console.log(`\nUSER ${user.id} (${user.email})`);
      console.log(`Missing fields: ${missingFields.join(", ")}`);

      for (const [field, value] of changedFields) {
        const currentValue = user[field as keyof CandidateUser] as
          | Date
          | string
          | null;

        console.log(
          `  ${field}: ${formatValue(currentValue)} -> ${formatValue(value as Date | string | null)}`,
        );
      }

      if (args.write) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: nextValues,
        });
      }

      updatedCount += 1;
    } catch (error) {
      skippedCount += 1;

      const message =
        error instanceof Error ? error.message : "Unknown Polar backfill error";

      console.warn(`\nSKIPPED ${user.id} (${user.email})`);
      console.warn(`  reason: ${message}`);
    }
  }

  console.log("\nSummary");
  console.log(`  mode: ${args.write ? "write" : "dry-run"}`);
  console.log(`  updated: ${updatedCount}`);
  console.log(`  unchanged: ${unchangedCount}`);
  console.log(`  skipped: ${skippedCount}`);

  if (!args.write) {
    console.log(
      "\nDry run only. Re-run with --write to persist these changes.",
    );
  }
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Polar linkage backfill failed.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
