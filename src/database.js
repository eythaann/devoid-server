import { createPool } from 'mysql';
import { promisify } from 'util';
import { database } from './keys.js';

const pool = createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
    if (err.code === 'ETIMEDOUT'){
      console.error('Database is lost');
    }
  }

  if (connection){ 
  connection.release(); 
  console.log('Database is Connected');
  }
  return;

})
pool.query = promisify(pool.query);
export default pool;

