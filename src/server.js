const express = require("express");
const cors = require("cors");
const { join } = require("path");
const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");

const articlesRoutes = require("./services/articles");
const authorsRoutes = require("./services/authors");

const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  badRequestHandler,
  catchAllHandler,
} = require("./errorHandlers");

const server = express();

const port = process.env.PORT || 3001;

const staticFolderPath = join(__dirname, "../public");
server.use(express.static(staticFolderPath));
server.use(express.json());

server.use(cors());

server.get("/", (req, res, next) => res.send("Server is running..."));
server.use("/articles", articlesRoutes);
server.use("/authors", authorsRoutes);

// ERROR HANDLERS
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", port);
      } else {
        console.log("Running locally on port", port);
      }
    })
  )
  .catch((err) => console.log(err));
