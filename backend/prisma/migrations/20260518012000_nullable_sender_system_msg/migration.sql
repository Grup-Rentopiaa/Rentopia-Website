-- AlterTable: make sender_id nullable to support system messages
ALTER TABLE "Message" ALTER COLUMN "sender_id" DROP NOT NULL;

-- AlterTable: add is_system flag to Message
ALTER TABLE "Message" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT false;
