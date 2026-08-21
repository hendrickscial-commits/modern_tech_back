// ===============================
// LOGIN
// ===============================

if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "./index.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
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

let employees = JSON.parse(localStorage.getItem("employees")) || [
  ...defaultEmployees,
];

let currentEmployeeIndex = -1;

function saveEmployees() {
  localStorage.setItem("employees", JSON.stringify(employees));
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

          <img src="${emp.avatar}" alt="${emp.name}">

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

          <button class="profile-btn"
                  onclick="openModal(${realIndex})">

            <i class="fa fa-user"></i>

          </button>
<button class="edit-btn"
onclick="openEditModal(${realIndex})">
    <i class="fa fa-pen"></i>
</button>

          <button class="delete-btn"
                  onclick="deleteEmployee(${realIndex})">

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

  document.getElementById("mInfo").innerHTML = `

      <div>

          <label>Email</label>

          <div>${emp.contact}</div>

      </div>

      <div>

          <label>Department</label>

          <div>${emp.department}</div>

      </div>

      <div>

          <label>Employment History</label>

          <div>${emp.employmentHistory}</div>

      </div>

      <div>

          <label>Salary</label>

          <div>R${emp.salary.toLocaleString()}</div>

      </div>

      <div>

          <label>Joined</label>

          <div>${emp.joinDate}</div>

      </div>

      <div>

          <label>Status</label>

          <div>${emp.status}</div>

      </div>

  `;

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

function saveEmployee() {
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

  const employee = {
    employeeId: Date.now(),

    name,

    contact: email,

    position,

    department,

    joinDate: new Date(hireDate).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),

    status,

    salary: 0,

    attendance: 100,

    employmentHistory: "New Employee",

    avatar,
  };

  employees.push(employee);

  saveEmployees();

  generateFilterButtons();

  populateTable(employees);

  updateStatusCounts();

  closeAddModal();
  document
    .getElementById("addEmployeeModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeAddModal();
      }
    });
  clearAddForm();
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

function updateEmployee() {
  if (currentEmployeeIndex === -1) return;

  const emp = employees[currentEmployeeIndex];

  emp.name = document.getElementById("editName").value.trim();

  emp.contact = document.getElementById("editEmail").value.trim();

  emp.position = document.getElementById("editPosition").value.trim();

  emp.department = document.getElementById("editDepartment").value.trim();

  const dateValue = document.getElementById("editHireDate").value;

  emp.joinDate = new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  emp.status = document.getElementById("editStatus").value;

  emp.salary = Number(document.getElementById("editSalary").value);

  emp.employmentHistory = document.getElementById("editHistory").value.trim();

  saveEmployees();

  generateFilterButtons();

  populateTable(employees);

  updateStatusCounts();

  closeEditModal();
}

// ===============================
// DATE FORMATTER
// ===============================

function convertDateForInput(dateString) {
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

function deleteEmployee(index) {
  const employee = employees[index];

  if (!confirm(`Delete ${employee.name}?`)) return;

  employees.splice(index, 1);

  saveEmployees();

  generateFilterButtons();

  populateTable(employees);

  updateStatusCounts();
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
// SAVE DEFAULT EMPLOYEES
// ===============================

if (!localStorage.getItem("employees")) {
  saveEmployees();
}

// ===============================
// INITIALIZE APPLICATION
// ===============================

generateFilterButtons();

populateTable(employees);

updateStatusCounts();

displayCurrentDate();
