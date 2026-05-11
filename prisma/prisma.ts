import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma";
import { PrismaMysql } from "@prisma/adapter-mysql";
import mysql from "mysql2/promise";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = mysql.createPool(process.env.DATABASE_URL!);
const adapter = new PrismaMysql(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
