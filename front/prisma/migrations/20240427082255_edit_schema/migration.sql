/*
  Warnings:

  - Added the required column `img` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GlobalStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "totalRestaurants" INTEGER NOT NULL,
    "totalMeals" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cp" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Restaurant" ("address", "city", "cp", "id", "name", "phone", "updated_at", "url") SELECT "address", "city", "cp", "id", "name", "phone", "updated_at", "url" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
