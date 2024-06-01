const oracledb = require("oracledb");
const loadEnvFile = require("./utils/envUtil");

const envVariables = loadEnvFile("./.env");

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
  user: envVariables.ORACLE_USER,
  password: envVariables.ORACLE_PASS,
  connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
};

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    return await action(connection);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
  return await withOracleDB(async (connection) => {
    return true;
  }).catch(() => {
    return false;
  });
}

async function fetchDemotableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM DEMOTABLE");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function initiateDemotable() {
  return await withOracleDB(async (connection) => {
    try {
      await connection.execute(`DROP TABLE DEMOTABLE`);
    } catch (err) {
      console.log("Table might not exist, proceeding to create...");
    }

    const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
    return true;
  }).catch(() => {
    return false;
  });
}

async function insertDemotable(id, name) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
      [id, name],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function insertIndividual(
  individualName,
  gender,
  age,
  sin,
  income,
  address,
  postalCode,
  occupationId,
  educationId,
  statusId
) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Individual ("Individual_Name", "Gender", "Age", "SIN", "Income", "Address", "Postal_Code", "Occupation_ID", "Education_ID", "Status_ID") 
            VALUES (:individualName, :gender, :age, :sin, :income, :address, :postalCode, :occupationId, :educationId, :statusId)`,
      [
        individualName,
        gender,
        age,
        sin,
        income,
        address,
        postalCode,
        occupationId,
        educationId,
        statusId,
      ],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

//Delete Household using Address and Postal Code deletes the Individual
async function deleteHousehold(address, postalCode) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM Household WHERE "Address" = :address AND "Postal_Code" = :postalCode`,
      [address, postalCode],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updateIndividualAddressAndPostalCode(
  sin,
  newAddress,
  newPostalCode
) {
  return await withOracleDB(async (connection) => {
    try {
      if (newAddress && newPostalCode) {
        const householdExists = await existsInTable(
          connection,
          "Household",
          "Address",
          newAddress,
          "Postal_Code",
          newPostalCode
        );

        if (!householdExists) {
          await insertIntoHousehold(connection, newAddress, newPostalCode);
        }
      }

      let updateArr = [];
      let queryParams = [];

      if (newAddress) {
        updateArr.push(`"Address" = :newAddress`);
        queryParams.push(newAddress);
      }

      if (newPostalCode) {
        updateArr.push(`"Postal_Code" = :newPostalCode`);
        queryParams.push(newPostalCode);
      }

      if (updateArr.length === 0) {
        throw new Error("Please provide address or postal code for the update");
      }

      queryParams.push(sin);
      const updateQuery = `UPDATE Individual SET ${updateArr.join(
        ", "
      )} WHERE "SIN" = :sin`;

      const result = await connection.execute(updateQuery, queryParams, {
        autoCommit: true,
      });
      return result.rowsAffected && result.rowsAffected > 0;
    } catch (error) {
      console.error("Error in updateIndividualAddressAndPostalCode: ", error);
      throw error;
    }
  }).catch((error) => {
    console.error("Database connection error: ", error);
    throw error;
  });
}

//Accepts gender and income, give all the people above
async function findIndividualsByGenderAndIncome(gender, income) {
  return await withOracleDB(async (connection) => {
    const query = `SELECT * FROM Individual WHERE "Gender" = :gender AND "Income" > :income`;
    const result = await connection.execute(
      query,
      [gender, income]
      //
    );

    return result.rows;
  }).catch((err) => {
    console.error("Error in query execution", err);
    throw err;
  });
}
//Shows individuals name,adress and postalcode
async function findIndividualsAddressAndName() {
  return await withOracleDB(async (connection) => {
    const query = `SELECT "Address", "Postal_Code", "Individual_Name" FROM Individual`;
    const result = await connection.execute(
      query,
      []
      //
    );

    return result.rows;
  }).catch((error) => {
    console.log("Error in query exeuction", error);
    throw error;
  });
}

//All the individuals in the a given city (utilizes the join of household and individual table)
async function findIndividualsByCity(cityName) {
  return await withOracleDB(async (connection) => {
    const query = `
      SELECT I."Individual_Name", I."Address", I."Postal_Code", H."City_Name"
      FROM Individual I
      JOIN Household H ON I."Postal_Code" = H."Postal_Code"
      WHERE H."City_Name" = :cityName`;

    const result = await connection.execute(query, [cityName], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    return result.rows;
  }).catch((err) => {
    console.error("Error in query execution", err);
    throw err;
  });
}

//Average Income based on the Education
async function getAverageIncomeBasedOnEducation() {
  return await withOracleDB(async (connection) => {
    const query = `
    SELECT E."Level_Name", AVG(I."Income") AS "Average_Income"
    FROM Individual I
    JOIN Education_Level E ON I."Education_ID" = E."Education_ID"
    GROUP BY E."Level_Name"`;

    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result.rows;
  }).catch((error) => {
    console.error("Error in query", error);
    throw error;
  });
}

//Occupation with higher given income
async function occupationWithGreaterGivenIncome(givenIncome) {
  return await withOracleDB(async (connection) => {
    const query = `SELECT O."Occupation_Name", AVG(I."Income") AS "Average_Income"
      FROM Individual I
      JOIN Occupation O ON I."Occupation_ID" = O."Occupation_ID"
      GROUP BY O."Occupation_Name"
      HAVING AVG(I."Income") > :givenIncome
    `;
    const result = await connection.execute(query, [givenIncome]);
    return result.rows;
  }).catch((error) => {
    console.error("Error in the query", error);
  });
}

//Average Income higher than given income in city
async function averageIncomeOfCityAboveGivenIncome(givenIncome) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT City_Avg."City_Name", AVG(City_Avg."Average_Income") AS "City_Avg_Income"
    FROM (
        SELECT H."City_Name", I."Individual_Name", AVG(I."Income") AS "Average_Income"
        FROM Individual I
        JOIN Household H ON I."Postal_Code" = H."Postal_Code"
        GROUP BY H."City_Name", I."Individual_Name"
    ) City_Avg
    GROUP BY City_Avg."City_Name"
    HAVING AVG(City_Avg."Average_Income") > :givenIncome`,
      [givenIncome]
    );
    return result.rows;
  }).catch((error) => {
    console.error("query issue !", error);
    throw error;
  });
}

//finds individuals with every skills
async function findInvidualsWithEverySkill() {
  return await withOracleDB(async (connection) => {
    const divisionQuery = `SELECT I."Individual_Name"
    FROM Individual I
    WHERE NOT EXISTS (
        SELECT S."Skill_ID"
        FROM Skills S
        WHERE NOT EXISTS (
            SELECT ISk."SIN"
            FROM IndividualSkills ISk
            WHERE ISk."SIN" = I."SIN" AND ISk."Skill_ID" = S."Skill_ID"
        )
    )`;

    const result = await connection.execute(divisionQuery);
    return result.rows;
  }).catch((error) => {
    console.error("Error in findIndividualsWithAllSkills:", error);
    throw error;
  });
}
//Inserts into the household table if not Address and Postal code not present
async function insertIntoHousehold(connection, address, postalCode) {
  await connection.execute(
    `INSERT INTO Household ("Address", "Postal_Code") VALUES (:address, :postalCode)`,
    [address, postalCode],
    { autoCommit: true }
  );
}

//Helper function
async function existsInTable(
  connection,
  tableName,
  column1Name,
  value1,
  column2Name,
  value2
) {
  const result = await connection.execute(
    `SELECT COUNT(*) AS count FROM ${tableName} WHERE "${column1Name}" = :value1 AND "${column2Name}" = :value2`,
    [value1, value2]
  );
  return result.rows[0].count > 0;
}

async function updateNameDemotable(oldName, newName) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
      [newName, oldName],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function countDemotable() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT Count(*) FROM DEMOTABLE");
    return result.rows[0][0];
  }).catch(() => {
    return -1;
  });
}

module.exports = {
  testOracleConnection,
  fetchDemotableFromDb,
  initiateDemotable,
  insertDemotable,
  insertIndividual,
  deleteHousehold,
  updateIndividualAddressAndPostalCode,
  findIndividualsByGenderAndIncome,
  findIndividualsAddressAndName,
  findIndividualsByCity,
  getAverageIncomeBasedOnEducation,
  occupationWithGreaterGivenIncome,
  averageIncomeOfCityAboveGivenIncome,
  findInvidualsWithEverySkill,
  updateNameDemotable,
  countDemotable,
};
