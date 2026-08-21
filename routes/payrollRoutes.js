import express from "express";

import {
    getPayrollCon,
    getPayrollByIdCon,
    addPayrollCon,
    updatePayrollCon,
    deletePayrollCon
} from "../controller/payrollCon.js";

const router = express.Router();

router.get("/", getPayrollCon);

router.get("/:id", getPayrollByIdCon);

router.post("/", addPayrollCon);

router.put("/:id", updatePayrollCon);

router.delete("/:id", deletePayrollCon);

export default router;