const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const movieRouter = require("./routes/movies");

// MIDDLEWARES
const logger = require("./middlewares/logger");

app.use(express.static("public")); // file statici --> immagini
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/test-error", (req, res) => {
  a.b;
  res.send("Hello world");
});

// ERRORS HANDLING
const errorMiddleware = require("./middlewares/errorsHandler");
app.use(errorMiddleware.error404);
app.use(errorMiddleware.error500);
// SERVER START
app.listen(3000, () => {
  console.log("Server environment: " + process.env.APP_MODE); // per far sapere al server che è eseguito in DEV --> IL MIO ENVIRONMENT localhost for testing
  console.log(
    "Server listening on " + process.env.APP_URL + ";" + process.env.APP_PORT,
  );
});
