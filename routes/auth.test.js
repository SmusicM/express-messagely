process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// use small value here so tests are fast
const BCRYPT_WORK_FACTOR = 1;

let testUserToken;

beforeEach(async function () {
  const hashedPassword = await bcrypt.hash("secret", BCRYPT_WORK_FACTOR);
  await db.query(
    `INSERT INTO users 
    (username,password,first_name,last_name,phone,join_at)
    VALUES ('test', $1,'TestFirstName','TestLastName','123456789',NOW())`,
    [hashedPassword]
  );
  const testUser = { username: "test" };
  testUserToken = jwt.sign(testUser, SECRET_KEY);
});

describe("POST /auth/register", function () {
  test("returns {username}", async function () {
    //this shows the same date as expected and recieved but its not exact so it 
    //cannot assert equal for join_at
    //thats why in expect i have it to response.body.join_at since its dynamically created
    const CURRENT_DATE = new Date().toISOString()
    const response = await request(app).post(`/auth/register`).send({
      username: "test2",
      password: "secret2",
      first_name: "test2name",
      last_name: "test2last",
      phone: "3333333333"
     
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      username: "test2",
      first_name: "test2name",
      last_name: "test2last",
      phone: "3333333333",
      join_at: response.body.join_at
    });
  });
});


describe('POST /auth/login', function () {
    test("returns logged in msg", async function () {
      const response = await request(app)
        .post(`/auth/login`)
        .send({ username: "test", password: "secret" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ token: expect.any(String) });
    });
  
    test("fails with wrong password", async function () {
      const response = await request(app)
        .post(`/auth/login`)
        .send({ username: "test", password: "WRONG" });
      expect(response.statusCode).toBe(400);
    });
  });

 

  afterEach(async function () {
    // delete any data created by test
    await db.query("DELETE FROM users");
  });
  
  afterAll(async function () {
    // close db connection
    await db.end();
  });