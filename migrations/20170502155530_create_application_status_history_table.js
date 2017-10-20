exports.up = function(knex, Promise) {
  return knex.schema.createTable('application_status_history', table => {
  	table.increments('applicationStatusHistoryId').primary();
    table.integer('doctorInsuranceId');
    table.integer('applicationStatusId');
    table.datetime('assignedDate').defaultTo(knex.raw('current_timestamp'));
    table.string('assignedBy');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('application_status_history');
};