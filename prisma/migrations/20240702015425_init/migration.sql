/*
  Warnings:

  - A unique constraint covering the columns `[correo]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Usuarios_correo_key` ON `Usuarios`(`correo`);
