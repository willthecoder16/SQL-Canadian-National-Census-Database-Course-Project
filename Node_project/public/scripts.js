/*
 * These functions below are for various webpage functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
  const statusElem = document.getElementById("dbStatus");
  const loadingGifElem = document.getElementById("loadingGif");

  const response = await fetch("/check-db-connection", {
    method: "GET",
  });

  // Hide the loading GIF once the response is received.
  loadingGifElem.style.display = "none";
  // Display the statusElem's text in the placeholder.
  statusElem.style.display = "inline";

  response
    .text()
    .then((text) => {
      statusElem.textContent = text;
    })
    .catch((error) => {
      statusElem.textContent = "connection timed out"; // Adjust error handling if required.
    });
}

//Insert new Individual record
async function insertIndividual(event) {
  event.preventDefault();

  const individualName = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value, 10);
  const sin = parseInt(document.getElementById("sin").value, 10);
  const income = parseFloat(document.getElementById("income").value);
  const address = document.getElementById("address").value;
  const postalCode = document.getElementById("postalCode").value;
  const occupationId = parseInt(
    document.getElementById("occupationID").value,
    10
  );
  const educationId = parseInt(
    document.getElementById("educationID").value,
    10
  );
  const statusId = parseInt(document.getElementById("statusID").value, 10);

  const response = await fetch("/insert-individual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Individual inserted successfully!";
  } else {
    messageElement.textContent = "Error inserting individual!";
  }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertId").value;
  const nameValue = document.getElementById("insertName").value;

  const response = await fetch("/insert-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idValue,
      name: nameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
  }
}

//Delete Individual
async function deleteHousehold(event) {
  event.preventDefault();

  const address = document.getElementById("deleteAddress").value;
  const postalCode = document.getElementById("deletePostalCode").value;

  try {
    const response = await fetch("/delete-household", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, postalCode }),
    });

    const responseData = await response.json();
    const messageElement = document.getElementById("deleteResultMsg");

    if (responseData.success) {
      messageElement.textContent = "Household deleted successfully";
    } else {
      messageElement.textContent = "Error: " + responseData.message;
    }
  } catch (error) {
    console.error("Error:", error);
    messageElement.textContent = "An error occurred while sending data";
  }
}

//Dynamically show input fields
function showUpdateField() {
  const option = document.querySelector(
    'input[name="updateChoice"]:checked'
  ).value;
  const updateField = document.getElementById("updateField");
  updateField.innerHTML = "";

  if (option === "address") {
    updateField.innerHTML = `<label>Updated Address:</label>
                                 <input type="text" id="updateAddress" placeholder="Enter Address"><br><br>`;
  } else if (option === "postalCode") {
    updateField.innerHTML = `<label>Updated Postal Code:</label>
                                 <input type="text" id="updatePostalCode" placeholder="Enter Postal Code" maxlength="6"><br><br>`;
  }
}

document.querySelectorAll('input[name="updateChoice"]').forEach((elem) => {
  elem.addEventListener("change", showUpdateField);
});

//Update address or postal code
async function updateHousehold(event) {
  event.preventDefault();

  const sin = document.getElementById("updateSin").value;
  const updatedAddress = document.getElementById("updateAddress")
    ? document.getElementById("updateAddress").value
    : null;
  const updatedPostalCode = document.getElementById("updatePostalCode")
    ? document.getElementById("updatePostalCode").value
    : null;

  try {
    const response = await fetch("/update-individual-address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sin,
        newAddress: updatedAddress,
        newPostalCode: updatedPostalCode,
      }),
    });

    const responseData = await response.json();
    const messageElement = document.getElementById("updateNameResultMsg");

    if (responseData.success) {
      messageElement.textContent = "Address or Postal Code updated";
    } else {
      messageElement.textContent = "Error: " + responseData.message;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("updateNameResultMsg").textContent =
      "An error occurred while sending data";
  }
}

//Get individuals by gender and income
async function getIndividualAddressAndIncome(event) {
  event.preventDefault();

  const gender = document.getElementById("getGender").value;
  const income = document.getElementById("getIncome").value;
  const resultsTableBody = document
    .getElementById("resultsTable")
    .querySelector("tbody");

  try {
    const response = await fetch(
      `/select-individuals?gender=${encodeURIComponent(
        gender
      )}&income=${encodeURIComponent(income)}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const individuals = await response.json();
    console.log(individuals);

    // Clear any existing content
    resultsTableBody.innerHTML = "";

    individuals.forEach((individualArray) => {
      const row = resultsTableBody.insertRow();

      const nameCell = row.insertCell();
      nameCell.textContent = individualArray[0];

      const genderCell = row.insertCell();
      genderCell.textContent = individualArray[1];

      const ageCell = row.insertCell();
      ageCell.textContent = individualArray[2];

      const sinCell = row.insertCell();
      sinCell.textContent = individualArray[3];

      const incomeCell = row.insertCell();
      incomeCell.textContent = individualArray[4];

      const addressCell = row.insertCell();
      addressCell.textContent = individualArray[5];

      const postalCodeCell = row.insertCell();
      postalCodeCell.textContent = individualArray[6];
      const occupationIDCell = row.insertCell();
      occupationIDCell.textContent = individualArray[7];
      const educationIDCell = row.insertCell();
      educationIDCell.textContent = individualArray[8];
      const statusIDCell = row.insertCell();
      statusIDCell.textContent = individualArray[9];
    });
  } catch (error) {
    console.error("Could not fetch individuals:", error);
    resultsTableBody.innerHTML = `Error loading results.`;
  }
}

//Displays the user
async function fetchAndDisplayIndividuals() {
  const tableElement = document.getElementById("individualsTable");
  const tableBody = tableElement.querySelector("tbody");

  try {
    const response = await fetch("/individuals-address-name");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);

    // Clear any existing content
    tableBody.innerHTML = "";

    responseData.forEach((individualArray) => {
      const row = tableBody.insertRow();

      const nameCell = row.insertCell();
      nameCell.textContent = individualArray[2];
      const addressCell = row.insertCell();
      addressCell.textContent = individualArray[0];

      const postalCodeCell = row.insertCell();
      postalCodeCell.textContent = individualArray[1];
    });
  } catch (error) {
    console.error("Could not fetch individuals:", error);
    tableBody.innerHTML = `Error loading data.`;
  }
}

//Individuals in the given city
async function individualsInGivenCity(event) {
  event.preventDefault();

  const cityNameInput = document.getElementById("joinCityName");
  const resultsTableBody = document
    .getElementById("joinResultsTable")
    .querySelector("tbody");

  try {
    const response = await fetch(
      `/individuals/by-city?cityName=${encodeURIComponent(cityNameInput.value)}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const individuals = await response.json();
    console.log(individuals);

    resultsTableBody.innerHTML = "";

    individuals.forEach((individual) => {
      const row = resultsTableBody.insertRow();

      const nameCell = row.insertCell();
      nameCell.textContent = individual.Individual_Name;

      const addressCell = row.insertCell();
      addressCell.textContent = individual.Address;

      const postalCodeCell = row.insertCell();
      postalCodeCell.textContent = individual.Postal_Code;

      const cityCell = row.insertCell();
      cityCell.textContent = individual.City_Name;
    });
  } catch (error) {
    console.error("Could not fetch individuals by city:", error);
    resultsTableBody.innerHTML = `Error: ${error}`;
  }
}
//Fetch individuals by average income
async function fetchAndDisplayIndividualsByAverageIncome() {
  const tableElement = document.getElementById("individualsTableAggregation");
  const tableBody = tableElement.querySelector(
    "#individualsTableAggregation tbody"
  );

  try {
    const response = await fetch("/average-income-by-education");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);

    // Clear any existing content
    tableBody.innerHTML = "";

    responseData.forEach((individualArray) => {
      const row = tableBody.insertRow();

      const levelCell = row.insertCell();
      levelCell.textContent = individualArray.Level_Name;
      const averageCell = row.insertCell();
      averageCell.textContent = individualArray.Average_Income;
    });
  } catch (error) {
    console.error("Could not fetch individuals:", error);
    tableBody.innerHTML = `Error loading data.`;
  }
}

//Occupation having greater average income
async function greaterAverageIncome(event) {
  event.preventDefault();

  const givenIncome = document.getElementById("aggregationAverageIncome");
  const resultsTableBody = document
    .getElementById("havingResultsTable")
    .querySelector("tbody");

  try {
    const response = await fetch(
      `get-occupation-with-high-income/?givenIncome=${encodeURIComponent(
        givenIncome.value
      )}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const individuals = await response.json();
    console.log(individuals);

    resultsTableBody.innerHTML = "";

    individuals.forEach((individualArray) => {
      const row = resultsTableBody.insertRow();

      const occupationCell = row.insertCell();
      occupationCell.textContent = individualArray[0];

      const averageIncomeCell = row.insertCell();
      averageIncomeCell.textContent = individualArray[1];
    });
  } catch (error) {
    console.error("Could not fetch occupation with average income:", error);
    resultsTableBody.innerHTML = `Error: ${error}`;
  }
}

//City having greater average income
async function greaterAverageIncomeCity(event) {
  event.preventDefault();

  const givenIncome = document.getElementById("nestedAggregationInput");
  const resultsTableBody = document
    .getElementById("nestedResultsTable")
    .querySelector("tbody");

  try {
    const response = await fetch(
      `/average-income-city/?givenIncome=${encodeURIComponent(
        givenIncome.value
      )}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const individuals = await response.json();
    console.log(individuals);

    resultsTableBody.innerHTML = "";

    individuals.forEach((individualArray) => {
      const row = resultsTableBody.insertRow();

      const cityCell = row.insertCell();
      cityCell.textContent = individualArray[0];

      const averageIncomeCell = row.insertCell();
      averageIncomeCell.textContent = individualArray[1];
    });
  } catch (error) {
    console.error("Could not fetch city with higher average income:", error);
    resultsTableBody.innerHTML = `Error: ${error}`;
  }
}

//Divison query
//Displays the user
async function getIndividualWithEverySkill() {
  const tableElement = document.getElementById("divisonTable");
  const tableBody = tableElement.querySelector("tbody");

  try {
    const response = await fetch("/individuals-with-every-skills");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);

    // Clear any existing content
    tableBody.innerHTML = "";

    responseData.forEach((individualArray) => {
      const row = tableBody.insertRow();

      const nameCell = row.insertCell();
      nameCell.textContent = individualArray[0];
    });
  } catch (error) {
    console.error("Could not fetch individuals:", error);
    tableBody.innerHTML = `Error loading data.`;
  }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
  checkDbConnection();
  // fetchAndDisplayIndividuals();
  
  document
    .getElementById("insertIndividual")
    .addEventListener("submit", insertIndividual);
  document
    .getElementById("deleteIndividual")
    .addEventListener("submit", deleteHousehold);
  document
    .getElementById("updateAddressPostalCode")
    .addEventListener("submit", updateHousehold);
  document
    .getElementById("getIndividualForm")
    .addEventListener("submit", getIndividualAddressAndIncome);
  document
    .getElementById("loadButton")
    .addEventListener("click", fetchAndDisplayIndividuals);
  document
    .getElementById("joinForm")
    .addEventListener("submit", individualsInGivenCity);
  document
    .getElementById("loadButtonAggregation")
    .addEventListener("click", fetchAndDisplayIndividualsByAverageIncome);
  document
    .getElementById("aggregationViaForm")
    .addEventListener("submit", greaterAverageIncome);
  document
    .getElementById("nestedAggregation")
    .addEventListener("submit", greaterAverageIncomeCity);
  document
    .getElementById("divisionLoadButton")
    .addEventListener("click", getIndividualWithEverySkill);
};


