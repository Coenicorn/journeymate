DROP USER 'journeymate'@'localhost';
FLUSH PRIVILEGES;
CREATE USER 'journeymate'@'localhost' IDENTIFIED BY 'fvbasjbavlkjhewropiuvbsRIUavbsjk';
GRANT SELECT, INSERT, UPDATE, CREATE, DELETE ON journeymate.* TO 'journeymate'@'localhost' IDENTIFIED BY 'fvbasjbavlkjhewropiuvbsRIUavbsjk';
FLUSH PRIVILEGES;
