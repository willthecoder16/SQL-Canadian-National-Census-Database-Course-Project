<h1> Milestone 1</h1>
<strong>Date:</strong> October 6, 2023

**Group Number:** 69

| Name           | Student Number | CS Alias (Userid) | Preferred E-mail Address   |
|----------------|----------------|-------------------|-----------------------------|
| Allison Jiao   | 63646590       | y4j5h             | alli0n@student.ubc.ca      |
| Manjot Singh    | 78562972       | b3r7o             | manjjott@student.ubc.ca     |
| William Sun    | 74695198       | p9k3b             | williamsunedu1617@gmail.com |




<h2>Project Description:</h2>

The project proposes a National Census Management system, to efficiently store, analyze and
manage the census data. The domain of the application(survey/census taking/population
management). The main goal is to facilitate the collection, management, and analysis of
national population and housing census data.
<ul>
<li>Demographic data collection: The collection involves collecting the data about
  individuals, their households, age, name, gender etc. </li>
<li> Geographical Data: The project will tend to cover the aspect of population density,
  average income. </li>
<li>Policy allocation and management: The demographic data can enable the policy making
  decision to tackle any specific tasks such as policy making and resource allocation.</li>
  </ul>
<h2>Domains Modelled: </h2>
The project tries to record data from the general population of Canada. Census data to crucial
for municipal and provincial planners to better cater services in their community. On a
community level, the database will provide city and provincial planners with better insight into
the socioeconomic statistics in the community they serve.
In real-life context,
<ul> <li>Public health planing: using the collected data government can identify the area with
  more elderly population, and plan healthcare for the more elderly population. </li>
<li> Education and infrastructure policy: using the collected data it is easy to identify the
regions with low-education/high-unemployment level that allows adequate funding and
  development of educational/occupational infrastructure at those regions. </li>
<li> Public Education: using the collected data neighbourhoods with higher rates of poverty
and single parent households with children can receive more supplementary funding in
  their schooling. </li>
  </ul>

<h2>Database Specifications:</h2>
The census database is used for national census data collection. The database organizes the
information using different filters, for example gender, age, income, occupation, marital status,
education level, ethnicity. The statistics are analyzed and calculated with mean, median,
variance, standard deviation to better represent the data and easier for data visualization.
The Database will allow the user to enter their information such as age, gender, occupation,
income , marital status etc.
Registration and Login System:
Users will be able to login and enter their data securely, and access , update the data as
required.
Data Management:
Database will allow certain users to be admin, who can access other user data, and delete their
data.

 
<p>
  <h3>Application Platform: </h3>
Database: Oracle (Department provided)

  Tech stack: JavaScript (Frontend), Express.js + Node.js (Backend) </p>

<h2>Appendix - Project Explanation:</h2>

<h2>Entities:</h2>

<h3>1. Individual</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>SIN(PK), Individual Name, Age, Gender, Birthplace, Ethnicity</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Belongs to Household, Speaks Language, Has Occupation, Attained Education Level</td>
    </tr>
</table>

<h3>2. Household</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>Address(PK), Postal Code(PK), NumberOfMembers, TotalIncome</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Belongs to Individual, Located in Electoral district, Located in city</td>
    </tr>
</table>

<h3>3. City</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>Name (PK), Province(PK), Population</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Contains Households</td>
    </tr>
</table>

<h3>4. Electoral District</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>Name (PK), MP, MP party</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Contains Households</td>
    </tr>
</table>

<h3>5. EducationLevel</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>EducationID (PK), LevelName, AverageIncome</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Individual has education</td>
    </tr>
</table>

<h3>6. MaritalStatus</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>StatusID (PK), StatusName, AverageAgeOfMarriage</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>Individual Marital Status</td>
    </tr>
</table>

<h3>7. Language Spoken (Weak Entity)</h3>
<table>
    <tr>
        <th>Attributes</th>
        <td>Language Name (Primary Key)</td>
    </tr>
    <tr>
        <th>Relationships</th>
        <td>spoken in the household</td>
    </tr>
</table>

<h3>ISA Hierarchy:</h3>
<h4>8. Occupation</h4>
<ul>
    <li>Employed
        <ul>
            <li>Attributes: Employer, JobTitle</li>
        </ul>
    </li>
    <li>Unemployed
        <ul>
            <li>Attributes: SeekingEmployment (Boolean)</li>
        </ul>
    </li>
    <li>Student
        <ul>
            <li>Attributes: InstitutionName, LevelOfStudy</li>
        </ul>
    </li>
    <li>Retired
        <ul>
            <li>Attributes: AgeAtRetirement</li>
        </ul>
    </li>
</ul>



<h2>Relationships:</h2>

<table>
    <tr>
        <th>S.No</th>
        <th>From</th>
        <th>Relationship</th>
        <th>To</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Individual</td>
        <td>Belongs to</td>
        <td>Household</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Household</td>
        <td>Located in</td>
        <td>City</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Household</td>
        <td>Located in</td>
        <td>Electoral district</td>
    </tr>
    <tr>
        <td>4</td>
        <td>Individual</td>
        <td>Has</td>
        <td>Occupation</td>
    </tr>
    <tr>
        <td>5</td>
        <td>Individual</td>
        <td>Attained</td>
        <td>EducationLevel</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Individual</td>
        <td>Holds</td>
        <td>MaritalStatus</td>
    </tr>
    <tr>
        <td>7</td>
        <td>Individual</td>
        <td>Spoken</td>
        <td>Language</td>
    </tr>
</table>



