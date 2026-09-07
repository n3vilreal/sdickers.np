const User = require("../../../model/userModel");

const shapeUser = (u) => ({
  _id: u.id,
  id: u.id,
  userEmail: u.user_email,
  userPhoneNumber: u.user_phone_number,
  userName: u.user_name,
  role: u.role,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
});

exports.getAllUsers = async (req, res) => {
  try {
    const rows = await User.all();
    res.status(200).json({ total: rows.length, data: rows.map(shapeUser) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: shapeUser(u) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Please provide a valid role (customer or admin)" });
    }
    if (
      req.user &&
      String(req.user.id) === String(req.params.id) &&
      role !== "admin"
    ) {
      return res.status(400).json({ message: "You cannot demote your own account" });
    }
    const [updated] = await User.update(req.params.id, { role });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User role updated successfully", data: shapeUser(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user && String(req.user.id) === String(req.params.id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    const deleted = await User.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};