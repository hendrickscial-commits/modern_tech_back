import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(2020, () => {
  console.log("http://localhost:2020");
});
