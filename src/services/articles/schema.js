const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ArticleSchema = new Schema(
  {
    headLine: String,
    subHead: String,
    content: String,
    category: { name: String, img: String },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    cover: String,
    review: [{ text: String, user: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema); // bounded to Users collections
