/*
  Warnings:

  - The primary key for the `Probabilidad` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Probabilidad` DROP PRIMARY KEY,
    MODIFY `fecha` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`fecha`);
