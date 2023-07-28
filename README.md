# Identity Reconcilation
This repository contains the backend code for Bitespeed identity reconciliation. The code is written in Typescript, uses [Express](https://expressjs.com/) as the web framework and [Sequlize](https://sequelize.org/) as the ORM. The database used is [MySQL](https://www.mysql.com/). The application is hosted on https://identity-reconciliation-3ae8819e2c92.herokuapp.com

# Pre-requisites
1. Install [Node.js](https://nodejs.org/en/download/)
2. Install [MySQL](https://dev.mysql.com/downloads/installer/)
3. Install [Postman](https://www.postman.com/downloads/)

# Steps for installation
1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Create a database in MySQL
4. Create a `.env` file in the root directory of the project and add the following variables:
```
PORT=3000
NODE_ENV=dev
DB_NAME=bitespeed
DB_USER=root
DB_HOST=127.0.0.1
DB_PASS=root
```
5. Run `npm run start` to start the server


# Testing the API
Open Postman and trigger POST request to `http://localhost:3000/identify` with the following request body:
```
{
	"email": "mcfly@hillvalley.edu",
	"phoneNumber": "123456"
}
```
You should get a response like this:
```
{
    "contact": {
        "primaryContatctId": 6,
        "emails": [
            "lorraine@hillvalley.edu",
            "mcfly@hillvalley.edu"
        ],
        "phoneNumbers": [
            "123456"
        ],
        "secondaryContactIds": [
            6
        ]
    }
}
```