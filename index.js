const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const commaNumber = require('comma-number');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js')
const Employee = require(__dirname + '/classes/Employee.js')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_db'
});

console.log("***********************************")
console.log("*                                 *")
console.log("*        EMPLOYEE TRACKER         *")
console.log("*                                 *")
console.log("***********************************")
connection.connect();
init();

function init() {
    console.log('\n\n')
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What do you want to do?',
            choices: ['View Departments', 'View Roles', 'View Employees', 'View Department Budget', 'Update Employee', 'Add Department', 'Add Role', 'Add Employe', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit Employee Tracker'],
            pageSize: 12
        }
        ]).then((answers) => {
            switch (answers.init) {
                case 'Exit Employee Tracker':
                    connection.end();
                    console.log('GoodBye');
                    break;
                case 'Update Employee': updateEployee();
                break;
                
                case 'Add Department': addDepartment();
                break;
                
                case 'Add Role': addRole();
                break;

                case 'Add Employee': addEmployee();
                break;

                case 'View Department': viewDepartment();
                break;

                case 'view Roles': viewRoles();
                break;

                case 'view Department Budget': viewDepartmentBudget();
                break;

                case 'Delet Employee': deleteEmployee();
                break;

                case 'Delete Department': deleteDepartment();
                break;

                case 'Delete Role': deleteRole();
                break;
            }
        })
}


