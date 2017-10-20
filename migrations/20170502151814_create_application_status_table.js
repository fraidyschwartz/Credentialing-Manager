exports.up = function(knex, Promise) {
  return knex.schema.createTable('application_statuses', table => {
  	table.increments('applicationStatusId').primary();
    table.string('applicationStatus');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('application_statuses');
};