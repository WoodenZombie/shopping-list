const express = require("express");
const ctrl = require("../controllers/shoppingListController");
const auth = require("../middleware/auth");
const ShoppingList = require("../models/ShoppingList");
const router = express.Router();

router.post("/create", auth(["owner", "admin"]), ctrl.create);
router.get("/list", auth(["owner", "member", "admin"]), ctrl.list);
router.get("/get", auth(["owner", "member", "admin"]), ctrl.get);
router.put("/update", auth(["owner", "admin"]), ctrl.update);
router.put("/archive", auth(["owner", "admin"]), ctrl.archive);
router.put("/unarchive", auth(["owner", "admin"]), ctrl.unarchive);
router.delete("/delete", auth(["owner", "admin"]), ctrl.delete);
router.delete("/leave", auth(["member", "admin"]), ctrl.leave);

// Test MongoDB connection
router.get("/test-db", async (req, res) => {
  try {
    const testList = await ShoppingList.findOne();
    res.status(200).json({ message: "MongoDB connection successful", data: testList });
  } catch (error) {
    res.status(500).json({ message: "MongoDB connection failed", error: error.message });
  }
});

module.exports = router;
