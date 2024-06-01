# CPSC 304 Project Cover Page

**Milestone #:** 2

**Date:** October 20, 2023

**Group Number:** 69

| Name           | Student Number | CS Alias (Userid) | Preferred E-mail Address   |
|----------------|----------------|-------------------|-----------------------------|
| Allison Jiao   | 63646590       | y4j5h             | alli0n@student.ubc.ca      |
| Manjot Singh    | 78562972       | b3r7o             | manjjott@student.ubc.ca     |
| William Sun    | 74695198       | p9k3b             | williamsunedu1617@gmail.com |

By typing our names and student numbers in the above table, we certify that the work in the attached assignment was performed solely by those whose names and student IDs are included above. (In the case of Project Milestone 0, the main purpose of this page is for you to let us know your e-mail address, and then let us assign you to a TA for your project supervisor.)

In addition, we indicate that we are fully aware of the rules and consequences of plagiarism, as set forth by the Department of Computer Science and the University of British Columbia.

**Project Description:**
The project proposes a National Census Management system, to efficiently store, analyze, and manage the census data. The domain of the application (survey/census taking/population management). The main goal is to facilitate the collection, management, and analysis of national population and housing census data.

**Changes In ER Diagram from feedback:**
- Added another ISA hierarchy Resident Status, containing sub-categories Citizen, Permanent Resident, Refugee, and temporary resident (work permit, study permit). This addresses the feedback of only 6 relationships present in our ER diagram from Milestone 1.
- Household now has total participation in Located in, as every household must be present in the Electoral district and City. This addresses the issue of cardinality constraints from Milestone 1.
- Occupation ISA hierarchy has total overlap constraints while Resident Status total disjoint constraint. These constraints are now reflected in the ER-diagram as well.
- Authorization entity added to become the owner entity of Occupation, which only allows users with Authorization_ID (requires a new one per SIN input) to access the Occupation_ID of an Individual.



### Functional Dependencies:

- **SIN = A**
- **Individual Name = B**
- **Gender = C**
- **Age = D**
- **Income = E**
- **Ethnicity = F**
- **Birthplace = G**
- **Occupation ID = H**
- **Education ID = I**
- **Status ID = J**
- **Address = K**
- **Postal Code = L**
- **Occupation Name = M**
- **Occupation Average Income = N**
- **Level Name = O**
- **Education Average Income = P**
- **Status Name = Q**
- **Average Age of Marriage = R**
- **Number of Members = S**
- **ED Name = T**
- **City Name = U**
- **Province Name = V**
- **Language Name = W**
- **MP = X**
- **MP Party = Y**
- **Population = Z**
- **Authorization ID = A***

**SIN → Individual Name, Gender, Age, Income, Ethnicity, Birthplace, Education ID, Status ID, Address, Postal Code**

**SIN, Authorization ID → Occupation ID**

**Occupation ID → Occupation Name, Occupation Average Income**

**Education ID → Level Name, Education Average Income**

**Status ID → Status Name, Average Age of Marriage**

**Address, Postal Code → Number of Members, ED Name, City Name, Province Name, Language Name**

**ED Name → MP, MP Party**

**City Name, Province Name → Population**

**A → B, C, D, E, F, G, I, J, K, L**

**AA* → H**

**H → M, N**

**I → O, P**

**J → Q, R**

**KL → S, T, U, V, W**

**T → X, Y**

**UV → Z**



### Normalization:
**3NF Decomposition:**
#### Step 1:

**SIN+ =** {SIN, Individual Name, Gender, Age, Income, Ethnicity, Birthplace, Occupation ID, Education ID, Status ID, Address, Postal Code, Occupation Average Income, Education Average Income, Average Age of Marriage, Number of Members, ED Name, City Name, Province Name, Language Name, MP, MP Party, Population}

**Occupation ID+ =** {Occupation ID, Occupation Name, Occupation Average Income}

**Education ID+ =** {Education ID, Level Name, Education Average Income}

**Status ID+ =** {Status ID, Status Name, Average Age of Marriage}

**Address, Postal Code+ =** {Address, Postal Code, Number of Members, ED Name, City Name, Province Name, Language Name, MP, MP Party, Population}

**ED Name+ =** {ED Name, MP, MP Party}

**City Name, Province Name+ =** {City Name, Province Name, Population}

#### Finding minimal cover of FDs:
**FDs:**
- A → B, C, D, E, F, G, I, J, K, L
- AA* → H
- H → M, N
- I → O, P
- J → Q, R
- KL → S, T, U, V, W
- T → X, Y
- UV → Z


### Normalization Steps:
#### Step 1:
- **Put FDs in standard form:**
  - A → B
  - A → C
  - A → D
  - A → E
  - A → F
  - A → G
  - AA* → H
  - A → I
  - A → J
  - A → K
  - A → L
  - H → M
  - H → N
  - I → O
  - I → P
  - J → Q
  - J → R
  - KL → S
  - KL → T
  - KL → U
  - KL → V
  - KL → W
  - T → X
  - T → Y
  - UV → Z

#### Step 2:
- **Minimize LHS of each FD**

  **DONE!**

#### Step 3:
- **Delete Redundant FDs**

  **We have no redundant FDs**

#### By Synthesis:
- **R(AB)**
- **R(AC)**
- **R(AD)**
- **R(AE)**
- **R(AF)**
- **R(AG)**
- **R(HM)**
- **R(HN)**
- **R(IO)**
- **R(IP)**
- **R(JQ)**
- **R(JR)**
- **R(KLS)**
- **R(TX)**
- **R(TY)**
- **R(KLT)**
- **R(UVZ)**
- **R(KLU)**
- **R(KLV)**
- **R(KLW)**
- **R(AI)**
- **R(AJ)**
- **R(AK)**
- **R(AL)**
- **R(AA*H)**

**Relational Schema:**
```sql
Individual (Individual Name: CHAR(20), Gender: BOOL, Age: INTEGER, SIN: INTEGER, Income: INTEGER, Ethnicity: CHAR(20), Birthplace: CHAR(20), Address: CHAR(20), Postal Code: CHAR(6), Occupation ID: INTEGER, Education ID: INTEGER, Status ID: INTEGER)
Household (Address: CHAR(20), Postal Code: CHAR(6), Number of Members: INTEGER, ED Name: CHAR(20), City Name: CHAR(20), Province Name: CHAR(20), Language Name: CHAR(20)) (ED Name, City Name, Province Name cannot be null)
Occupation (Occupation ID: INTEGER, Occupation Name: CHAR(20), Occupation Average Income: INTEGER)
Education Level (Education ID: INTEGER, Level Name: CHAR(20), Education Average Income: INTEGER)
Marital Status (Status ID: INTEGER, Status Name: CHAR(20), Average Age of Marriage: INTEGER)
Electoral District (ED Name: CHAR(20), MP: CHAR(20), MP Party: CHAR(20))
City (City Name: CHAR(20), Province Name: CHAR(20), Population: INTEGER)
Language (Language Name: CHAR(20), Address: CHAR(20), Postal Code: CHAR(6))
Employed (Employer: CHAR(20), Job Title: CHAR(20), Occupation ID: INTEGER, Occupation Name: CHAR(20), Occu_Avg_Income: INTEGER)
Unemployed (Seeking Employment: BOOL, Occupation ID: INTEGER, Occupation Name: CHAR(20), Occu_Avg_Income: INTEGER)
Student (Institution Name: CHAR(30), Level of Study: CHAR(20), Occupation ID: INTEGER, Occupation Name: CHAR(20), Occu_Avg_Income: INTEGER)
Retired (Age at Retirement: INTEGER, Occupation ID: INTEGER, Occupation Name: CHAR(20), Occu_Avg_Income: INTEGER)
```
**SQL Table**


```sql

CREATE TABLE Individual (
  Individual_Name CHAR(20),
  Gender CHAR(20),
  Age INTEGER,
  SIN INTEGER PRIMARY KEY,
  Income INTEGER,
  Ethnicity CHAR(20),
  Birthplace CHAR(20),
  Address CHAR(20),
  Postal Code CHAR(6),
  Occupation ID INTEGER,
  Education ID INTEGER,
  Status ID INTEGER,
  FOREIGN KEY(Address, Postal Code) REFERENCES Household ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(Occupation ID) REFERENCES Occupation ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(Education ID) REFERENCES Education Level ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY(Status ID) REFERENCES Marital Status ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Household (
  Address CHAR(20),
  Postal Code CHAR(6),
  Number of Members INTEGER,
  ED Name CHAR(20) NOT NULL,
  City Name CHAR(20) NOT NULL,
  Province Name CHAR(20),
  Language Name CHAR(20),
  PRIMARY KEY(Address, Postal Code),
  FOREIGN KEY(ED Name) REFERENCES Electoral District ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY(City Name, Province Name) REFERENCES City ON DELETE NO ACTION ON UPDATE CASCADE,
  FOREIGN KEY(Language Name) REFERENCES Language ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Occupation (
  Occupation ID INTEGER PRIMARY KEY,
  Occupation Name CHAR(20),
  Occupation Average Income INTEGER
);

CREATE TABLE Education Level (
  Education ID INTEGER PRIMARY KEY,
  Level Name CHAR(20),
  Education Average Income INTEGER
);

CREATE TABLE Marital Status (
  Status ID INTEGER PRIMARY KEY,
  Status Name CHAR(20),
  Average Age of Marriage INTEGER
);

CREATE TABLE Electoral District (
  ED Name CHAR(20) PRIMARY KEY,
  MP CHAR(20),
  MP Party CHAR(20)
);

CREATE TABLE City (
  City Name CHAR(20),
  Province Name CHAR(20),
  Population INTEGER,
  PRIMARY KEY(City Name, Province Name)
);

CREATE TABLE Language (
  Language Name CHAR(20),
  Address CHAR(20),
  Postal Code CHAR(6),
  PRIMARY KEY(Language Name, Address, Postal Code),
  FOREIGN KEY(Address, Postal Code) REFERENCES Household ON DELETE CASCADE
);

CREATE TABLE Employed (
  Employer CHAR(20),
  Job Title CHAR(20),
  Occupation ID INTEGER,
  Occupation Name CHAR(20),
  Occu_Avg_Income INTEGER,
  PRIMARY KEY(Occupation ID),
  FOREIGN KEY(Occupation ID) REFERENCES Occupation ON DELETE CASCADE
);

CREATE TABLE Unemployed (
  Seeking Employment BOOL,
  Occupation ID INTEGER,
  Occupation Name CHAR(20),
  Occu_Avg_Income INTEGER,
  PRIMARY KEY(Occupation ID),
  FOREIGN KEY(Occupation ID) REFERENCES Occupation ON DELETE CASCADE
);

CREATE TABLE Student (
  Institution Name CHAR(30),
  Level of Study CHAR(20),
  Occupation ID INTEGER,
  Occupation Name CHAR(20),
  Occu_Avg_Income INTEGER,
  PRIMARY KEY(Occupation ID),
  FOREIGN KEY(Occupation ID) REFERENCES Occupation ON DELETE CASCADE
);

CREATE TABLE Retired (
  Age at Retirement INTEGER,
  Occupation ID INTEGER,
  Occupation Name CHAR(20),
  Occu_Avg_Income INTEGER,
  PRIMARY KEY(Occupation ID),
  FOREIGN KEY(Occupation ID) REFERENCES Occupation ON DELETE CASCADE
);
```
**Insert 5 tuples**
```sql

-- Individual Table
INSERT INTO Individual VALUES ("Martinez, John", "M", 28, 987615431, 90000, "Latin American", "USA", "#123 ExampleStreet", "T5J 0R4", 1, 1, 1);
INSERT INTO Individual VALUES ("Wong, Ashley", "F", 30, 987615432, 120000, "Chinese", "Canada", "#123 SQLStreet", "V6E 1M7", 2, 2, 2);
INSERT INTO Individual VALUES ("Reynolds, Olivia", "F", 38, 987615433, 80000, NULL, "White European", "USA", "#111 NoSQLStreet", "H2Z 1B2", 3, 3, 3);
INSERT INTO Individual VALUES ("Mitchell, Mason", "M", 55, 987615434, 200000, NULL, "White European", "USA", "#111 NoSqlStreet", "M5H 2N2", 4, 4, 4);
INSERT INTO Individual VALUES ("Patel, Neha", "M", 40, 987615431, 100000, "South Asian", "India", "#123 DataStreet", "M4C 1A1", 5, 5, 5);

-- Household Table
INSERT INTO Household VALUES ("#123 ExampleStreet", "T5J 0R4", 2, "Edmonton Centre", "Edmonton", "AB", "English");
INSERT INTO Household VALUES ("#123 SQLStreet", "V6E 1M7", 3, "Vancouver Granville", "Vancouver", "BC", "Chinese");
INSERT INTO Household VALUES ("#111 NoSQLStreet", "H2Z 1B2", 1, "Saint-Laurent", "Montreal", "QC", "English");
INSERT INTO Household VALUES ("#123 ComputerStreet", "M5H 2N2", 1, "Toronto-St.Paul’s", "Toronto", "ON", "English");
INSERT INTO Household VALUES ("#123 DataStreet", "M4C 1A1", 1, "Toronto-Danforth", "Toronto", "ON", "English");

-- Occupation Table
INSERT INTO Occupation VALUES (1, "Civil Engineer", 90000);
INSERT INTO Occupation VALUES (2, "Family Physician", 250000);
INSERT INTO Occupation VALUES (3, "Teacher", 80000);
INSERT INTO Occupation VALUES (4, "Software Engineer", 200000);
INSERT INTO Occupation VALUES (5, "Data Scientist", 150000);

-- Education Level Table
INSERT INTO Education Level VALUES (1, "Bachelors", 76000);
INSERT INTO Education Level VALUES (2, "MD", 100000);
INSERT INTO Education Level VALUES (3, "Bachelor", 80000);
INSERT INTO Education Level VALUES (4, "Bachelors", 80000);
INSERT INTO Education Level VALUES (5, "PhD", 105000);

-- Marital Status Table
INSERT INTO Marital Status VALUES (1, "Single", 28);
INSERT INTO Marital Status VALUES (2, "Married", 30);
INSERT INTO Marital Status VALUES (3, "Divorced", 38);
INSERT INTO Marital Status VALUES (4, "Widowed", 55);
INSERT INTO Marital Status VALUES (5, "Separated", 40);

-- Electoral District Table
INSERT INTO Electoral District VALUES ("Edmonton Centre", "Randy Boissonnault", "Liberal");
INSERT INTO Electoral District VALUES ("Vancouver Granville", "Hedy Fry", "Liberal");
INSERT INTO Electoral District VALUES ("Saint-Laurent", "Emmanuella Lambropoulos", "Liberal");
INSERT INTO Electoral District VALUES ("Toronto-St-Paul’s", "Carolyn Bennet", "Liberal");
INSERT INTO Electoral District VALUES ("Toronto-Danforth", "Julie Dabrusin", "Liberal");

-- City Table
INSERT INTO City VALUES ("Edmonton", "AB", 1010899);
INSERT INTO City VALUES ("Vancouver", "BC", 662248);
INSERT INTO City VALUES ("Montreal", "QC", 1762949);
INSERT INTO City VALUES ("Toronto", "ON", 2794356);
INSERT INTO City VALUES ("Toronto", "ON", 2794356);

-- Language Table
INSERT INTO Language VALUES ("English", "#123 ExampleStreet", "T5J 0R4");
INSERT INTO Language VALUES ("Chinese", "#123 SQLStreet", "V6E 1M7");
INSERT INTO Language VALUES ("English", "#111 NoSQLStreet", "H2Z 1B2");
INSERT INTO Language VALUES ("English", "#123 ComputerStreet", "M5H 2N2");
INSERT INTO Language VALUES ("English", "#123 DataStreet", "M4C 1A1");

-- Employed Table
INSERT INTO Employed VALUES ("Pacific Land Group", "Civil Engineer", 1, "Civil Engineer", 76000);
INSERT INTO Employed VALUES ("Vancouver General Hospital", "Family Physician", 2, "Family Physician", 100000);
INSERT INTO Employed VALUES ("John F. Kennedy High School", "Teacher", 3, "Teacher", 80000);
INSERT INTO Employed VALUES ("Google", "Software Engineer", 4, "Software Engineer", 80000);
INSERT INTO Employed VALUES ("SAP", "Data Scientist", 5, "Data Scientist", 105000);

-- Unemployed Table
INSERT INTO Unemployed VALUES (FALSE, 1, "Civil Engineer", 76000);
INSERT INTO Unemployed VALUES (FALSE, 2, "Family Physician", 100000);
INSERT INTO Unemployed VALUES (FALSE, 3, "Teacher", 80000);
INSERT INTO Unemployed VALUES (FALSE, 4, "Software Engineer", 80000);
INSERT INTO Unemployed VALUES (FALSE, 5, "Data Scientist", 105000);

-- Student Table
INSERT INTO Student VALUES ("UBC", "Bachelors", 1, "Civil Engineer", 76000);
INSERT INTO Student VALUES ("UofT", "MD", 2, "Family Physician", 100000);
INSERT INTO Student VALUES ("McGill", "Bachelor", 3, "Teacher", 80000);
INSERT INTO Student VALUES ("Stanford", "Bachelors", 4, "Software Engineer", 80000);
INSERT INTO Student VALUES ("UofT", "PhD", 5, "Data Scientist", 105000);

-- Retired Table
INSERT INTO Retired VALUES (65, 1, "Civil Engineer", 76000);
INSERT INTO Retired VALUES (67, 2, "Family Physician", 100000);
INSERT INTO Retired VALUES (70, 3, "Teacher", 80000);
INSERT INTO Retired VALUES (66, 5, "Data Scientist", 105000);
INSERT INTO Retired VALUES (66, 5, "Software Engineer", 80000);
```
