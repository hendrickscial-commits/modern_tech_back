const express = require("express");

const router = express.Router();

const {
    getEmployees,
    getEmployeeById
} = require("../controllers/employeeController");


// GET all employees
router.get("/", getEmployees);

// GET one employee
router.get("/:id", getEmployeeById);

module.exports = router;
