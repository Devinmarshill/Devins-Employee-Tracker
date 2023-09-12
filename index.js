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
        .then((answers) => {
            if (answers.choices === "View all Employees") {
                viewEmployees()
            } else if (answers.choices === "Add an Employee") {
                addEmployees()
            } else if (answers.choices === "Update an Employee Role") {
                updateEmployee()
            }
            else if (answers.choices === "View all Departments") {
                viewDepartments()
            } else if (answers.choices === "Add a Department") {
                addDepartment()
            }
            else if (answers.choices === "View all Roles") {
                viewRoles()
            } else if (answers.choices === "Add a Role") {
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
    db.query("SELECT id as value, title as name from role", (err, roleData) => {
        db.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee WHERE manager_id is null", (err, managerData) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the First Name",
                    name: "first_name",

                },
                {
                    type: "input",
                    message: "What is the last Name",
                    name: "last_name",

                },
                {
                    type: "rawlist",
                    message: "choose the following title",
                    name: "role_id",
                    choices: roleData

                },
                {
                    type: "rawlist",
                    message: "choose the following manager",
                    name: "manager_id",
                    choices: managerData

                },
            ]).then(answer => {
                db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)", [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
                    err => {
                        viewEmployees()
                    })
            })
        })
    })
}
function updateEmployee() {
    db.query("SELECT id as value, title as name from role", (err, roleData) => {
        db.query("SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee WHERE manager_id is null", (err, employeeData) => {
            inquirer.prompt([
                {
                    type: "list",
                    message: "choose the following title",
                    name: "role_id",
                    choices: roleData

                },
                {
                    type: "list",
                    message: "choose the following employee",
                    name: "employee_id",
                    choices: employeeData

                },
            ]).then(answer => {
                db.query("UPDATE employee SET role_id=? WHERE id=?", (answer.role_id, answer.employee_id), err => {
                    viewEmployees()
                })
            })
        })
    })
}
function viewDepartments() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(supervisors.first_name, ' ', supervisors.last_name) AS Manager FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id=role.department_id
LEFT JOIN employee AS supervisors ON employee.manager_id=supervisors.id;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}
function addDepartment() {
    db.query("SELECT * FROM department", (err, departmentData) => {
        db.query("SELECT id as value, CONCAT(department_id) as name FROM department WHERE department_id is null", (err, departmentData) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the Department",
                    name: "department_id",

                }
            ]).then(answer => {
                db.query("INSERT INTO department (department) VALUES(?)", [answer.department],
                    err => {
                        viewDepartments()
                    })
            })
        })
    })
}
function viewRoles() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(supervisors.first_name, ' ', supervisors.last_name) AS Manager FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id=role.department_id
LEFT JOIN employee AS supervisors ON employee.manager_id=supervisors.id;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}
function addRole() {
    db.query("INSERT into role_id as value as name from role", (err, roleData) => {
        inquirer.prompt([
            {
                type: "list",
                message: "choose the following title",
                name: "role_id",
                choices: roleData

            }
        ]).then(answer => {
            db.query("UPDATE employee SET role_id=? WHERE id=?", (answer.role_id), err => {
                viewEmployees()
            })
        })
    })
}