const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const dbSocketAddr = process.env.DB_HOST.split(':');

const pool = mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    host: dbSocketAddr[0], // e.g. '127.0.0.1'
    port: dbSocketAddr[1], // e.g. '3306'
    // ... Specify additional properties here.
  });

pool.query = promisify(pool.query);
module.exports = pool;
