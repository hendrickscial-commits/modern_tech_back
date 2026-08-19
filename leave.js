const API_BASE_URL = "http://localhost:2020";

const data = {
  attendanceAndLeave: [],
};

function toYMD(input) {
  if (!input) return "";
  if (input instanceof Date) return input.toISOString().split("T")[0];
  return String(input).split("T")[0].split(" ")[0];
}

// API Helper Functions
async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return null;
  }
}

async function postToAPI(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    return null;
  }
}

async function putToAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error putting to ${endpoint}:`, error);
    return null;
  }
}

// Load data from API
async function loadDataFromAPI() {
  const leaveData = await fetchFromAPI("/leave");
  const attendanceData = await fetchFromAPI("/attendance");

  if (!leaveData || !attendanceData) {
    console.error("Failed to load data from API");
    return;
  }

  // Group data by employee_id
  const employeeMap = new Map();

  // Process attendance data
  attendanceData.forEach((record) => {
    if (!employeeMap.has(record.employee_id)) {
      employeeMap.set(record.employee_id, {
        employeeId: record.employee_id,
        name: `Employee ${record.employee_id}`,
        attendance: [],
        leaveRequests: [],
      });
    }
    const employee = employeeMap.get(record.employee_id);
    employee.attendance.push({
      date: toYMD(record.attendance_date),
      status: record.status || "Unknown",
      id: record.id,
    });
  });

  // Process leave data
  leaveData.forEach((record) => {
    if (!employeeMap.has(record.employee_id)) {
      employeeMap.set(record.employee_id, {
        employeeId: record.employee_id,
        name: `Employee ${record.employee_id}`,
        attendance: [],
        leaveRequests: [],
      });
    }
    const employee = employeeMap.get(record.employee_id);
    employee.leaveRequests.push({
      date: toYMD(record.leave_date),
      reason: record.reason,
      status: record.status || "Pending",
      id: record.leave_id,
    });
  });

  data.attendanceAndLeave = Array.from(employeeMap.values());

  const attendanceDates = data.attendanceAndLeave.flatMap((employee) =>
    employee.attendance.map((record) => record.date),
  );
  selectedDay =
    [...new Set(attendanceDates)].sort().at(-1) ||
    new Date().toISOString().split("T")[0];

  // If no data, show message
  if (data.attendanceAndLeave.length === 0) {
    console.warn("No data loaded from API");
  }
}

let selectedEmployeeId = 1;
let activeTab = "attendance";
let selectedDay = "";
let newRequestBtn;
let requestModal;
let closeModal;
let cancelBtn;
let leaveRequestForm;
let employeeSelect;
let leaveType;
let startDate;
let endDate;
let reason;

function formatDate(dateStr) {
  const ymd = toYMD(dateStr);
  if (!ymd) return "";

  const date = new Date(ymd + "T00:00:00");
  if (Number.isNaN(date.getTime())) return ymd;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateAttendancePercent(employee) {
  if (employee.attendance.length === 0) return 0;

  const present = employee.attendance.filter(
    (record) => record.status.toLowerCase() === "present",
  ).length;
  return Math.round((present / employee.attendance.length) * 100);
}

function getPendingCount(employee) {
  return employee.leaveRequests.filter((req) => req.status === "Pending")
    .length;
}

function calculateSummary() {
  const totalEmployees = data.attendanceAndLeave.length;
  const presentToday = data.attendanceAndLeave.filter((emp) =>
    emp.attendance.find(
      (a) => a.date === selectedDay && a.status === "Present",
    ),
  ).length;
  const onLeaveToday = data.attendanceAndLeave.filter((emp) =>
    emp.attendance.find(
      (a) =>
        a.date === selectedDay &&
        ["absent", "leave"].includes(a.status.toLowerCase()),
    ),
  ).length;
  const remote = data.attendanceAndLeave.filter((emp) =>
    emp.attendance.find(
      (a) => a.date === selectedDay && a.status.toLowerCase() === "remote",
    ),
  ).length;
  const pendingReqs = data.attendanceAndLeave.reduce(
    (sum, emp) => sum + getPendingCount(emp),
    0,
  );

  return {
    totalEmployees,
    presentToday,
    onLeaveToday,
    remote,
    pendingReqs,
  };
}

function renderSummaryCards() {
  const summary = calculateSummary();
  const html = `
      <div class="summary-card">
          <div class="summary-label">Present Today</div>
          <div class="summary-value">${summary.presentToday}</div>
          <div class="summary-subtext">of ${summary.totalEmployees} scheduled</div>
      </div>
      <div class="summary-card">
          <div class="summary-label">On Leave</div>
          <div class="summary-value">${summary.onLeaveToday}</div>
          <div class="summary-subtext">absent today</div>
      </div>
      <div class="summary-card">
          <div class="summary-label">Remote</div>
          <div class="summary-value">${summary.remote}</div>
          <div class="summary-subtext">working remotely</div>
      </div>
      <div class="summary-card">
          <div class="summary-label">Pending Reqs</div>
          <div class="summary-value">${summary.pendingReqs}</div>
          <div class="summary-subtext">awaiting approval</div>
      </div>
  `;
  document.getElementById("summaryCards").innerHTML = html;
}

function renderEmployeeList() {
  const html = data.attendanceAndLeave
    .map((emp) => {
      const attendance = calculateAttendancePercent(emp);
      const pending = getPendingCount(emp);
      const isActive = emp.employeeId === selectedEmployeeId;

      return `
          <div class="employee-item ${isActive ? "active" : ""}" data-employee-id="${emp.employeeId}">
              <div class="employee-info">
                  <div class="employee-name">${emp.name}</div>
                  <div class="employee-stat">${attendance}% attendance</div>
              </div>
              ${pending > 0 ? `<span class="badge badge-pending">${pending}</span>` : ""}
          </div>
      `;
    })
    .join("");

  document.getElementById("employeeList").innerHTML = html;

  document.querySelectorAll(".employee-item").forEach((item) => {
    item.addEventListener("click", () => {
      selectedEmployeeId = parseInt(item.dataset.employeeId);
      renderEmployeeList();
      renderEmployeeDetail();
    });
  });
}

function renderEmployeeDetail() {
  const employee = data.attendanceAndLeave.find(
    (e) => e.employeeId === selectedEmployeeId,
  );
  if (!employee) return;

  const attendance = calculateAttendancePercent(employee);
  const pending = getPendingCount(employee);

  document.getElementById("selectedEmployeeName").textContent = employee.name;
  document.getElementById("selectedEmployeeStats").innerHTML = `
      <div class="stat-item">
          <span>Attendance:</span>
          <span class="stat-value">${attendance}%</span>
      </div>
      ${
        pending > 0
          ? `
          <div class="stat-item">
              <span>Pending:</span>
              <span class="stat-value">${pending} request${pending > 1 ? "s" : ""}</span>
          </div>
      `
          : ""
      }
  `;

  const employeeIndex = data.attendanceAndLeave.findIndex(
    (e) => e.employeeId === employee.employeeId,
  );

  renderAttendanceTable(employee);
  renderLeaveTable(employee, employeeIndex);
}

function renderAttendanceTable(employee) {
  const html = [...employee.attendance]
    .sort((first, second) => second.date.localeCompare(first.date))
    .map((record) => {
      const status = record.status || "Unknown";
      const normalizedStatus = status.toLowerCase();
      const displayStatus = normalizedStatus === "absent" ? "Leave" : status;
      const badgeClass =
        normalizedStatus === "present"
          ? "status-present"
          : normalizedStatus === "remote"
            ? "status-approved"
            : "status-leave";

      return `
          <tr>
              <td>${formatDate(record.date)}</td>
              <td><span class="status-badge ${badgeClass}">${displayStatus}</span></td>
          </tr>
      `;
    })
    .join("");

  document.getElementById("attendanceTableBody").innerHTML = html;
}

async function approveRequest(employeeIndex, requestIndex) {
  const employee = data.attendanceAndLeave[employeeIndex];
  const request = employee?.leaveRequests?.[requestIndex];
  if (!request) return;

  // request.id is the leave_id from MySQL
  const result = await putToAPI(`/leave/${request.id}/accept`);

  if (result) {
    request.status = "Approved";
    renderSummaryCards();
    renderEmployeeList();
    renderEmployeeDetail();
  } else {
    alert("Failed to approve - check console");
  }
}

async function denyRequest(employeeIndex, requestIndex) {
  const employee = data.attendanceAndLeave[employeeIndex];
  const request = employee?.leaveRequests?.[requestIndex];
  if (!request) return;

  const result = await putToAPI(`/leave/${request.id}/deny`);

  if (result) {
    request.status = "Denied";
    renderSummaryCards();
    renderEmployeeList();
    renderEmployeeDetail();
  } else {
    alert("Failed to deny - check console");
  }
}

function renderLeaveTable(employee, employeeIndex) {
  const html = employee.leaveRequests
    .map((req, requestIndex) => {
      const statusClass = `status-${req.status.toLowerCase()}`;
      const isPending = req.status === "Pending";

      return `
          <tr>
              <td>${formatDate(req.date)}</td>
              <td>${req.reason}</td>
              <td>
                  <span class="status-badge ${statusClass}">${req.status}</span>
                  ${
                    isPending
                      ? `
                      <div class="request-actions">
                          <button class="btn-action btn-approve" type="button" onclick="approveRequest(${employeeIndex}, ${requestIndex})">Approve</button>
                          <button class="btn-action btn-deny" type="button" onclick="denyRequest(${employeeIndex}, ${requestIndex})">Deny</button>
                      </div>
                  `
                      : ""
                  }
              </td>
          </tr>
      `;
    })
    .join("");

  document.getElementById("leaveTableBody").innerHTML =
    html ||
    `
      <tr>
          <td colspan="3" style="text-align: center; color: var(--gray-400); padding: 40px;">
              No leave requests
          </td>
      </tr>
  `;
}

function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;

      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((tc) => tc.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(`${tabName}Tab`).classList.add("active");
      activeTab = tabName;
    });
  });
}

function openRequestModal() {
  if (!employeeSelect) return;

  employeeSelect.innerHTML = `
    <option value="">Select employee</option>
    ${data.attendanceAndLeave
      .map(
        (employee) => `
          <option value="${employee.employeeId}" ${employee.employeeId === selectedEmployeeId ? "selected" : ""}>
            ${employee.name}
          </option>
        `,
      )
      .join("")}
  `;

  const today = new Date().toISOString().split("T")[0];
  if (startDate) startDate.min = today;
  if (endDate) endDate.min = today;

  requestModal.classList.remove("hidden");
}

function closeRequestModal() {
  requestModal.classList.add("hidden");
  leaveRequestForm.reset();
}

function initRequestModal() {
  newRequestBtn = document.getElementById("newRequestBtn");
  requestModal = document.getElementById("requestModal");
  closeModal = document.getElementById("closeModal");
  cancelBtn = document.getElementById("cancelBtn");
  leaveRequestForm = document.getElementById("leaveRequestForm");
  employeeSelect = document.getElementById("employeeSelect");
  leaveType = document.getElementById("leaveType");
  startDate = document.getElementById("startDate");
  endDate = document.getElementById("endDate");
  reason = document.getElementById("reason");

  if (!newRequestBtn || !requestModal || !leaveRequestForm) return;

  newRequestBtn.addEventListener("click", openRequestModal);
  closeModal?.addEventListener("click", closeRequestModal);
  cancelBtn?.addEventListener("click", closeRequestModal);

  requestModal.addEventListener("click", (event) => {
    if (event.target === requestModal) {
      closeRequestModal();
    }
  });

  leaveRequestForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const employeeId = Number(employeeSelect.value);
    const selectedLeaveType = leaveType.value;
    const startValue = startDate.value;
    const endValue = endDate.value;
    const reasonValue = reason.value.trim();

    if (
      !employeeId ||
      !selectedLeaveType ||
      !startValue ||
      !endValue ||
      !reasonValue
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (new Date(endValue) < new Date(startValue)) {
      alert("End date cannot be before start date.");
      return;
    }

    const employee = data.attendanceAndLeave.find(
      (item) => item.employeeId === employeeId,
    );

    if (!employee) {
      alert("Please select a valid employee.");
      return;
    }

    const result = await postToAPI("/leave", {
      employee_id: employeeId,
      leave_date: startValue,
      reason: `${selectedLeaveType} - ${reasonValue}`,
    });

    if (!result) {
      alert("Failed to submit request - check console.");
      return;
    }

    await loadDataFromAPI();

    selectedEmployeeId = employeeId;
    renderSummaryCards();
    renderEmployeeList();
    renderEmployeeDetail();
    closeRequestModal();
    alert("Request submitted successfully.");
  });
}

function handleDaySelection(event) {
  const newDate = event.target.value;
  if (!newDate) return;

  selectedDay = newDate;
  renderSummaryCards();
  displayCurrentDate();
}

async function init() {
  await loadDataFromAPI();

  const daySelector = document.getElementById("daySelector");
  if (daySelector) {
    daySelector.value = selectedDay;
    daySelector.addEventListener("change", handleDaySelection);
  }

  renderSummaryCards();
  renderEmployeeList();
  renderEmployeeDetail();
  initTabs();
  initRequestModal();
  displayCurrentDate();
}

document.addEventListener("DOMContentLoaded", init);

function displayCurrentDate() {
  const ymd = toYMD(selectedDay);
  const selected = new Date(`${ymd}T00:00:00`);

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const dateElement = document.getElementById("currentDate");

  if (dateElement) {
    dateElement.textContent = selected.toLocaleDateString("en-GB", options);
  }
}
