CREATE USER 'journeymate'@'%' IDENTIFIED BY '7bd665cd50c5bc5b03968c2adb73698c';
GRANT SELECT, INSERT, UPDATE, CREATE, DELETE ON `journeymate`.* TO 'journeymate'@'%' IDENTIFIED BY '7bd665cd50c5bc5b03968c2adb73698c';
FLUSH PRIVILEGES;