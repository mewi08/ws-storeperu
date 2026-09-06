require('dotenv').config();
const express = require("express");
const mysql = require('mysql2/promise');
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

//Función para validar los datos de entrada
function validarDatos(datos){
  const { nombre, categoria, descripcion, 
    garantia, precio, stock } = datos;
  
  if(!nombre){ 
    throw new Error('Ingrese el nombre del producto');
  };
  
  if(!categoria) {
    throw new Error('Ingrese la categoria del producto');
  };

  if(!descripcion){
    throw new Error('Ingrese la descripción del producto');
  };

  if(garantia != null && garantia < 0){
    throw new Error('La garantia no puede ser negativa');
  };

  if(!precio){
    throw new Error('Ingrese el precio del producto');
  }

  if(!stock){
    throw new Error('Ingrese el stock del producto');
  }

  if(precio < 0){
    throw new Error('El precio no puede ser negativo');
  };

  if(stock < 0){
    throw new Error('El stock no puede ser negativo');
  };
}

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})