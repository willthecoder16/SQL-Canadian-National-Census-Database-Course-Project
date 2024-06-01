-- DROP tables (if they exist in database)
drop table CITY cascade constraints;

drop table EDUCATION_LEVEL cascade constraints;

drop table ELECTORAL_DISTRICT cascade constraints;

drop table EMPLOYED cascade constraints;

drop table HOUSEHOLD cascade constraints;

drop table INDIVIDUAL cascade constraints;

drop table INDIVIDUALSKILLS cascade constraints;

drop table LANGUAGE cascade constraints;

drop table MARITAL_STATUS cascade constraints;

drop table OCCUPATION cascade constraints;

drop table RETIRED cascade constraints;

drop table SKILLS cascade constraints;

drop table STUDENT cascade constraints;

drop table UNEMPLOYED cascade constraints;

-- CREATE tables
CREATE TABLE Individual (
  "Individual_Name" VARCHAR2(20),
  "Gender" VARCHAR2(20),
  "Age" INTEGER,
  "SIN" INTEGER PRIMARY KEY,
  "Income" INTEGER,
  "Address" VARCHAR2(20),
  "Postal_Code" VARCHAR2(6),
  "Occupation_ID" INTEGER,
  "Education_ID" INTEGER,
  "Status_ID" INTEGER
);

CREATE TABLE Household (
  "Address" VARCHAR2(20),
  "Postal_Code" VARCHAR2(6),
  "Number_of_Members" INTEGER,
  "ED_Name" VARCHAR2(20) NOT NULL,
  "City_Name" VARCHAR2(20) NOT NULL,
  "Province_Name" VARCHAR2(20),
  "Language_Name" VARCHAR2(20),
  PRIMARY KEY ("Address", "Postal_Code")
);

CREATE TABLE Occupation (
  "Occupation_ID" INTEGER PRIMARY KEY,
  "Occupation_Name" VARCHAR2(30)
);

CREATE TABLE Education_Level (
  "Education_ID" INTEGER PRIMARY KEY,
  "Level_Name" VARCHAR2(20)
);

CREATE TABLE Marital_Status (
  "Status_ID" INTEGER PRIMARY KEY,
  "Status_Name" VARCHAR2(20)
);

CREATE TABLE Electoral_District ("ED_Name" VARCHAR2(20) PRIMARY KEY);

CREATE TABLE City (
  "City_Name" VARCHAR2(20),
  "Province_Name" VARCHAR2(20),
  PRIMARY KEY ("City_Name", "Province_Name")
);

CREATE TABLE Language (
  "Language_Name" VARCHAR2(20),
  "Address" VARCHAR2(20),
  "Postal_Code" VARCHAR2(6),
  PRIMARY KEY ("Language_Name", "Address", "Postal_Code")
);

CREATE TABLE Employed (
  "Employer" VARCHAR2(20),
  "Job_Title" VARCHAR2(20),
  "Occupation_ID" INTEGER,
  "Occupation_Name" VARCHAR2(20),
  PRIMARY KEY ("Occupation_ID")
);

CREATE TABLE Unemployed (
  "Seeking_Employment" NUMBER(1),
  "Occupation_ID" INTEGER,
  "Occupation_Name" VARCHAR2(20),
  PRIMARY KEY ("Occupation_ID")
);

CREATE TABLE Student (
  "Institution_Name" VARCHAR2(30),
  "Level_of_Study" VARCHAR2(20),
  "Occupation_ID" INTEGER,
  "Occupation_Name" VARCHAR2(20),
  PRIMARY KEY ("Occupation_ID")
);

CREATE TABLE Retired (
  "Age_at_Retirement" INTEGER,
  "Occupation_ID" INTEGER,
  "Occupation_Name" VARCHAR2(20),
  PRIMARY KEY ("Occupation_ID")
);

-- Created 2 new tables to 
-- Skills
CREATE TABLE Skills (
  "Skill_ID" INTEGER PRIMARY KEY,
  "Skill_Name" VARCHAR2(50)
);

-- Individual Skills
CREATE TABLE IndividualSkills (
  "SIN" INTEGER,
  "Skill_ID" INTEGER,
  PRIMARY KEY ("SIN", "Skill_ID"),
  FOREIGN KEY ("SIN") REFERENCES Individual("SIN"),
  FOREIGN KEY ("Skill_ID") REFERENCES Skills("Skill_ID")
);

-- ALTER table to add foreign keys
-- Individual Table
ALTER TABLE
  Individual
ADD
  CONSTRAINT fk_individual_household FOREIGN KEY ("Address", "Postal_Code") REFERENCES Household ("Address", "Postal_Code") ON DELETE CASCADE;

ALTER TABLE
  Individual
ADD
  FOREIGN KEY ("Occupation_ID") REFERENCES Occupation ("Occupation_ID") ON DELETE
SET
  NULL;

ALTER TABLE
  Individual
ADD
  FOREIGN KEY ("Education_ID") REFERENCES Education_Level ("Education_ID") ON DELETE
SET
  NULL;

ALTER TABLE
  Individual
ADD
  FOREIGN KEY ("Status_ID") REFERENCES Marital_Status ("Status_ID") ON DELETE
SET
  NULL;

-- Employed table
ALTER TABLE
  Employed
ADD
  FOREIGN KEY ("Occupation_ID") REFERENCES Occupation ("Occupation_ID") ON DELETE CASCADE;

-- Household table
ALTER TABLE
  Household
ADD
  FOREIGN KEY ("ED_Name") REFERENCES Electoral_District ("ED_Name");

ALTER TABLE
  Household
ADD
  FOREIGN KEY ("City_Name", "Province_Name") REFERENCES City ("City_Name", "Province_Name");

ALTER TABLE
  Household
MODIFY
  "ED_Name" VARCHAR2(20) NULL;

ALTER TABLE
  Household
MODIFY
  "City_Name" VARCHAR2(20) NULL;

-- Unemployed table
ALTER TABLE
  Unemployed
ADD
  FOREIGN KEY ("Occupation_ID") REFERENCES Occupation ("Occupation_ID") ON DELETE CASCADE;

-- Student Table
ALTER TABLE
  Student
ADD
  FOREIGN KEY ("Occupation_ID") REFERENCES Occupation ("Occupation_ID") ON DELETE CASCADE;

-- Retired table
ALTER TABLE
  Retired
ADD
  FOREIGN KEY ("Occupation_ID") REFERENCES Occupation ("Occupation_ID") ON DELETE CASCADE;

-- Language table
ALTER TABLE
  Language
ADD
  FOREIGN KEY ("Address", "Postal_Code") REFERENCES Household ("Address", "Postal_Code") ON DELETE CASCADE;

-- Triggers
-- https://www.geeksforgeeks.org/sql-trigger-student-database/
-- Automation to satisfy the foregin key constraint

-- 
CREATE OR REPLACE TRIGGER trg_individual_to_household
AFTER INSERT OR UPDATE ON Individual
FOR EACH ROW
DECLARE
  countHousehold NUMBER;
BEGIN
  SELECT COUNT(*) INTO countHousehold
  FROM Household
  WHERE "Address" = :NEW."Address"
  AND "Postal_Code" = :NEW."Postal_Code";

  IF countHousehold = 0 THEN
    INSERT INTO Household ("Address", "Postal_Code")
    VALUES (:NEW."Address", :NEW."Postal_Code");
  END IF;
END;
/
-- 
CREATE OR REPLACE TRIGGER trg_individual_to_occupation
AFTER INSERT OR UPDATE ON Individual
FOR EACH ROW
DECLARE
  countOccupation NUMBER;
BEGIN
  SELECT COUNT(*) INTO countOccupation
  FROM Occupation
  WHERE "Occupation_ID" = :NEW."Occupation_ID";

  IF countOccupation = 0 THEN
    INSERT INTO Occupation ("Occupation_ID", "Occupation_Name")
    VALUES (:NEW."Occupation_ID", 'Default Occupation Name');
  END IF;
END;
/
--
CREATE OR REPLACE TRIGGER trg_individual_to_education
AFTER INSERT OR UPDATE ON Individual
FOR EACH ROW
DECLARE
  countEducation NUMBER;
BEGIN
  SELECT COUNT(*) INTO countEducation
  FROM Education_Level
  WHERE "Education_ID" = :NEW."Education_ID";

  IF countEducation = 0 THEN
    INSERT INTO Education_Level ("Education_ID", "Level_Name")
    VALUES (:NEW."Education_ID", 'Default Education');
  END IF;
END;
/
--
CREATE OR REPLACE TRIGGER trg_individual_to_marital_status
AFTER INSERT OR UPDATE ON Individual
FOR EACH ROW
DECLARE
  countMaritalStatus NUMBER;
BEGIN
  SELECT COUNT(*) INTO countMaritalStatus
  FROM Marital_Status
  WHERE "Status_ID" = :NEW."Status_ID";

  IF countMaritalStatus = 0 THEN
    INSERT INTO Marital_Status ("Status_ID", "Status_Name")
    VALUES (:NEW."Status_ID", 'Default Status Name');
  END IF;
END;
/
--

--POPULATE table
-- Occupation Table
INSERT INTO Occupation ("Occupation_ID", "Occupation_Name") VALUES (1, 'Civil Engineer');
INSERT INTO Occupation ("Occupation_ID", "Occupation_Name") VALUES (2, 'Family Physician');
INSERT INTO Occupation ("Occupation_ID", "Occupation_Name") VALUES (3, 'Teacher');
INSERT INTO Occupation ("Occupation_ID", "Occupation_Name") VALUES (4, 'Software Engineer');
INSERT INTO Occupation ("Occupation_ID", "Occupation_Name") VALUES (5, 'Data Scientist');
-- Education Level Table
INSERT INTO Education_Level ("Education_ID", "Level_Name") VALUES (1, 'Bachelors');
INSERT INTO Education_Level ("Education_ID", "Level_Name") VALUES (2, 'MD');
INSERT INTO Education_Level ("Education_ID", "Level_Name") VALUES (3, 'Bachelor');
INSERT INTO Education_Level ("Education_ID", "Level_Name") VALUES (4, 'Bachelors');
INSERT INTO Education_Level ("Education_ID", "Level_Name") VALUES (5, 'PhD');
-- Marital Status Table
INSERT INTO Marital_Status ("Status_ID", "Status_Name") VALUES (1, 'Single');
INSERT INTO Marital_Status ("Status_ID", "Status_Name") VALUES (2, 'Married');
INSERT INTO Marital_Status ("Status_ID", "Status_Name") VALUES (3, 'Divorced');
INSERT INTO Marital_Status ("Status_ID", "Status_Name") VALUES (4, 'Widowed');
INSERT INTO Marital_Status ("Status_ID", "Status_Name") VALUES (5, 'Separated');
-- Skills Table
INSERT INTO Skills ("Skill_ID", "Skill_Name") VALUES (1, 'Programming');
INSERT INTO Skills ("Skill_ID", "Skill_Name") VALUES (2, 'Data Analysis');
INSERT INTO Skills ("Skill_ID", "Skill_Name") VALUES (3, 'Project Management');
-- Electoral District Table
INSERT INTO Electoral_District ("ED_Name") VALUES ('Edmonton Centre');
INSERT INTO Electoral_District ("ED_Name") VALUES ('Vancouver Granville');
INSERT INTO Electoral_District ("ED_Name") VALUES ('Saint-Laurent');
INSERT INTO Electoral_District ("ED_Name") VALUES ('Toronto-St');
INSERT INTO Electoral_District ("ED_Name") VALUES ('Toronto-Danforth');
-- City Table
INSERT INTO City ("City_Name", "Province_Name") VALUES ('Edmonton', 'AB');
INSERT INTO City ("City_Name", "Province_Name") VALUES ('Vancouver', 'BC');
INSERT INTO City ("City_Name", "Province_Name") VALUES ('Montreal', 'QC');
INSERT INTO City ("City_Name", "Province_Name") VALUES ('Toronto', 'ON');

-- Household Table
INSERT INTO Household ("Address", "Postal_Code", "Number_of_Members", "ED_Name", "City_Name", "Province_Name", "Language_Name") VALUES ('#123 ExampleStreet', 'T5J0R4', 2, 'Edmonton Centre', 'Edmonton', 'AB', 'English');
INSERT INTO Household ("Address", "Postal_Code", "Number_of_Members", "ED_Name", "City_Name", "Province_Name", "Language_Name") VALUES ('#123 SQLStreet', 'V6E1M7', 3, 'Vancouver Granville', 'Vancouver', 'BC', 'Chinese');
INSERT INTO Household ("Address", "Postal_Code", "Number_of_Members", "ED_Name", "City_Name", "Province_Name", "Language_Name") VALUES ('#111 NoSQLStreet', 'H2Z1B2', 1, 'Saint-Laurent', 'Montreal', 'QC', 'English');
INSERT INTO Household ("Address", "Postal_Code", "Number_of_Members", "ED_Name", "City_Name", "Province_Name", "Language_Name") VALUES ('#123 ComputerStreet', 'M5H2N2', 1, 'Toronto-St', 'Toronto', 'ON', 'English');
INSERT INTO Household ("Address", "Postal_Code", "Number_of_Members", "ED_Name", "City_Name", "Province_Name", "Language_Name") VALUES ('#123 DataStreet', 'M4C1A1', 1, 'Toronto-Danforth', 'Toronto', 'ON', 'English');
-- Language Table
INSERT INTO Language ("Language_Name", "Address", "Postal_Code") VALUES ('English', '#123 ExampleStreet', 'T5J0R4');
INSERT INTO Language ("Language_Name", "Address", "Postal_Code") VALUES ('Chinese', '#123 SQLStreet', 'V6E1M7');
INSERT INTO Language ("Language_Name", "Address", "Postal_Code") VALUES ('English', '#111 NoSQLStreet', 'H2Z1B2');
INSERT INTO Language ("Language_Name", "Address", "Postal_Code") VALUES ('English', '#123 ComputerStreet', 'M5H2N2');
INSERT INTO Language ("Language_Name", "Address", "Postal_Code") VALUES ('English', '#123 DataStreet', 'M4C1A1');

-- Individual Table
INSERT INTO Individual ("Individual_Name", "Gender", "Age", "Income", "SIN", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") VALUES ('Martinez, John', 'M', 45, 85000, 987615431, '#123 ExampleStreet', 'T5J0R4', 1, 1, 1);
INSERT INTO Individual ("Individual_Name", "Gender", "Age", "Income", "SIN", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") VALUES ('Wong, Ashley', 'F', 38, 150000, 987615432, '#123 SQLStreet', 'V6E1M7', 2, 2, 2);
INSERT INTO Individual ("Individual_Name", "Gender", "Age", "Income", "SIN", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") VALUES ('Reynolds, Olivia', 'F', 29, 70000, 987615433, '#111 NoSQLStreet', 'H2Z1B2', 3, 3, 3);
INSERT INTO Individual ("Individual_Name", "Gender", "Age", "Income", "SIN", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") VALUES ('Mitchell, Mason', 'M', 33, 140000, 987615434, '#123 ComputerStreet', 'M5H2N2', 4, 4, 4);
INSERT INTO Individual ("Individual_Name", "Gender", "Age", "Income", "SIN", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") VALUES ('Patel, Neha', 'F', 35, 100000, 987615435, '#123 DataStreet', 'M4C1A1', 5, 5, 5);


-- Employed Table
INSERT INTO Employed ("Employer", "Job_Title", "Occupation_ID", "Occupation_Name") VALUES ('Pacific Land Group', 'Civil Engineer', 1, 'Civil Engineer');
INSERT INTO Employed ("Employer", "Job_Title", "Occupation_ID", "Occupation_Name") VALUES ('Vancouver General', 'Family Physician', 2, 'Family Physician');
INSERT INTO Employed ("Employer", "Job_Title", "Occupation_ID", "Occupation_Name") VALUES ('John High School', 'Teacher', 3, 'Teacher');
INSERT INTO Employed ("Employer", "Job_Title", "Occupation_ID", "Occupation_Name") VALUES ('Google', 'Software Engineer', 4, 'Software Engineer');
INSERT INTO Employed ("Employer", "Job_Title", "Occupation_ID", "Occupation_Name") VALUES ('SAP', 'Data Scientist', 5, 'Data Scientist');



-- Unemployed Table
INSERT INTO Unemployed ("Seeking_Employment", "Occupation_ID", "Occupation_Name") VALUES (0, 1, 'Civil Engineer');
INSERT INTO Unemployed ("Seeking_Employment", "Occupation_ID", "Occupation_Name") VALUES (0, 2, 'Family Physician');
INSERT INTO Unemployed ("Seeking_Employment", "Occupation_ID", "Occupation_Name") VALUES (0, 3, 'Teacher');
INSERT INTO Unemployed ("Seeking_Employment", "Occupation_ID", "Occupation_Name") VALUES (0, 4, 'Software Engineer');
INSERT INTO Unemployed ("Seeking_Employment", "Occupation_ID", "Occupation_Name") VALUES (0, 5, 'Data Scientist');



-- Student Table
INSERT INTO Student ("Institution_Name", "Level_of_Study", "Occupation_ID", "Occupation_Name") VALUES ('UBC', 'Bachelors', 1, 'Civil Engineer');
INSERT INTO Student ("Institution_Name", "Level_of_Study", "Occupation_ID", "Occupation_Name") VALUES ('UofT', 'MD', 2, 'Family Physician');
INSERT INTO Student ("Institution_Name", "Level_of_Study", "Occupation_ID", "Occupation_Name") VALUES ('McGill', 'Bachelor', 3, 'Teacher');
INSERT INTO Student ("Institution_Name", "Level_of_Study", "Occupation_ID", "Occupation_Name") VALUES ('Stanford', 'Bachelors', 4, 'Software Engineer');
INSERT INTO Student ("Institution_Name", "Level_of_Study", "Occupation_ID", "Occupation_Name") VALUES ('UofT', 'PhD', 5, 'Data Scientist');



-- Retired Table
INSERT INTO Retired ("Age_at_Retirement", "Occupation_ID", "Occupation_Name") VALUES (65, 1, 'Civil Engineer');
INSERT INTO Retired ("Age_at_Retirement", "Occupation_ID", "Occupation_Name") VALUES (67, 2, 'Family Physician');
INSERT INTO Retired ("Age_at_Retirement", "Occupation_ID", "Occupation_Name") VALUES (70, 3, 'Teacher');
INSERT INTO Retired ("Age_at_Retirement", "Occupation_ID", "Occupation_Name") VALUES (66, 4, 'Software Engineer');
INSERT INTO Retired ("Age_at_Retirement", "Occupation_ID", "Occupation_Name") VALUES (66, 5, 'Data Scientist');


-- Individual Skills
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615431, 1);
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615431, 3);
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615431, 2);
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615432, 3);
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615432, 2);
INSERT INTO IndividualSkills ("SIN", "Skill_ID") VALUES (987615432, 1);





















