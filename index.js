const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const commaNumber = require('comma-number');
const { default: ListPrompt } = require('inquirer/lib/prompts/list');
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


function insertRole(title, salary, department_id) {
    connection.query('INSERT INTO roles SET ?', new Role(title, salary, department_id), (err, res) => {
        if (err) throw err;
        console.log(`${title} to Roles was added`);
        init();
    });
}
 

function addEmployee() {
    const rolesData = [];
    const rolesName = [];

    const employeesData = [];
    const employeesNames = ['No Manager'];

    getRolesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                employeesData.push(data[i]);
                employeesNames.push(data[i].role)
            }

            getEmployeesAsync()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    employeesData.push(data[i]);
                    employeesNames.push(data[i].last_name)
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'what is the employees first name?',
            default: () => { },
            validate: firstName => {
                let valid = /^[a-zA-Z0-9 ]{1,30$}/.test(firstName);
                if (!valid) {
                    return console.log('your title must be between 1 and 30 characters.')
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'what is the employees first name?',
            default: () => { },
            validate: lastName => {
                let valid = /^[a-zA-Z0-9 ]{1,30$}/.test(lastName);
                if (!valid) {
                    return console.log('your title must be between 1 and 30 characters.')
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: `what is the employees role?`,
            choices: rolesName
        },
        {
            type: 'list',
            name: 'manager',
            message: `who is the employees manager?`,
            choices: rolesName
        },
    ]).then(answers => {
        let roleId;
        let managerId;

        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }
        
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.role === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            } else if (answers.manager === 'No Manager') {
                managerId = null;
            }
        }
        insertEmployee(answers.firstName, answers.lastName, roleId, managerId);
    });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
    connection.query('INSERT INTO employees SET ?', new Employee(firstName, lastName, roleId, managerId), (err, res) => {
        if (err) throw err;
        console.log(`${firstName} ${lastName} hass been added`)
        init();
    });
}

function viewRoles() {
    connection.query(`SELECT r.title AS 'Role', r.id AS 'ID', d.name AS 'Department', r.salary AS 'salary'
                        FROM roles r JOIN departments d ON r.deparment_id = d.id ORDER BY r.department_id`,
                
                (err, res) => {
                    console.log('\n\n')
                    console.table(res);
                    init();
                });
}

function viewEmployees() {
    inquirer.prompt([
        {
            name: 'sortby',
            type: 'list',
            message: 'How would you like to sort the employees?',
            choices: ['Last name', 'Manager', 'Department']
        }
    ]).then((answers) => {
        switch (answers.sortBy) {
            case 'Last name': sortByLastName();
            break;

            case 'Manager': sortByManager();
            break;

            case 'Department': sortByDepartment();
            break;
        }
    })
}

function sortByLastName() {
    connection.query(`SELECT e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role', r.Salary', d.name AS 'Department'
                    FROM employees e JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id ORDER BY e.last_name`,
                    (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        init();
                    });
}

function sortByManager() {
    connection.query(`SELECT e.last_name AS 'Employee Last Name', e.first_name AS 'First Name', e.id AS 'ID', m.last_name AS 'Manager'
                    FROM employees e LEFT JOIN employees m on e.manager_id = m.id ORDER BY m.last_name, e.last_name`,
                    (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        init();
                    });
}

function sortByDepartment() {
    connection.query(`SELECT d.name AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role', r.salary AS 'Salary'
                    FROM employees e JOIN roles r on e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id ORDER BY d.name, e.last_name`,
                    (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        init();
                    });
}
                        

function updateEployee() {
    const rolesData = [];
    const rolesName = [];
    const employeesData = [];
    const employeesNames = [];

    getRolesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                rolesData.push(data[i]);
                rolesName.push(data[i].role)
            }

            getEmployeesAsync()
                .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        employeesData.push(data[i]);
                        employeesNames.push(data[i].last_name)
                    }
                    updateEployeeQuestions(rolesData, rolesName, employeesData, employeesNames);
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err);
        });
}


function updateEployeeQuestions(rolesData, rolesName, employeesData, employeesNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'which employee would you like to update?',
            choices: employeesNames,
            pageSize: 12
        },
        {
            type: 'list',
            name: 'update',
            message: 'what information would you like to update?',
            choices: [`Employees role`, `Employees manager`, `Cancel`]
        }
    ]).then(answers => {
        let employeeId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.employee === employeesData[i].last_name) {
                employeeId = employeesData[i].id;
            }
        }
        if (answers.update === `Employee's role`) {
            getNewRoleId(employeeId, rolesData, rolesName)
        }else if (answers.update === `Employees manager`) {
            employeesNames.push('No Manager');
            getManagerId(employeeId, employeesData, employeesNames)
        } else {
            init();
        }
    })
}

function getNewRoleId(employeeId, rolesData, rolesName) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: `What is the employees new role?`,
            choices: rolesName,
            pageSize: 12
        }
    ]).then(answers => {
        let roleId;
        for (let i =0; i < rolesData.length; i++){
            if(answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }
        updateEployeeRole(employeeId, roleId)
    })
}

