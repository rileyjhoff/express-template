-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS random_data;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE random_data (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR NOT NULL,
  active BOOLEAN NOT NULL DEFAULT(false),
  age INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
)