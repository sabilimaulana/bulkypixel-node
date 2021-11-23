const { Router } = require("express");
const {
  addPhotographer,
  getPhotographers,
  getPhotographer,
  editPhotographer,
  deletePhotographer,
} = require("../controllers/photographer");
const { uploadFile } = require("../middlewares/uploadFile");
const router = Router();

router.post("/", uploadFile("image"), addPhotographer);
router.get("/", getPhotographers);
router.get("/:slug", getPhotographer);
router.patch("/:slug", uploadFile("image"), editPhotographer);
router.delete("/:slug", deletePhotographer);

module.exports = router;
