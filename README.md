# Smart Surveying Device

![Logo](docs/images/device.png "This is the logo")

The Smart Surveying Device is an innovative solution addressing the inefficiencies in land surveying, boundary marking, and construction layout tasks. It automates stake placement with high precision, reducing both manual labor and project costs.

### Enable GitHub Pages

You can put the things to be shown in GitHub pages into the _docs/_ folder. Both html and md file formats are supported. You need to go to settings and enable GitHub pages and select _main_ branch and _docs_ folder from the dropdowns, as shown in the below image.


### Special Configurations

These projects will be automatically added into [https://projects.ce.pdn.ac.lk](). If you like to show more details about your project on this site, you can fill the parameters in the file, _/docs/index.json_

```
{
  "title": "Smart Surveying Device",
  "team": [
    {
      "name": "Jayasingha B.V.R.R",
      "email": "e20168@eng.pdn.ac.lk",
      "eNumber": "E/20/168"
    },
    {
      "name": "Malinga G.A.I",
      "email": "e20242@eng.pdn.ac.lk",
      "eNumber": "E/20/242"
    },
    {
      "name": "Padeniya S.M.N.N",
      "email": "e20276@eng.pdn.ac.lk",
      "eNumber": "E/20/276"
    },
    {
      "name": "Seneviratne G.S",
      "email": "e20369@eng.pdn.ac.lk",
      "eNumber": "E/20/369"
     }
  ],
  "supervisors": [
    {
      "name": "Dr. Isuru Nawinne",
      "email": "isurunawinne@eng.pdn.ac.lk"
    }
  ],
  "tags": ["Web", "Embedded Systems"]
}
```

Once you filled this _index.json_ file, please verify the syntax is correct. (You can use [this](https://jsonlint.com/) tool).

### Page Theme

A custom theme integrated with this GitHub Page, which is based on [github.com/cepdnaclk/eYY-project-theme](https://github.com/cepdnaclk/eYY-project-theme). If you like to remove this default theme, you can remove the file, _docs/\_config.yml_ and use HTML based website.


## Database Structure - MongoDB ER Model

### Overview

This project utilizes a MongoDB-based NoSQL database optimized for a document-oriented approach. The system efficiently manages Users, Projects, Points, and Devices by leveraging references between collections and embedding where appropriate to ensure scalability and flexibility.
        Users and Projects → Referenced using User_Id
        Projects and Points → Referenced using Project_Id
        Projects and Devices → Devices are embedded inside Projects

### Database Schema Design
#### User Collection

Each User document contains essential details. Projects are stored separately and referenced using User_Id.

```
{
  "User_Id": 1,
  "Email": "user@example.com",
  "Password": "hashed_password",
  "Role": "admin",
  "Created_At": "2024-02-22",
  "Last_Login": "2024-02-23"
}

```
#### Project Collection (Referenced from User)
Each Project is stored separately and references a User_Id. The Devices used in a project are embedded inside the document
```
{
  "Project_Id": 101,
  "User_Id": 1,  // Reference to User collection
  "Name": "Project 1",
  "Created_On": "2024-02-20",
  "Last_Modified": "2024-02-22",
  "Status": "Completed",
  "Survey_Time": "12:00:00",
  "Description": "Road surver day-1",
  "Total_Points": 100,
  "Devices": [
    {
      "Name": "Device A",
      "Status": "Online",
      "Type": "Base",
      "Battery_Percentage": 90,
      "Signal_Strength": "Good",
      "Last_Update": "2024-02-22",
      "Hardware_Id": 301
    }
  ]  // Embedded devices
}
```

#### Point Collection (Referenced from Project)
Each Point represents a geographic location where survey data is collected. Instead of being embedded, each Point document references a Project_Id.
```
{
  "Point_Id": 5001,
  "Project_Id": 101,  // Reference to Project collection
  "Name": "Location 1",
  "Type": "Sensor Data",
  "Latitude": 45.1234,
  "Longitude": 93.1234,
  "Survey_Id": 25,
  "Accuracy": 1.5,
  "Timestamp": "12:05:00"
}

```

#### Device (Embedded in Project)
Devices are embedded inside Projects because they are tightly coupled with them, reducing unnecessary joins.
```
{
  "Name": "Device A",
  "Status": "Online",
  "Type": "Base",
  "Battery_Percentage": 90,
  "Signal_Strength": "Good",
  "Last_Update": "2024-02-22",
  "Hardware_Id": 301
}
```
### Entity-Relationship Diagram (ERD)



