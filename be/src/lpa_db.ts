import mysql from 'mysql';
import util from 'util';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

//-- env
console.log('@ db info, host:', DB_HOST);
console.log('@ db info, user:', DB_USER);
console.log('@ db info, port:', DB_PORT);
console.log('@ db info, db:', DB_DATABASE);
//!--

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

export const dbQuery = util.promisify(db.query).bind(db);
