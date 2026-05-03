-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "path" TEXT,
    "browser" TEXT,
    "language" TEXT,
    "screen_width" INTEGER,
    "screen_height" INTEGER,
    "visited_at" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);
