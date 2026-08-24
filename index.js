import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import {
  getLeaveCon,
  getLeaveByIdCon,
  acceptLeaveCon,
  denyLeaveCon,
  postLeaveCon,
} from "./controller/leaveCon.js";
import {
  getAttendanceCon,
  getAttendanceByIdCon,
  getAttendanceByDateCon,
} from "./controller/attendanceCon.js";

import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import "./config/database.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Get all leave requests
app.get("/leave", getLeaveCon);

//Get leave requests by employee ID
app.get("/leave/:employee_id", getLeaveByIdCon);

//Accept or deny leave requests by leave ID
app.put("/leave/:leave_id/accept", acceptLeaveCon);
app.put("/leave/:leave_id/deny", denyLeaveCon);

//Add a new leave request
app.post("/leave", postLeaveCon); //Go to body and add a request in thunder client

//Get attendance for all employees
app.get("/attendance", getAttendanceCon);

//Get attendancde of employees by date
app.get("/attendance/a/:attendance_date", getAttendanceByDateCon);

//Gett attendance by employee id
app.get("/attendance/:employee_id", getAttendanceByIdCon);

// Employee routes
app.use("/employees", employeeRoutes);
app.use("/api/employees", employeeRoutes);

// Performance routes
app.use("/api/performance", performanceRoutes);

//Auth routes
app.use("/auth", authRoutes);

// Payroll routes
app.use("/payroll", payrollRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "ModernTech HR Backend API is running",
  });
});

const PORT = process.env.PORT || 2020;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
