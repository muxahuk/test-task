const knex = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_URL
});
const KnexOrm = require('knex-orm').default;

const Database = new KnexOrm(knex);

module.exports = Database;
module.exports.knex = knex;
