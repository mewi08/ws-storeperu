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

//para agregar códigos de estado HTTP
class ErrorHttp extends Error {
  //el constructor recibe el mensaje y el código de estado
  constructor(mensaje, status) {
    //envía el mensaje a la clase Error
    super(mensaje);
    //guarda el código de estado HTTP
    this.status = status;
  }
}

function sendSuccess(result, datos){
  result.status(200).send({
    success: true,
    datos,
  });
};

function sendError(result, error){
  result.status(error.status || 500).send({
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
    throw new ErrorHttp('Ingrese el nombre del producto', 400);
  };
  
  if(!listaCategoria.includes(categoria)) {
    throw new ErrorHttp('La categoría no es valida', 400);
  };

  if(!descripcion){
    throw new ErrorHttp('Ingrese la descripción del producto', 400);
  };

  if(garantia != null && garantia < 0){
    throw new ErrorHttp('La garantia no puede ser negativa', 400);
  };

  if(precio == null){
    throw new ErrorHttp('Ingrese el precio del producto', 400);
  }

  if(stock == null){
    throw new ErrorHttp('Ingrese el stock del producto', 400);
  }

  if(precio <= 0){
    throw new ErrorHttp('El precio debe ser mayor a 0', 400);
  };

  if(stock < 0){
    throw new ErrorHttp('El stock no puede ser negativo', 400);
  };
}

//Función para validar si existe un producto por ID
//Si encuentra un producto devolverá la constante 1
async function validarProducto(id) {
  const sql = 'SELECT 1 FROM productos WHERE id = ?';
  const [res] = await db.query(sql, [id]);

  if (res.length == 0) {
    throw new ErrorHttp('No encontrado', 404);
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

  sendSuccess(result, { 
    id: res.insertId,
    mensaje: "Producto registrado"
  });

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

    sendSuccess(result, { 
      affectedRows: res.affectedRows,
      mensaje: "Producto actualizado"
    });
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
    sendSuccess(result, { 
      affectedRows : res.affectedRows,
      mensaje: "Producto eliminado"
    });
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
    const sql = `
    SELECT id, nombre, categoria, descripcion, garantia, precio, stock
    FROM productos
    WHERE id = ?`;

    const [res] = await db.query(sql, [id]);
    if (res.length === 0) {
      throw new ErrorHttp('No encontrado', 404);
    }
    sendSuccess(result, res[0]);
  }catch(error){
    sendError(result, error);
  }
});

//buscar por categoria
app.get("/productos/categoria/:categoria", async (require, result) => {
  try{
    const { categoria } = require.params;
    const sql = `
    SELECT id, nombre, categoria, descripcion, garantia, precio, stock
    FROM productos
    WHERE categoria = ?`;

    const [res] = await db.query(sql, [categoria]);
    if(res.length == 0){
      throw new ErrorHttp('No encontrado', 404);
    }
    sendSuccess(result, res);
  }catch(error){
    sendError(result, error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})