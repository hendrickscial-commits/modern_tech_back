const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async (req, res) => {
    try {
        const [payroll] = await db.query('SELECT * FROM payroll');

        res.json({
            success: true,
            data: payroll
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payroll records'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [payroll] = await db.query(
            'SELECT * FROM payroll WHERE payroll_id = ?',
            [id]
        );

        if (payroll.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        res.json({
            success: true,
            data: payroll[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payroll record'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        } = req.body || {};

        if (
            employee_id === undefined ||
            hours_worked === undefined ||
            leave_deductions === undefined ||
            final_salary === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'All payroll fields are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO payroll
            (employee_id, hours_worked, leave_deductions, final_salary)
            VALUES (?, ?, ?, ?)`,
            [
                employee_id,
                hours_worked,
                leave_deductions,
                final_salary
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Payroll record added successfully',
            payroll_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to add payroll record'
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            employee_id,
            hours_worked,
            leave_deductions,
            final_salary
        } = req.body || {};

        if (
            employee_id === undefined ||
            hours_worked === undefined ||
            leave_deductions === undefined ||
            final_salary === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'All payroll fields are required'
            });
        }

        const [result] = await db.query(
            `UPDATE payroll
             SET employee_id = ?,
                 hours_worked = ?,
                 leave_deductions = ?,
                 final_salary = ?
             WHERE payroll_id = ?`,
            [
                employee_id,
                hours_worked,
                leave_deductions,
                final_salary,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        res.json({
            success: true,
            message: 'Payroll record updated successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to update payroll record'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM payroll WHERE payroll_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        res.json({
            success: true,
            message: 'Payroll record deleted successfully'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete payroll record'
        });
    }
});

module.exports = router;