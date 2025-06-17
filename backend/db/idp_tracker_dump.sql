-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for idp_tracker_db
CREATE DATABASE IF NOT EXISTS `idp_tracker_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `idp_tracker_db`;

-- Dumping structure for table idp_tracker_db.account
CREATE TABLE IF NOT EXISTS `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleID` int DEFAULT NULL,
  `username` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `password` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `fullname` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `personnel` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `level` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lead` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-',
  `division` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subdivision` char(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_account_role` (`roleID`),
  CONSTRAINT `fk_account_role` FOREIGN KEY (`roleID`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table idp_tracker_db.answertype
CREATE TABLE IF NOT EXISTS `answertype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.answertype: ~8 rows (approximately)
-- DELETE FROM `answertype`;
INSERT INTO `answertype` (`id`, `type`) VALUES
	(1, 'inputField'),
	(2, 'listbox'),
	(3, 'date'),
	(4, 'file'),
	(5, 'time'),
	(6, 'dynamicQuestion'),
	(7, 'none'),
	(8, 'datalist');

-- Dumping structure for table idp_tracker_db.choice
CREATE TABLE IF NOT EXISTS `choice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionID` int DEFAULT NULL,
  `text` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_question_text` (`questionID`,`text`),
  CONSTRAINT `fk_listbox_question` FOREIGN KEY (`questionID`) REFERENCES `question` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.choice: ~87 rows (approximately)
-- DELETE FROM `choice`;
INSERT INTO `choice` (`id`, `questionID`, `text`) VALUES
	(40, NULL, 'ถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้ใหม่กับทีมงานหรือผู้อื่น'),
	(84, NULL, 'ทดสอบ'),
	(39, NULL, 'พัฒนานวัตกรรม/ปรับปรุงวิธีการทำงาน'),
	(1, 5, 'ข้าราชการ'),
	(3, 5, 'จ้างเหมาเอกชนดำเนินการ'),
	(2, 5, 'พนักงานราชการ'),
	(4, 5, 'ลูกจ้างโครงการ'),
	(44, 6, 'ที่ปรึกษา'),
	(52, 6, 'นักจัดการงานทั่วไป'),
	(49, 6, 'นักทรัพยากรบุคคล'),
	(51, 6, 'นักประชาสัมพันธ์'),
	(47, 6, 'นักวิชาการคอมพิวเตอร์'),
	(54, 6, 'นักวิชาการตรวจสอบภายใน'),
	(56, 6, 'นักวิชาการพัสดุ'),
	(53, 6, 'นักวิชาการเงินและบัญชี'),
	(48, 6, 'นักวิเคราะห์นโยบายและแผน'),
	(50, 6, 'นักวิเทศสัมพันธ์'),
	(57, 6, 'นักเทคโนโลยีสารสนเทศ'),
	(61, 6, 'นางช่างเทคนิค'),
	(62, 6, 'นางช่างไฟฟ้า'),
	(55, 6, 'นิติกร'),
	(43, 6, 'ผู้ช่วยปลัดกระทรวง'),
	(42, 6, 'ผู้ตรวจราชการ'),
	(45, 6, 'ผู้อำนวยการ'),
	(41, 6, 'รองปลัดกระทรวง'),
	(58, 6, 'วิศวกรไฟฟ้าสื่อสาร'),
	(46, 6, 'หัวหน้าสำนักงานรัฐมนตรี'),
	(64, 6, 'เจ้าพนักงานการเงินและบัญชี'),
	(59, 6, 'เจ้าพนักงานธุรการ'),
	(63, 6, 'เจ้าพนักงานพัสดุ'),
	(60, 6, 'เจ้าพนักงานสื่อสาร'),
	(78, 8, '-'),
	(72, 8, 'ชำนาญการ'),
	(71, 8, 'ชำนาญการพิเศษ'),
	(76, 8, 'ชำนาญงาน'),
	(69, 8, 'ทรงคุณวุฒิ'),
	(74, 8, 'ทักษะพิเศษ'),
	(66, 8, 'บริหารต้น'),
	(65, 8, 'บริหารสูง'),
	(73, 8, 'ปฏิบัติการ'),
	(77, 8, 'ปฏิบัติงาน'),
	(75, 8, 'อาวุโส'),
	(68, 8, 'อำนวยการต้น'),
	(67, 8, 'อำนวยการสูง'),
	(70, 8, 'เชี่ยวชาญ'),
	(83, 9, '-'),
	(80, 9, 'ผอ.กลุ่ม'),
	(79, 9, 'ผอ.กอง'),
	(17, 10, 'กลุ่มขับเคลื่อนการปฏิรูปประเทศ ยุทธศาสตร์ชาติ และการสร้างความสามัคคีปรองดอง (กลุ่ม ป.ย.ป.)'),
	(6, 10, 'กลุ่มตรวจสอบภายใน (ตส.)'),
	(7, 10, 'กลุ่มพัฒนาระบบบริหาร (พร.)'),
	(10, 10, 'กองกฎหมาย (กม.)'),
	(9, 10, 'กองกลาง (กก.)'),
	(11, 10, 'กองการต่างประเทศ (ตท.)'),
	(15, 10, 'กองการสื่อสารโทรคมนาคม (กส.)'),
	(16, 10, 'กองงานดิจิทัลจังหวัด (ดจ.)'),
	(19, 10, 'กองนวัตกรรมด้านดิจิทัล'),
	(12, 10, 'กองป้องกันและปราบปรามการกระทำความผิดทางเทคโนโลยีสารสนเทศ (ปท.)'),
	(13, 10, 'กองยุทธศาสตร์และแผนงาน (ยศ.)'),
	(5, 10, 'ราชการบริหารส่วนกลาง'),
	(8, 10, 'ศูนย์ปฏิบัติการต่อต้านการทุจริต (ศปท.)'),
	(14, 10, 'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร (ศท.)'),
	(18, 10, 'สำนักงานรัฐมนตรี'),
	(81, 11, '1'),
	(82, 11, '2'),
	(120, 11, '5'),
	(85, 11, 'tr'),
	(87, 11, 'กลุ่ม2'),
	(23, 25, '(๑) ดิจิทัล หรือ AI'),
	(24, 25, '(๒) Design Thinking/ Innovation'),
	(25, 25, '(๓) Communication'),
	(26, 25, '(๔) Critical Thinking and Problem solving    Untitled Title'),
	(29, 26, 'Duolingo'),
	(27, 26, 'แพลตฟอร์มการเรียนรู้ออนไลน์'),
	(28, 26, 'แหล่งการเรียนรู้จากวิดีโอและพอตคาสต์'),
	(33, 27, 'Coursera'),
	(34, 27, 'edX'),
	(35, 27, 'Future Skill'),
	(37, 27, 'Khan Academy'),
	(36, 27, 'MasterClass'),
	(20, 27, 'OCSC e-Learning'),
	(30, 27, 'SET e-Learning'),
	(21, 27, 'TDGA e-Learning'),
	(22, 27, 'ThaiMOOC'),
	(32, 27, 'Udacity'),
	(31, 27, 'Udemy'),
	(38, 27, 'อื่นๆ');

-- Dumping structure for table idp_tracker_db.comment
CREATE TABLE IF NOT EXISTS `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `generatedpdfID` int DEFAULT NULL,
  `accountID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_generated_account` (`generatedpdfID`,`accountID`),
  KEY `accountID` (`accountID`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`generatedpdfID`) REFERENCES `generatedpdf` (`id`) ON DELETE SET NULL,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table idp_tracker_db.form
CREATE TABLE IF NOT EXISTS `form` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hrID` int DEFAULT NULL,
  `title` char(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `description` char(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_form_hr` (`hrID`),
  CONSTRAINT `fk_form_hr` FOREIGN KEY (`hrID`) REFERENCES `hr` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.form: ~3 rows (approximately)
-- DELETE FROM `form`;
INSERT INTO `form` (`id`, `hrID`, `title`, `description`) VALUES
	(1, 1, 'แผนพัฒนารายบุคคล', 'Individual Development Plan: IDP'),
	(3, 1, 'ทดสอบ', ''),
	(4, 1, 'แบบรายงานผล การดำเนินการตามตัวชี้วัดและค่าเป้าหมายการพัฒนาองค์กรให้เป็นองค์กรแห่งการเรียนรู้ (ร้อยละ ๑๐)', '');

-- Dumping structure for table idp_tracker_db.generatedpdf
CREATE TABLE IF NOT EXISTS `generatedpdf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `formID` int DEFAULT NULL,
  `partID` int DEFAULT NULL,
  `status` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'รอการอนุมัติจากผอ.กลุ่ม',
  `path` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `formID` (`formID`,`userID`,`partID`),
  UNIQUE KEY `unique_user_form` (`formID`,`userID`,`partID`),
  KEY `fk_generatedpdf_part` (`partID`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping structure for table idp_tracker_db.part
CREATE TABLE IF NOT EXISTS `part` (
  `id` int NOT NULL AUTO_INCREMENT,
  `formID` int DEFAULT NULL,
  `text` char(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_topic_form` (`formID`),
  CONSTRAINT `fk_topic_form` FOREIGN KEY (`formID`) REFERENCES `form` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.part: ~2 rows (approximately)
-- DELETE FROM `part`;
INSERT INTO `part` (`id`, `formID`, `text`) VALUES
	(1, 1, 'ส่วนที่ ๑ แผนพัฒนารายบุคคล'),
	(8, 1, 'ส่วนที่ ๒ แบบรายงานผล การดำเนินการตามตัวชี้วัดและค่าเป้าหมายการพัฒนาองค์กรให้เป็นองค์กรแห่งการเรียนรู้ (ร้อยละ ๑๐)');

-- Dumping structure for table idp_tracker_db.question
CREATE TABLE IF NOT EXISTS `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topicID` int DEFAULT NULL,
  `answerTypeID` int DEFAULT NULL,
  `text` char(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `example` char(250) COLLATE utf8mb4_general_ci NOT NULL,
  `required` tinyint NOT NULL DEFAULT '0',
  `questionDetail` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_answertype` (`answerTypeID`),
  KEY `fk_question_part` (`topicID`) USING BTREE,
  CONSTRAINT `fk_question_answertype` FOREIGN KEY (`answerTypeID`) REFERENCES `answertype` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_question_topic` FOREIGN KEY (`topicID`) REFERENCES `topic` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.question: ~39 rows (approximately)
-- DELETE FROM `question`;
INSERT INTO `question` (`id`, `topicID`, `answerTypeID`, `text`, `example`, `required`, `questionDetail`) VALUES
	(4, 8, 1, 'ชื่อ-นามสกุล', 'ตัวอย่าง นายใจดี สีดำ', 1, NULL),
	(5, 8, 2, 'ประเภทบุคลากร', '', 1, NULL),
	(6, 8, 2, 'ชื่อตำแหน่ง', '', 1, NULL),
	(8, 8, 2, 'ระดับตำแหน่ง', '', 1, NULL),
	(9, 8, 2, 'ตำแหน่งอื่น ๆ', '', 1, NULL),
	(10, 8, 2, 'กอง', '', 1, NULL),
	(11, 8, 8, 'กลุ่ม', '', 1, NULL),
	(12, 8, 1, 'อีเมล', '', 1, NULL),
	(13, 9, 1, 'จุดแข็ง', '', 1, NULL),
	(14, 9, 1, 'จุดอ่อน', '', 1, NULL),
	(15, 9, 1, 'โอกาสในการพัฒนา', '', 1, NULL),
	(16, 9, 1, 'สรุปความต้องการในการพัฒนา', '', 1, NULL),
	(17, 10, 1, 'เป้าหมายการพัฒนา (ย่อย)', 'ตัวอย่าง: พัฒนาทักษะการนำเสนอผลงานอย่างมืออาชีพ', 1, NULL),
	(18, 10, 1, 'ประเด็นการพัฒนา', 'ตัวอย่าง:  การออกแบบสไลด์นำเสนอ, เทคนิคการพูดในที่สาธารณะ, การถามตอบคำถามเชิง  กลยุทธ์', 1, NULL),
	(19, 10, 1, 'ระยะเวลา', 'ตัวอย่าง:   ๔ เดือน ระหว่าง พ.ค. – ก.ย ๖๘', 1, NULL),
	(20, 10, 1, 'วิธีการพัฒนา', 'ตัวอย่าง:  เรียนด้วยตนเองผ่านคอร์สออนไลน์ และฝึกปฏิบัติในโอกาสต่าง ๆ', 1, NULL),
	(25, 16, 4, 'หลักฐานการเข้ารับการฝึกอบรม/ workshop / สัมมนาเชิงวิชาการ / online learning', '\r\n', 0, NULL),
	(26, 16, 2, 'ประเภทแหล่งการเรียนรู้ที่จะรายงาน', '', 1, NULL),
	(27, 16, 2, 'แพลตฟอร์มการเรียนรู้ที่ใช้', '', 0, NULL),
	(28, 16, 1, 'ชื่อหลักสูตร / รายวิชา', '', 0, NULL),
	(29, 16, 3, 'วันที่เริ่มเรียน', '', 0, NULL),
	(30, 16, 3, 'วันที่จบหลักสูตร', '', 0, NULL),
	(31, 17, 1, '🎯 ความรู้ทักษะที่ได้รับการพัฒนา (จริง)', 'ตัวอย่าง - การใช้งานระบบ AI สำหรับบันทึกและสรุปรายงานการประชุม', 1, NULL),
	(32, 17, 1, '🎯 ระยะเวลาพัฒนา (จริง)', 'ตัวอย่าง - ๒ เดือน (ก.พ.-มี.ค.๖๘)', 1, NULL),
	(33, 17, 1, '🎯 วิธีการพัฒนา', 'ตัวอย่าง - เรียนรู้ด้วยตนเองผ่านคอร์สออนไลน์ร่วมกับการ เข้ารับการอบรมการใช้งานระบบ AI สำหรับการบันทึกและสรุปการประชุม', 1, NULL),
	(34, 17, 1, '🎯 ผลการพัฒนานวัตกรรม/ปรับปรุงวิธีการทำงานหรือถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้ใหม่', 'ตัวอย่าง - สามารถนำระบบ AI มาใช้บันทึกและสรุปรายงานการประชุมได้อย่างถูกต้อง ครบถ้วน รวดเร็ว ประหยัดเวลา', 1, NULL),
	(35, 16, 5, 'จำนวนชั่วโมงที่เรียนรู้', 'ตัวอย่าง - 03:00:00 , 00:47:32', 0, '{"sum": 0}'),
	(36, 18, 6, '', '', 0, NULL),
	(37, 19, 1, 'พัฒนานวัตกรรม/ปรับปรุงวิธีการทำงาน', ' (เช่น การบันทึกและสรุปรายงานการประชุมผู้บริหาร สป.ดศ. ด้วย AI)', 0, NULL),
	(38, 19, 7, '', '***อธิบายเชิงเปรียบเทียบ การใช้ทักษะเดิม และการใช้ทักษะใหม่ ว่ามีการเปลี่ยนแปลงอย่างไร***', 0, NULL),
	(39, 19, 1, 'วิธีการเดิม', 'ตัวอย่าง ๑. เตรียมระบบเพื่อบันทึกเสียงการประชุม และบันทึกรายงานการประชุมด้วยวิธีการจดบันทึกด้วยมือไปพร้อมๆ กับการประชุม', 0, NULL),
	(40, 19, 1, 'ปรับปรุงใหม่', 'ตัวอย่าง ๑. เตรียมระบบ AI เพื่อบันทึกเสียงการประชุม โดยบันทึกเฉพาะประเด็นสำคัญเป็นบางส่วนเท่านั้น', 0, NULL),
	(41, 20, 1, 'หัวข้อที่ถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้', '', 0, NULL),
	(42, 20, 1, 'วันที่ถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้', '', 0, NULL),
	(43, 20, 1, 'หลักฐานการถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้', '', 0, NULL),
	(45, 21, 1, '๓. ประโยชน์ที่ได้รับ', 'โปรดระบุประโยชน์ที่ได้รับจากการนำความรู้และทักษะที่ได้รับการพัฒนามาปรับใช้ ทั้งต่อตนเอง ต่อทีมงาน และต่อองค์กร', 0, NULL),
	(46, 21, 1, '๔. ข้อเสนอแนะเพิ่มเติม', '', 0, NULL),
	(47, 10, 1, 'ตัวชี้วัดความสำเร็จ', 'ตัวอย่าง:  สามารถออกแบบสไลด์นำเสนอที่ดึงดูดความสนใจ นำเสนอข้อมูลได้อย่างน่าสนใจ ตอบคำถามได้อย่างชัดเจนและกระชับ', 1, NULL),
	(48, 11, 1, '', '', 0, NULL);

-- Dumping structure for table idp_tracker_db.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.role: ~3 rows (approximately)
-- DELETE FROM `role`;
INSERT INTO `role` (`id`, `name`) VALUES
	(1, 'hr'),
	(2, 'user'),
	(3, 'approver');

-- Dumping structure for table idp_tracker_db.specialquestion
CREATE TABLE IF NOT EXISTS `specialquestion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `column` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `questionID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_specialQuestion_question` (`questionID`),
  CONSTRAINT `fk_specialQuestion_question` FOREIGN KEY (`questionID`) REFERENCES `question` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.specialquestion: ~7 rows (approximately)
-- DELETE FROM `specialquestion`;
INSERT INTO `specialquestion` (`id`, `table`, `column`, `questionID`) VALUES
	(1, 'account', 'fullname', 4),
	(2, 'account', 'personnel', 5),
	(3, 'account', 'position', 6),
	(4, 'account', 'level', 8),
	(5, 'account', 'lead', 9),
	(6, 'account', 'division', 10),
	(7, 'account', 'subdivision', 11);

-- Dumping structure for table idp_tracker_db.topic
CREATE TABLE IF NOT EXISTS `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partID` int DEFAULT NULL,
  `topicTypeID` int DEFAULT NULL,
  `text` char(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(550) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `typeDetail` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_part_topic` (`partID`) USING BTREE,
  KEY `fk_part_parttype` (`topicTypeID`) USING BTREE,
  CONSTRAINT `fk_topic_part` FOREIGN KEY (`partID`) REFERENCES `part` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_topictype` FOREIGN KEY (`topicTypeID`) REFERENCES `topictype` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.topic: ~10 rows (approximately)
-- DELETE FROM `topic`;
INSERT INTO `topic` (`id`, `partID`, `topicTypeID`, `text`, `description`, `typeDetail`) VALUES
	(8, 1, 2, '๑.ข้อมูลส่วนบุคคล', NULL, NULL),
	(9, 1, 2, '๒.การวิเคราะห์และสรุปความต้องการพัฒนา', '(โปรดวิเคราะห์จุดแข็ง จุดอ่อน โอกาสในการพัฒนา และสรุปความต้องการในการพัฒนา โดยพิจารณาให้ครอบคลุมทักษะที่จำเป็น สำหรับการปฏิบัติงาน ในตำแหน่งปัจจุบัน และการเตรียมความพร้อมทักษะในการปฏิบัติงานในตำแหน่ง เป้าหมายในอนาคต โดยครอบคลุมทักษะ ๓ ด้าน ได้แก่(๑) ทักษะด้านดิจิทัล\r\n(๒) ทักษะการทำงานวิถีใหม่ที่เป็นสากล (ภาษาอังกฤษ AI)\r\n(๓) ความรู้และทักษะการปฏิบัติงานอย่างเป็นมืออาชีพ)\r\n', NULL),
	(10, 1, 1, '๓.การกำหนดประเด็น วิธีการ และการวางแผนการพัฒนา', '(จำนวนอย่างน้อย ๓-๕ เรื่อง)    *คำตอบไม่เกิน 250 ตัวอักษร', '{"min": 3}'),
	(11, 1, 2, 'หมายเหตุ (ระบุทรัพยากรที่ต้องการสนับสนุน, ปัญหาอุปสรรค, แนวทางการบริหารจัดการเบื้องต้น)', '**หากมีการแก้ไขข้อมูลในแบบฟอร์มกรุณากดส่งแบบฟอร์มอีกครั้ง** หากติดปัญหาติดต่อ 16916', '{"descent": false}'),
	(16, 8, 3, 'ค่าเป้าหมายระดับที่ ๒', ' ', '{"inherit": 10}'),
	(17, 8, 2, 'ค่าเป้าหมายระดับที่ ๔ ผ่านการพัฒนา/ฝึกอบรมตามแผนพัฒนารายบุคคล (IDP) และรายงานผลการพัฒนาตามแนวทางที่กำหนด', '- ระบุองค์ความรู้หรือทักษะที่ได้รับการพัฒนาตามที่ระบุไว้ใน IDP (แผนพัฒนารายบุคคล): ', '{"inherit": 10}'),
	(18, 8, 4, 'ค่าเป้าหมายระดับที่ ๕ การนำความรู้หรือทักษะที่ได้รับจากการเรียนรู้ไปประยุกต์ใช้จริง', '********(เลือกดำเนินการอย่างใดอย่างหนึ่ง)***********', '{"min": 1}'),
	(19, 8, 2, 'พัฒนานวัตกรรม/ปรับปรุงวิธีการทำงาน อย่างน้อย ๑ โครงการ/กระบวนงาน', ' ', '{"inherit": 18}'),
	(20, 8, 2, 'ถ่ายทอด/แบ่งปัน/แลกเปลี่ยนความรู้ใหม่กับทีมงานหรือผู้อื่น อย่างน้อย ๑ ครั้ง', NULL, '{"inherit": 18}'),
	(21, 8, 2, 'ประโยชน์ที่ได้รับและข้อเสนอแนะ', ' ', NULL);

-- Dumping structure for table idp_tracker_db.topictype
CREATE TABLE IF NOT EXISTS `topictype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table idp_tracker_db.topictype: ~4 rows (approximately)
DELETE FROM `topictype`;
INSERT INTO `topictype` (`id`, `type`) VALUES
	(1, 'multipleAnswer'),
	(2, 'singleAnswer'),
	(3, 'multipleFile'),
	(4, 'dynamicQuestion');

-- Dumping structure for table idp_tracker_db.useranswer
CREATE TABLE IF NOT EXISTS `useranswer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionID` int DEFAULT NULL,
  `accountID` int DEFAULT NULL,
  `text` char(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `groupInstance` int DEFAULT '0',
  `subInstance` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `questionID` (`questionID`,`accountID`,`groupInstance`,`subInstance`),
  KEY `fk_useranswer_account` (`accountID`),
  CONSTRAINT `fk_useranswer_account` FOREIGN KEY (`accountID`) REFERENCES `account` (`id`),
  CONSTRAINT `fk_useranswer_question` FOREIGN KEY (`questionID`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5661 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
