import {
    getPayroll,
    getPayrollById,
    getEmployeeSalary,
    createPayroll,
    updatePayroll,
    deletePayroll
} from '../model/payrollModel.js';

export const getPayrollCon = async (req, res) => {
    console.log("PAYROLL ROUTE WAS HIT");

    try {
        const payroll = await getPayroll();

        res.json({
            success: true,
            data: payroll
        });

    } catch (error) {
        console.error("PAYROLL ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPayrollByIdCon = async (req, res) => {
    try {
        const { id } = req.params;

        const payroll = await getPayrollById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        res.json({
            success: true,
            data: payroll
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payroll record'
        });
    }
};

export const addPayrollCon = async (req, res) => {
    try {
        const {
            employee_id,
            hours_worked,
            leave_deductions
        } = req.body || {};

        if (
            employee_id === undefined ||
            hours_worked === undefined ||
            leave_deductions === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'employee_id, hours_worked and leave_deductions are required'
            });
        }

        if (
            Number(hours_worked) < 0 ||
            Number(leave_deductions) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Hours worked and leave deductions cannot be negative'
            });
        }

        const employee = await getEmployeeSalary(employee_id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const salary = Number(employee.salary);
        const hourlyRate = salary / 160;
        const earnedSalary = hourlyRate * Number(hours_worked);
        const finalSalary = earnedSalary - Number(leave_deductions);

        if (finalSalary < 0) {
            return res.status(400).json({
                success: false,
                message: 'Final salary cannot be negative'
            });
        }

        const payrollId = await createPayroll(
            employee_id,
            hours_worked,
            leave_deductions,
            finalSalary
        );

        res.status(201).json({
            success: true,
            message: 'Payroll record added successfully',
            payroll_id: payrollId,
            final_salary: finalSalary
        });

    } catch (error) {
        console.error("ADD PAYROLL ERROR:", error);

        res.status(500).json({
            success: false,
            message: 'Failed to add payroll record'
        });
    }
};

export const updatePayrollCon = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            employee_id,
            hours_worked,
            leave_deductions
        } = req.body || {};

        if (
            employee_id === undefined ||
            hours_worked === undefined ||
            leave_deductions === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'employee_id, hours_worked and leave_deductions are required'
            });
        }

        if (
            Number(hours_worked) < 0 ||
            Number(leave_deductions) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Hours worked and leave deductions cannot be negative'
            });
        }

        const existingPayroll = await getPayrollById(id);

        if (!existingPayroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        const employee = await getEmployeeSalary(employee_id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const salary = Number(employee.salary);
        const hourlyRate = salary / 160;
        const earnedSalary = hourlyRate * Number(hours_worked);
        const finalSalary = earnedSalary - Number(leave_deductions);

        if (finalSalary < 0) {
            return res.status(400).json({
                success: false,
                message: 'Final salary cannot be negative'
            });
        }

        await updatePayroll(
            id,
            employee_id,
            hours_worked,
            leave_deductions,
            finalSalary
        );

        res.json({
            success: true,
            message: 'Payroll record updated successfully',
            final_salary: finalSalary
        });

    } catch (error) {
        console.error("UPDATE PAYROLL ERROR:", error);

        res.status(500).json({
            success: false,
            message: 'Failed to update payroll record'
        });
    }
};

export const deletePayrollCon = async (req, res) => {
    try {
        const { id } = req.params;

        const payroll = await getPayrollById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        await deletePayroll(id);

        res.json({
            success: true,
            message: 'Payroll record deleted successfully'
        });

    } catch (error) {
        console.error("DELETE PAYROLL ERROR:", error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete payroll record'
        });
    }
};