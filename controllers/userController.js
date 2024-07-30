const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/uploadMiddleware");

// Get user details
exports.getUserDetails = async (req, res) => {
  const tentuserid = req.params.id;
  console.log("tentuserid", tentuserid, req.params);

  try {
    const user = await userService.getUserById(tentuserid);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.json({ status: "success", data: user });
  } catch (error) {
    console.error("Get user details error:", error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Update user details
exports.updateUserDetails = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: "error", message: err });
    }

    const tentuserid = req.params.id;
    const { firstname, lastname, email } = req.body;
    let profileImagePath = req.body.profileImagePath;

    if (req.file) {
      profileImagePath = req.file.path;
    }

    try {
      const user = await userService.updateUserDetails(tentuserid, {
        firstname,
        lastname,
        email,
        profileImagePath,
      });
      res.json({
        status: "success",
        message: "User details updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Update user details error:", error.message);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  });
};

// Update user password
exports.updateUserPassword = async (req, res) => {
  const tentuserid = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await userService.getUserById(tentuserid);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updateUserPassword(tentuserid, hashedPassword);

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
