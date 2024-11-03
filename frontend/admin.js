const apiUrl = 'http://localhost:5000/api';

// Verificar autenticación al cargar la página
function verificarAutenticacion() {
    if (!sessionStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
    }
}

// Manejar el cierre de sesión
document.getElementById('logoutButton').addEventListener('click', function() {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('authToken');
    window.location.href = 'index.html';
});

// Cargar productos al iniciar la página
async function cargarProductos() {
    const response = await fetch(`${apiUrl}/productos`);
    const productos = await response.json();

    // Ordenar los productos por rubro
    productos.sort((a, b) => {
        if (a.Rubro < b.Rubro) return -1;
        if (a.Rubro > b.Rubro) return 1;
        return 0;
    });

    mostrarProductos(productos);
}

// Mostrar productos en la tabla
function mostrarProductos(productos) {
    const tbody = document.getElementById('tbody-productos');
    tbody.innerHTML = ''; // Limpiar el contenido anterior

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.Nombre}</td>
            <td>${producto.Descripcion}</td>
            <td>${producto.Rubro}</td>
            <td>$${producto.Precio}</td>
            <td>
                <button onclick="abrirFormularioModificar(${producto.Codigo})">Modificar</button>
                <button onclick="eliminarProducto(${producto.Codigo})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para abrir el formulario de modificar producto
async function abrirFormularioModificar(codigo) {
    try {
        const response = await fetch(`${apiUrl}/productos/${codigo}`);
        
        if (response.ok) {
            const producto = await response.json();

            // Llenar los campos del formulario de modificación
            document.getElementById('nombre-modificar').value = producto.Nombre;
            document.getElementById('descripcion-modificar').value = producto.Descripcion;
            document.getElementById('rubro-modificar').value = producto.Rubro; // Usar el código del rubro
            document.getElementById('precio-modificar').value = producto.Precio;
            document.getElementById('url-imagen-modificar').value = producto.URLImagen;

            // Mostrar el formulario
            document.getElementById('form-modificar-producto').style.display = 'block';
            document.getElementById('codigo-modificar').value = codigo;
        } else {
            alert('Error al cargar el producto para modificar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el producto para modificar');
    }
}

// Agregar un nuevo producto
document.getElementById('nuevo-producto-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoProducto = {
        Nombre: document.getElementById('nombre').value,
        Descripcion: document.getElementById('descripcion').value,
        Rubro: document.getElementById('rubro').value,
        Precio: parseFloat(document.getElementById('precio').value),
        URLImagen: document.getElementById('url-imagen').value
    };

    try {
        const response = await fetch(`${apiUrl}/productos`, {
            method: 'POST',
            headers: {
                'Authorization': sessionStorage.getItem('authToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (response.ok) {
            alert('Producto agregado con éxito');
            
            // Limpiar los campos del formulario
            document.getElementById('nombre').value = '';
            document.getElementById('descripcion').value = '';
            document.getElementById('rubro').value = ''; // Vuelve al valor por defecto
            document.getElementById('precio').value = '';
            document.getElementById('url-imagen').value = '';
            
            // Ocultar el formulario
            document.getElementById('form-agregar-producto').style.display = 'none';
            
            // Recargar la lista de productos
            cargarProductos();
        } else {
            alert('Error al agregar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto');
    }
});

// Función para modificar producto
async function modificarProducto() {
    const codigo = document.getElementById('codigo-modificar').value;
    const productoModificado = {
        Nombre: document.getElementById('nombre-modificar').value,
        Descripcion: document.getElementById('descripcion-modificar').value,
        Rubro: document.getElementById('rubro-modificar').value,
        Precio: parseFloat(document.getElementById('precio-modificar').value),
        URLImagen: document.getElementById('url-imagen-modificar').value
    };

    try {
        const response = await fetch(`${apiUrl}/productos/${codigo}`, {
            method: 'PUT',
            headers: {
                'Authorization': sessionStorage.getItem('authToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoModificado)
        });

        if (response.ok) {
            alert('Producto modificado con éxito');
            cargarProductos();
            document.getElementById('form-modificar-producto').style.display = 'none';
        } else {
            const error = await response.json();
            alert(`Error al modificar el producto: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al modificar el producto');
    }
}

// Función para eliminar un producto
async function eliminarProducto(codigo) {
    const response = await fetch(`${apiUrl}/productos/${codigo}`, {
        method: 'DELETE',
        headers: {
            'Authorization': sessionStorage.getItem('authToken') // Incluir token
        }
    });

    if (response.ok) {
        alert('Producto eliminado con éxito');
        cargarProductos(); // Recargar la lista de productos
    } else {
        alert('Error al eliminar el producto');
    }
}

// Mostrar el formulario de agregar producto
document.getElementById('btn-agregar-producto').addEventListener('click', () => {
    const form = document.getElementById('form-agregar-producto');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Evento para el formulario de modificación
document.getElementById('modificar-producto-form').addEventListener('submit', (e) => {
    e.preventDefault();
    modificarProducto();
});

// Cargar opciones de rubro en el select al iniciar
async function cargarRubros() {
    try {
        const response = await fetch(`${apiUrl}/productos/rubros`);
        if (!response.ok) {
            throw new Error('Error al cargar rubros');
        }
        const rubros = await response.json();

        const rubroSelect = document.getElementById('rubro');
        const rubroModificarSelect = document.getElementById('rubro-modificar');

        // Limpiar opciones anteriores
        rubroSelect.innerHTML = '';
        rubroModificarSelect.innerHTML = '';

        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un rubro';
        rubroSelect.appendChild(defaultOption.cloneNode(true));
        rubroModificarSelect.appendChild(defaultOption);

        // Agregar las opciones de rubros
        rubros.forEach(rubro => {
            const option = document.createElement('option');
            option.value = rubro.Codigo;
            option.textContent = rubro.Descripcion;
            
            rubroSelect.appendChild(option.cloneNode(true));
            rubroModificarSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar rubros:', error);
        alert('Error al cargar los rubros');
    }
}

// Cargar rubros al iniciar
window.onload = () => {
    verificarAutenticacion(); // Verifica la autenticación
    cargarRubros(); // Carga los rubros
    cargarProductos(); // Para cargar los productos
};
