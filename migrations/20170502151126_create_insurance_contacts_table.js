exports.up = function(knex, Promise) {
  return knex.schema.createTable('insurance_contacts', table => {
  	table.increments('insuranceContactId').primary();
  	table.integer('insuranceId');
  	table.string('title');
  	table.string('firstName');
  	table.string('lastName');
  	table.string('phone');
  	table.string('ext');
  	table.string('fax');
  	table.string('email');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('insurance_contacts');
};