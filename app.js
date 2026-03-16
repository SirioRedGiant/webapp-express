const express = require("express");
const app = express();

// MIDDLEWARES
const logger = require("./middlewares/logger");

app.use(logger);
app.use(express.static("public"));
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
app.use(errorMiddleware.error500);
app.use(errorMiddleware.error404);

// SERVER START
app.listen(3000, () => {
  console.log("Server listening...");
});
