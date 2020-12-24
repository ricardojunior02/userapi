const knex = require('knex');

const connection = knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'userapi'
  }

})

module.exports = connection;