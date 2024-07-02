-- CreateTable
CREATE TABLE `Usuarios` (
    `telefono` VARCHAR(191) NOT NULL,
    `nombres` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `domicilio` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`telefono`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kit_traffic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `idPropietario` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registro_personas` (
    `id` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hora` VARCHAR(191) NOT NULL,
    `numero_personas` INTEGER NOT NULL,
    `lugar` VARCHAR(191) NOT NULL,
    `idKit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Probabilidad` (
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dia` VARCHAR(191) NOT NULL,
    `idKit` INTEGER NOT NULL,

    PRIMARY KEY (`fecha`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Concurrencia` (
    `id` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hora` VARCHAR(191) NOT NULL,
    `dia` VARCHAR(191) NOT NULL,
    `numero_personas` INTEGER NOT NULL,
    `lugar` VARCHAR(191) NOT NULL,
    `idKit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kit_traffic` ADD CONSTRAINT `Kit_traffic_idPropietario_fkey` FOREIGN KEY (`idPropietario`) REFERENCES `Usuarios`(`telefono`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registro_personas` ADD CONSTRAINT `Registro_personas_idKit_fkey` FOREIGN KEY (`idKit`) REFERENCES `Kit_traffic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Probabilidad` ADD CONSTRAINT `Probabilidad_idKit_fkey` FOREIGN KEY (`idKit`) REFERENCES `Kit_traffic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Concurrencia` ADD CONSTRAINT `Concurrencia_idKit_fkey` FOREIGN KEY (`idKit`) REFERENCES `Kit_traffic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
