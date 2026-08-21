import {pool} from '../config/config.js'

//Get attendance for all employees
export const getAttendance = async () => {
  let [rows, columns] = await pool.query('SELECT * FROM attendance');
  return rows
} 

//Get attendance by employee id
export const getAttendanceById = async (employee_id) => {
  let [rows, columns] = await pool.query('SELECT * FROM attendance WHERE employee_id = ?', [employee_id]);
  return rows
}

//Get attendance of employees by date
export const getAttendanceByDate = async (attendance_date) => {
  let [rows, columns] = await pool.query('SELECT * FROM attendance WHERE attendance_date = ?', [attendance_date]);
  return rows
}