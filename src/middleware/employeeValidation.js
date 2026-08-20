export const validateEmployee = (req, res, next) => {

    const {
        name,
        position,
        department,
        salary,
        employment_history,
        contact
    } = req.body;

    if (!name || !position || !department || salary === undefined || salary === null || !employment_history || !contact) {
        return res.status(400).json({
            message: "All employee fields are required"
        });
    }

    if (Number(salary) < 0) {
        return res.status(400).json({
            message: "Salary cannot be negative"
        });
    }

    if (!contact.includes("@")) {
        return res.status(400).json({
            message: "Please provide a valid email address"
        });
    }

    const startsEachWordWithCapital = (value) =>
        value.trim().split(/\s+/).every((word) => /^[A-Z]/.test(word));

    if (!startsEachWordWithCapital(name)) {
        return res.status(400).json({
            message: "Each first and last name must start with an uppercase letter"
        });
    }

    if (!startsEachWordWithCapital(position)) {
        return res.status(400).json({
            message: "Each word in the position must start with an uppercase letter"
        });
    }

    if (!startsEachWordWithCapital(department)) {
        return res.status(400).json({
            message: "Each word in the department must start with an uppercase letter"
        });
    }

    const allowedDepartments = [
        "Development",
        "HR",
        "QA",
        "Sales",
        "Marketing",
        "Design",
        "IT",
        "Finance",
        "Support"
    ];

    if (!allowedDepartments.includes(department.trim())) {
        return res.status(400).json({
            message: `Department must be one of: ${allowedDepartments.join(", ")}`
        });
    }

    next();
};
