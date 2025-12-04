const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: "" },
  role: { type: String, default: "user" } // Mặc định là 'user', admin set tay sau
});

module.exports = mongoose.model("User", userSchema);