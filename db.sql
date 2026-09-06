CREATE DATABASE store_peru;
USE store_peru;

CREATE TABLE productos(
    id 		    INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(30) NOT NULL,
    categoria   VARCHAR(15) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    garantia    TINYINT NULL DEFAULT 0,
    precio      DECIMAL(6,2) NOT NULL,
    stock       SMALLINT NOT NULL,

    create_at   DATETIME NOT NULL DEFAULT NOW(),
    update_at   DATETIME NULL
)ENGINE=InnoDB;

INSERT INTO productos (nombre, categoria, descripcion, garantia, precio, stock) VALUES
('Casa de muñecas','Juguetes', 'Casa de muñecas con 2 pisos',0, 50, 2),
('Laptop Lenovo','Tecnología','Gran tecnología de refrigeración',12,2000.5,10),
('Teclado Mecánico Gamer','Tecnología','Resiste a salpicaduras y con cable removible',12,80,2);