const {
  createPack,
  getAllPacks,
  getSinglePack,
  updatePack,
  deletePack,
} = require("../controller/admin/pack/packController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const router = require("express").Router();
router.route("/pack").post(isAuthenticated, isAdmin, createPack);
router.route("/packs").get(getAllPacks);
router.route("/pack/:id").get(getSinglePack);
router.route("/pack/:id").patch(isAuthenticated, isAdmin, updatePack);
router.route("/pack/:id").delete(isAuthenticated, isAdmin, deletePack);
module.exports = router;
