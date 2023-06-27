/*
  Warnings:

  - A unique constraint covering the columns `[atTag]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `atTag` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "atTag" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_atTag_key" ON "User"("atTag");
