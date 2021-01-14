express = require("express");
const mongoose = require("mongoose");

const AuthorModel = require("./schema");

const authorsRouter = express.Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorModel.find(req.query);

    if (authors) {
      res.send(authors);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading authors list a problem occurred!");
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.id);
    if (author) {
      res.send(author);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next("While reading authors list a problem occurred!");
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);

    const { _id } = await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );

    if (modifiedAuthor) {
      res.send(modifiedAuthor);
    } else {
      const error = new Error(`author with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndDelete(req.params.id);

    if (author) {
      res.send("Deleted");
    } else {
      const error = new Error(`author with id ${req.params.id} not found`);
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = authorsRouter;
