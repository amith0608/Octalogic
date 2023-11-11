import dotenv from "dotenv";
import mysql from "mysql";
import fs from "fs";
dotenv.config();

//configuration of your mysql database
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const connection = mysql.createConnection(dbConfig);

const seedScript = fs.readFileSync("seed.sql", "utf8");

const sqlStatements = seedScript
  .split(";")
  .filter((statement) => statement.trim() !== "");

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database.");
    executeNextStatement();
  }
});

function executeNextStatement() {
  if (sqlStatements.length === 0) {
    connection.end();
    console.log("Data seeding complete.");
  } else {
    const statement = sqlStatements.shift();
    connection.query(statement, (err, results) => {
      if (err) {
        console.error("Error executing SQL statement:", err);
        connection.end();
      } else {
        console.log("SQL statement executed successfully.");
        executeNextStatement();
      }
    });
  }
}
