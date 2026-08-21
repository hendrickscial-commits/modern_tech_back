import pool from "../config/database.js";

class EmployeeModel {

    // GET all employees
    static async getAllEmployees() {

        const [rows] = await pool.execute(`
            SELECT *FROM employees ORDER BY employee_id ASC;`);

        return rows;
    }

    // GET one employee
    static async getEmployeeById(id) {

        const [rows] = await pool.execute(`
            SELECT *FROM employees WHERE employee_id = ?;`, [id]);

        return rows[0] || null;
    }

    // CREATE employee
    static async createEmployee(employeeData) {

    const { 
        name,
        position,
        department,
        salary,
        employment_history,
        contact
    } = employeeData;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT COALESCE(MAX(employee_id), 0) + 1 AS employeeId FROM employees FOR UPDATE`);

        const employeeId = rows[0].employeeId;

        await connection.execute(
            `INSERT INTO employees
            (employee_id, name, position, department, salary, employment_history, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                employeeId,
                name,
                position,
                department,
                salary,
                employment_history,
                contact
            ]
        );

        await connection.commit();
        return employeeId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

    // UPDATE employee
    static async updateEmployee(id, employeeData) {

        const {
            name,
            position,
            department,
            salary,
            employment_history,
            contact
        } = employeeData;

        await pool.execute(`
            UPDATE employees
            SET
                name = ?,
                position = ?,
                department = ?,
                salary = ?,
                employment_history = ?,
                contact = ?
            WHERE employee_id = ?;
        `, [
            name,
            position,
            department,
            salary,
            employment_history,
            contact,
            id
        ]);
    }


    // DELETE employee
    static async deleteEmployee(id) {

        await pool.execute(`DELETE FROM employees WHERE employee_id = ?;`, [id]);
    }
}
export default EmployeeModel;
