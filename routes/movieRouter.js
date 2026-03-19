const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.index);
router.get("/:id", movieController.show);
router.post("/:id/review", movieController.storeReview);

module.exports = router;
