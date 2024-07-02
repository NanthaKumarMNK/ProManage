const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/getUserData/:userId", authController.getUserData);
router.get("/getAssignie/:userId", authController.getAssignie);
router.put("/putUserData/:userId",verifyToken,authController.putUserData);
router.put("/putUser/:userId",verifyToken,authController.putUser);

module.exports = router;
