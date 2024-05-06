-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "crousId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Crous" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crous_pkey" PRIMARY KEY ("id")
);
-- Add Crous
INSERT INTO "Crous" ("name", "url", "updated_at") VALUES ('Crous de Lyon', 'https://www.crous-lyon.fr/se-restaurer/ou-manger/', '2024-05-01T18:09:45.000Z');

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_crousId_fkey" FOREIGN KEY ("crousId") REFERENCES "Crous"("id") ON DELETE RESTRICT ON UPDATE CASCADE;