const Sequelize = require('sequelize');
const debug = require('debug')('sql');
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/boiler'
const db = new Sequelize(DATABASE_URL, {
  logging: debug
});

module.exports = db;
