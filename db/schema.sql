DROP DATABASE IF EXISTS company_db;
 
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY  NOT NULL,
    name VARCHAR(40) UNIQUE NOT NULL 
    ); 


CREATE TABLE roles(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(40) UNIQUE NOT NULL,
    salary DECIMAL(11,2) UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE);

CREATE TABLE employees(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_ind (role_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_ind (manager_id),
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL);
    