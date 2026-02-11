-- Script SQL pour résoudre le problème de duplication d'ID
-- À exécuter dans votre client MySQL (PHPMyAdmin, MySQL Workbench, etc.)

USE pharmacy_db;

-- 1. Vérifier l'état actuel
SHOW TABLE STATUS LIKE 'order';

-- 2. Réinitialiser l'auto-increment à une valeur sûre
-- ATTENTION: Sauvegardez vos données avant d'exécuter cette commande!
ALTER TABLE `order` AUTO_INCREMENT = 1;

-- 3. Ou si vous voulez commencer à partir d'un nombre plus élevé:
-- ALTER TABLE `order` AUTO_INCREMENT = 1000;

-- 4. Vérifier que ça a fonctionné
SHOW TABLE STATUS LIKE 'order';

-- 5. Optionnel: Nettoyer les doublons si nécessaire
-- DELETE o1 FROM `order` o1 INNER JOIN `order` o2 
-- WHERE o1.id > o2.id AND o1.orderNumber = o2.orderNumber;