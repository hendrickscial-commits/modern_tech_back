import {getLeave} from '../model/leaveDb.js'
import {getLeaveById} from '../model/leaveDb.js'
import {acceptLeave} from '../model/leaveDb.js'
import {denyLeave} from '../model/leaveDb.js'
import {postLeave} from '../model/leaveDb.js'
import {getAttendance} from '../model/leaveDb.js'
import {getAttendanceById} from '../model/leaveDb.js'
import {getAttendanceByDate} from '../model/leaveDb.js'

//Get all leave requests
export const getLeaveCon = async (req, res) => {
  res.json(await getLeave());
}

//Get leave requests by employee ID
export const getLeaveByIdCon = async (req, res) => {
  const employee_id = req.params.employee_id;
  res.json(await getLeaveById(employee_id));
}


//Accept or deny leave requests by leave ID
export const acceptLeaveCon = async (req, res) => {
  const leave_id = req.params.leave_id;
  res.json(await acceptLeave(leave_id));
}

export const denyLeaveCon = async (req, res) => {
  const leave_id = req.params.leave_id;
  res.json(await denyLeave(leave_id));
}

//Add a new leave request
export const postLeaveCon = async (req, res) => {
  const { employee_id, leave_date, reason } = req.body;
  res.json(await postLeave(employee_id, leave_date, reason));
}

//Get attendance for all employees
export const getAttendanceCon = async (req, res) => {
  res.json(await getAttendance());
}

//Get attendance by employee id
export const getAttendanceByIdCon = async (req, res) => {
  const employee_id = req.params.employee_id;
  res.json(await getAttendanceById(employee_id));
}

//Get attendance of employees by date
export const getAttendanceByDateCon = async (req, res) => {
  
  const attendance_date = req.params.attendance_date;
  console.log("Date from URL:", attendance_date);

    const result = await getAttendanceByDate(attendance_date);

    console.log("Result from database:", result);

    res.json(result);
}