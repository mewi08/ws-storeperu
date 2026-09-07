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

  const listaCategoria = ['Juguetes', 'Tecnología', 'Ropa', 'Hogar'];

  if(!nombre){ 
    throw new Error('Ingrese el nombre del producto');
  };
  
  if(!listaCategoria.includes(categoria)) {
    throw new Error('La categoría no es valida');
  };

  if(!descripcion){
    throw new Error('Ingrese la descripción del producto');
  };

  if(garantia != null && garantia < 0){
    throw new Error('La garantia no puede ser negativa');
  };

  if(precio == null){
    throw new Error('Ingrese el precio del producto');
  }

  if(stock == null){
    throw new Error('Ingrese el stock del producto');
  }

  if(precio <= 0){
    throw new Error('El precio debe ser mayor a 0');
  };

  if(stock < 0){
    throw new Error('El stock no puede ser negativo');
  };
}

//Función para validar si existe un producto por ID
//Si encuentra un producto devolverá la constante 1
async function validarProducto(id) {
  const sql = 'SELECT 1 FROM productos WHERE id = ?';
  const [res] = await db.query(sql, [id]);

  if (res.length == 0) {
    throw new Error('No encontrado');
  }
}

//Crear
app.post("/productos", async (require, result) => {
  try{
    validarDatos(require.body);
    const { nombre, categoria, descripcion, 
    garantia, precio, stock } = require.body;

  const sql = `
    INSERT INTO productos (nombre, categoria, descripcion, garantia, precio, stock)
      VALUES (?,?,?,?,?,?) 
    `;

  const [res] = await db.query(sql, [nombre, categoria, descripcion, garantia, precio, stock]);

  sendSuccess(result, { id: res.insertId } );

  }catch(error){
    sendError(result, error);
  }
});

//actualizar
app.put("/productos/:id", async (require, result) => {
  try{
    validarDatos(require.body);
    const { id } = require.params;
    await validarProducto(id);
    const { nombre, categoria, descripcion, 
    garantia, precio, stock } = require.body;

    const sql = `
      UPDATE productos SET 
        nombre = ?,
        categoria = ?,
        descripcion = ?,
        garantia = ?,
        precio = ?,
        stock = ?,
        update_at = NOW()
      WHERE id = ?
    `;

    const [res] = await db.query(sql, [nombre, categoria, descripcion, garantia, precio, stock, id]);

    sendSuccess(result, { affectedRows: res.affectedRows });
  }catch(error){
    sendError(result, error);
  };
});

//eliminar
app.delete("/productos/:id", async (require, result) => {
  try{
    const { id } = require.params;
    await validarProducto(id);

    const sql = 'DELETE FROM productos WHERE id = ?';

    const [res] = await db.query(sql, [id]);
    sendSuccess(result, { affectedRows : res.affectedRows});
  }catch(error){
    sendError(result, error);
  }
});

//listar 
app.get("/productos", async (require, result) => {
  try{
    const sql = `
    SELECT id, nombre, categoria, descripcion, garantia, precio, stock
      FROM productos
      ORDER BY id DESC
      LIMIT 5`;

    const [res] = await db.query(sql);
    sendSuccess(result, res);
  }catch(error){
    sendError(result, error);
  }
});

//buscar por id
app.get("/productos/:id", async (require, result) => {
  try{
    const { id } = require.params;
    await validarProducto(id);
    
    const sql = `
    SELECT id, nombre, categoria, descripcion, garantia, precio, stock
    FROM productos
    WHERE id = ?`;

    const [res] = await db.query(sql, [id]);
    sendSuccess(result, res[0]);
  }catch(error){
    sendError(result, error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})