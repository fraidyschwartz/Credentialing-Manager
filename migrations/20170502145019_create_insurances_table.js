
exports.up = function(knex, Promise) {
  return knex.schema.createTable('insurances', table => {
  	table.increments('insuranceId').primary();
  	table.string('name');
  	table.string('address1');
  	table.string('address2');
    table.string('city');
    table.string('state');
    table.string('zip');
    table.string('fax');
    table.string('email');
    table.string('groupContractNumber');
    table.string('notes');
    table.string('necessaryDocs')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('insurances');
};
