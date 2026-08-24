const express = require("express");
const router = express.Router();

const db = require("../config/database");

// ==========================================
// GET ALL PERFORMANCE RECORDS
// GET /api/performance
// ==========================================
router.get("/", (req, res) => {

    const sql = `
        SELECT
            performance.performance_id,
            performance.employee_id,
            employees.name,
            employees.position,
            employees.department,
            employees.contact,
            performance.performance_score,
            performance.rating,
            performance.manager_comments,
            performance.review_date
        FROM performance
        INNER JOIN employees
            ON performance.employee_id = employees.employee_id
        ORDER BY performance.performance_id ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error fetching performance records:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch performance records"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
});


// ==========================================
// GET PERFORMANCE FOR ONE EMPLOYEE
// GET /api/performance/:employee_id
// ==========================================
router.get("/:employee_id", (req, res) => {

    const employeeId = req.params.employee_id;

    const sql = `
        SELECT
            performance.performance_id,
            performance.employee_id,
            employees.name,
            employees.position,
            employees.department,
            employees.contact,
            performance.performance_score,
            performance.rating,
            performance.manager_comments,
            performance.review_date
        FROM performance
        INNER JOIN employees
            ON performance.employee_id = employees.employee_id
        WHERE performance.employee_id = ?
    `;

    db.query(sql, [employeeId], (err, results) => {

        if (err) {
            console.error("Error fetching employee performance:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch employee performance"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Performance record not found"
            });
        }

        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
});


module.exports = router;
