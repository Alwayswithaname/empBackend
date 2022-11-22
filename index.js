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

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'what is the name of the new department?',
            default: () => { },
            validate: name => {
                let valid = /^[a-zA-Z0-9 ]{1,30$}/.test(name);
                if (!valid) {
                    return console.log('your name must be between 1 and 30 characters.')
                }
            }
        }

    ]).then ((answers) => {
        insertDepartment(answers.name);
    });
}
 
 
function insertDepartment(newDepart) {
    connection.query('INSERT INTO department SET ?', new Department(newDepart), (err, res) => {
        if (err) throw err;
        console.log(`${newDepart} has been added to Department`);
        init();
    })
}


function addRole() {
    const array = [];
    getDepartmentsAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
        })
        .catch(err => {
            console.log(err);
        });
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'what is the title of the new role?',
            default: () => { },
            validate: title => {
                let valid = /^[a-zA-Z0-9 ]{1,30$}/.test(title);
                if (!valid) {
                    return console.log('your title must be between 1 and 30 characters.')
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'what is the salary of the new role?',
            default: () => { },
            validate: salary => {
                let valid = /^\d+(\.\d{0,2})?$/.test(salary);
                if (!valid) {
                    return console.log('please enter a valid number.')
                }} 
        },
        {
        type: 'input',
            name: 'department',
            message: 'what department is the new role in?',
            choices: array 
        }
    ]).then(answers => {
        let departmentId;
            for (let i = 0; i < array.length; i++) {
                if (answers.department === array[i].name) {
                    departmentId = array[i].id
                }
        }
        insertRole(answers.title, answers.salary, departmentId);
    })
}
            
  