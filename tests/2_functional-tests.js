/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

const mongoose = require("mongoose");
const { Issue } = require("../schema");
const { expect } = require("chai");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(
  //         res.body[0],
  //         "commentcount",
  //         "Books in array should contain commentcount"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "title",
  //         "Books in array should contain title"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "_id",
  //         "Books in array should contain _id"
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", async () => {
          const now = new Date().getTime();
          const createRes = await chai
            .request(server)
            .post("/api/books")
            .type("form")
            .send({
              title: `test-book-${now}`,
            });
          assert.equal(createRes.status, 200);
          assert.exists(createRes.body._id);
          assert.property(createRes.body, "title", `test-book-${now}`);
        });

        test("Test POST /api/books with no title given", async () => {
          const now = new Date().getTime();
          const createRes = await chai
            .request(server)
            .post("/api/books")
            .type("form");
          assert.equal(createRes.status, 200);
          assert.equal(createRes.text, "missing required field title");
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", async () => {
        const now = new Date().getTime();
        const createRes = await chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({
            title: `test-book-${now}`,
          });
        assert.equal(createRes.status, 200);
        assert.exists(createRes.body._id);
        assert.property(createRes.body, "title", `test-book-${now}`);

        const getRes = await chai.request(server).get("/api/books");
        assert.equal(getRes.status, 200);
        const length = getRes.body.length;
        assert.isAtLeast(length, 1);
        assert.equal(getRes.body[length - 1].title, `test-book-${now}`);
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", async () => {
        const getRes = await chai
          .request(server)
          .get("/api/books/ffffffffffffffffffffffff");
        assert.equal(getRes.status, 200);
        assert.equal(getRes.text, "no book exists");
      });

      test("Test GET /api/books/[id] with valid id in db", async () => {
        const now = new Date().getTime();
        const createRes = await chai
          .request(server)
          .post("/api/books")
          .type("form")
          .send({
            title: `test-book-${now}`,
          });
        assert.equal(createRes.status, 200);
        assert.property(createRes.body, "title", `test-book-${now}`);
        assert.exists(createRes.body._id);

        const id = createRes.body._id;
        const getRes = await chai.request(server).get(`/api/books/${id}`);
        assert.equal(createRes.status, 200);
        assert.property(createRes.body, "_id", `${id}`);
        assert.property(createRes.body, "title", `test-book-${now}`);
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", async () => {
          const now = new Date().getTime();
          const createRes = await chai
            .request(server)
            .post("/api/books")
            .type("form")
            .send({
              title: `test-book-${now}`,
            });
          assert.equal(createRes.status, 200);
          assert.exists(createRes.body._id);
          assert.property(createRes.body, "title", `test-book-${now}`);

          const _id = createRes.body._id;

          const commentRes = await chai
            .request(server)
            .post(`/api/books/${_id}`)
            .type("form")
            .send({
              comment: now,
            });
          assert.equal(commentRes.status, 200);
          assert.deepEqual(commentRes.body, {
            _id: _id,
            title: `test-book-${now}`,
            commentcount: 1,
            comments: [now.toString()],
          });
        });

        test("Test POST /api/books/[id] without comment field", async () => {
          const commentRes = await chai
            .request(server)
            .post(`/api/books/foo`)
            .type("form")
            .send({});
          assert.equal(commentRes.status, 200);
          assert.equal(commentRes.text, "missing required field comment");
        });

        test("Test POST /api/books/[id] with comment, id not in db", async () => {
          const commentRes = await chai
            .request(server)
            .post(`/api/books/foo`)
            .type("form")
            .send({
              comment: "bar",
            });
          assert.equal(commentRes.status, 200);
          assert.equal(commentRes.text, "no book exists");
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", async (done) => {
        // create a book
        const now = new Date().getTime();
        const createRes = await chai.request(server).post("/api/books").type("form").send({
          title: `test-book-${now}`,
        });
        assert.equal(createRes.status, 200, "createRes should return 200");
        assert.property(createRes.body, "title", `test-book-${now}`);
        assert.exists(createRes.body._id);

        // delete the book
        const _id = createRes.body._id;
        const deleteRes = await chai.request(server).delete(`/api/books/${_id}`);
        assert.equal(deleteRes.status, 200, "deleteRes should return 200");
        assert.equal(deleteRes.text, "delete successful", "Deleting the book should succeed");

        // make sure the book is deleted
        const getRes = await chai
          .request(server)
          .get(`/api/books/${_id}`);
        assert.equal(getRes.status, 200, "getRes should return 200");
        assert.equal(getRes.text, "no book exists");
      });

      test("Test DELETE /api/books/[id] with  id not in db", async () => {
        const badTitle = "foo";
        const deleteRes = await chai.request(server).delete(`/api/books/${badTitle}`);
        assert.equal(deleteRes.status, 200);
        assert.equal(deleteRes.text, "no book exists");
      });
    });
  });
});
