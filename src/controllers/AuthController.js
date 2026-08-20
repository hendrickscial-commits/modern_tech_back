import AuthModel from "../models/AuthModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {

    // LOGIN
    static async login(req, res) {

        try {

            const { email, password } = req.body;

            // Check that the user entered both fields
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            // Find the user in the database
            const user = await AuthModel.findUserByEmail(email);

            // User does not exist or is not an HR administrator
            if (!user) {
                return res.status(401).json({
                    message: "Acess denied "
                });
            }

            // Check the password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            // Password is incorrect
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // This portal is for HR administrators only.
            if (user.role?.toLowerCase() !== "hr") {
                return res.status(403).json({
                    message: "Access denied"
                });
            }

              // CREATE JWT TOKEN
            const token = jwt.sign(
                {
                    userId: user.user_id,
                    employeeId: user.employee_id,
                    role: user.role,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            // Login successful
            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.user_id,
                    email: user.email,
                    role: user.role,
                    employeeId: user.employee_id
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Login failed"
            });

        }
    }

}

export default AuthController;
