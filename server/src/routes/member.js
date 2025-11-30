const express = require("express");
const ctrl = require("../controllers/memberController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth(["owner", "admin"]), ctrl.add);
router.delete("/remove", auth(["owner", "admin"]), ctrl.remove);
router.get("/list", auth(["owner", "member", "admin"]), ctrl.list);

module.exports = router;
