require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function sendSuccess(result, datos){
  result.status(200).send({
    success: true,
    datos,
  });
};

function sendError(result, error){
  result.status(500).send({
    success: false,
    mensaje: error.message,
  });
};

db.getConnection((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos Store Perú");
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})