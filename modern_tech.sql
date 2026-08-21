CREATE DATABASE modern_tech;
USE modern_tech;

CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    employment_history TEXT,
    contact VARCHAR(150)
);

INSERT INTO employees
(employee_id, name, position, department, salary, employment_history, contact)
VALUES
(1, 'Sibongile Nkosi', 'Software Engineer', 'Development', 70000.00, 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@moderntech.com'),
(2, 'Lungile Moyo', 'HR Manager', 'HR', 80000.00, 'Joined in 2013, promoted to Manager in 2017', 'lungile.moyo@moderntech.com'),
(3, 'Thabo Molefe', 'Quality Analyst', 'QA', 55000.00, 'Joined in 2018', 'thabo.molefe@moderntech.com'),
(4, 'Keshav Naidoo', 'Sales Representative', 'Sales', 60000.00, 'Joined in 2020', 'keshav.naidoo@moderntech.com'),
(5, 'Zanele Khumalo', 'Marketing Specialist', 'Marketing', 58000.00, 'Joined in 2019', 'zanele.khumalo@moderntech.com'),
(6, 'Sipho Zulu', 'UI/UX Designer', 'Design', 65000.00, 'Joined in 2016', 'sipho.zulu@moderntech.com'),
(7, 'Naledi Moeketsi', 'DevOps Engineer', 'IT', 72000.00, 'Joined in 2017', 'naledi.moeketsi@moderntech.com'),
(8, 'Farai Gumbo', 'Content Strategist', 'Marketing', 56000.00, 'Joined in 2021', 'farai.gumbo@moderntech.com'),
(9, 'Karabo Dlamini', 'Accountant', 'Finance', 62000.00, 'Joined in 2018', 'karabo.dlamini@moderntech.com'),
(10, 'Fatima Patel', 'Customer Support Lead', 'Support', 58000.00, 'Joined in 2016', 'fatima.patel@moderntech.com');

CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    hours_worked INT,
    leave_deductions INT,
    final_salary DECIMAL(10,2),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO payroll
(employee_id, hours_worked, leave_deductions, final_salary)
VALUES
(1, 160, 8, 69500.00),
(2, 150, 10, 79000.00),
(3, 170, 4, 54800.00),
(4, 165, 6, 59700.00),
(5, 158, 5, 57850.00),
(6, 168, 2, 64800.00),
(7, 175, 3, 71800.00),
(8, 160, 0, 56000.00),
(9, 155, 5, 61500.00),
(10, 162, 4, 57750.00);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO attendance
(employee_id, attendance_date, status)
VALUES
(1, '2025-07-25', 'Present'),
(1, '2025-07-26', 'Absent'),
(1, '2025-07-27', 'Present'),
(1, '2025-07-28', 'Present'),
(1, '2025-07-29', 'Present'),

(2, '2025-07-25', 'Present'),
(2, '2025-07-26', 'Present'),
(2, '2025-07-27', 'Absent'),
(2, '2025-07-28', 'Present'),
(2, '2025-07-29', 'Present'),

(3, '2025-07-25', 'Present'),
(3, '2025-07-26', 'Present'),
(3, '2025-07-27', 'Present'),
(3, '2025-07-28', 'Absent'),
(3, '2025-07-29', 'Present'),

(4, '2025-07-25', 'Absent'),
(4, '2025-07-26', 'Present'),
(4, '2025-07-27', 'Present'),
(4, '2025-07-28', 'Present'),
(4, '2025-07-29', 'Present'),

(5, '2025-07-25', 'Present'),
(5, '2025-07-26', 'Present'),
(5, '2025-07-27', 'Absent'),
(5, '2025-07-28', 'Present'),
(5, '2025-07-29', 'Present'),

(6, '2025-07-25', 'Present'),
(6, '2025-07-26', 'Present'),
(6, '2025-07-27', 'Absent'),
(6, '2025-07-28', 'Present'),
(6, '2025-07-29', 'Present'),

(7, '2025-07-25', 'Present'),
(7, '2025-07-26', 'Present'),
(7, '2025-07-27', 'Present'),
(7, '2025-07-28', 'Absent'),
(7, '2025-07-29', 'Present'),

(8, '2025-07-25', 'Present'),
(8, '2025-07-26', 'Absent'),
(8, '2025-07-27', 'Present'),
(8, '2025-07-28', 'Present'),
(8, '2025-07-29', 'Present'),

(9, '2025-07-25', 'Present'),
(9, '2025-07-26', 'Present'),
(9, '2025-07-27', 'Present'),
(9, '2025-07-28', 'Absent'),
(9, '2025-07-29', 'Present'),

(10, '2025-07-25', 'Present'),
(10, '2025-07-26', 'Present'),
(10, '2025-07-27', 'Absent'),
(10, '2025-07-28', 'Present'),
(10, '2025-07-29', 'Present');

CREATE TABLE leave_requests (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_date DATE NOT NULL,
    reason VARCHAR(100),
    status ENUM('Pending', 'Approved', 'Denied') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO leave_requests
(employee_id, leave_date, reason, status)
VALUES
(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),

(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),

(3, '2025-07-10', 'Medical Appointment', 'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),

(4, '2025-07-20', 'Bereavement', 'Approved'),

(5, '2024-12-01', 'Childcare', 'Pending'),

(6, '2025-07-18', 'Sick Leave', 'Approved'),

(7, '2025-07-22', 'Vacation', 'Pending'),

(8, '2024-12-02', 'Medical Appointment', 'Approved'),

(9, '2025-07-19', 'Childcare', 'Denied'),

(10, '2024-12-03', 'Vacation', 'Pending');

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('HR', 'Manager', 'Employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- employee_id is a foreign key
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO users (employee_id, email, password, role, created_at)
VALUES
(1, 'hr@moderntech.co.za', '$2b$10$EeXFwT7rsYCYbZeAUM7qM.zsmHrleDgT8HLcoMu9SFPAyookDrFbO', 'HR', '2026-08-14 07:49:33'),
(2, 'manager@moderntech.co.za', '$2b$10$EeXFwT7rsYCYbZeAUM7qM.zsmHrleDgT8HLcoMu9SFPAyookDrFbO', 'Manager', '2026-08-14 07:49:33'),
(3, 'employee@moderntech.co.za', '$2b$10$EeXFwT7rsYCYbZeAUM7qM.zsmHrleDgT8HLcoMu9SFPAyookDrFbO', 'Employee', '2026-08-14 07:49:33');