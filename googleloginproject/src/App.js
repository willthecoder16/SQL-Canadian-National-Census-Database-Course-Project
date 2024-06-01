import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {Routes, Route, useNavigate} from 'react-router-dom';
//source for router: https://bobbyhadz.com/blog/react-onclick-redirect
//table style: https://www.digitalocean.com/community/tutorials/how-to-style-a-table-with-css
//dropdown table: https://www.w3schools.com/howto/howto_css_dropdown.asp
import axios from 'axios';

function App() {

    function Home() {
        return (
        <div>  
            <center><h2>Home</h2></center>
            <center><h2>Database Connection Status: 
            {/* An in-line placeholder to display connection status. */}
            <span id="dbStatus"> </span>
            {/* A loading GIF, will be hided once get the status. */}
            <img id="loadingGif" class="loading-gif" src="loading_100px.gif" alt="Loading..." />
            </h2></center>
            <div class = "profile">
                <center><img src={profile.picture} alt="Profile" /></center>
                <center><h3>User Logged in</h3></center>
                <center><p>Name: {profile.name}</p></center>
                <center><p>Email Address: {profile.email}</p></center>
                <br />
                <center><button class="button-61" onClick={logOut}>Log out</button></center>
            </div>
        </div>
        );
    }

    function Table() {

        return (
        <div>
        <center><h3>Show Census Table</h3></center>
        <center><table id="demotable" border="1">
            <thead>
                <tr>
                    {/* Table head, need to be adjusted accordingly to align with your own. */}
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>SIN</th>
                    <th>Income</th>
                    <th>Address</th>
                    <th>Postal Code</th>
                    <th>Occupation ID</th>
                    <th>Education ID</th>
                    <th>Marriage Status ID</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table></center>

        <center><DeleteHousehold /></center>

        <center><h3>Reset Census Table</h3></center>
        <center><button class="button-61" id="resetDemotable"> reset </button></center> <br />
        {/* A placeholder to display messages related to the reset operation. */}
        <div id="resetResultMsg"></div>

        <center><h3>Count the Tuples in Census Table</h3></center>
        <center><button class="button-61" id="count-demotable"> count </button></center> <br /><br />
        {/* A placeholder to display the count result. */}
        <div id="countResultMsg"></div> <br />
        </div>
        );
    }

    function Insert() {

        return (
        <div>
        <center><h3> Insert Values into Census Table </h3></center>
        <center>

        <form id='insert-demotable'>    
        Name: <input type="text" id="insertName" placeholder="Enter Name" maxlength="20" /> <br /><br />
        Gender: <input type="text" id="insertGender" placeholder="Enter Gender" maxlength="20" /> <br /><br />
        Age: <input type="number" id="insertAge" placeholder="Enter Age" /> <br /><br />
        SIN: <input type="number" id="insertSIN" placeholder="Enter SIN" required/> <br /><br />
        Income: <input type="income" id="insertIncome" placeholder="Enter income" required/> <br /><br />
        Address: <input type="text" id="insertAddress" placeholder="Enter Address" /> <br /><br />
        Postal Code: <input type="text" id="insertPostalCode" placeholder="Enter Postal Code" maxlength="6"/> <br /><br />
        Occupation ID: <input type="number" id="insertOccupationID" placeholder="Enter Occupation ID"/> <br /><br />
        Education ID: <input type="number" id="insertEducationID" placeholder="Enter Education ID"/> <br /><br />
        Marriage Status ID: <input type="number" id="insertMarriageStatusID" placeholder="Enter Marriage Status ID"/> <br /><br />

        <button class="button-61" type="submit"> insert </button> <br />
        </form></center>
        <div id="insertResultMsg"></div>
        </div>
        );
    }

    function Update() {
        const [updateChoice, setUpdateChoice] = useState(null);

        const updateFieldVisibility = (event) => {
            setUpdateChoice(event.target.value);
        };

        const renderUpdateField = () => {
            switch (updateChoice) {
            case 'address':
                return (
                <div>
                    <label htmlFor="newAddress">New Address:</label>
                    <input type="text" id="insertNewAddress" name="newAddress" />
                </div>
                );
            case 'postalCode':
                return (
                <div>
                    <label htmlFor="newPostalCode">New Postal Code:</label>
                    <input type="text" id="insertNewPostal" name="newPostalCode" maxLength="6" />
                </div>
                );
            default:
                return null; // Render nothing if no choice is selected
            }
        };

        return (
        <div>
        <center><h3>Update Cencus Data</h3></center>
        {/* <center><p>The values are case sensitive and if you enter in the wrong case, the update statement will not do anything.</p></center> */}
        <center><form id="updateAddressPostalCode">
        <label>SIN:</label>
        <input type="number" id="updateSin" placeholder="Enter SIN" maxlength="9" /><br /><br />
    
        <input type="radio" id="choiceAddress" name="updateChoice" value="address" onChange={updateFieldVisibility} />
        <label htmlFor="choiceAddress">New Address</label><br />

        <input type="radio" id="choicePostalCode" name="updateChoice" value="postalCode" maxLength="6" onChange={updateFieldVisibility} />
        <label htmlFor="choicePostalCode">New Postal Code</label><br /><br />
    
        <div id="updateField">
        {renderUpdateField()} <br /><br />
        </div>
    
        <button class="button-61" type="submit">Update Household</button><br />
        </form></center>
        {/* A placeholder to display messages related to the update operation. */}
        <div id="updateNameResultMsg"></div>

        </div>

        );
    }

    function Select() {
        return (
            <div>
            <center><SelectIndividuals /></center>
            <center><SelectIndividualAttributes /></center>
            <center><FilterIndividualsByCity /></center>
            <center><FindIndividualsWithEverySkill /></center>
            </div>
        );
    }

    function Data() {
        return (
            <div>
            <center><h3>Data Summary</h3></center>
            <center><div>
                <AverageIncomeByEducation />
                <AverageIncomeByOccupation />
                <CityAverageIncome />
            </div></center>
            </div>
        );
    }

    function AboutUs() {
        return (
            <div>
            <center><h2>About Us</h2></center>
            </div>
        );
    }

    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    const navigate = useNavigate();

    const navigateHome = () => {
        // 👇️ navigate to /
        navigate('/');
      };

    const navigateToTable = () => {
        navigate('/table', {replace: true});
      };

    const navigateToInsert = () => {
        navigate('/insert', {replace: true});
      };

    const navigateToUpdate = () => {
        navigate('/update', {replace: true});
      };
    const navigateToData = () => {
        navigate('/data', {replace: true});
    };
    const navigateToSelect = () => {
        navigate('/select', {replace: true});
    };
    const navigateAbout = () => {
        navigate('/aboutus');
    }

    return (
        <div>
            <br />
            <br />
            {profile ? (
                <div>
                    &nbsp;<button class="button-61" onClick={navigateHome}>Home</button>
                    {/* &nbsp;<button class="button-61" onClick={navigateToFunction}>Function</button> */}
                    &nbsp;
                    <div class="dropdown">
                        <button class="button-61">Functions</button>
                        <div class="dropdown-content">
                            <a href="#" onClick={navigateToTable}>Table View</a>
                            <a href="#" onClick={navigateToInsert}>Insert</a>
                            <a href="#" onClick={navigateToUpdate}>Update</a>
                            <a href='#' onClick={navigateToSelect}>Select</a>
                            <a href="#" onClick={navigateToData}>Data</a>
                        </div>
                    </div>
                    &nbsp;<button class="button-61" onClick={navigateAbout}>About us</button>
                    <Routes>
                    <Route path="/table" element={<Table />} />
                    <Route path="/insert" element={<Insert />} />
                    <Route path="/update" element={<Update />} />
                    <Route path="/select" element={<Select />} />
                    <Route path="/data" element={<Data />}/>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    </Routes>
                </div>
            ) : (
              <div>
                <h2><center>Welcome to National Census Database (NCD)</center></h2>
                {/* <center><button class="button-61" onClick={() => login()}>Sign in with NCD account 📊</button></center> */}
                <br />
                <center><button class="button-61" onClick={() => login()}>Sign in with Google 🚀 </button></center>
                <br />
                {/* <center><button class="button-61" onClick={() => login()}>Sign up for NCD account 🐣</button></center> */}
                
              </div>
            )}
        </div>
    );
}

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
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

const DeleteHousehold = () => {
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handlePostalCodeChange = (event) => {
        setPostalCode(event.target.value);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch('/delete-household', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address, postalCode }),
            });

            if (response.ok) {
                console.log('Household deleted successfully!');
            } else {
                console.error('Error deleting household:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting household:', error);
        }
    };

    return (
        <div>
            <h3>Delete Household</h3>
            <div>
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" value={address} onChange={handleAddressChange} /><br /><br />
            </div>
            <div>
                <label htmlFor="postalCode">Postal Code:</label>
                <input type="text" id="postalCode" value={postalCode} onChange={handlePostalCodeChange} /><br /><br />
            </div>
            <button class="button-61" onClick={handleDelete}>Delete Household</button>
        </div>
    );
    };

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const nameValue = document.getElementById('insertName').value;
    const genderValue = document.getElementById('insertGender').value;
    const ageValue = document.getElementById('insertAge').value;
    const SINValue = document.getElementById('insertSIN').value;
    const incomeValue = document.getElementById('insertIncome').value;
    const addressValue = document.getElementById('insertAddress').value;
    const postalValue = document.getElementById('insertPostalCode').value;
    const occupationIDValue = document.getElementById('insertOccupationID').value;
    const educationIDValue = document.getElementById('insertEducationID').value;
    const marriageStatusIDValue = document.getElementById('insertMarriageStatusID').value;

    try {
        const response = await fetch('/insert-demotable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                individualName: nameValue,
                individualName: nameValue,
                gender: genderValue,
                age: ageValue,
                sin: SINValue,
                income: incomeValue,
                address: addressValue,
                postalCode: postalValue,
                occupationID: occupationIDValue,
                educationID: educationIDValue,
                statusID: marriageStatusIDValue
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const messageElement = document.getElementById('insertResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Data inserted successfully!";
            fetchTableData();
        } else {
            messageElement.textContent = "Error inserting data!";
        }
    } catch (error) {
        console.error('Error inserting data:', error);
        // Handle the error (display an error message, etc.)
    }
}

const SelectIndividuals = () => {
    const [gender, setGender] = useState('');
    const [income, setIncome] = useState('');
    const [selectedIndividuals, setSelectedIndividuals] = useState([]);

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleIncomeChange = (event) => {
        setIncome(event.target.value);
    };

    const handleSelect = async () => {
        try {
            const response = await fetch(`/select-individuals?gender=${gender}&income=${income}`);
            const result = await response.json();
            setSelectedIndividuals(result);
        } catch (error) {
            console.error('Error selecting individuals:', error);
        }
    };

    return (
        <div>
            <h3>Select Individuals</h3>
            <div>
                <label htmlFor="gender">Gender:</label>
                <input type="text" id="gender" value={gender} onChange={handleGenderChange} /><br /><br />
            </div>
            <div>
                <label htmlFor="income">Income:</label>
                <input type="number" id="income" value={income} onChange={handleIncomeChange} /><br /><br />
            </div>
            <button class="button-61" onClick={handleSelect}>Select Individuals</button>
            <div>
            <h4>Selected Individuals:</h4>
                {selectedIndividuals.length > 0 ? (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Income</th>
                                {/* Add more columns based on your individual table structure */}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedIndividuals.map((individual, index) => (
                                <tr key={index}>
                                    <td>{individual.Individual_Name}</td>
                                    <td>{individual.Gender}</td>
                                    <td>{individual.Income}</td>
                                    {/* Add more columns based on your individual table structure */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No individuals found.</p>
                )}
            </div>
        </div>
    );
};

const SelectIndividualAttributes = () => {
    const [selectedAttributes, setSelectedAttributes] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('/individuals-address-name');
            const result = await response.json();
            setSelectedAttributes(result);
        } catch (error) {
            console.error('Error fetching individual attributes:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h3>Select Individual and Address</h3>
            {selectedAttributes.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Postal Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedAttributes.map((individual, index) => (
                            <tr key={index}>
                                <td>{individual.Individual_Name}</td>
                                <td>{individual.Address}</td>
                                <td>{individual.Postal_Code}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No individuals found.</p>
            )}
        </div>
    );
};

const FilterIndividualsByCity = () => {
    const [cityName, setCityName] = useState('');
    const [filteredIndividuals, setFilteredIndividuals] = useState([]);

    const handleCityNameChange = (event) => {
        setCityName(event.target.value);
    };

    const handleFilter = async () => {
        try {
            const response = await fetch(`/individuals/by-city?cityName=${cityName}`);
            const result = await response.json();
            setFilteredIndividuals(result);
        } catch (error) {
            console.error('Error filtering individuals by city:', error);
        }
    };

    useEffect(() => {
        // You may want to fetch data on component mount or based on user actions
    }, []);

    return (
        <div>
            <h3>Filter Individuals By City</h3>
            <div>
                <label htmlFor="cityName">City Name:</label>
                <input type="text" id="cityName" value={cityName} onChange={handleCityNameChange} /><br /><br />
            </div>
            <button class="button-61" onClick={handleFilter}>Filter Individuals</button>
            <div>
                <h4>Filtered Individuals:</h4>
                {filteredIndividuals.length > 0 ? (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Postal Code</th>
                                <th>City Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIndividuals.map((individual, index) => (
                                <tr key={index}>
                                    <td>{individual.Individual_Name}</td>
                                    <td>{individual.Address}</td>
                                    <td>{individual.Postal_Code}</td>
                                    <td>{individual.City_Name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No individuals found.</p>
                )}
            </div>
        </div>
    );
};

const FindIndividualsWithEverySkill = () => {
    const [individualsWithEverySkill, setIndividualsWithEverySkill] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('/individuals-with-every-skills');
            const result = await response.json();
            setIndividualsWithEverySkill(result);
        } catch (error) {
            console.error('Error finding individuals with every skill:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h3>Find Individuals With Every Skill</h3>
            {individualsWithEverySkill.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {individualsWithEverySkill.map((individual, index) => (
                            <tr key={index}>
                                <td>{individual.Individual_Name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No individuals found with every skill.</p>
            )}
        </div>
    );
};

// Update the values in the table by SIN
async function updateDemotable(event) {
    event.preventDefault();

    const sin = document.getElementById('SINsearch').value;
    const updatedAddress = document.getElementById('insertNewAddress').value;
    const updatedPostal = document.getElementById('insertNewPostal').value;

    // Validate key
    if (!sin) {
        console.error('Invalid SIN for update');
        return;
    }

    try {
        const response = await fetch('/update-demotable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sin,
                newAddress: updatedAddress,
                newPostal: updatedPostal
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const messageElement = document.getElementById('updateNameResultMsg');

        if (responseData.success) {
            messageElement.textContent = 'Name updated successfully!';
            fetchTableData();
        } else {
            messageElement.textContent = 'Error updating name!';
        }
    } catch (error) {
        console.error('Error updating name:', error);
        // Handle the error (display an error message, etc.)
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

const AverageIncomeByEducation = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/average-income-by-education');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h4>Average Income by Education Level</h4>
            <table border="1">
                <thead>
                    <tr>
                        <th>Education ID</th>
                        <th>Average Income</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.educationLevel}</td>
                            <td>{row.averageIncome}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AverageIncomeByOccupation = () => {
    const [givenIncome, setGivenIncome] = useState('');
    const [data, setData] = useState([]);

    const handleInputChange = (event) => {
        setGivenIncome(event.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`/get-occupation-with-high-income?givenIncome=${givenIncome}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [givenIncome]);

    return (
        <div>
            <h4>Average Income by Occupation</h4>
            <div>
                <label htmlFor="givenIncome">Enter Given Income:</label>
                <input
                    type="number"
                    id="givenIncome"
                    name="givenIncome"
                    value={givenIncome}
                    onChange={handleInputChange}
                />
                &nbsp;<button class="button-61" onClick={fetchData}>Filter</button><br /><br />
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>Occupation</th>
                        <th>Average Income</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.occupationName}</td>
                            <td>{row.averageIncome}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CityAverageIncome = () => {
    const [givenIncome, setGivenIncome] = useState('');
    const [data, setData] = useState([]);

    const handleInputChange = (event) => {
        setGivenIncome(event.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`/average-income-city?givenIncome=${givenIncome}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [givenIncome]);

    return (
        <div>
            <h4>City Average Income</h4>
            <div>
                <label htmlFor="givenIncome">Enter Given Income:</label>
                <input
                    type="number"
                    id="givenIncome"
                    name="givenIncome"
                    value={givenIncome}
                    onChange={handleInputChange}
                />
                &nbsp;<button class="button-61" onClick={fetchData}>Filter</button><br /><br />
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Average Income</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.City_Name}</td>
                            <td>{row.City_Avg_Income}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    const rD = document.getElementById("resetDemotable");
    if (rD) {
        document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    }
    const iD = document.getElementById("insertDemotable");
    if (rD) {
        document.getElementById("insertDemotable").addEventListener("click", insertDemotable);
    }
    const uD = document.getElementById("updateDemotable");
    if (rD) {
        document.getElementById("updateDemotable").addEventListener("click", updateDemotable);
    }
    const cD = document.getElementById("countDemotable");
    if (rD) {
        document.getElementById("countDemotable").addEventListener("click", countDemotable);
    }
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

export default App;
