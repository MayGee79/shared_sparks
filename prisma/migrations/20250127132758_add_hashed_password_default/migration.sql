-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hashedPassword" DROP NOT NULL,
ALTER COLUMN "hashedPassword" SET DEFAULT '';
