const express = require("express");
const Messages = require("../models/message");
const ExpressError = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async function (req, res, next) {
    try{
      const results = await Messages.get(req.params.id)
  
     
      console.log(results)
      
      return res.json(results)
    }catch(e){
      next(e)
    }
  })

  //{
//	"to_username": "firstuser",
//	"body":"first post!"
//}

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn,async function (req, res, next) {
    try {
      const {from_username,to_username,body} = req.body
      const result = await Messages.create({from_username,to_username,body})
      
      console.log(result)
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", async function (req, res, next) {
    try {
      
      const result = Messages.markRead(req.params.id)
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  });
module.exports = router;