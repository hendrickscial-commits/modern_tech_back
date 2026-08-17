const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

const payrollRoutes = require('./routes/payrollRoutes.js');

app.use('/payroll', payrollRoutes);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to ModernTech Solutions API'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});