-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "consent_marketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consent_necessary" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "consent_preferences" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consent_statistics" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Message" (
    "pesan_id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "isi_pesan" TEXT NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("pesan_id")
);

-- CreateTable
CREATE TABLE "Penawaran" (
    "penawaran_id" TEXT NOT NULL,
    "produk_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Penawaran_pkey" PRIMARY KEY ("penawaran_id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penawaran" ADD CONSTRAINT "Penawaran_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penawaran" ADD CONSTRAINT "Penawaran_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
