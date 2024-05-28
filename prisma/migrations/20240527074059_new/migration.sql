/*
  Warnings:

  - You are about to drop the `itemimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lostitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `returnevidence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `itemimage` DROP FOREIGN KEY `ItemImage_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `lostitem` DROP FOREIGN KEY `LostItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `returnevidence` DROP FOREIGN KEY `ReturnEvidence_borrowId_fkey`;

-- DropTable
DROP TABLE `itemimage`;

-- DropTable
DROP TABLE `lostitem`;

-- DropTable
DROP TABLE `returnevidence`;

-- CreateTable
CREATE TABLE `Item_Image` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lost_Item` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Return_Evidence` (
    `id` VARCHAR(191) NOT NULL,
    `borrowId` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item_Image` ADD CONSTRAINT `Item_Image_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lost_Item` ADD CONSTRAINT `Lost_Item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Return_Evidence` ADD CONSTRAINT `Return_Evidence_borrowId_fkey` FOREIGN KEY (`borrowId`) REFERENCES `Borrow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
