const express = require("express");

const User = require("../models/user");
const ExpressError = require("../expressError");
//const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/",  ensureLoggedIn,async function (req, res, next) {
    try{
      const results = await User.all()
     
      //console.log(results)
      return res.json(results)
    }catch(e){
      next(e)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureLoggedIn,async function (req, res, next) {
    try{
      const results = await User.get(req.params.username)

      if (results.length === 0) {
        //let invalidError = new Error(
        //  `There is no User with that Username ${req.params.username}`
        //);
        //invalidError.status = 404;
        //throw invalidError;
        throw new ExpressError(`There is no User with that Username`,400)
      }
      console.log(results)
      
      return res.json(results)
    }catch(e){
      next(e)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to",async function (req, res, next) {
  try{
    const results = await User.messagesTo(req.params.username)

    if (results.length === 0) {
      //let invalidError = new Error(
      //  `There is no User with that Username ${req.params.username}`
      //);
      //invalidError.status = 404;
      //throw invalidError;
      throw new ExpressError(`There is no User with that Username`,400)
    }
    console.log(results)
    
    return res.json(results)
  }catch(e){
    next(e)
  }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", async function (req, res, next) {
  try{
    const results = await User.messagesFrom(req.params.username)

    if (results.length === 0) {
      //let invalidError = new Error(
      //  `There is no User with that Username ${req.params.username}`
      //);
      //invalidError.status = 404;
      //throw invalidError;
      throw new ExpressError(`There is no User with that Username`,400)
    }
    console.log(results)
    
    return res.json(results)
  }catch(e){
    next(e)
  }
})
module.exports = router;