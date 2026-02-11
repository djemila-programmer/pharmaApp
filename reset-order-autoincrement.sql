-- Script pour réinitialiser l'auto-increment de la table order
-- À exécuter dans votre client MySQL (PHPMyAdmin, MySQL Workbench, etc.)

USE pharmacy_db;

-- Vérifier l'état actuel
SELECT 'État actuel de la table order:' as Info;
SHOW TABLE STATUS LIKE 'order';

-- Réinitialiser l'auto-increment à 1
ALTER TABLE `order` AUTO_INCREMENT = 1;

-- Vérifier que la réinitialisation a fonctionné
SELECT 'Après réinitialisation:' as Info;
SHOW TABLE STATUS LIKE 'order';

-- Optionnel: Vider la table si nécessaire (ATTENTION: cela supprime toutes les commandes!)
-- TRUNCATE TABLE `order`;