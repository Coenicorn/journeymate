CREATE USER 'journeymate'@'localhost' IDENTIFIED BY '';
GRANT SELECT, INSERT, UPDATE, CREATE TABLE ON journeymate.* TO 'journeymate'@'localhost';
FLUSH PRIVILEGES;
