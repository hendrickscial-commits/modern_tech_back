import express from "express";
import cors from "cors";
import payrollRoutes from "./routes/payrollRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = 2020;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/payroll", payrollRoutes);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});