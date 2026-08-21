require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const employeeRoutes = require("./routes/employeeRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Employee routes
app.use("/api/employees", employeeRoutes);

// Performance routes
app.use("/api/performance", performanceRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "ModernTech backend is running!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});