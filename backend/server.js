const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Importar body-parser
const app = express();
const pool = require('./config/db');
const productosRouter = require('./routes/productos');
const authRoutes = require('./routes/auth'); // Importar rutas de autenticación

app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(express.json()); // Para parsear JSON en las solicitudes

// Rutas
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ message: 'Conexión exitosa', result: rows[0].solution });
    } catch (error) {
        res.status(500).json({ message: 'Error en la conexión', error });
    }
});

app.use('/api/productos', productosRouter);
app.use('/api/auth', authRoutes); // Asegúrate de que esta línea esté presente

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
