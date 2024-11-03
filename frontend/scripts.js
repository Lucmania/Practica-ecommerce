const apiUrl = 'http://localhost:5000/api';
let productos = [];

// Cargar productos y mostrarlos
async function cargarProductos() {
    const response = await fetch(`${apiUrl}/productos`);
    productos = await response.json();

    // Ordenar los productos por rubro
    productos.sort((a, b) => {
        if (a.Rubro < b.Rubro) return -1;
        if (a.Rubro > b.Rubro) return 1;
        return 0;
    });

    mostrarProductos('cuadrícula'); // Muestra la vista predeterminada en cuadrícula
}

// Mostrar productos en el DOM
function mostrarProductos(vista) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';

    if (vista === 'lista') {
        productosContainer.classList.add('productos-lista');
        productosContainer.classList.remove('productos-cuadrícula');

        const table = document.createElement('table');
        table.classList.add('product-list');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Rubro</th>
                    <th>Foto</th>
                </tr>
            </thead>
            <tbody id="product-list-body"></tbody>
        `;
        productosContainer.appendChild(table);

        const tbody = document.getElementById("product-list-body");
        productos.forEach(producto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${producto.Nombre}</td>
                <td>${producto.Descripcion}</td>
                <td>$${producto.Precio}</td>
                <td>${producto.Rubro}</td>
                <td><img src="${producto.URLImagen}" alt="${producto.Nombre}" style="width: auto; max-width: 60px; max-height: 60px; object-fit: cover;"></td>
            `;
            tbody.appendChild(row);
        });
    } else {
        productosContainer.classList.add('productos-cuadrícula');
        productosContainer.classList.remove('productos-lista');

        productos.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto');
            productoElement.innerHTML = `
                <h3>${producto.Nombre}</h3>
                <p>${producto.Descripcion}</p>
                <p>Rubro: ${producto.Rubro}</p>
                <p>Precio: $${producto.Precio}</p>
                <img src="${producto.URLImagen}" alt="${producto.Nombre}" />
            `;
            productosContainer.appendChild(productoElement);
        });
    }
}

// Buscar productos por descripción
async function buscarProductos() {
    const searchQuery = document.getElementById('search').value;
    const response = await fetch(`${apiUrl}/productos?descripcion=${searchQuery}`);
    productos = await response.json();

    // Ordenar los productos por rubro
    productos.sort((a, b) => {
        if (a.Rubro < b.Rubro) return -1;
        if (a.Rubro > b.Rubro) return 1;
        return 0;
    });

    mostrarProductos(document.querySelector('.productos-lista') ? 'lista' : 'cuadrícula');
}

// Cargar opciones de rubro en el select
async function cargarRubros() {
    const response = await fetch(`${apiUrl}/productos/rubros`);
    const rubros = await response.json();

    const rubroSelect = document.getElementById('rubro');
    rubros.forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro.Codigo;  // Usar el código exacto del rubro
        option.textContent = rubro.Descripcion;
        rubroSelect.appendChild(option);
    });
}

// Filtrar productos por rubro
async function filtrarPorRubro() {
    const rubroId = document.getElementById('rubro').value;
    const response = await fetch(`${apiUrl}/productos?rubro=${rubroId}`);
    productos = await response.json();

    // Ordenar los productos por rubro
    productos.sort((a, b) => {
        if (a.Rubro < b.Rubro) return -1;
        if (a.Rubro > b.Rubro) return 1;
        return 0;
    });
    
    mostrarProductos(document.querySelector('.productos-lista') ? 'lista' : 'cuadrícula');
}

// Función para cambiar la vista
function cambiarVista(vista) {
    mostrarProductos(vista);
}

// Manejar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('authToken', data.token);
            window.location.href = 'admin.html';
        } else {
            alert(data.message || 'Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al procesar la solicitud.');
    }
});

// Manejador del botón de administrador
document.getElementById('loginButton').addEventListener('click', function() {
    if (sessionStorage.getItem('isAuthenticated')) {
        // Si está autenticado, redirigir directamente a la página de administración
        window.location.href = 'admin.html';
    } else {
        // Si no está autenticado, mostrar el formulario de login
        document.getElementById('loginFormContainer').style.display = 'block';
    }
});

document.getElementById('closeLoginForm').addEventListener('click', function() {
    document.getElementById('loginFormContainer').style.display = 'none';
});

// Al cargar la página
window.onload = function() {
    cargarProductos();
    cargarRubros();
};