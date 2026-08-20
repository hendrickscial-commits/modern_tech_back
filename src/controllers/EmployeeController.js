import EmployeeModel from "../models/EmployeeModel.js";

const demoEmployees = [
    [1, "Sibongile Nkosi", "Software Engineer", "Development", 70000, "Joined in 2015, promoted to Senior in 2018", "sibongile.nkosi@moderntech.com"],
    [2, "Lungile Moyo", "HR Manager", "HR", 80000, "Joined in 2013, promoted to Manager in 2017", "lungile.moyo@moderntech.com"],
    [3, "Thabo Molefe", "Quality Analyst", "QA", 55000, "Joined in 2018", "thabo.molefe@moderntech.com"],
    [4, "Keshav Naidoo", "Sales Representative", "Sales", 60000, "Joined in 2020", "keshav.naidoo@moderntech.com"],
    [5, "Zanele Khumalo", "Marketing Specialist", "Marketing", 58000, "Joined in 2019", "zanele.khumalo@moderntech.com"],
    [6, "Sipho Zulu", "UI/UX Designer", "Design", 65000, "Joined in 2016", "sipho.zulu@moderntech.com"],
    [7, "Naledi Moeketsi", "DevOps Engineer", "IT", 72000, "Joined in 2017", "naledi.moeketsi@moderntech.com"],
    [8, "Farai Gumbo", "Content Strategist", "Marketing", 56000, "Joined in 2021", "farai.gumbo@moderntech.com"],
    [9, "Karabo Dlamini", "Accountant", "Finance", 62000, "Joined in 2018", "karabo.dlamini@moderntech.com"],
    [10, "Fatima Patel", "Customer Support Lead", "Support", 58000, "Joined in 2016", "fatima.patel@moderntech.com"]
].map(([employee_id, name, position, department, salary, employment_history, contact]) => ({
    employee_id,
    name,
    position,
    department,
    salary,
    employment_history,
    contact
}));

class EmployeeController {

    static async getEmployees(req, res) {
        try {
            const employees = await EmployeeModel.getAllEmployees();

            return res.status(200).json(employees);

        } catch (error) {
            console.error(error);

            if (process.env.DEV_LOGIN_FALLBACK === "true") {
                return res.status(200).json(demoEmployees);
            }

            return res.status(500).json({
                message: "Failed to get employees"
            });
        }
    }

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

            return res.status(200).json(employee);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to get employee"
            });
        }
    }

    static async createEmployee(req, res) {
        try {
            const employeeId =
                await EmployeeModel.createEmployee(req.body);

            return res.status(201).json({
                message: "Employee created successfully",
                employeeId
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to create employee"
            });
        }
    }

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

            return res.status(200).json({
                message: "Employee updated successfully"
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to update employee"
            });
        }
    }

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

            return res.status(200).json({
                message: "Employee deleted successfully"
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to delete employee"
            });
        }
    }
}

export default EmployeeController;