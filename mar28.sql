-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: seproject2
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `request_type` enum('Event','Venue') NOT NULL,
  `approver_id` int DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `comments` text,
  `approval_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_approvals_request` (`request_id`),
  KEY `fk_approvals_approver` (`approver_id`),
  CONSTRAINT `fk_approvals_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_approvals_request` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,22,'Event',2,'Approved',NULL,'2025-03-20 20:10:45'),(2,23,'Event',2,'Rejected','na','2025-03-20 20:29:49'),(4,25,'Event',2,'Rejected','nachale','2025-03-20 20:31:18'),(5,26,'Event',2,'Approved',NULL,'2025-03-20 20:11:07'),(7,24,'Event',7,'Pending',NULL,'2025-03-20 19:55:04'),(8,22,'Event',6,'Pending',NULL,'2025-03-20 20:10:45'),(9,26,'Event',6,'Pending',NULL,'2025-03-20 20:11:07'),(10,27,'Event',2,'Approved',NULL,'2025-03-22 06:31:51'),(11,28,'Event',2,'Pending',NULL,'2025-03-22 06:28:38'),(12,27,'Event',6,'Approved',NULL,'2025-03-22 06:33:48'),(13,27,'Event',7,'Approved',NULL,'2025-03-22 06:34:47'),(14,27,'Event',8,'Rejected','nachale','2025-03-22 06:36:49'),(15,29,'Event',2,'Pending',NULL,'2025-03-22 07:12:21'),(16,30,'Event',2,'Approved',NULL,'2025-03-22 09:41:04'),(17,30,'Event',3,'Pending',NULL,'2025-03-22 09:41:04');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events_permissions`
--

DROP TABLE IF EXISTS `events_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int DEFAULT NULL,
  `club_name` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `phone_number` bigint NOT NULL,
  `point_of_contact` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  CONSTRAINT `events_permissions_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_permissions`
--

LOCK TABLES `events_permissions` WRITE;
/*!40000 ALTER TABLE `events_permissions` DISABLE KEYS */;
INSERT INTO `events_permissions` VALUES (1,7,'qw','q',1234567890,'a'),(2,8,'qw','q',1234567890,'a'),(3,9,'qw','q',1234567890,'a'),(4,10,'qw','q',1234567890,'a'),(15,22,'qw','q',917981139681,'1234567890'),(16,23,'qw','q',917981139681,'1234567890'),(17,24,'qw','q',917981139681,'1234567890'),(18,25,'qw','q',917981139681,'1234567890'),(19,26,'algoZenith','Love Cupid',1234567890,'mounika'),(20,27,'algo','q',917981139681,'1234567890'),(21,28,'algo','q',917981139681,'1234567890');
/*!40000 ALTER TABLE `events_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty_roles`
--

DROP TABLE IF EXISTS `faculty_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty_roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `club_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `user_id` (`user_id`,`role_id`),
  KEY `fk_faculty_roles_role` (`role_id`),
  CONSTRAINT `fk_faculty_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_faculty_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty_roles`
--

LOCK TABLES `faculty_roles` WRITE;
/*!40000 ALTER TABLE `faculty_roles` DISABLE KEYS */;
INSERT INTO `faculty_roles` VALUES (1,2,1,'Tech Club'),(2,3,2,NULL),(3,4,3,NULL),(4,5,4,NULL),(5,6,5,NULL),(6,7,6,NULL),(7,8,7,NULL);
/*!40000 ALTER TABLE `faculty_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_type` enum('event','venue') NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `request_date` date NOT NULL,
  `request_time` time NOT NULL,
  `description` text,
  `id_card_upload` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (1,'event','John Doe','john.doe@nitc.ac.in','2025-03-15','10:00:00','Request for Tech Club Hackathon event approval.','id_card_john.png','pending','2025-03-13 14:03:07'),(2,'venue','John Doe','john.doe@nitc.ac.in','2025-03-20','14:30:00','Request to book Seminar Hall for AI Workshop.','id_card_john.png','pending','2025-03-13 14:03:07'),(3,'event','Alice Kumar','alice.kumar@nitc.ac.in','2025-03-18','09:00:00','Approval request for Annual Science Fair.','id_card_alice.png','approved','2025-03-13 14:03:07'),(4,'venue','Bob Mathew','bob.mathew@nitc.ac.in','2025-03-22','16:00:00','Request to book Auditorium for Cultural Fest.','id_card_bob.png','pending','2025-03-13 14:03:07'),(5,'event','Catherine Joseph','catherine.joseph@nitc.ac.in','2025-03-25','11:00:00','Request for Robotics Club Exhibition event.','id_card_catherine.png','rejected','2025-03-13 14:03:07'),(6,'venue','Daniel Raj','daniel.raj@nitc.ac.in','2025-03-27','15:45:00','Booking request for Conference Room for Research Seminar.','id_card_daniel.png','approved','2025-03-13 14:03:07'),(7,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-19','17:00:00','sarvgsetnbhty','/id_cards/1742318684321-0001.jpg','pending','2025-03-18 17:24:44'),(8,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-19','17:00:00','sarvgsetnbhty','/id_cards/1742318685088-0001.jpg','pending','2025-03-18 17:24:45'),(9,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-19','17:00:00','sarvgsetnbhty','/id_cards/1742318703417-0001.jpg','pending','2025-03-18 17:25:03'),(10,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-19','17:00:00','sarvgsetnbhty','/id_cards/1742318706905-0001.jpg','pending','2025-03-18 17:25:06'),(11,'venue','Praneeth Emandi','praneethe4@gmail.com','2025-03-19','17:00:00','sarvgsetnbhty','/id_cards/1742319248694-0001.jpg','pending','2025-03-18 17:34:08'),(22,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-21','17:00:00','asdvc','/id_cards/1742431462141-0001.jpg','pending','2025-03-20 00:44:22'),(23,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-21','17:00:00','asdvc','/id_cards/1742431464734-0001.jpg','pending','2025-03-20 00:44:24'),(24,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-21','17:00:00','asdvc','/id_cards/1742431466564-0001.jpg','pending','2025-03-20 00:44:26'),(25,'event','Praneeth Emandi','praneethe4@gmail.com','2025-03-21','17:00:00','asdvc','/id_cards/1742431472229-0001.jpg','pending','2025-03-20 00:44:32'),(26,'event','Mounika Kanderi','mounikaramesh05@gmail.com','2025-03-22','17:00:00','god please','/id_cards/1742475257629-0001.jpg','pending','2025-03-20 12:54:17'),(27,'event','sri ram','sr@gmail.com','2025-03-24','16:00:00','peace','/id_cards/1742624905927-praneeth2.jpg','pending','2025-03-22 06:28:25'),(28,'event','sri ram','sr@gmail.com','2025-03-24','16:00:00','peace','/id_cards/1742624918247-praneeth2.jpg','pending','2025-03-22 06:28:38'),(29,'venue','kaja','praneethe4@gmail.com','2025-03-26','12:00:00','asd','/id_cards/1742627541905-praneeth2.jpg','pending','2025-03-22 07:12:21'),(30,'venue','kaja','praneethe4@gmail.com','2025-03-24','11:00:00','fgh','/id_cards/1742636413354-praneeth2.jpg','pending','2025-03-22 09:40:13');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `hierarchy` int NOT NULL,
  `permission` enum('event','venue') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Faculty_Coordinator_Club',0,'event'),(2,'Staff_In_Charge_Venue',1,'venue'),(3,'Faculty_In_Charge_Venue',2,'venue'),(4,'HOD_CSED',3,'venue'),(5,'Associate_Dean',1,'event'),(6,'Dean_Students_Welfare',2,'event'),(7,'Registrar',3,'event');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `role` enum('Student','Faculty','Administrator') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Doe','john.doe@nitc.ac.in','pwd123','Student'),(2,'Dr. Alice Kumar','alice.kumar@nitc.ac.in','pwd456','Faculty'),(3,'Mr. Bob Mathew','bob.mathew@nitc.ac.in','pwd789','Faculty'),(4,'Dr. Catherine Joseph','catherine.joseph@nitc.ac.in','pwd321','Faculty'),(5,'Dr. Daniel Raj','daniel.raj@nitc.ac.in','pwd654','Faculty'),(6,'Dr. Eva Sharma','eva.sharma@nitc.ac.in','pwd987','Faculty'),(7,'Dr. Frank Xavier','frank.xavier@nitc.ac.in','pwd159','Faculty'),(8,'Dr. Grace Thomas','grace.thomas@nitc.ac.in','pwd753','Faculty');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue_permissions`
--

DROP TABLE IF EXISTS `venue_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int DEFAULT NULL,
  `venue_location` varchar(255) NOT NULL,
  `club_name` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `phone_number` bigint NOT NULL,
  `point_of_contact` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_id` (`request_id`),
  CONSTRAINT `venue_permissions_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue_permissions`
--

LOCK TABLES `venue_permissions` WRITE;
/*!40000 ALTER TABLE `venue_permissions` DISABLE KEYS */;
INSERT INTO `venue_permissions` VALUES (1,11,'audi','qw','q',1234567890,'a'),(2,29,'NLHC 102','algoZenith','dance',917981139681,'kaja'),(3,30,'ELHC 402','algoZenith','dance',917981139681,'kaja');
/*!40000 ALTER TABLE `venue_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `capacity` int DEFAULT NULL,
  `staff_in_charge` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 17:00:55
