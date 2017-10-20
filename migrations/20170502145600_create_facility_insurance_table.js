exports.up = function(knex, Promise) {
  return knex.schema.createTable('facility_insurances', table => {
  	table.increments('facilityInsuranceId').primary();
  	table.integer('facilityId');
  	table.integer('insuranceId');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('facility_insurances');
};