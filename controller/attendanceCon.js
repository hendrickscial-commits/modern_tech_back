import { getAttendance } from '../model/attendanceDb.js'
import { getAttendanceById } from '../model/attendanceDb.js'
import { getAttendanceByDate } from '../model/attendanceDb.js'

// Get attendance for all employees
export const getAttendanceCon = async (req, res) => {
  try {
    const result = await getAttendance();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting attendance:", error);
    res.status(500).json({ message: "Failed to get attendance", error: error.message });
  }
}

// Get attendance by employee id
export const getAttendanceByIdCon = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const result = await getAttendanceById(employee_id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting attendance by employee ID:", error);
    res.status(500).json({ message: "Failed to get attendance", error: error.message });
  }
}

// Get attendance of employees by date
export const getAttendanceByDateCon = async (req, res) => {
  try {
    const attendance_date = req.params.attendance_date;
    const result = await getAttendanceByDate(attendance_date);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting attendance by date:", error);
    res.status(500).json({ message: "Failed to get attendance by date", error: error.message });
  }
}