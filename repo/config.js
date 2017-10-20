var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : "localhost",
    user : "root",
    password : '1234',
    database : "credentialing_manager"
  }
});

export default knex;