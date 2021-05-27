const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');


  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  // Establish a connection to the database
  pool = mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASS, // e.g. 'my-db-password'
    database: process.env.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    // Specify additional properties here.
    
  });


pool.query = promisify(pool.query);
module.exports = pool;
