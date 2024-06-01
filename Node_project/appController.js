const express = require("express");
const appService = require("./appService");

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get("/check-db-connection", async (req, res) => {
  const isConnect = await appService.testOracleConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

router.get("/demotable", async (req, res) => {
  const tableContent = await appService.fetchDemotableFromDb();
  res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
  const initiateResult = await appService.initiateDemotable();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-demotable", async (req, res) => {
  const { id, name } = req.body;
  const insertResult = await appService.insertDemotable(id, name);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});
router.post("/insert-individual", async (req, res) => {
  const {
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
  } = req.body;

  const insertResult = await appService.insertIndividual(
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
  );

  if (insertResult) {
    res.json({ success: true, message: "Individual inserted successfully" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Failed to insert individual" });
  }
});

//Delete household controller
router.delete("/delete-household", async (req, res) => {
  const { address, postalCode } = req.body;

  try {
    const deleteResult = await appService.deleteHousehold(address, postalCode);

    if (deleteResult) {
      res.json({ success: true, message: "Household deleted successfully" });
    } else {
      res.status(404).json({
        success: false,
        message: "Household not found or already deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete household",
      error: error.message,
    });
  }
});

router.put("/update-individual-address", async (req, res) => {
  const { sin, newAddress, newPostalCode } = req.body;

  if (!sin) {
    return res.status(400).json({ success: false, message: "SIN is required" });
  }

  const sanitizedSIN = sin.trim();
  const sanitizedNewAddress = newAddress ? newAddress.trim() : null;
  const sanitizedNewPostalCode = newPostalCode ? newPostalCode.trim() : null;

  if (!/^\d+$/.test(sanitizedSIN)) {
    return res
      .status(400)
      .json({ success: false, message: "Check SIN format" });
  }

  if (
    sanitizedNewPostalCode &&
    !/^[A-Za-z0-9 ]+$/.test(sanitizedNewPostalCode)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Check Postal Code format" });
  }

  try {
    const updateResult = await appService.updateIndividualAddressAndPostalCode(
      sanitizedSIN,
      sanitizedNewAddress,
      sanitizedNewPostalCode
    );

    if (updateResult) {
      res.json({
        success: true,
        message: "Individual's address and postal code updated",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Update failed. Check you SIN, address and postal code",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update individual's address and postal code",
      error: error.message,
    });
  }
});

//Selects individual based on their income and gender
router.get("/select-individuals", async (req, res) => {
  try {
    const { gender, income } = req.query;
    //backend checks for the user
    if (!gender || !income) {
      return res.status(400).send("Gender and Income are required fields!");
    }
    const individuals = await appService.findIndividualsByGenderAndIncome(
      gender,
      income
    );
    return res.json(individuals);
  } catch (error) {
    res.status(500).send("backend issue");
    console.log(error);
  }
});

//Get individual name, address and their postal code
router.get("/individuals-address-name", async (req, res) => {
  try {
    const individuals = await appService.findIndividualsAddressAndName();
    return res.json(individuals);
  } catch (error) {
    console.log(error);
  }
});
//Get individuals by city name utilizing the join of individual and household table
router.get("/individuals/by-city", async (req, res) => {
  try {
    const { cityName } = req.query;

    if (!cityName) {
      return res.status(400).send("City name is required");
    }

    const individuals = await appService.findIndividualsByCity(cityName);
    res.json(individuals);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//Get Average Income By Education
router.get("/average-income-by-education", async (req, res) => {
  try {
    const averageIncomeAndEducationLevel =
      await appService.getAverageIncomeBasedOnEducation();
    res.status(200).json(averageIncomeAndEducationLevel);
  } catch (error) {
    console.log(error);
    res.status(500).send("Backend issue");
  }
});

router.post("/update-name-demotable", async (req, res) => {
  const { oldName, newName } = req.body;
  const updateResult = await appService.updateNameDemotable(oldName, newName);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

//Get Occupation name with income higher than the given income
router.get("/get-occupation-with-high-income", async (req, res) => {
  const { givenIncome } = req.query;
  if (!givenIncome) {
    res.status(400).send("givenIncome is required");
  }
  const intGivenIncome = parseInt(givenIncome);

  try {
    const occupationWithHigherIncome =
      await appService.occupationWithGreaterGivenIncome(intGivenIncome);
    res.status(200).json(occupationWithHigherIncome);
  } catch (error) {
    console.log(error);
    res.status(500).json("Backend Issue");
  }
});

//Get average income within each city, but only for cities where the average income is above a certain income.
router.get("/average-income-city", async (req, res) => {
  const { givenIncome } = req.query;
  if (!givenIncome) {
    res.status(400).send("givenIncome is required !");
  }
  const intGivenIncome = parseInt(givenIncome);
  try {
    const result = await appService.averageIncomeOfCityAboveGivenIncome(
      intGivenIncome
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Backed issue!");
  }
});

//Get individuals with all skills
router.get("/individuals-with-every-skills", async (req, res) => {
  try {
    const individualsWithEverySkill =
      await appService.findInvidualsWithEverySkill();
    res.status(200).json(individualsWithEverySkill);
  } catch (error) {
    console.log(error);
    res.status(500).send("backend issue !");
  }
});

router.get("/count-demotable", async (req, res) => {
  const tableCount = await appService.countDemotable();
  if (tableCount >= 0) {
    res.json({
      success: true,
      count: tableCount,
    });
  } else {
    res.status(500).json({
      success: false,
      count: tableCount,
    });
  }
});

module.exports = router;
