const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    assignie:{
       type: Array,
      required: true,
    }
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("User", userSchema);
