import pool from "../config/database.js";

class AuthModel {

    // Finding a user by email
    static async findUserByEmail(email) {

        const [rows] = await pool.execute(`
            SELECT *
            FROM users
            WHERE email = ?;
        `, [email]);

        return rows[0] || null;
    }

}

export default AuthModel;