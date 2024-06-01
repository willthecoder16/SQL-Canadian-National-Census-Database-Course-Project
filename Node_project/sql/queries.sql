-- INSERT
-- "insert an individual"
INSERT INTO
    Individual (
        "Individual_Name",
        "Gender",
        "Age",
        "SIN",
        "Income",
        "Address",
        "Postal_Code",
        "Occupation_ID",
        "Education_ID",
        "Status_ID"
    )
VALUES
    (
        :individualName,
        :gender,
        :age,
        :sin,
        :income,
        :address,
        :postalCode,
        :occupationId,
        :educationId,
        :statusId
    );


-- DELETE
-- "delete a household, deletes the individual (ON DELETE CASCADE)"
DELETE FROM
    Household
WHERE
    "Address" = :address
    AND "Postal_Code" = :postalCode;


-- UPDATE
-- "update individual address, postal code, also updates in the household using sin"
UPDATE
    Individual
SET
    "Address" = :newAddress,
    "Postal_Code" = :newPostalCode
WHERE
    "SIN" = :sin;


-- SELECTION
-- "select all the individuals having particular gender and income > than given income "
SELECT
    *
FROM
    Individual
WHERE
    "Gender" = :gender
    AND "Income" > :income;


-- PROJECTION
-- "selects name,age and address of the individual"
SELECT
    "Address",
    "Postal_Code",
    "Individual_Name"
FROM
    Individual;


-- JOIN
-- "Utilizes the join of Individual and household to filter out individuals in any given city"
SELECT
    I."Individual_Name",
    I."Address",
    I."Postal_Code",
    H."City_Name"
FROM
    Individual I
    JOIN Household H ON I."Postal_Code" = H."Postal_Code"
WHERE
    H."City_Name" = :cityName;


-- AGGREGATION
-- Get Average income by education
SELECT
    E."Level_Name",
    AVG(I."Income") AS "Average_Income"
FROM
    Individual I
    JOIN Education_Level E ON I."Education_ID" = E."Education_ID"
GROUP BY
    E."Level_Name";


-- AGGREGATION WITH HAVING
-- Get Average Income by Occupation
SELECT
    O."Occupation_Name",
    AVG(I."Income") AS "Average_Income"
FROM
    Individual I
    JOIN Occupation O ON I."Occupation_ID" = O."Occupation_ID"
GROUP BY
    O."Occupation_Name"
HAVING
    AVG(I."Income") > :givenIncome;


-- NESTED AGGREGATION BY GROUP BY
-- Get average of average income of city, only city where average income is greater than given income
SELECT
    City_Avg."City_Name",
    AVG(City_Avg."Average_Income") AS "City_Avg_Income"
FROM
    (
        SELECT
            H."City_Name",
            I."Individual_Name",
            AVG(I."Income") AS "Average_Income"
        FROM
            Individual I
            JOIN Household H ON I."Postal_Code" = H."Postal_Code"
        GROUP BY
            H."City_Name",
            I."Individual_Name"
    ) City_Avg
GROUP BY
    City_Avg."City_Name"
HAVING
    AVG(City_Avg."Average_Income") > :givenIncome;


-- DIVSION
-- Find all individuals having every skill
SELECT
    I."Individual_Name"
FROM
    Individual I
WHERE
    NOT EXISTS (
        SELECT
            S."Skill_ID"
        FROM
            Skills S
        WHERE
            NOT EXISTS (
                SELECT
                    ISk."SIN"
                FROM
                    IndividualSkills ISk
                WHERE
                    ISk."SIN" = I."SIN"
                    AND ISk."Skill_ID" = S."Skill_ID"
            )
    );