// EMPLOYEE DATABASE
let employees = [];
let selectedEmployee = null;
let originalComment = "";

    //    DOM ELEMENTS
const employeeContainer = document.getElementById("employeeContainer");
const searchInput = document.getElementById("searchInput");

const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailPosition = document.getElementById("detailPosition");
const detailID = document.getElementById("detailID");
const detailDepartment = document.getElementById("detailDepartment");
const detailAttendance = document.getElementById("detailAttendance");
const detailScore = document.getElementById("detailScore");
const detailBadge = document.getElementById("detailBadge");
const detailComment = document.getElementById("detailComment");

const detailsPanel = document.getElementById("detailsPanel");
const closePanel = document.getElementById("closePanel");

const totalEmployees = document.getElementById("totalEmployees");
const excellentCount = document.getElementById("excellentCount");
const goodCount = document.getElementById("goodCount");
const averageCount = document.getElementById("averageCount");
const improvementCount = document.getElementById("improvementCount");

const currentDate = document.getElementById("currentDate");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const emptyState = document.getElementById("emptyState");
const notificationBtn = document.getElementById("notificationBtn");
const addEmployeeBtn = document.getElementById("addEmployee");

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

const refreshBtn = document.getElementById("refreshEmployees");
const sortBtn = document.getElementById("sortEmployees");

const loadingOverlay = document.getElementById("loadingOverlay");

const confirmationModal =
    document.getElementById("confirmationModal");

const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

// CURRENT DATE
const today = new Date();

if (currentDate) {
    currentDate.textContent =
        today.toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

//  UPDATE DASHBOARD STATISTICS
function updateStatistics() {
    console.log("Updating statistics...");
    console.log("Employees:", employees);

    if (totalEmployees) {
        totalEmployees.textContent = employees.length;
    }

    if (excellentCount) {
        excellentCount.textContent =
            employees.filter(employee =>
                employee.rating === "Excellent"
            ).length;
    }

    if (goodCount) {
        goodCount.textContent =
            employees.filter(employee =>
                employee.rating === "Good"
            ).length;
    }

    if (averageCount) {
        averageCount.textContent =
            employees.filter(employee =>
                employee.rating === "Average"
            ).length;
    }

    if (improvementCount) {
        improvementCount.textContent =
            employees.filter(employee =>
                employee.rating === "Needs Improvement"
            ).length;
    }

    console.log("Statistics:", {
        total: employees.length,
        excellent: employees.filter(e => e.rating === "Excellent").length,
        good: employees.filter(e => e.rating === "Good").length,
        average: employees.filter(e => e.rating === "Average").length,
        improvement: employees.filter(e => e.rating === "Needs Improvement").length
    });
}

// PERFORMANCE BADGE
function getBadgeClass(rating) {
    switch (rating) {

        case "Excellent":
            return "excellent";

        case "Good":
            return "good";

        case "Average":
            return "average";

        case "Needs Improvement":
            return "improvement";

        default:
            return "average";
    }
}

  // CREATE EMPLOYEE CARDS
function createEmployeeCard(employee) {
    return `
        <div class="employee-card fade-in">
            <div class="employee-header">
                <img
                    src="${employee.image || "./employee1.jpg"}"
                    alt="${employee.name}"
                    onerror="this.src='./employee1.jpg';">

                <div class="employee-info">
                    <h3>${employee.name}</h3>
                    <p>${employee.position}</p>
                    <span class="employee-id">${employee.id}</span>
                </div>
            </div>

            <div class="employee-stats">
                <div class="employee-stat">
                    <span>Department</span>
                    <strong>${employee.department}</strong>
                </div>

                <div class="employee-stat">
                    <span>Attendance</span>
                    <strong>${employee.attendance}%</strong>
                </div>

                <div class="employee-stat">
                    <span>Performance</span>
                    <strong>${employee.score}%</strong>
                </div>

                <div class="employee-stat">
                    <span>Rating</span>
                    <strong>${employee.rating}</strong>
                </div>
            </div>

            <span class="performance-badge ${getBadgeClass(employee.rating)}">
                ${employee.rating}
            </span>

            <div class="card-buttons">
                <button
                    type="button"
                    class="view-btn"
                    data-employee-id="${employee.apiId}">
                    <i class="fa-solid fa-eye"></i>
                    View
                </button>
            </div>
        </div>
    `;
}

  // DISPLAY EMPLOYEES
function displayEmployees(list) {
    if (!employeeContainer) {
        console.error("employeeContainer not found.");
        return;
    }

    employeeContainer.innerHTML = "";

    /* No employees */
    if (!list || list.length === 0) {
        employeeContainer.style.display = "none";

        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;
    }

    /* Employees exist */
    employeeContainer.style.display = "grid";
    if (emptyState) {
        emptyState.style.display = "none";
    }

    /* Create cards */
    list.forEach(employee => {
        employeeContainer.insertAdjacentHTML(
            "beforeend",
            createEmployeeCard(employee)
        );
    });
}

if (employeeContainer) {
    employeeContainer.addEventListener("click", event => {
        const viewButton = event.target.closest(".view-btn");

        if (!viewButton) {
            return;
        }

        const employeeId = viewButton.dataset.employeeId;
        showEmployee(employeeId, true);
    });
}

    // LOAD PERFORMANCE DATA
async function loadEmployees() {
    try {
        if (loadingOverlay) {
            loadingOverlay.style.display = "flex";
        }

        const response = await fetch(
            "http://localhost:3000/api/performance"
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();

        const records =
            Array.isArray(result) ? result :
            Array.isArray(result.data) ? result.data :
            Array.isArray(result.employees) ? result.employees :
            Array.isArray(result.performance) ? result.performance :
            Array.isArray(result.records) ? result.records :
            [];

        employees = records.map(employee => {
            const apiId =
                employee.employee_id ??
                employee.employeeId ??
                employee.id;

            const numericId = Number(apiId);

            return {
                apiId: apiId,
                id: Number.isNaN(numericId)
                    ? String(apiId || "UNKNOWN")
                    : `EMP${String(numericId).padStart(3, "0")}`,
                name: employee.name || "Unknown Employee",
                department: employee.department || "N/A",
                position: employee.position || "Employee",
                attendance: employee.attendance ?? 0,
                score: employee.performance_score ??
                    employee.performanceScore ??
                    employee.score ??
                    0,
                rating: employee.rating || "N/A",
                comment: employee.manager_comments ||
                    employee.managerComments ||
                    "",
                image: employee.image || ""
            };
        });

        displayEmployees(employees);
        updateStatistics();

        if (employees.length > 0) {
            await showEmployee(employees[0].apiId, false);
        }
    } catch (error) {
        console.error("Error fetching performance data:", error);
        employees = [];
        displayEmployees([]);
        showToast("Unable to load performance data. Check the backend.");
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }
    }
}

// SEARCH EMPLOYEES
if (searchInput) {
    searchInput.addEventListener(
        "keyup",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();

            const filteredEmployees =
                employees.filter(employee =>

                    (employee.name || "")
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    (employee.department || "")
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    (employee.position || "")
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    (employee.id || "")
                        .toLowerCase()
                        .includes(searchValue)

                );

            displayEmployees(
                filteredEmployees
            );
        }
    );
}

   // UPDATE SELECTED EMPLOYEE
async function showEmployee(employeeID, openPanel = true) {
    try {

        console.log(
            "View clicked for:",
            employeeID
        );


        /*
           EMP001 -> 1
           EMP010 -> 10
        */

       const numericID = String(employeeID).replace(/^EMP/i, "");


        console.log(
            "Requesting employee:",
            numericID
        );


        const response =
            await fetch(
                `http://localhost:3000/api/performance/${numericID}`
            );


        if (!response.ok) {

            throw new Error(
                `Employee API returned ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "API response:",
            result
        );


        /*
           Support both:

           { data: employee }

           and

           employee
        */

        const employee =
            result.data || result;


        if (!employee) {

            showToast(
                "Employee performance data not found."
            );

            return;

        }


        console.log(
            "Employee:",
            employee
        );


        /* Store selected employee */

        selectedEmployee =
            employee;


        originalComment =
            employee.manager_comments || "";


        /* Employee details */

        if (detailName) {

            detailName.textContent =
                employee.name || "Unknown Employee";

        }


        if (detailPosition) {

            detailPosition.textContent =
                employee.position || "Employee";

        }


        if (detailID) {

            detailID.textContent =
                `EMP${String(employee.employee_id)
                    .padStart(3, "0")}`;

        }


        if (detailDepartment) {

            detailDepartment.textContent =
                employee.department || "N/A";

        }


        if (detailAttendance) {

            detailAttendance.textContent =
                `${employee.attendance ?? 0}%`;

        }


        if (detailScore) {

            detailScore.textContent =
                `${employee.performance_score ?? 0}%`;

        }


        if (detailComment) {

            detailComment.value =
                employee.manager_comments || "";

            detailComment.readOnly =
                true;

        }


        if (detailBadge) {

            detailBadge.textContent =
                employee.rating || "N/A";

            detailBadge.className =
                "performance-badge " +
                getBadgeClass(employee.rating);

        }


        if (detailImage) {

            detailImage.src =
                employee.image || "./employee1.jpg";

            detailImage.alt =
                employee.name || "Employee";

        }


        /*
           Only open the panel when the user actually
           clicks View.
        */

        if (
            openPanel &&
            detailsPanel
        ) {

            detailsPanel.style.display =
                "block";

        }


        console.log(
            "Employee details updated successfully."
        );


    } catch (error) {

        console.error(
            "Error loading employee details:",
            error
        );


        showToast(
            "Unable to load employee details."
        );

    }

}


/* =========================================================
                    EDIT COMMENT
========================================================= */

if (editBtn) {

    editBtn.addEventListener("click", () => {

        if (!detailComment) {
            return;
        }


        detailComment.readOnly =
            false;


        detailComment.focus();


        showToast(
            "Edit mode enabled."
        );

    });

}


/* =========================================================
                    SAVE COMMENT
========================================================= */

if (saveBtn) {

    saveBtn.addEventListener("click", () => {

        if (
            !selectedEmployee ||
            !detailComment
        ) {
            return;
        }


        selectedEmployee.manager_comments =
            detailComment.value;


        selectedEmployee.comment =
            detailComment.value;


        originalComment =
            detailComment.value;


        detailComment.readOnly =
            true;


        showToast(
            "Changes saved successfully."
        );

    });

}


/* =========================================================
                    CANCEL EDIT
========================================================= */

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        if (!detailComment) {
            return;
        }


        detailComment.value =
            originalComment;


        detailComment.readOnly =
            true;


        showToast(
            "Changes cancelled."
        );

    });

}


/* =========================================================
                    SIDEBAR TOGGLE
========================================================= */

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}


/* =========================================================
                    SCROLL TO TOP
========================================================= */

window.addEventListener("scroll", () => {

    if (!scrollTopBtn) {
        return;
    }


    if (window.scrollY > 300) {

        scrollTopBtn.style.display =
            "flex";

    } else {

        scrollTopBtn.style.display =
            "none";

    }

});


if (scrollTopBtn) {

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =========================================================
                    TOAST NOTIFICATIONS
========================================================= */

function showToast(message) {

    const toastContainer =
        document.getElementById(
            "toastContainer"
        );


    if (!toastContainer) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.innerHTML = `
        <strong>
            Success
        </strong>

        <br>

        ${message}
    `;


    toastContainer.appendChild(
        toast
    );


    setTimeout(() => {

        toast.remove();

    }, 3000);

}


/* =========================================================
                    REFRESH EMPLOYEES
========================================================= */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            if (loadingOverlay) {

                loadingOverlay.style.display =
                    "flex";

            }


            await loadEmployees();


            if (loadingOverlay) {

                loadingOverlay.style.display =
                    "none";

            }


            showToast(
                "Employee list refreshed."
            );

        }
    );

}


/* =========================================================
                    SORT EMPLOYEES
========================================================= */

let ascending = true;


if (sortBtn) {

    sortBtn.addEventListener(
        "click",
        () => {

            employees.sort((a, b) => {

                return ascending

                    ? a.name.localeCompare(b.name)

                    : b.name.localeCompare(a.name);

            });


            ascending =
                !ascending;


            displayEmployees(
                employees
            );


            showToast(
                "Employee list sorted."
            );

        }
    );

}


/* =========================================================
                    CONFIRMATION MODAL
========================================================= */

function showConfirmation(
    message,
    callback
) {

    const modalMessage =
        document.getElementById(
            "modalMessage"
        );


    if (modalMessage) {

        modalMessage.textContent =
            message;

    }


    if (!confirmationModal) {
        return;
    }


    confirmationModal.style.display =
        "flex";


    if (confirmYes) {

        confirmYes.onclick = () => {

            confirmationModal.style.display =
                "none";

            callback();

        };

    }


    if (confirmNo) {

        confirmNo.onclick = () => {

            confirmationModal.style.display =
                "none";

        };

    }

}


/* =========================================================
                CLOSE DETAILS PANEL
========================================================= */

if (closePanel) {

    closePanel.addEventListener(
        "click",
        () => {

            if (detailsPanel) {

                detailsPanel.style.display =
                    "none";

            }

        }
    );

}


/* =========================================================
                REOPEN DETAILS PANEL
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(".view-btn")
        ) {

            if (detailsPanel) {

                detailsPanel.style.display =
                    "block";

            }

        }

    }
);


/* =========================================================
                    ESC KEY CLOSES MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (confirmationModal) {

                confirmationModal.style.display =
                    "none";

            }

        }

    }
);


/* =========================================================
                    CLICK OUTSIDE MODAL
========================================================= */

window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            confirmationModal
        ) {

            confirmationModal.style.display =
                "none";

        }

    }
);


/* =========================================================
                    FINAL INITIALISATION
========================================================= */

window.addEventListener(
    "load",
    () => {

        if (loadingOverlay) {

            loadingOverlay.style.display =
                "flex";

        }


        setTimeout(() => {

            if (loadingOverlay) {

                loadingOverlay.style.display =
                    "none";

            }

        }, 1000);

    }
);


/* =========================================================
                    START APPLICATION
========================================================= */

loadEmployees();


/* =========================================================
                    SUCCESS MESSAGE
========================================================= */

console.log(
    "ModernTech Performance Dashboard Loaded Successfully."
);