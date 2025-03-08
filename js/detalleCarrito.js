// Selección de elementos del DOM
let tablaCarrito = document.querySelector('.cart-table tbody');
let resumenSubTotal = document.querySelector('.res-sub-total');
let resumenDescuento = document.querySelector('.promo');
let resumenTotal = document.querySelector('.total');
let destino = document.querySelector('.destino');
let resumenDomicilio = document.querySelector('.valor-domi');
let btnResumen = document.querySelector('.btn-resumen');

// Formato de números
const formatNumber = (num) => 
    new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 3, 
        maximumFractionDigits: 3 
    }).format(num);

// Evento de carga inicial
document.addEventListener("DOMContentLoaded", cargarProductos);

// Cargar productos desde localStorage
function cargarProductos() {
    let TodosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if (productosPrevios != null) {
        TodosProductos = Object.values(productosPrevios);
    }

    // Limpiar tabla
    tablaCarrito.innerHTML = "";

    if (TodosProductos.length > 0) {
        TodosProductos.forEach((producto, i) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="d-flex justify-content-evenly align-items-center"> 
                    <span onclick="borrarProducto(${i})" class="btn btn-danger">X</span>
                    <img src="${producto.imagen}" width="70px">
                    <span>${producto.nombre}</span>
                </td>
                <td>$<span>${producto.precio}</span></td>
                <td>
                    <div class="quantity quantity-wrap">
                        <div class="decrement" onclick="actualizarCantidad(${i},-1)">
                            <i class="fa-solid fa-minus"></i>
                        </div>
                        <input type="text" name="quantity" class="number" 
                            value="${producto.cantidad || 1}" 
                            maxlength="2" size="1" readonly>
                        <div class="increment" onclick="actualizarCantidad(${i},1)">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </td>
                <td>${(producto.precio * producto.cantidad || 0.00).toFixed(3)}</td>
            `;
            tablaCarrito.appendChild(fila);
        });
    } else {
        let fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="4">No hay productos en el carrito</td>`;
        tablaCarrito.appendChild(fila);
    }

    resumeCompra();
}

// Actualizar cantidad de productos
function actualizarCantidad(pos, cambio) {
    let TodosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if (productosPrevios != null) {
        TodosProductos = Object.values(productosPrevios);
    }

    if (TodosProductos[pos]) {
        TodosProductos[pos].cantidad = (TodosProductos[pos].cantidad || 1) + cambio;

        if (TodosProductos[pos].cantidad < 1) {
            TodosProductos[pos].cantidad = 1;
        }
    }

    localStorage.setItem("pro-carrito", JSON.stringify(TodosProductos));
    cargarProductos();
}

// Borrar producto del carrito
function borrarProducto(pos) {
    let TodosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if (productosPrevios != null) {
        TodosProductos = Object.values(productosPrevios);
    }

    TodosProductos.splice(pos, 1);
    localStorage.setItem("pro-carrito", JSON.stringify(TodosProductos));
    cargarProductos();
}

// Resumen de la compra
function resumeCompra() {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0;

    TodosProductos.forEach(producto => {
        subtotal += producto.precio * producto.cantidad;
    });

    let domicilio = 0;
    switch (destino.value) {
        case "Bello":
            domicilio = 10.000;
            break;
        case "Itagui":
        case "Envigado":
        case "Sabaneta":
            domicilio = 15.000;
            break;
        case "La Estrella":
        case "Caldas":
        case "Copacabana":
            domicilio = 20.000;
            break;
        default:
            domicilio = 0;
            break;
    }

    let descuento = (subtotal > 100.000) ? subtotal * 0.1 : 0;
    let total = subtotal - descuento + domicilio;

    resumenSubTotal.textContent = formatNumber(subtotal);
    resumenDescuento.textContent = formatNumber(descuento);
    resumenTotal.textContent = formatNumber(total);
    resumenDomicilio.textContent = domicilio.toFixed(3);
}

// Evento: cambio de destino
destino.addEventListener("change", resumeCompra);

// Botón para generar resumen
btnResumen.addEventListener("click", () => {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let resumen = {
        productos: Array.isArray(TodosProductos) ? TodosProductos : [],
        subtotal: resumenSubTotal.textContent,
        descuento: resumenDescuento.textContent,
        destino: destino.value,
        domicilio: resumenDomicilio.textContent,
        total: resumenTotal.textContent
    };

    localStorage.setItem("pro-resumen", JSON.stringify(resumen));
    location.href = "checkout.html";
});