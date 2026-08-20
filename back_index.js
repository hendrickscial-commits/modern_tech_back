import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import employeeRoutes from "./src/routes/employeeRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 2020;

app.use(cors());

app.use(express.json());

// Employee routes
app.use("/employees", employeeRoutes);

//Auth routes
app.use("/auth", authRoutes);


// Home route
app.get("/", (req, res) => {

    res.json({
        message: "ModernTech HR Backend API is running"
    });

});


app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});