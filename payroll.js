const API_URL = "https://modern-tech-back.onrender.com";

const employeeSelect = document.getElementById("employee");
const generateBtn = document.getElementById("generateBtn");

const payslip = document.getElementById("payslip");
const emptyState = document.getElementById("emptyState");

const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const printBtn = document.getElementById("printBtn");

const employeeCode = document.getElementById("employeeCode");
const payPeriod = document.getElementById("payPeriod");

const empName = document.getElementById("empName");
const empDept = document.getElementById("empDept");
const empPosition = document.getElementById("empPosition");
const empHours = document.getElementById("empHours");
const annualSalary = document.getElementById("annualSalary");

const salary = document.getElementById("salary");
const overtime = document.getElementById("overtime");
const bonus = document.getElementById("bonus");
const gross = document.getElementById("gross");

const tax = document.getElementById("tax");
const pension = document.getElementById("pension");
const medicalAid = document.getElementById("medicalAid");
const totalDeductions = document.getElementById("totalDeductions");

const netPay = document.getElementById("netPay");

const activeEmployeesEl =
    document.getElementById("activeEmployees");

const totalPayrollEl =
    document.getElementById("totalPayroll");

const averageSalaryEl =
    document.getElementById("averageSalary");

const annualPayrollEl =
    document.getElementById("annualPayroll");

const payrollRecordsToggle =
    document.getElementById("payrollRecordsToggle");

const payrollRecordsContent =
    document.getElementById("payrollRecordsContent");

const recordsArrow =
    document.getElementById("recordsArrow");

const addPayrollBtn =
    document.getElementById("addPayrollBtn");

const savePayrollBtn =
    document.getElementById("savePayrollBtn");

const cancelPayrollBtn =
    document.getElementById("cancelPayrollBtn");

let employeeInformation = [];
let payrollData = [];
let editingPayrollId = null;

function formatCurrency(value) {
    return "R " + Number(value || 0).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function loadPayrollData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "Failed to load payroll records"
            );
        }

        payrollData = result.data.map(payroll => ({
            payrollId: payroll.payroll_id,
            employeeId: payroll.employee_id,
            hoursWorked: Number(payroll.hours_worked || 0),
            medicalAidDeduction: Number(
                payroll.leave_deductions || 0
            ),
            finalSalary: Number(payroll.final_salary || 0)
        }));

        const uniqueEmployees = [];

        result.data.forEach(payroll => {
            const exists = uniqueEmployees.find(
                employee =>
                    employee.employeeId == payroll.employee_id
            );

            if (!exists) {
                uniqueEmployees.push({
                    employeeId: payroll.employee_id,
                    name: payroll.name,
                    position: payroll.position,
                    department: payroll.department,
                    salary: Number(payroll.salary || 0)
                });
            }
        });

        employeeInformation = uniqueEmployees;

        loadEmployees();
        updateSummary();
        displayPayrollRecords();

        console.log("Payroll loaded:", payrollData);

    } catch (error) {
        console.error("Failed to load payroll:", error);

        alert(
            "Could not connect to the payroll server on port 2020."
        );
    }
}

function loadEmployees() {
    if (!employeeSelect) return;

    employeeSelect.innerHTML =
        '<option value="" disabled selected>Select Employee</option>';

    employeeInformation.forEach(employee => {
        const option = document.createElement("option");

        option.value = employee.employeeId;
        option.textContent = employee.name;

        employeeSelect.appendChild(option);
    });
}

function updateSummary() {
    const totalPayroll = payrollData.reduce(
        (total, payroll) =>
            total + payroll.finalSalary,
        0
    );

    const annualPayroll = totalPayroll * 12;

    const averageSalary =
        payrollData.length > 0
            ? totalPayroll / payrollData.length
            : 0;

    if (activeEmployeesEl) {
        activeEmployeesEl.textContent =
            payrollData.length;
    }

    if (totalPayrollEl) {
        totalPayrollEl.textContent =
            formatCurrency(totalPayroll);
    }

    if (averageSalaryEl) {
        averageSalaryEl.textContent =
            formatCurrency(averageSalary);
    }

    if (annualPayrollEl) {
        annualPayrollEl.textContent =
            formatCurrency(annualPayroll);
    }
}

function generatePayslip() {
    const selectedPayroll = payrollData.find(
        payroll =>
            payroll.employeeId ==
            employeeSelect.value
    );

    if (!selectedPayroll) {
        alert("Please select an employee.");
        return;
    }

    const selectedEmployee =
        employeeInformation.find(
            employee =>
                employee.employeeId ==
                selectedPayroll.employeeId
        );

    if (!selectedEmployee) {
        alert("Employee information not found.");
        return;
    }

    const selectedPeriod =
        document.getElementById("period")?.value;

    if (selectedPeriod && payPeriod) {
        const date =
            new Date(selectedPeriod + "-01");

        payPeriod.textContent =
            "Pay Period: " +
            date.toLocaleString("en-US", {
                month: "long",
                year: "numeric"
            });
    }

    if (employeeCode) {
        employeeCode.textContent =
            "E" +
            selectedPayroll.employeeId
                .toString()
                .padStart(3, "0");
    }

    if (empName) {
        empName.textContent =
            selectedEmployee.name;
    }

    if (empDept) {
        empDept.textContent =
            selectedEmployee.department;
    }

    if (empPosition) {
        empPosition.textContent =
            selectedEmployee.position;
    }

    if (empHours) {
        empHours.textContent =
            selectedPayroll.hoursWorked + " hrs";
    }

    const basicSalary =
        selectedEmployee.salary;

    const yearlySalary =
        basicSalary * 12;

    const overtimeHours =
        Math.max(
            selectedPayroll.hoursWorked - 160,
            0
        );

    const overtimePay =
        overtimeHours * 250;

    const bonusPay =
        basicSalary >= 70000
            ? 1500
            : 500;

    const grossPay =
        basicSalary +
        overtimePay +
        bonusPay;

    const taxAmount =
        grossPay * 0.18;

    const pensionAmount =
        grossPay * 0.05;

    const medicalAidAmount =
        selectedPayroll.medicalAidDeduction * 250;

    const deductions =
        taxAmount +
        pensionAmount +
        medicalAidAmount;

    const netSalary =
        grossPay -
        deductions;

    if (salary) {
        salary.textContent =
            formatCurrency(basicSalary);
    }

    if (annualSalary) {
        annualSalary.textContent =
            formatCurrency(yearlySalary);
    }

    if (overtime) {
        overtime.textContent =
            formatCurrency(overtimePay);
    }

    if (bonus) {
        bonus.textContent =
            formatCurrency(bonusPay);
    }

    if (gross) {
        gross.textContent =
            formatCurrency(grossPay);
    }

    if (tax) {
        tax.textContent =
            "-" + formatCurrency(taxAmount);
    }

    if (pension) {
        pension.textContent =
            "-" + formatCurrency(pensionAmount);
    }

    if (medicalAid) {
        medicalAid.textContent =
            "-" + formatCurrency(medicalAidAmount);
    }

    if (totalDeductions) {
        totalDeductions.textContent =
            "-" + formatCurrency(deductions);
    }

    if (netPay) {
        netPay.textContent =
            formatCurrency(netSalary);
    }

    localStorage.setItem(
        "lastPayslip",
        JSON.stringify({
            employeeId:
                selectedEmployee.employeeId,
            name:
                selectedEmployee.name,
            department:
                selectedEmployee.department,
            position:
                selectedEmployee.position,
            hours:
                selectedPayroll.hoursWorked,
            salary:
                basicSalary,
            annualSalary:
                yearlySalary,
            overtime:
                overtimePay,
            bonus:
                bonusPay,
            gross:
                grossPay,
            tax:
                taxAmount,
            pension:
                pensionAmount,
            medicalAid:
                medicalAidAmount,
            deductions:
                deductions,
            netPay:
                netSalary
        })
    );

    if (emptyState) {
        emptyState.classList.add("hidden");
    }

    if (payslip) {
        payslip.classList.remove("hidden");
    }
}

function displayPayrollRecords() {
    const tableBody =
        document.getElementById(
            "payrollTableBody"
        );

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (payrollData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="padding:20px;text-align:center;">
                    No payroll records found.
                </td>
            </tr>
        `;
        return;
    }

    payrollData.forEach(payroll => {
        const employee =
            employeeInformation.find(
                employee =>
                    employee.employeeId ==
                    payroll.employeeId
            );

        if (!employee) return;

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td style="padding:12px;">
                ${employee.name}
            </td>

            <td style="padding:12px;">
                ${payroll.hoursWorked}
            </td>

            <td style="padding:12px;">
                ${formatCurrency(payroll.finalSalary)}
            </td>

            <td style="padding:12px;">
                <button
                    type="button"
                    onclick="editPayroll(${payroll.payrollId})"
                >
                    <i class="fa-solid fa-pen"></i>
                    Edit
                </button>

                <button
                    type="button"
                    onclick="deletePayroll(${payroll.payrollId})"
                >
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function loadPayrollEmployees() {
    const select =
        document.getElementById(
            "payrollEmployee"
        );

    if (!select) return;

    select.innerHTML =
        '<option value="" disabled selected>Select Employee</option>';

    employeeInformation.forEach(employee => {
        const option =
            document.createElement("option");

        option.value =
            employee.employeeId;

        option.textContent =
            employee.name;

        select.appendChild(option);
    });
}

function showAddPayrollForm() {
    editingPayrollId = null;

    const form =
        document.getElementById(
            "payrollForm"
        );

    const title =
        document.getElementById(
            "formTitle"
        );

    if (title) {
        title.textContent =
            "Add Payroll";
    }

    loadPayrollEmployees();

    document.getElementById(
        "payrollEmployee"
    ).value = "";

    document.getElementById(
        "hoursWorked"
    ).value = "";

    document.getElementById(
        "leaveDeductions"
    ).value = "";

    form.classList.remove("hidden");
}

function editPayroll(id) {
    const payroll =
        payrollData.find(
            record =>
                record.payrollId == id
        );

    if (!payroll) {
        alert("Payroll record not found.");
        return;
    }

    editingPayrollId =
        payroll.payrollId;

    const form =
        document.getElementById(
            "payrollForm"
        );

    const title =
        document.getElementById(
            "formTitle"
        );

    loadPayrollEmployees();

    if (title) {
        title.textContent =
            "Edit Payroll";
    }

    document.getElementById(
        "payrollEmployee"
    ).value =
        payroll.employeeId;

    document.getElementById(
        "hoursWorked"
    ).value =
        payroll.hoursWorked;

    document.getElementById(
        "leaveDeductions"
    ).value =
        payroll.medicalAidDeduction;

    form.classList.remove("hidden");

    if (
        payrollRecordsContent &&
        payrollRecordsContent.classList.contains("hidden")
    ) {
        payrollRecordsContent.classList.remove("hidden");

        if (recordsArrow) {
            recordsArrow.classList.remove(
                "fa-chevron-down"
            );

            recordsArrow.classList.add(
                "fa-chevron-up"
            );
        }
    }
}

function cancelPayroll() {
    editingPayrollId = null;

    const form =
        document.getElementById(
            "payrollForm"
        );

    form.classList.add("hidden");
}

async function savePayroll() {
    const employeeId =
        document.getElementById(
            "payrollEmployee"
        ).value;

    const hoursValue =
        document.getElementById(
            "hoursWorked"
        ).value;

    const leaveValue =
        document.getElementById(
            "leaveDeductions"
        ).value;

    if (!employeeId) {
        alert("Please select an employee.");
        return;
    }

    if (
        hoursValue === "" ||
        Number(hoursValue) < 0
    ) {
        alert("Please enter valid hours worked.");
        return;
    }

    if (
        leaveValue === "" ||
        Number(leaveValue) < 0
    ) {
        alert("Please enter a valid deduction.");
        return;
    }

    const payroll = {
        employee_id:
            Number(employeeId),

        hours_worked:
            Number(hoursValue),

        leave_deductions:
            Number(leaveValue)
    };

    try {
        let response;

        if (editingPayrollId) {
            response =
                await fetch(
                    `${API_URL}/${editingPayrollId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify(payroll)
                    }
                );
        } else {
            response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify(payroll)
                    }
                );
        }

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Payroll operation failed."
            );
        }

        alert(
            editingPayrollId
                ? "Payroll updated successfully."
                : "Payroll created successfully."
        );

        editingPayrollId = null;

        document.getElementById(
            "payrollForm"
        ).classList.add("hidden");

        await loadPayrollData();

    } catch (error) {
        console.error(
            "Payroll save error:",
            error
        );

        alert(
            error.message ||
            "Unable to save payroll."
        );
    }
}

async function deletePayroll(id) {
    const confirmed =
        confirm(
            "Are you sure you want to delete this payroll record?"
        );

    if (!confirmed) {
        return;
    }

    try {
        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to delete payroll."
            );
        }

        alert(
            "Payroll deleted successfully."
        );

        await loadPayrollData();

    } catch (error) {
        console.error(
            "Delete payroll error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete payroll."
        );
    }
}

if (payrollRecordsToggle) {
    payrollRecordsToggle.addEventListener(
        "click",
        () => {
            payrollRecordsContent.classList.toggle(
                "hidden"
            );

            recordsArrow.classList.toggle(
                "fa-chevron-down"
            );

            recordsArrow.classList.toggle(
                "fa-chevron-up"
            );
        }
    );
}

if (addPayrollBtn) {
    addPayrollBtn.addEventListener(
        "click",
        showAddPayrollForm
    );
}

if (savePayrollBtn) {
    savePayrollBtn.addEventListener(
        "click",
        savePayroll
    );
}

if (cancelPayrollBtn) {
    cancelPayrollBtn.addEventListener(
        "click",
        cancelPayroll
    );
}

if (generateBtn) {
    generateBtn.addEventListener(
        "click",
        generatePayslip
    );
}

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener(
        "click",
        () => {
            if (
                payslip.classList.contains(
                    "hidden"
                )
            ) {
                alert(
                    "Please generate a payslip first."
                );
                return;
            }

            downloadPdfBtn.style.display =
                "none";

            printBtn.style.display =
                "none";

            const options = {
                margin: 5,
                filename:
                    `${empName.textContent}-Payslip.pdf`,
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 1.5,
                    scrollY: 0,
                    useCORS: true
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                }
            };

            html2pdf()
                .set(options)
                .from(payslip)
                .save()
                .then(() => {
                    downloadPdfBtn.style.display =
                        "";

                    printBtn.style.display =
                        "";

                    const message =
                        document.getElementById(
                            "downloadMessage"
                        );

                    if (message) {
                        message.classList.add(
                            "show"
                        );

                        setTimeout(() => {
                            message.classList.remove(
                                "show"
                            );
                        }, 3000);
                    }
                })
                .catch(() => {
                    downloadPdfBtn.style.display =
                        "";

                    printBtn.style.display =
                        "";

                    alert(
                        "Unable to generate PDF."
                    );
                });
        }
    );
}

if (printBtn) {
    printBtn.addEventListener(
        "click",
        () => {
            window.print();
        }
    );
}

function logout() {
    window.location.href =
        "index.html";
}

function displayCurrentDate() {
    const today =
        new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const dateElement =
        document.getElementById(
            "currentDate"
        );

    if (dateElement) {
        dateElement.textContent =
            today.toLocaleDateString(
                "en-GB",
                options
            );
    }
}

function loadSavedPayslip() {
    const savedPayslip =
        localStorage.getItem(
            "lastPayslip"
        );

    if (!savedPayslip) {
        return;
    }

    try {
        const data =
            JSON.parse(
                savedPayslip
            );

        if (empName) {
            empName.textContent =
                data.name;
        }

        if (empDept) {
            empDept.textContent =
                data.department;
        }

        if (empPosition) {
            empPosition.textContent =
                data.position;
        }

        if (empHours) {
            empHours.textContent =
                data.hours + " hrs";
        }

        if (salary) {
            salary.textContent =
                formatCurrency(
                    data.salary
                );
        }

        if (annualSalary) {
            annualSalary.textContent =
                formatCurrency(
                    data.annualSalary
                );
        }

        if (overtime) {
            overtime.textContent =
                formatCurrency(
                    data.overtime
                );
        }

        if (bonus) {
            bonus.textContent =
                formatCurrency(
                    data.bonus
                );
        }

        if (gross) {
            gross.textContent =
                formatCurrency(
                    data.gross
                );
        }

        if (tax) {
            tax.textContent =
                "-" +
                formatCurrency(
                    data.tax
                );
        }

        if (pension) {
            pension.textContent =
                "-" +
                formatCurrency(
                    data.pension
                );
        }

        if (medicalAid) {
            medicalAid.textContent =
                "-" +
                formatCurrency(
                    data.medicalAid
                );
        }

        if (totalDeductions) {
            totalDeductions.textContent =
                "-" +
                formatCurrency(
                    data.deductions
                );
        }

        if (netPay) {
            netPay.textContent =
                formatCurrency(
                    data.netPay
                );
        }

        if (employeeCode) {
            employeeCode.textContent =
                "E" +
                data.employeeId
                    .toString()
                    .padStart(3, "0");
        }

        if (emptyState) {
            emptyState.classList.add(
                "hidden"
            );
        }

        if (payslip) {
            payslip.classList.remove(
                "hidden"
            );
        }

    } catch (error) {
        console.error(
            "Could not load saved payslip:",
            error
        );
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadAllEmployees();
    loadPayrollData();
    displayCurrentDate();
    loadSavedPayslip();
});

async function loadAllEmployees() {
    try {
        const response = await fetch(https://modern-tech-back.onrender.com/employees);

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const result = await response.json();

        const employees = result.data || result;

        employeeInformation = employees.map(employee => ({
            employeeId: employee.employee_id,
            name: employee.name,
            position: employee.position,
            department: employee.department,
            salary: Number(employee.salary || 0)
        }));

        loadEmployees();
        loadPayrollEmployees();

    } catch (error) {
        console.error("Failed to load employees:", error);
    }
}
