USE chunks_db;

SELECT * FROM department;

SELECT role.id, title, salary, name AS department FROM role LEFT JOIN department ON department.id = role.department_id;

SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(supervisors.first_name, ' ', supervisors.last_name) AS Manager FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department.id=role.department_id
LEFT JOIN employee AS supervisors ON employee.manager_id=supervisors.id;