CREATE TABLE `StaffPermission` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `module` VARCHAR(191) NOT NULL,
  `canView` BOOLEAN NOT NULL DEFAULT true,
  `canManage` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `StaffPermission_userId_module_key`(`userId`, `module`),
  INDEX `StaffPermission_userId_idx`(`userId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `StaffPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BankTransfer` (
  `id` VARCHAR(191) NOT NULL,
  `checkoutIntentId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `proofFileName` VARCHAR(191) NOT NULL,
  `proofMimeType` VARCHAR(191) NOT NULL,
  `proofDataBase64` LONGTEXT NOT NULL,
  `reviewedById` VARCHAR(191) NULL,
  `reviewNote` TEXT NULL,
  `reviewedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `BankTransfer_checkoutIntentId_key`(`checkoutIntentId`),
  INDEX `BankTransfer_status_idx`(`status`),
  INDEX `BankTransfer_userId_idx`(`userId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `BankTransfer_checkoutIntentId_fkey` FOREIGN KEY (`checkoutIntentId`) REFERENCES `CheckoutIntent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BankTransfer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
