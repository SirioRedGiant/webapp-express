const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const movieRouter = require("./routes/movies");
const globalRouter = require("./routes/globalRouter");

// MIDDLEWARES
const logger = require("./middlewares/logger");
const errorMiddleware = require("./middlewares/errorsHandler");
app.use("/", globalRouter);

app.use(logger); // Attivazione del logger ad ogni richiesta
app.use(express.static("public")); // file statici --> immagini
app.use(express.json());

// DEFINIZIONE ROTTE
app.get("/", (req, res) => {
  res.send("Welcome to Movies-DB!");
});
app.use("/movies", movieRouter);

// rotta test error 500
app.get("/test-error", (req, res) => {
  a.b;
  res.send("Hello world");
});

// ERRORS HANDLING
app.use(errorMiddleware.error404);
app.use(errorMiddleware.error500);

// SERVER START
app.listen(process.env.APP_PORT || 3000, () => {
  console.log("Server environment: " + process.env.APP_MODE); // per far sapere al server che è eseguito in DEV --> IL MIO ENVIRONMENT localhost for testing
  console.log(
    "Server listening on " + process.env.APP_URL + ":" + process.env.APP_PORT,
  );
});
