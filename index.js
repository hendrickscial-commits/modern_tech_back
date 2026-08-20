import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

import {
    getLeaveCon,
    getLeaveByIdCon,
    acceptLeaveCon,
    denyLeaveCon,
    postLeaveCon
} from "./controller/leaveCon.js";

import {
    getAttendanceCon,
    getAttendanceByIdCon,
    getAttendanceByDateCon
} from "./controller/attendanceCon.js";

import payrollRoutes from "./routes/payrollRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2020;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = __dirname;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(frontendPath));
app.use(express.static(path.join(__dirname, "public")));

app.use("/employees", employeeRoutes);
app.use("/auth", authRoutes);
app.use("/payroll", payrollRoutes);

app.get("/leave", getLeaveCon);
app.get("/leave/:employee_id", getLeaveByIdCon);
app.put("/leave/:leave_id/accept", acceptLeaveCon);
app.put("/leave/:leave_id/deny", denyLeaveCon);
app.post("/leave", postLeaveCon);

app.get("/attendance", getAttendanceCon);
app.get("/attendance/a/:attendance_date", getAttendanceByDateCon);
app.get("/attendance/:employee_id", getAttendanceByIdCon);

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});