import {pool} from '../config/config.js'

//Get all leave requests
export const getLeave = async () => {
  let [rows, columns] = await pool.query('SELECT * FROM leave_requests');
  return rows
} 

//Get leave requests by employee ID 
export const getLeaveById = async (employee_id) => {
  let [rows, columns] = await pool.query('SELECT * FROM leave_requests WHERE employee_id = ?', [employee_id]);
  return rows
}

//Accept or deny leave requests by leave ID
export const acceptLeave = async (leave_id) => {
  let [rows, columns] = await pool.query('UPDATE leave_requests SET status = "Approved" WHERE leave_id = ?', [leave_id]);
  return rows
}

export const denyLeave = async (leave_id) => {
  let [rows, columns] = await pool.query('UPDATE leave_requests SET status = "Denied" WHERE leave_id = ?', [leave_id]);
  return rows
}

//Add a new leave request
export const postLeave = async (employee_id, leave_date, reason) => {
  let [rows, columns] = await pool.query('INSERT INTO leave_requests (employee_id, leave_date, reason) VALUES (?, ?, ?)', [employee_id, leave_date, reason]);
  return rows
}