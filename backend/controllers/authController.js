const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    const { studentId, password } = req.body;

    try {
        const user = await User.findOne({ studentId });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

          console.log("🔑 Generated Token:", token);

        res.json({ token, user: { studentId: user.studentId, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
