import { pool } from './config/config.js';


// ==========================================
// GET ALL PAYROLL
// ==========================================

export const getPayroll = async () => {

    const [payroll] = await pool.query(`
        SELECT
            payroll.*,
            employees.name,
            employees.position,
            employees.department,
            employees.salary
        FROM payroll
        JOIN employees
            ON payroll.employee_id = employees.employee_id
        ORDER BY payroll.payroll_id ASC
    `);

    return payroll;
};


// ==========================================
// GET PAYROLL BY ID
// ==========================================

export const getPayrollById = async (id) => {

    const [payroll] = await pool.query(
        `
        SELECT
            payroll.*,
            employees.name,
            employees.position,
            employees.department,
            employees.salary
        FROM payroll
        JOIN employees
            ON payroll.employee_id = employees.employee_id
        WHERE payroll.payroll_id = ?
        `,
        [id]
    );

    return payroll[0];
};


// ==========================================
// GET EMPLOYEE SALARY
// ==========================================

export const getEmployeeSalary = async (employee_id) => {

    const [employees] = await pool.query(
        `
        SELECT salary
        FROM employees
        WHERE employee_id = ?
        `,
        [employee_id]
    );

    return employees[0];
};


// ==========================================
// CREATE PAYROLL
// ==========================================

export const createPayroll = async (
    employee_id,
    hours_worked,
    leave_deductions,
    finalSalary
) => {

    const [result] = await pool.query(
        `
        INSERT INTO payroll
        (
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            employee_id,
            hours_worked,
            leave_deductions,
            finalSalary
        ]
    );

    return result.insertId;
};


// ==========================================
// UPDATE PAYROLL
// ==========================================

export const updatePayroll = async (
    id,
    employee_id,
    hours_worked,
    leave_deductions,
    finalSalary
) => {

    const [result] = await pool.query(
        `
        UPDATE payroll
        SET
            employee_id = ?,
            hours_worked = ?,
            leave_deductions = ?,
            final_salary = ?
        WHERE payroll_id = ?
        `,
        [
            employee_id,
            hours_worked,
            leave_deductions,
            finalSalary,
            id
        ]
    );

    return result;
};


// ==========================================
// DELETE PAYROLL
// ==========================================

export const deletePayroll = async (id) => {

    const [result] = await pool.query(
        `
        DELETE FROM payroll
        WHERE payroll_id = ?
        `,
        [id]
    );

    return result;
};