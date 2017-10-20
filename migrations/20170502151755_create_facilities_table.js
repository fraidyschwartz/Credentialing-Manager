exports.up = function(knex, Promise) {
  return knex.schema.createTable('facilities', table => {
  	table.increments('facilityId').primary();
    table.string('facility');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('facilities');
};