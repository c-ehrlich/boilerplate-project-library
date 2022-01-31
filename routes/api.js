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

    .delete(async function (req, res) {
      const deleteRes = await Book.deleteMany({});
      console.log(`deleted ${deleteRes.deletedCount} items`);
      res.send("complete delete successful");
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
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;

      Book.findOneAndDelete({ _id: bookid }, (err, book) => {
        if (!book) {
          return res.send("no book exists");
        }
        if (err) {
          console.err(error);
          return res.send(err);
        }

        return res.send("delete successful");
      });
    });
};
