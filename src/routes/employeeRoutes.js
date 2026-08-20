import express from "express";
import EmployeeController from "../controllers/EmployeeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { validateEmployee } from "../middleware/employeeValidation.js";

const router = express.Router();

// GET all employees - HR only hasaccess to get all employee information
router.get(
    "/",
    verifyToken,
    allowRoles("HR"),
    EmployeeController.getEmployees
);

// GET one employee - HR only has access to get employee information by ID
router.get(
    "/:id",
    verifyToken,
    allowRoles("HR"),
    EmployeeController.getEmployeeById
);

// CREATE employee - HR only has access to create employee information
router.post(
    "/",
    verifyToken,
    allowRoles("HR"),
    validateEmployee,
    EmployeeController.createEmployee
);

// UPDATE employee - HR only has access to update employee information
router.put(
    "/:id",
    verifyToken,
    allowRoles("HR"),
    validateEmployee,
    EmployeeController.updateEmployee
);

// DELETE employee - HR only has access to delete employee information
router.delete(
    "/:id",
    verifyToken,
    allowRoles("HR"),
    EmployeeController.deleteEmployee
);

export default router;