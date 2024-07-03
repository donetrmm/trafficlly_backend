/*
  Warnings:

  - The primary key for the `Concurrencia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Concurrencia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Concurrencia` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `fecha` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`fecha`);
