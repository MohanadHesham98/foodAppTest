import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword) {
      console.log("Admin credentials not found in .env");
      return;
    }

    const adminExists = await userModel.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await userModel.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

export default createAdmin;
