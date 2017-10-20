
exports.up = function(knex, Promise) {
  return knex.schema.createTable('doctors', table => {
  	table.increments('doctorId').primary();
  	table.string('name');
  	table.string('credentials');
    table.boolean('isActive');
    table.integer('facilityId');
    table.integer('departmentId');
    table.string('notes');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('doctors');
};