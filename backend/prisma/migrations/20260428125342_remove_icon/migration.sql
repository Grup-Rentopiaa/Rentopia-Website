/*
  Warnings:

  - You are about to drop the column `icon` on the `listings` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `listings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `price` on the `listings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `brand` on the `listings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `title` on the `rentals` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `price` on the `rentals` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `store` on the `rentals` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `note` on the `rentals` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "listings" DROP COLUMN "icon",
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "price" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "brand" SET DATA TYPE VARCHAR(64);

-- AlterTable
ALTER TABLE "rentals" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "price" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "store" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "note" SET DATA TYPE VARCHAR(128);

-- CreateIndex
CREATE INDEX "listings_user_id_idx" ON "listings"("user_id");

-- CreateIndex
CREATE INDEX "rentals_user_id_idx" ON "rentals"("user_id");
