import EmployeeModel from "../models/EmployeeModel.js";

class EmployeeController {

    // GET all employees
    static async getEmployees(req, res) {

        try {

            const employees = await EmployeeModel.getAllEmployees();

            res.status(200).json(employees);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get employees"
            });

        }
    }


    // GET one employee
    static async getEmployeeById(req, res) {

        try {

            const { id } = req.params;

             if (
            req.user.role === "Employee" &&
            req.user.employeeId != id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

            const employee =
                await EmployeeModel.getEmployeeById(id);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            res.status(200).json(employee);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to get employee"
            });

        }
    }

    // POST employee
    static async createEmployee(req, res) {

        try {

            const employeeId =
                await EmployeeModel.createEmployee(req.body);

            res.status(201).json({
                message: "Employee created successfully",
                employeeId: employeeId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to create employee"
            });

        }
    }


    // PUT employee
    static async updateEmployee(req, res) {

        try {

            const { id } = req.params;

            const employee =
                await EmployeeModel.getEmployeeById(id);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            await EmployeeModel.updateEmployee(id, req.body);

            res.status(200).json({
                message: "Employee updated successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to update employee"
            });

        }
    }


    // DELETE employee
    static async deleteEmployee(req, res) {

        try {

            const { id } = req.params;

            const employee =
                await EmployeeModel.getEmployeeById(id);

            if (!employee) {

                return res.status(404).json({
                    message: "Employee not found"
                });

            }

            await EmployeeModel.deleteEmployee(id);

            res.status(200).json({
                message: "Employee deleted successfully"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to delete employee"
            });

        }
    }

}

export default EmployeeController;