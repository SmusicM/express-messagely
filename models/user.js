/** User class for message.ly */

const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require("bcrypt");
/** User of the site. */
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  
  

  static async register({username, hashedPassword, first_name, last_name, phone }) {
   
    const result = await db.query(
      `INSERT INTO users(username,password,first_name,last_name,phone,join_at)
      VALUES($1,$2,$3,$4,$5,NOW())
      RETURNING username,first_name,last_name,phone,join_at`,
      [username, hashedPassword, first_name, last_name, phone]
    )
    return result.rows[0];
   }
  
  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
      const result = await db.query(`
        SELECT password FROM users WHERE username = $1
        `,[username])
        const user = result.rows[0]
        if(!user){
          return false
        }
        const auth_valid = await bcrypt.compare(password, user.password) 
          
        return auth_valid
        
        
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const results = await db.query(
      `UPDATE users SET last_login_at = mow()
      WHERE username = $1`,[username]
    )
    return results.rows
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
       const results = await db.query(
        `SELECT username,first_name,last_name,phone FROM users
        ORDER BY first_name,last_name`
       )
       return results.rows
      }

  /** Get: get user by username
   *
   * returns {username, first_name, last_name, phone, join_at, last_login_at } */
 

  static async get(username) {
    const results = await db.query(
      `SELECT username,first_name,last_name,phone FROM users
      WHERE username = $1
      ORDER BY first_name,last_name`,[username]
     )
     return results.rows
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(`
      SELECT users.username,users.first_name,users.last_name,users.phone,
      messages.id,messages.to_username,messages.body,messages.sent_at,messages.read_at
      FROM messages
      JOIN users ON messages.to_username = users.username
      WHERE messages.from_username = $1
      `,[username])
      return results.rows.map(row=>({
        id:row.id,
        body: row.body,
        sent_at: row.sent_at,
        read_at: row.read_at,
        to_user:{
          username:row.username,
          first_name:row.first_name,
          last_nane:row.last_name,
          phone:row.phone
        }
      }))
   }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const results = await db.query(`
      SELECT users.username,users.first_name,users.last_name,users.phone,
      messages.id,messages.from_username,messages.body,messages.sent_at,messages.read_at
      FROM messages
      JOIN users ON messages.from_username = users.username
      WHERE messages.to_username = $1
      `,[username])
      return results.rows.map(row=>({
        id:row.id,
        body: row.body,
        sent_at: row.sent_at,
        read_at: row.read_at,
        from_user:{
          username:row.username,
          first_name:row.first_name,
          last_nane:row.last_name,
          phone:row.phone
        }
      }))
   }
}


module.exports = User;