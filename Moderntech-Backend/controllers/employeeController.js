// Temporary employee data
// This will eventually come from MySQL.

const employees = [
    {
        id: 1,
        name: "Employee 1",
        department: "Human Resources",
        position: "HR Manager"
    },
    {
        id: 2,
        name: "Employee 2",
        department: "Finance",
        position: "Financial Analyst"
    },
    {
        id: 3,
        name: "Employee 3",
        department: "IT",
        position: "Software Developer"
    },
    {
        id: 4,
        name: "Employee 4",
        department: "Marketing",
        position: "Marketing Specialist"
    },
    {
        id: 5,
        name: "Employee 5",
        department: "Operations",
        position: "Operations Coordinator"
    },
    {
        id: 6,
        name: "Employee 6",
        department: "IT",
        position: "Systems Administrator"
    },
    {
        id: 7,
        name: "Employee 7",
        department: "Finance",
        position: "Accountant"
    },
    {
        id: 8,
        name: "Employee 8",
        department: "Human Resources",
        position: "HR Officer"
    },
    {
        id: 9,
        name: "Employee 9",
        department: "Marketing",
        position: "Content Specialist"
    },
    {
        id: 10,
        name: "Employee 10",
        department: "Operations",
        position: "Operations Manager"
    }
];


// GET all employees
const getEmployees = (req, res) => {
    res.status(200).json(employees);
};


// GET one employee
const getEmployeeById = (req, res) => {
    const employee = employees.find(
        employee => employee.id === Number(req.params.id)
    );

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json(employee);
};


module.exports = {
    getEmployees,
    getEmployeeById
};