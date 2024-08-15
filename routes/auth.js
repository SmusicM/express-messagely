const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../expressError");
const db = require("../db");
const { ensureLoggedIn, ensureCorrectUser, authenticateJWT } = require("../middleware/auth");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const router = new express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await User.authenticate(username, password);
   
    if (result) { 
      let token = jwt.sign({username: result.username }, SECRET_KEY);
      console.log("logged in success");
      console.log(token)
      return res.json({ token });
    }else{
      throw new ExpressError("Invalid user/password", 400);
    }
    
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await User.register({
      username,
      hashedPassword,
      first_name,
      last_name,
      phone,
    });
    console.log(result)
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});




module.exports = router;
