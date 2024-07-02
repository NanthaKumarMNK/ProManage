const User = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const formData = req.body;
    let errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = "Field can't be empty";
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    if (!/^[a-zA-Z]+$/.test(formData.name)) {
      return res.status(400).json({
        name: "Invalid name",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        email: "Invalid email",
      });
    }

    const isExistingUser = await User.findOne({ email: formData.email });
    if (isExistingUser) {
      return res.status(400).json({ errorMessage: "User already exists" });
    }

    if (formData.password.length < 4) {
      return res.status(400).json({
        password: "Weak password",
      });
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const match = await bcrypt.compare(formData.cPassword, hashedPassword);
    if (!match) {
      return res.status(400).json({
        cPassword: "password doesn't match",
      });
    }

    const userData = new User({
      name: formData.name,
      email: formData.email,
      password: hashedPassword,
      assignie: [],
    });

    await userData.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const formData = req.body;

    let errors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        errors[key] = "Field can't be empty";
      }
    });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const userDetails = await User.findOne({ email: formData.email });

    if (!userDetails) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid Username and password" });
    }

    const passwordMatch = await bcrypt.compare(
      formData.password,
      userDetails.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userDetails._id }, process.env.SECRTE_KEY);

    res.cookie("token", token, { httpOnly: true });
    res.cookie("userId", userDetails.userId, { httpOnly: true });

    res.json({
      message: "User logged in",
      userId: userDetails._id,
      userEmail: userDetails.email,
      token: token,
      name: userDetails.name,
    });
  } catch (error) {
    next(error);
  }
};
const getUserData = async (req, res, next) => {
  try {
    const userId = req.params.userId.replace(":", "");
    const userDetails = await User.findById({ _id: userId });

    if (!userDetails) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid Username and password" });
    }

    res.json({
      name: userDetails.name,
      email: userDetails.email,
    });
  } catch (error) {
    next(error);
  }
};
const getAssignie = async (req, res, next) => {
  try {
    const userId = req.params.userId.replace(":", "");
    const userDetails = await User.findById(
      { _id: userId },
      {
        assignie: 1,
      }
    );

    if (!userDetails) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid Username and password" });
    }

    res.json({
      assignie: userDetails.assignie,
    });
  } catch (error) {
    next(error);
  }
};

const putUserData = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const formData = req.body;

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    let updatedUserInfo = {};

    if (userToUpdate.name !== formData.name) {
      if (!/^[a-zA-Z]+$/.test(formData.name)) {
        return res.status(400).json({ errorMessage: "Invalid name" });
      } else {
        updatedUserInfo["name"] = formData.name;
      }
    }

    if (userToUpdate.email !== formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return res.status(400).json({ errorMessage: "Invalid email" });
      } else {
        const existingUser = await User.findOne({
          _id: { $ne: userId },
          email: formData.email,
        });

        if (existingUser) {
          return res.status(400).json({ errorMessage: "Email already exists" });
        }

        updatedUserInfo["email"] = formData.email;
      }
    }

    if (formData.oldPassword && formData.newPassword) {
      const isPasswordMatch = await bcrypt.compare(
        formData.oldPassword,
        userToUpdate.password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({ errorMessage: "Invalid old password" });
      }

      if (formData.oldPassword === formData.newPassword) {
        return res
          .status(400)
          .json({
            errorMessage: "New password must be different from old password",
          });
      }

      if (formData.newPassword.length < 4) {
        return res
          .status(400)
          .json({
            errorMessage: "New password must be at least 4 characters long",
          });
      }

      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
      updatedUserInfo["password"] = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserInfo, {
      new: true,
      runValidators: true,
    });

    res.json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const formData = req.body;
    if (formData.assignie) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.assignie)) {
        return res.status(400).json({
          errorMessage: "Invalid email",
        });
      }
    }
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    if (userToUpdate.assignie.length === 0) {
      userToUpdate.assignie.push(formData.assignie);
    } else {
      if (userToUpdate.assignie.includes(formData.assignie)) {
        return res
          .status(400)
          .json({ errorMessage: "User already assigned to board" });
      }
      userToUpdate.assignie.push(formData.assignie);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({ message: `${formData.assignie} added to board` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserData,
  putUserData,
  putUser,
  getAssignie,
};
