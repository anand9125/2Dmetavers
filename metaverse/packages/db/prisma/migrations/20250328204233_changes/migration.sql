/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `mapElements` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `thumbnail` on table `Map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `Space` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `static` to the `spaceElements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mapElements" DROP CONSTRAINT "mapElements_elementId_fkey";

-- DropForeignKey
ALTER TABLE "mapElements" DROP CONSTRAINT "mapElements_mapId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Map" ALTER COLUMN "thumbnail" SET NOT NULL;

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "height" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;

-- AlterTable
ALTER TABLE "spaceElements" ADD COLUMN     "static" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "mapElements";

-- CreateTable
CREATE TABLE "MapElements" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "static" BOOLEAN NOT NULL,

    CONSTRAINT "MapElements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MapElements_id_key" ON "MapElements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "MapElements" ADD CONSTRAINT "MapElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElements" ADD CONSTRAINT "MapElements_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
