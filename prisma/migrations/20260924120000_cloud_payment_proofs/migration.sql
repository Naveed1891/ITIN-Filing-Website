ALTER TABLE `BankTransfer`
  MODIFY `proofDataBase64` LONGTEXT NULL,
  ADD COLUMN `proofStorageKey` VARCHAR(191) NULL;
