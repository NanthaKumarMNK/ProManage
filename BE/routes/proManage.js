const express = require("express");
const router = express.Router();
const proManageController = require("../controllers/proManage");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/createList", verifyToken, proManageController.postCreateList);
router.put("/editList/:listId", verifyToken, proManageController.putEditList);
router.put("/putList/:listId",  proManageController.putList);

router.delete("/delete/:listId", verifyToken, proManageController.deleteList);

router.get("/list/:listId", proManageController.getList);
router.get("/getAllList/:myEmail", proManageController.getAllList);
router.get("/getAnalytics", proManageController.getAnalytics);

module.exports = router;
