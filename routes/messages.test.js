const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Message = require("../models/message");
const ExpressError = require("../expressError");
const db = require("../db");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const router = new express.Router();

let testMessage;

beforeEach(async function () {
  
  const result = await db.query(
    `INSERT INTO messages (
              from_username,
              to_username,
              body,
              sent_at)
            VALUES ('testuser', 'testuser2', 'testmessage', current_timestamp)
            RETURNING id, from_username, to_username, body, sent_at`
  );
  console.log(testMessage);
  testMessage = result.rows[0];
  console.log(testMessage);
  //testMessage.add_date = testinvoice.add_date.toISOString();
});

//describe("POST /messages/", function () {
//    test("returns message details at specified id", async function () {
//      const response = await request(app).post(`/messages/`).send({
//
//      });
//  
//      expect(response.statusCode).toBe(200);
//      expect(response.body).toEqual();
//    });
//  });


describe("GET /messages/:id", function () {
  test("returns message details at specified id", async function () {
    const response = await request(app).get(`/messages/${testMessage.id}`);

    expect(response.statusCode).toBe(200);
    //expect(response.body).toEqual();
  });
});

afterEach(async function () {
  // delete any data created by test
  await db.query("DELETE FROM messages");
});

afterAll(async function () {
  // close db connection
  await db.end();
});
