const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los productos o buscar por descripción
router.get('/', async (req, res) => {
    try {
        const { descripcion, rubro } = req.query;
        let query = `
            SELECT p.Codigo, p.Nombre, p.Descripcion, p.Precio, p.URLImagen, r.Descripcion AS Rubro
            FROM productos p
            LEFT JOIN rubros r ON p.Rubro = r.Codigo
            `;
        const params = [];

        // Filtro por descripción
        if (descripcion) {
            query += ' WHERE p.Descripcion LIKE ?';
            params.push(`%${descripcion}%`);
        }

        // Filtro por rubro
        if (rubro) {
            query += descripcion ? ' AND' : ' WHERE';
            query += ' p.Rubro = ?';
            params.push(rubro);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Obtener lista de rubros
router.get('/rubros', async (req, res) => {
    try {
        const [rubros] = await pool.query('SELECT Codigo, Descripcion FROM rubros');
        res.json(rubros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los rubros', error });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    // Verifica si hay un token de sesión
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const { Nombre, Descripcion, Rubro, Precio, URLImagen } = req.body;
        const query = 'INSERT INTO productos (Nombre, Descripcion, Rubro, Precio, URLImagen) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(query, [Nombre, Descripcion, Rubro, Precio, URLImagen]);
        res.json({ message: 'Producto creado con éxito', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {  // Cambiar '/' por '/:id'
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const { id } = req.params;
        const { Nombre, Descripcion, Rubro, Precio, URLImagen } = req.body;  // Agregar Nombre
        const query = `
            UPDATE productos
            SET Nombre = ?, Descripcion = ?, Rubro = ?, Precio = ?, URLImagen = ?
            WHERE Codigo = ?
        `;
        await pool.query(query, [Nombre, Descripcion, Rubro, Precio, URLImagen, id]);
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.Codigo, p.Nombre, p.Descripcion, p.Rubro, p.Precio, p.URLImagen, r.Descripcion AS RubroNombre
            FROM productos p
            LEFT JOIN rubros r ON p.Rubro = r.Codigo
            WHERE p.Codigo = ?
        `;
        const [rows] = await pool.query(query, [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    // Verifica si hay un token de sesión
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const { id } = req.params;
        const query = 'DELETE FROM productos WHERE Codigo = ?';
        await pool.query(query, [id]);
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

module.exports = router;