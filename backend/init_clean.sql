-- ถ้ามีฐานข้อมูล userdocs อยู่แล้ว ให้ลบทิ้งก่อน
DROP DATABASE IF EXISTS `userdocs`;

-- สร้างฐานข้อมูลใหม่
CREATE DATABASE `userdocs`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `userdocs`;

-- สร้างตาราง roles
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `level` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- สร้างตาราง users
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `role_id` INT NOT NULL,
  `token` VARCHAR(100),
  `image` VARCHAR(10),
  `name` VARCHAR(100),
  `id_card` VARCHAR(20),
  `department` VARCHAR(100),
  `position` VARCHAR(100),
  `email` VARCHAR(100),
  `contact` VARCHAR(20),
  CONSTRAINT `fk_users_roles`
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
      ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- สร้างตาราง documents
CREATE TABLE `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doc_number` VARCHAR(20) NOT NULL,
  `doc_name` VARCHAR(100),
  `subject` VARCHAR(255),
  `department` VARCHAR(100),
  `doc_date` DATE,
  `doc_time` TIME,
  `pdf_file` VARCHAR(255),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- สร้างตาราง document_roles
CREATE TABLE `document_roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `document_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  CONSTRAINT `fk_dr_document`
    FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`)
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dr_role`
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`)
      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- เติมข้อมูลตัวอย่าง roles
INSERT INTO `roles` (`name`) VALUES
  ('admin'),
  ('worker'),
  ('guest');
