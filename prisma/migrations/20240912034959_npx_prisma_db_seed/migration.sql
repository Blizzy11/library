/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `rackId` on the `Item` table. All the data in the column will be lost.
  - You are about to alter the column `categoryId` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `nik` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rack` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rack_name` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Admin` DROP FOREIGN KEY `Admin_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_rackId_fkey`;

-- DropIndex
DROP INDEX `User_nik_key` ON `User`;

-- AlterTable
ALTER TABLE `Borrow` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` VARCHAR(191) NULL,
    ADD COLUMN `description` LONGTEXT NULL,
    ADD COLUMN `returnAt` DATETIME(3) NULL,
    MODIFY `borrowDate` DATE NOT NULL,
    MODIFY `returnDate` DATE NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'CACNCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Category` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `rackId`,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NOT NULL,
    ADD COLUMN `number` VARCHAR(191) NOT NULL,
    ADD COLUMN `rack_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NULL,
    MODIFY `description` LONGTEXT NULL,
    MODIFY `categoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Role` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `nik`,
    MODIFY `birthDate` DATE NULL;

-- DropTable
DROP TABLE `Admin`;

-- DropTable
DROP TABLE `Rack`;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
