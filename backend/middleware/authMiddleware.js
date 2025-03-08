const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        console.log("✅ Authenticated User:", req.user);
        next();
    } catch (error) {
        console.error("❌ Token Verification Error:", error.message);
        res.status(403).json({ message: "Token is not valid" });
    }
};

module.exports = authenticateUser;
