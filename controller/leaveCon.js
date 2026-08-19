import { getLeave } from '../model/leaveDb.js'
import { getLeaveById } from '../model/leaveDb.js'
import { acceptLeave } from '../model/leaveDb.js'
import { denyLeave } from '../model/leaveDb.js'
import { postLeave } from '../model/leaveDb.js'

// Get all leave requests
export const getLeaveCon = async (req, res) => {
  try {
    const result = await getLeave();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting leave requests:", error);
    res.status(500).json({ message: "Failed to get leave requests", error: error.message });
  }
}

// Get leave requests by employee ID
export const getLeaveByIdCon = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const result = await getLeaveById(employee_id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting leave by employee ID:", error);
    res.status(500).json({ message: "Failed to get leave requests", error: error.message });
  }
}

// Accept leave request by leave ID
export const acceptLeaveCon = async (req, res) => {
  try {
    const leave_id = req.params.leave_id;
    await acceptLeave(leave_id);
    res.status(200).json({ message: "Request accepted!" });
  } catch (error) {
    console.error("Error accepting leave request:", error);
    res.status(500).json({ message: "Failed to accept leave request", error: error.message });
  }
}

// Deny leave request by leave ID
export const denyLeaveCon = async (req, res) => {
  try {
    const leave_id = req.params.leave_id;
    await denyLeave(leave_id);
    res.status(200).json({ message: "Request denied!" });
  } catch (error) {
    console.error("Error denying leave request:", error);
    res.status(500).json({ message: "Failed to deny leave request", error: error.message });
  }
}

// Add a new leave request
export const postLeaveCon = async (req, res) => {
  try {
    const { employee_id, leave_date, reason } = req.body;

    if (!employee_id || !leave_date || !reason) {
      return res.status(400).json({ message: "employee_id, leave_date and reason are required" });
    }

    await postLeave(employee_id, leave_date, reason);
    res.status(201).json({ message: "New request submitted!" });
  } catch (error) {
    console.error("Error posting leave request:", error);
    res.status(500).json({ message: "Failed to submit leave request", error: error.message });
  }
}