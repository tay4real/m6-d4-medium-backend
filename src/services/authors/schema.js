const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const AuthorSchema = new Schema(
  { name: String, img: String },
  { timestamps: true }
);

module.exports = mongoose.model("Author", AuthorSchema); // bounded to Users collections
