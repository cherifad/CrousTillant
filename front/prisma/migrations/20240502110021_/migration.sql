/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_url_key" ON "Restaurant"("url");
