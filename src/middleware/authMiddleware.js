import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if token was provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    // Get only the token
    const token = authHeader.split(" ")[1];

    try {

        // Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Save the decoded user information
        req.user = decoded;

        // Continue to the route
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};