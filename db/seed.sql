USE company_db;

INSERT INTO departments(name)
VALUES('Sales'),
('Marketing'),
('Hr');

INSERT INTO roles(title, salary, department_id)
VALUES('Sales Lead', 91234.67, 1),
('Associate Sales', 45183.20, 1),
('senior Project Manager', 124309.99, 2),
('Associate Project Manager', 80394.89, 2),
('HR Manager', 83918.78, 3),
('Executive Assistant', 43291.50, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Ted', 'White', 1, NULL),
('Emily', 'Blue',1 , NULL),
('Jake', 'Green',2 , 1),
('Alysa', 'Red', 3, NULL),
('Amanda', 'Black', 4, 4),
('Leo', 'Yellow',5 , NULL),
('Adam', 'Blue', 6, 7),
('Josh', 'Green', 6, 7),