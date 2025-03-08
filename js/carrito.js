// Variables globales
let btnProducts = document.querySelectorAll(".btn-product");
let listadoCarrito = document.querySelector(".list-cart tbody");
let contadorCarrito = document.querySelector(".contar-pro");
let con = 0;

// Cargar productos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProLocalStorage();
});

// Asignar eventos a los botones de productos
btnProducts.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        con++;
        contadorCarrito.textContent = con;
        infoProducto(i);
    });
});

// Agregar producto al carrito
function agregarProductos(producto) {
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${producto.id}</td>
        <td><img src="${producto.imagen}" width="70px"></td>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>
            <span onclick="borrarProducto(${producto.id})" class="btn btn-danger">X</span>
        </td>
    `;
    listadoCarrito.appendChild(fila);
}

// Obtener información del producto
function infoProducto(pos) {
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let infoPro = {
        id: con, // Identificador único
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1
    };
    agregarProductos(infoPro);
    guardarProLocalStorage(infoPro);
}

// Borrar producto del carrito
// Borrar producto del carrito
function borrarProducto(id) {
    let producto = event.target;
    producto.parentElement.parentElement.remove();

    if (con > 0) {
        con--;
        contadorCarrito.textContent = con;
    }

    eliminarProLocalStorage(id);
    actualizarIDs(); // Llamar a esta función para actualizar los IDs
}

// Actualizar los IDs de los productos en el carrito
function actualizarIDs() {
    const filas = listadoCarrito.querySelectorAll("tr");
    let productosActualizados = [];
    
    filas.forEach((fila, index) => {
        // Actualizar el ID en la fila visual del carrito
        fila.querySelector("td:first-child").textContent = index + 1;

        // Reconstruir los datos del producto actualizado
        const productoActualizado = {
            id: index + 1,
            imagen: fila.querySelector("img").src,
            nombre: fila.querySelector("td:nth-child(3)").textContent,
            precio: fila.querySelector("td:nth-child(4)").textContent.replace("$", ""),
        };
        
        productosActualizados.push(productoActualizado);
    });

    // Sincronizar localStorage con los IDs actualizados
    localStorage.setItem("pro-carrito", JSON.stringify(productosActualizados));
}

// Guardar producto en localStorage
function guardarProLocalStorage(producto) {
    let TodosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if (productosPrevios != null) {
        TodosProductos = Object.values(productosPrevios);
    }

    TodosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(TodosProductos));
}

// Eliminar producto de localStorage
function eliminarProLocalStorage(id) {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito"));

    if (TodosProductos != null) {
        TodosProductos = TodosProductos.filter(producto => producto.id !== id);
        localStorage.setItem("pro-carrito", JSON.stringify(TodosProductos));
    }
}

// Cargar productos desde localStorage
function cargarProLocalStorage() {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito"));

    if (TodosProductos != null) {
        con = TodosProductos.length; // Sincronizar el contador
        contadorCarrito.textContent = con;

        TodosProductos.forEach(producto => {
            agregarProductos(producto);
        });
    }
}

// Mostrar/ocultar carrito
contadorCarrito.parentElement.addEventListener("click", () => {
    listadoCarrito.parentElement.classList.toggle("ocultar");
});