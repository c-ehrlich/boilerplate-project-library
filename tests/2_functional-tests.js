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

    // suite("GET /api/books => array of books", function () {
    //   test("Test GET /api/books", function (done) {
    //     assert.fail();
    //   });
    // });

    // suite("GET /api/books/[id] => book object with [id]", function () {
    //   test("Test GET /api/books/[id] with id not in db", function (done) {
    //     assert.fail();
    //   });

    //   test("Test GET /api/books/[id] with valid id in db", function (done) {
    //     assert.fail();
    //   });
    // });

    // suite(
    //   "POST /api/books/[id] => add comment/expect book object with id",
    //   function () {
    //     test("Test POST /api/books/[id] with comment", function (done) {
    //       assert.fail();
    //     });

    //     test("Test POST /api/books/[id] without comment field", function (done) {
    //       assert.fail();
    //     });

    //     test("Test POST /api/books/[id] with comment, id not in db", function (done) {
    //       assert.fail();
    //     });
    //   }
    // );

    // suite("DELETE /api/books/[id] => delete book object id", function () {
    //   test("Test DELETE /api/books/[id] with valid id in db", function (done) {
    //     assert.fail();
    //   });

    //   test("Test DELETE /api/books/[id] with  id not in db", function (done) {
    //     assert.fail();
    //   });
    // });
  });
});
