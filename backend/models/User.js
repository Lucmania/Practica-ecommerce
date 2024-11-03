const connection = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    // Buscar un usuario por su nombre de usuario
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results[0]); // Devolver el primer resultado
                }
            );
        });
    }
}

module.exports = User;
