exports.up = function(knex, Promise) {
  return knex.schema.createTable('doctor_insurances', table => {
  	table.increments('doctorInsuranceId').primary();
    table.integer('doctorId');
    table.integer('insuranceId');
    table.integer('applicationStatusId');
    table.date('effectiveDate');
    table.string('notes');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('doctor_insurances');
};