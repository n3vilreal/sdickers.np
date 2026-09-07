const knex = require("knex");
const bcrypt = require("bcryptjs");
const config = require("../../knexfile");
const User = require("../model/userModel");

let bootstrapped = false;

exports.connectDatabase = async () => {
  const db = knex(config);
  try {
    await db.raw("select 1");
  } catch (error) {
    console.log("Database connection error:", error);
    throw error;
  }
  if (!bootstrapped) {
    const isAdminExists = await User.findByEmail(process.env.ADMIN_EMAIL);
    const adminMatch = isAdminExists.find((u) => u.role === "admin");
    if (!adminMatch) {
      await User.create({
        user_email: process.env.ADMIN_EMAIL,
        user_password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
        user_phone_number: process.env.ADMIN_PHONE,
        user_name: process.env.ADMIN_USERNAME,
        role: "admin",
      });
    }
    bootstrapped = true;
  }
  return db;
};