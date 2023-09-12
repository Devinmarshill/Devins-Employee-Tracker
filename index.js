const inquirer=require('inquirer')
const mysql=require('mysql2')
const {printTable}= require('console-table-printer')
require('dotenv').config()

const db = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:3306
})
db.connect(()=>{
    mainMenu()
})

function mainMenu(){
    inquirer.prompt({
        type: "list",
        message: "what would you like to do?",
        name: "options",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
    })
}