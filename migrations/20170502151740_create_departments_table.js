exports.up = function(knex, Promise) {
  return knex.schema.createTable('departments', table => {
  	table.increments('departmentId').primary();
    table.string('department');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('departments');
};