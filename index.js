import express from "express";
import {getLeaveCon, getLeaveByIdCon, acceptLeaveCon, denyLeaveCon, postLeaveCon, getAttendanceCon, getAttendanceByIdCon, getAttendanceByDateCon} from "./controller/leaveCon.js";


const app = express();
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

//Gett attendance by employee id
app.get("/attendance/:employee_id", getAttendanceByIdCon);

//Get attendancde of employees by date
app.get("/attendance/a/:attendance_date", getAttendanceByDateCon);

app.listen(2020, () => {
    console.log("http://localhost:2020");
});

