/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable: Invoice adjustments
ALTER TABLE "Invoice"
  ADD COLUMN "memo" TEXT,
  ALTER COLUMN "borrowerEmail" DROP NOT NULL;

-- 1) Add updatedAt as NULLABLE
ALTER TABLE "User"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NULL,
  ALTER COLUMN "name" DROP NOT NULL;

-- 2) Backfill existing rows with current timestamp
UPDATE "User"
SET "updatedAt" = now()
WHERE "updatedAt" IS NULL;

-- 3) Make updatedAt NOT NULL and default to now() for new rows
ALTER TABLE "User"
  ALTER COLUMN "updatedAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET DEFAULT now();

-- CreateTable: Contact model
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- Add foreign key to link Contact.userId -> User.id
ALTER TABLE "Contact"
  ADD CONSTRAINT "Contact_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
