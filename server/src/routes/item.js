const express = require("express");
const ctrl = require("../controllers/itemController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth(["owner", "member", "admin"]), ctrl.add);
router.delete("/remove", auth(["owner", "member", "admin"]), ctrl.remove);
router.put("/update", auth(["owner", "member", "admin"]), ctrl.update);
router.put("/resolve", auth(["owner", "member", "admin"]), ctrl.resolve);
router.put("/unresolve", auth(["owner", "member", "admin"]), ctrl.unresolve);
router.get("/list", auth(["owner", "member", "admin"]), ctrl.list);
router.get("/get", auth(["owner", "member", "admin"]), ctrl.get);

module.exports = router;
