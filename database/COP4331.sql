CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- Users Table
CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Login VARCHAR(50) NOT NULL DEFAULT '',
    Password VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Contacts Table
CREATE TABLE Contacts (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Phone VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(50) NOT NULL DEFAULT '',
    UserID INT NOT NULL DEFAULT '0',
    PRIMARY KEY (ID)
) ENGINE = InnoDB;

-- Initial User Data
insert into Users (FirstName,LastName,Login,Password) VALUES ('Rick','Leinecker','RickL','COP4331');

insert into Users (FirstName,LastName,Login,Password) VALUES ('Sam','Hill','SamH','Test');

insert into Users (FirstName,LastName,Login,Password) VALUES('Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2');

insert into Users (FirstName,LastName,Login,Password) VALUES ('Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b'); 
