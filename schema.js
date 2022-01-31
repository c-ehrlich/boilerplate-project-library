/**
 * Schema Setup
 */
// const myDB = require("./connection"); // TODO is this necessary?
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String] },
});
const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
