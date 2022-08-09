/* eslint-disable no-console */
const pool = require('./lib/utils/pool');
const { readFileSync } = require('node:fs');
const sql = readFileSync('./sql/setup.sql', 'utf-8');

async function setupDb() {
  try {
    await pool.query(sql);
    console.log('setup complete');
  } catch (e) {
    console.log(e);
  }
}

setupDb();
