require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany(); // Clear existing users

        // Read data from users.json
        const rawData = fs.readFileSync(path.resolve(__dirname, "users.json"));
        const users = JSON.parse(rawData);

        // Hash passwords before inserting
        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            }))
        );

        await User.insertMany(hashedUsers);
        console.log("✅ Users imported successfully!");

        // Close DB connection
        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error("❌ Error importing users:", error);
        process.exit(1);
    }
};

seedUsers();
