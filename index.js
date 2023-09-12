const inquirer = require('inquirer')
const mysql = require('mysql2')
const { printTable } = require('console-table-printer')
require('dotenv').config()

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
})
db.connect(() => {
    mainMenu()
})

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "what would you like to do?",
        name: "choices",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
    })
        .then(answer => {
            if (answer.choices === "View all Employees") {
                viewEmployees()
            } else if (answer.choices === "Add an Employee") {
                addEmployees()
            } else if (answer.choices === "Update an Employee Role") {
                updateEmployee()
            }

        })
        .then(answer => {
            if (answer.choices === "View all Departments") {
                viewDepartments()
            } else if (answer.choices === "Add a Department") {
                addDepartment()
            }

        })
        .then(answer => {
            if (answer.choices === "View all Roles") {
                viewRoles()
            } else if (answer.choices === "Add a Role") {
                addRole()
            }

        })
}

function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(supervisors.first_name, ' ', supervisors.last_name) AS Manager FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id=role.department_id
LEFT JOIN employee AS supervisors ON employee.manager_id=supervisors.id;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}
function addEmployees() {

}
function updateEmployee() {

}
function viewDepartments() {

}
function addDepartment() {

}
function viewRoles() {

}
function addRole() {

}