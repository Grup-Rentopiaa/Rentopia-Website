-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_b64" TEXT,
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total_sewa" INTEGER NOT NULL DEFAULT 0;
