/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `roleId`,
    ADD COLUMN `Role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
