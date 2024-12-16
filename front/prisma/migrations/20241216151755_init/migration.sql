-- CreateEnum
CREATE TYPE "ScrapingStatus" AS ENUM ('pending', 'success', 'error');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "last_scraping_at" TIMESTAMP(3),
ADD COLUMN     "last_scraping_error" TEXT,
ADD COLUMN     "last_scraping_status" "ScrapingStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "ScrapingLog" (
    "id" SERIAL NOT NULL,
    "crousId" INTEGER NOT NULL,
    "status" "ScrapingStatus" NOT NULL,
    "error" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrapingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScrapingLog" ADD CONSTRAINT "ScrapingLog_crousId_fkey" FOREIGN KEY ("crousId") REFERENCES "Crous"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
