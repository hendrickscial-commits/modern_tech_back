// ===============================
// LOGIN
// ===============================

if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "./index.html";
}

const API_BASE_URL = "http://localhost:2020";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function handleAuthenticationError(response) {
  if (response.status !== 401) return false;

  logout();
  return true;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmployeeId");
  localStorage.removeItem("authToken");
  window.location.href = "./index.html";
}

// ===============================
// EMPLOYEE DATA
// ===============================

const defaultEmployees = [
  {
    employeeId: 1,
    name: "Sibongile Nkosi",
    position: "Software Engineer",
    department: "Development",
    salary: 70000,
    employmentHistory: "Joined in 2015, promoted to Senior in 2018",
    contact: "sibongile.nkosi@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/6564468/pexels-photo-6564468.jpeg?u=sibongile",
    joinDate: "Mar 15, 2015",
  },
  {
    employeeId: 2,
    name: "Lungile Moyo",
    position: "HR Manager",
    department: "HR",
    salary: 80000,
    employmentHistory: "Joined in 2013, promoted to Manager in 2017",
    contact: "lungile.moyo@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/111738/pexels-photo-111738.jpeg?u=lungile",
    joinDate: "Aug 22, 2013",
  },
  {
    employeeId: 3,
    name: "Thabo Molefe",
    position: "Quality Analyst",
    department: "QA",
    salary: 55000,
    employmentHistory: "Joined in 2018",
    contact: "thabo.molefe@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/12271118/pexels-photo-12271118.jpeg?u=thabo",
    joinDate: "Jun 10, 2018",
  },
  {
    employeeId: 4,
    name: "Keshav Naidoo",
    position: "Sales Representative",
    department: "Sales",
    salary: 60000,
    employmentHistory: "Joined in 2020",
    contact: "keshav.naidoo@moderntech.com",
    status: "Absent",
    attendance: 80,
    avatar: "https://i.pravatar.cc/400?img=keshav",
    joinDate: "Jan 05, 2020",
  },
  {
    employeeId: 5,
    name: "Zanele Khumalo",
    position: "Marketing Specialist",
    department: "Marketing",
    salary: 58000,
    employmentHistory: "Joined in 2019",
    contact: "zanele.khumalo@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/29086752/pexels-photo-29086752.jpeg?u=zanele",
    joinDate: "Apr 18, 2019",
  },
  {
    employeeId: 6,
    name: "Sipho Zulu",
    position: "UI/UX Designer",
    department: "Design",
    salary: 65000,
    employmentHistory: "Joined in 2016",
    contact: "sipho.zulu@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/30482423/pexels-photo-30482423.jpeg?u=sipho",
    joinDate: "Sep 30, 2016",
  },
  {
    employeeId: 7,
    name: "Naledi Moeketsi",
    position: "DevOps Engineer",
    department: "IT",
    salary: 72000,
    employmentHistory: "Joined in 2017",
    contact: "naledi.moeketsi@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/36646353/pexels-photo-36646353.jpeg?u=naledi",
    joinDate: "Feb 14, 2017",
  },
  {
    employeeId: 8,
    name: "Farai Gumbo",
    position: "Content Strategist",
    department: "Marketing",
    salary: 56000,
    employmentHistory: "Joined in 2021",
    contact: "farai.gumbo@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/5916465/pexels-photo-5916465.jpeg?u=farai",
    joinDate: "Nov 08, 2021",
  },
  {
    employeeId: 9,
    name: "Karabo Dlamini",
    position: "Accountant",
    department: "Finance",
    salary: 62000,
    employmentHistory: "Joined in 2018",
    contact: "karabo.dlamini@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/6512777/pexels-photo-6512777.jpeg?u=karabo",
    joinDate: "Jul 12, 2018",
  },
  {
    employeeId: 10,
    name: "Fatima Patel",
    position: "Customer Support Lead",
    department: "Support",
    salary: 58000,
    employmentHistory: "Joined in 2016",
    contact: "fatima.patel@moderntech.com",
    status: "Present",
    attendance: 80,
    avatar:
      "https://images.pexels.com/photos/13070557/pexels-photo-13070557.jpeg?u=fatima",
    joinDate: "May 03, 2016",
  },
];

// ===============================
// STORAGE
// ===============================

let employees = [];
let currentEmployeeIndex = -1;

function getOriginalAvatar(emp) {
  return defaultEmployees.find(
    (original) =>
      original.employeeId === Number(emp.employee_id ?? emp.employeeId) ||
      original.contact === (emp.contact ?? emp.email),
  )?.avatar;
}

function normalizeEmployee(emp) {
  return {
    employeeId: emp.employee_id ?? emp.employeeId ?? Date.now(),
    name: emp.name ?? "Unnamed Employee",
    position: emp.position ?? "",
    department: emp.department ?? "",
    salary: Number(emp.salary ?? 0),
    employmentHistory:
      emp.employment_history ?? emp.employmentHistory ?? "New Employee",
    contact: emp.contact ?? emp.email ?? "",
    status: emp.status ?? "Present",
    attendance: Number(emp.attendance ?? 100),
    avatar:
      emp.avatar ??
      getOriginalAvatar(emp) ??
      `https://i.pravatar.cc/400?u=${encodeURIComponent(
        emp.contact || emp.name || "employee",
      )}`,
    joinDate:
      emp.join_date ??
      emp.joinDate ??
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
  };
}

function saveEmployees() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

async function loadEmployees() {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (handleAuthenticationError(response)) return;
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to load employees");
    }

    const data = await response.json();
    employees = Array.isArray(data) ? data.map(normalizeEmployee) : [];
  } catch (error) {
    console.error(error);
    employees = [];
    const tbody = document.querySelector("#emTable tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6">${error.message || "Unable to load employees. Ensure the backend is running."}</td></tr>`;
    }
  }

  saveEmployees();
  generateFilterButtons();
  populateTable(employees);
  updateStatusCounts();
}

// ===============================
// DOM ELEMENTS
// ===============================

const emTable = document.getElementById("emTable");
const searchInput = document.getElementById("search");

const profileModal = document.getElementById("profileModal");
const closeBtn = document.getElementById("closeBtn");

const filterButtonsContainer = document.getElementById(
  "filterButtonsContainer",
);

// ===============================
// FILTER BUTTONS
// ===============================

function getUniqueDepartments() {
  return [...new Set(employees.map((emp) => emp.department))].sort();
}

function generateFilterButtons() {
  filterButtonsContainer.innerHTML = `<button class="filter-btn active" data-filter="all">All</button>`;

  getUniqueDepartments().forEach((dept) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = dept;
    btn.textContent = dept;
    filterButtonsContainer.appendChild(btn);
  });

  attachFilterButtonListeners();
}

function attachFilterButtonListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      if (btn.dataset.filter === "all") {
        populateTable(employees);
      } else {
        populateTable(
          employees.filter((emp) => emp.department === btn.dataset.filter),
        );
      }
    });
  });
}

// ===============================
// POPULATE EMPLOYEE TABLE
// ===============================

function populateTable(data) {
  const tbody = emTable.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((emp, index) => {
    const realIndex = employees.findIndex(
      (e) => e.employeeId === emp.employeeId,
    );
    const statusClass = emp.status.toLowerCase().replace(/\s/g, "");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${String(index + 1).padStart(2, "0")}</td>
      <td>
        <div class="emp">
          <img src="${emp.avatar}" alt="${emp.name}" width="44" height="44" loading="lazy" decoding="async">
          <div>
            <strong>${emp.name}</strong>
            <div class="email">${emp.contact}</div>
          </div>
        </div>
      </td>
      <td>${emp.department}</td>
      <td>${emp.position}</td>
      <td>
        <span class="badge ${statusClass}">
          <span class="dot"></span>
          ${emp.status}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="profile-btn" onclick="openModal(${realIndex})">
            <i class="fa fa-user"></i>
          </button>
          <button class="edit-btn" onclick="openEditModal(${realIndex})">
            <i class="fa fa-pen"></i>
          </button>
          <button class="delete-btn" onclick="deleteEmployee(${realIndex})">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===============================
// PROFILE MODAL
// ===============================

function openModal(index) {
  const emp = employees[index];
  const userRole = localStorage.getItem("userRole") || "Employee";

  document.getElementById("mAvatar").src = emp.avatar;
  document.getElementById("mName").textContent = emp.name;
  document.getElementById("mPosition").textContent = emp.position;
  document.getElementById("mAtt").textContent = emp.attendance + "%";

  document.getElementById("mTags").innerHTML = `
    <span class="badge ${emp.status.toLowerCase()}">
      <span class="dot"></span>
      ${emp.status}
    </span>
    <span class="tag">${emp.department}</span>
  `;

  const infoRows = [
    `<div><label>Email</label><div>${emp.contact}</div></div>`,
    `<div><label>Department</label><div>${emp.department}</div></div>`,
  ];

  if (userRole !== "Employee") {
    infoRows.push(
      `<div><label>Employment History</label><div>${emp.employmentHistory}</div></div>`,
    );
    infoRows.push(
      `<div><label>Salary</label><div>R${emp.salary.toLocaleString()}</div></div>`,
    );
    infoRows.push(`<div><label>Joined</label><div>${emp.joinDate}</div></div>`);
  }

  infoRows.push(`<div><label>Status</label><div>${emp.status}</div></div>`);

  document.getElementById("mInfo").innerHTML = infoRows.join("");
  profileModal.classList.add("open");
}

function closeModal() {
  profileModal.classList.remove("open");
}

// ===============================
// SEARCH
// ===============================

function filterEmployees(searchTerm) {
  const search = searchTerm.toLowerCase();

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search) ||
      emp.contact.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search) ||
      emp.position.toLowerCase().includes(search),
  );

  populateTable(filtered);
}

// ===============================
// STATUS CARDS
// ===============================

function updateStatusCounts() {
  document.getElementById("totalCount").textContent = employees.length;
  document.getElementById("presentCount").textContent = employees.filter(
    (emp) => emp.status === "Present",
  ).length;
  document.getElementById("absentCount").textContent = employees.filter(
    (emp) => emp.status === "Absent",
  ).length;
}

// ===============================
// ADD EMPLOYEE MODAL
// ===============================

function openAddModal() {
  clearAddForm();
  document.getElementById("addEmployeeModal").classList.add("open");
}

function closeAddModal() {
  document.getElementById("addEmployeeModal").classList.remove("open");
}

// ===============================
// CLEAR FORM
// ===============================

function clearAddForm() {
  document.getElementById("employeeName").value = "";
  document.getElementById("employeeEmail").value = "";
  document.getElementById("employeePosition").value = "";
  document.getElementById("employeeDepartment").value = "";
  document.getElementById("employeeHireDate").value = "";
  document.getElementById("employeeStatus").value = "Present";
  document.getElementById("employeePhoto").value = "";
}

// ===============================
// ADD EMPLOYEE
// ===============================


async function saveEmployee() {
  const name = document.getElementById("employeeName").value.trim();
  const email = document.getElementById("employeeEmail").value.trim();
  const position = document.getElementById("employeePosition").value.trim();
  const department = document.getElementById("employeeDepartment").value.trim();
  const hireDate = document.getElementById("employeeHireDate").value;
  const status = document.getElementById("employeeStatus").value;

  if (!name || !email || !position || !department || !hireDate) {
    alert("Please complete all required fields.");
    return;
  }

  const photoInput = document.getElementById("employeePhoto");
  let avatar = "https://i.pravatar.cc/400?u=" + encodeURIComponent(email);

  if (photoInput.files.length > 0) {
    avatar = URL.createObjectURL(photoInput.files[0]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name,
        contact: email,
        position,
        department,
        salary: 0,
        employment_history: "New Employee",
        status,
        attendance: 100,
        avatar,
        join_date: new Date(hireDate).toISOString().split("T")[0],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (handleAuthenticationError(response)) return;
      throw new Error(data.message || "Failed to add employee");
    }

    await loadEmployees();
    closeAddModal();
    clearAddForm();
  } catch (error) {
    alert(error.message || "Failed to add employee");
  }
}

// ===============================
// EDIT EMPLOYEE MODAL
// ===============================

function openEditModal(index) {
  currentEmployeeIndex = index;
  const emp = employees[index];

  document.getElementById("editName").value = emp.name;
  document.getElementById("editEmail").value = emp.contact;
  document.getElementById("editPosition").value = emp.position;
  document.getElementById("editDepartment").value = emp.department;
  document.getElementById("editHireDate").value = convertDateForInput(
    emp.joinDate,
  );
  document.getElementById("editStatus").value = emp.status;
  document.getElementById("editSalary").value = emp.salary;
  document.getElementById("editHistory").value = emp.employmentHistory;

  document.getElementById("editEmployeeModal").classList.add("open");
}

function closeEditModal() {
  document.getElementById("editEmployeeModal").classList.remove("open");
  currentEmployeeIndex = -1;
}

// ===============================
// UPDATE EMPLOYEE
// ===============================

async function updateEmployee() {
  if (currentEmployeeIndex === -1) return;

  const emp = employees[currentEmployeeIndex];

  const updatedEmployee = {
    name: document.getElementById("editName").value.trim(),
    contact: document.getElementById("editEmail").value.trim(),
    position: document.getElementById("editPosition").value.trim(),
    department: document.getElementById("editDepartment").value.trim(),
    salary: Number(document.getElementById("editSalary").value || 0),
    employment_history: document.getElementById("editHistory").value.trim(),
    status: document.getElementById("editStatus").value,
    join_date: document.getElementById("editHireDate").value,
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/employees/${emp.employeeId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedEmployee),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      if (handleAuthenticationError(response)) return;
      throw new Error(data.message || "Failed to update employee");
    }

    await loadEmployees();
    closeEditModal();
  } catch (error) {
    alert(error.message || "Failed to update employee");
  }
}

// ===============================
// DATE FORMATTER
// ===============================

function convertDateForInput(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";
  return date.toISOString().split("T")[0];
}

// Close edit modal when clicking outside
const editModal = document.getElementById("editEmployeeModal");

editModal.addEventListener("click", function (e) {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// ===============================
// DELETE EMPLOYEE
// ===============================

async function deleteEmployee(index) {
  const employee = employees[index];

  if (!employee) return;
  if (!confirm(`Delete ${employee.name}?`)) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/employees/${employee.employeeId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      if (handleAuthenticationError(response)) return;
      throw new Error(data.message || "Failed to delete employee");
    }

    await loadEmployees();
  } catch (error) {
    alert(error.message || "Failed to delete employee");
  }
}

// ===============================
// PROFILE MODAL EVENTS
// ===============================

closeBtn.addEventListener("click", closeModal);

profileModal.addEventListener("click", function (e) {
  if (e.target === profileModal) {
    closeModal();
  }
});

// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input", function () {
  filterEmployees(this.value);
});

// ===============================
// CURRENT DATE
// ===============================

function displayCurrentDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const dateElement = document.getElementById("currentDate");

  if (dateElement) {
    dateElement.textContent = today.toLocaleDateString("en-GB", options);
  }
}

// ===============================
// INITIALIZE APPLICATION
// ===============================

function updateLoggedInUserProfile() {
  const userName = localStorage.getItem("userName") || "Admin User";
  const userRole = localStorage.getItem("userRole") || "HR Administrator";
  const userAvatar = document.getElementById("userAvatar");
  const sidebarUserName = document.getElementById("sidebarUserName");
  const sidebarUserRole = document.getElementById("sidebarUserRole");

  if (userAvatar) {
    const initials = userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    userAvatar.textContent = initials || "AU";
  }

  if (sidebarUserName) {
    sidebarUserName.textContent = userName;
  }

  if (sidebarUserRole) {
    sidebarUserRole.textContent = userRole;
  }
}

if (!localStorage.getItem("employees")) {
  localStorage.setItem("employees", JSON.stringify(defaultEmployees));
}

generateFilterButtons();
displayCurrentDate();
updateLoggedInUserProfile();
loadEmployees();
