UPDATE `FormPackage`
SET `priceCents` = 9900,
    `salePriceCents` = NULL
WHERE `slug` IN ('new-itin-application', 'itin-renewal');
