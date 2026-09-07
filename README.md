# WebService
Está aplicación, utiliza NodeJS como entorno de desarrollo para acceder y gestionas los datos desde MySQL y servirlos a través de un API REST en formato JSON.

### Requerimientos
- NodeJS
- MySQL

### Base de datos
Restaure la BD, tabla y registros desde el archivo **database.sql**.

### Despliegue
1. Clone el repositorio: 
```shell
  git clone https://github.com/usuario/mi-proyecto.git
```

2. Restaure node_modules:
```shell
npm install
```

3. Configure las variables de entorno:
```shell
copy .env.example .env
```

4. Ejecute el servidor local:
```shell
npm run dev
```

### API Rutas
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/productos` | Crea un producto |
| PUT | `/productos/:id` | Actualiza un producto |
| DELETE | `/productos/:id` | Elimina un producto |
| GET | `/productos` | Lista los productos |
| GET | `/productos:id` | Buscar producto por ID |
| GET | `/productos/categoria/:categoria` | Buscar producto por categoría |

### Créditos
_Desarrollado por: **Melanie Tello**_