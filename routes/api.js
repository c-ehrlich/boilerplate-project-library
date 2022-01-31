/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
const { Book } = require("../schema");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      Book.find({}, "title _id comments", (err, books) => {
        books = books.map((book) => ({
          ...book._doc,
          commentcount: book.comments.length,
        }));
        res.json(books);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title || title === "") {
        return res.send("missing required field title");
      }

      const book = new Book({ title: title });
      book.save().then((book) => {
        return res.json({
          title: book.title,
          _id: book._id,
        });
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      const bookid = req.params.id;
      Book.findOne({ _id: bookid }, "_id title comments", (err, book) => {
        if (!book) {
          // this needs to go before the `if (err)` check
          // because not getting an obj can happen both with and without err
          return res.send("no book exists");
        }
        if (err) {
          console.error(err);
          return res.send("no book exists");
        }
        const bookReturn = { ...book._doc, commentcount: book.comments.length };
        return res.json(bookReturn);
      });
    })

    .post(function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment || comment === "") {
        return res.send("missing required field comment");
      }
      Book.findOneAndUpdate(
        { _id: bookid },
        { $push: { comments: comment } },
        { fields: "_id title comments", new: true },
        (err, book) => {
          if (!book) {
            return res.send("no book exists");
          }
          if (err) {
            console.error(err);
            return res.send(`error: ${err}`);
          }
          const bookReturn = {
            ...book._doc,
            commentcount: book.comments.length,
          };
          return res.json(bookReturn);
        }
      );
      //json res format same as .get

      // return res.send("missing required field comment");

      // check if the book exists first, THEN if there is a comment

      // if good: return the entire book, with the new comment AND commentcount
      // MAYBE make prepareBookForJson a function, that strips out any unnecessary fields and adds commentcount?
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
