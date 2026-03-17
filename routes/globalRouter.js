const express = require("express");
const router = express.Router();
const movieRouter = require("./movies");

// REGISTRO di tutte le risorse del sito
router.use("/movies", movieRouter);
// router.use('/actors', /directors); // Esempio futuro

module.exports = router;
