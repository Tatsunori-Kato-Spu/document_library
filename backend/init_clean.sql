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
  `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;

-- สร้างตาราง documents
CREATE TABLE `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doc_number` VARCHAR(20) NOT NULL,
  `doc_name` VARCHAR(100),
  `subject` VARCHAR(255),
  `department` VARCHAR(100),
  `doc_date` DATE,
  `doc_time` TIME,
  `pdf_file` LONGBLOB
) ENGINE=InnoDB;

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
) ENGINE=InnoDB;

-- เติมข้อมูลตัวอย่าง roles
INSERT INTO `roles` (`name`) VALUES
  ('admin'),
  ('worker'),
  ('guest');

-- เติมข้อมูลตัวอย่าง users
INSERT INTO `users` (
  `username`,`password`,`role_id`,`token`,`image`,`name`,`id_card`,`department`,`position`,`email`,`contact`
) VALUES
  ('admin','adminpass',1,'admin123','1','นายสมชาย ใจดี','123456','ฝ่ายการตลาด','ผู้จัดการ','somchai@example.com','081-1234567'),
  ('worker','workerpass',2,'worker123','2','นางสาวสวย ใจงาม','789101','ฝ่ายการเงิน','เจ้าหน้าที่การเงิน','suay@example.com','081-7654321'),
  ('user1','pass1',2,'token1','3','นายจิตร จินดา','112233','ฝ่ายบุคคล','เจ้าหน้าที่บุคคล','jit@example.com','081-1122334'),
  ('user2','pass2',2,'token2','4','นางสมหญิง หอมแก้ว','445566','ฝ่ายบัญชี','เจ้าหน้าที่บัญชี','somying@example.com','081-4455667'),
  ('user3','pass3',2,'token3','5','นายวิทยา ชาญชัย','778899','ฝ่ายไอที','โปรแกรมเมอร์','wittaya@example.com','081-7788990');

-- เติมข้อมูลตัวอย่าง documents
INSERT INTO `documents` (
  `doc_number`,`doc_name`,`subject`,`department`,`doc_date`,`doc_time`
) VALUES
  ('426333','รายงานปี2550','เอกสารรายงานประจำปี 2550','บัญชี','2006-12-21','14:12:00'),
  ('426334','รายงานปี2551','เอกสารรายงานประจำปี 2551','การเงิน','2007-12-20','15:20:00'),
  ('426335','รายงานปี2552','เอกสารรายงานประจำปี 2552','การเงิน','2008-12-19','16:30:00'),
  ('426336','รายงานปี2553','เอกสารรายงานประจำปี 2553','ทรัพยากรบุคคล','2009-12-18','17:40:00'),
  ('426337','รายงานปี2554','เอกสารรายงานประจำปี 2554','บัญชี','2010-12-17','18:50:00');

-- เติมความสัมพันธ์ document_roles
INSERT INTO `document_roles` (`document_id`,`role_id`) VALUES
  (1,1),(1,2),
  (2,1),(2,2),(2,3),
  (3,1),(3,2),
  (4,1),(4,2),(4,3),
  (5,1);
