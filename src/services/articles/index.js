express = require("express");
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");
const ArticleModel = require("./schema");

const articlesRouter = express.Router();

articlesRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ArticleModel.countDocuments(query.criteria);

    const articles = await ArticleModel.find(
      query.criteria,
      query.options.fields
    )
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .populate("authors");
    res.send({ links: query.links("/articles", total), articles });
  } catch (error) {
    next("Sorry, a problem occurred!");
  }
});

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id).populate("authors");
    res.send(article);
  } catch (error) {
    next("While reading articles list a problem occurred!");
  }
});

articlesRouter.post("/", async (req, res, next) => {
  try {
    const newArticle = new ArticleModel(req.body);

    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true, new: true }
    );

    if (modifiedArticle) {
      res.send(modifiedArticle);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);

    if (article) {
      res.send(`Article ${article} deleted`);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const { review } = await ArticleModel.findById(req.params.id, {
      review: 1,
      _id: 0,
    });
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { review } = await ArticleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        review: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    if (review && review.length > 0) {
      res.send(review);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.post("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id, {
      _id: 0,
    });

    const updated = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          review: req.body.review,
        },
      },
      { runValidators: true, new: true }
    );
    res.status(201).send(updated);
  } catch (error) {
    next(error);
  }
});

articlesRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { review } = await ArticleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        review: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    );

    if (review && review.length > 0) {
      const reviewToEdit = { ...review[0].toObject(), ...req.body };

      const modifiedArticle = await ArticleModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "review._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        { $set: { "review.$": reviewToEdit } },
        {
          runValidators: true,
          new: true,
        }
      );
      res.send(modifiedArticle);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          review: {
            _id: mongoose.Types.ObjectId(req.params.reviewId),
          },
        },
      },
      {
        new: true,
      }
    );
    res.send(modifiedArticle);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = articlesRouter;
