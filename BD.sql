CREATE DATABASE ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE rubros (
    Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Descripcion VARCHAR(80) NOT NULL
);

CREATE TABLE productos (
    Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(80) NOT NULL,
    Descripcion VARCHAR(250) NOT NULL,
    Rubro INT,
    Precio DECIMAL(15, 2),
    URLImagen VARCHAR(120),
    FOREIGN KEY (Rubro) REFERENCES rubros(Codigo)
);

INSERT INTO rubros (Descripcion) VALUES 
    ('Electrónica'), 
    ('Hogar'), 
    ('Deportes'), 
    ('Juguetes'), 
    ('Ropa'), 
    ('Alimentos');
    
INSERT INTO productos (Nombre, Descripcion, Rubro, Precio, URLImagen) VALUES
    ('Smart Tv LG Smart', 'Con el Smart TV 43ur8750 vivi el 4K', 1, 599999.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_843765-MLU73339199662_122023-F.webp'),
    ('Notebook Acer Aspire', 'Notebook Acer Aspire 3 | 15.6" pantalla FHD | AMD Ryzen 7 5700U | 16GB de RAM | 512GB de SSD', 1, 1365799.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_735859-MLU75755217597_042024-F.webp'),
    ('Motorola Moto G54', 'Celular con una memoria RAM de 8 GB y una memoria interna de 128GB.', 1, 549999.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_745268-MLU77601394582_072024-F.webp'),
    ('Suono Home/Office aspiradora', 'La aspiradora trineo de 2,5 litros de Suono es la herramienta definitiva para mantener tu hogar impecable con facilidad y eficacia.', 2, 108206.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_904408-MLU75243264969_032024-F.webp'),
    ('Lampara Luna Llena 3d Gadnic', 'Lámpara Gadnic Luna 13cm 16 Colores RGB + Blanco Luz Cálida y Fría', 2, 28999.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_686051-MLU72926688021_112023-F.webp'),
    ('Silla Gamer Pro Ergonomica Giratoria Femmto', 'Experimenta el máximo confort y cuida tu salud con la Silla de Escritorio Femmto GP001 Gamer Ergonómica.', 2, 291078.87, 'https://http2.mlstatic.com/D_NQ_NP_2X_911642-MLU71128255302_082023-F.webp'),
    ('Pelota De Voley Wolfi', 'Pelota De Voley Cuero Sintético', 3, 11850, 'https://http2.mlstatic.com/D_NQ_NP_2X_686801-MLA42073719894_062020-F.webp'),
    ('Longboard Lab Super Start', 'La tabla #1 de todos los iniciantes que busquen manejar su primer Longboard, junto a su gran diseño Super Star, disfruta y vive una verdadera aventura', 3, 159084, 'https://http2.mlstatic.com/D_NQ_NP_2X_876096-MLA48752163466_012022-F.webp'),
    ('Pokémon Booster Pack', 'Pokémon Trick Or Trade Booster Pack', 4, 3150, 'https://http2.mlstatic.com/D_NQ_NP_2X_624777-MLA72274776672_102023-F.webp'),
    ('UNO', '¿El rey de los juegos rompe amistades? Definitivamente el Uno.', 4, 14046, 'https://http2.mlstatic.com/D_NQ_NP_2X_769807-MLA79737631359_102024-F.webp'),
    ('Camiseta Termica', 'Remera Camiseta Termica Primera Piel Manga Larga Pro', 5, 17099.99, 'https://http2.mlstatic.com/D_NQ_NP_2X_773286-MLA49387405274_032022-F.webp'),
    ('Camiseta G2', 'Camiseta G2 2020 E-sports', 5, 30000, 'https://http2.mlstatic.com/D_NQ_NP_2X_687162-MLA71412026001_082023-F.webp'),
    ('Caramelos Flynn Paff', 'Caramelos Flynn Paff Tutti Frutti Sin Tacc Caja X70', 6, 4326.52, 'https://http2.mlstatic.com/D_NQ_NP_2X_924679-MLA49255653272_032022-F.webp'),
    ('Caramelos Pico Dulce', 'Caramelos masticables Pico Dulce 500g en paquete', 6, 3500, 'https://http2.mlstatic.com/D_NQ_NP_2X_886640-MLU74842940554_032024-F.webp');


select * from rubros;
select * from productos;
select * from users;
