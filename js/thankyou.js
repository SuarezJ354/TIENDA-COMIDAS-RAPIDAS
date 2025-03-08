// Selección de elementos del DOM
let valorDomicilio = document.querySelector('.valor-domi');
let DomicilioCiudad = document.querySelector('.destino');
let resumenDescuento = document.querySelector('.promo');
let resumenTotal = document.querySelector('.total');
let tablaCarrito = document.querySelector('.resumen');
let ResumenMetodoPago = document.querySelector('.metodo-pago');
let nombreCliente = document.querySelector('.nombre');
let apellidoCliente = document.querySelector('.apellido');
let telefonoCliente = document.querySelector('.telefono');
let correoCliente = document.querySelector('.correo');
let direccionCliente = document.querySelector('.direccion1');
let direccion2Cliente = document.querySelector('.direccion2');
let btnOtraCompra = document.querySelector('.btn-gracias');

// Formatear números
const formatNumber = (num) => 
    new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 3, 
        maximumFractionDigits: 3 
    }).format(num);

// Evento de carga inicial
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// Cargar productos desde localStorage
function cargarProductos() {
    let TodosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));

    if (productosPrevios != null) {
        TodosProductos = Object.values(productosPrevios);
    }

    // Limpiar la tabla del carrito
    tablaCarrito.innerHTML = "";

    if (TodosProductos.length > 0) {
        TodosProductos.forEach((producto, i) => {
            let fila = document.createElement("tr");

            fila.innerHTML = `
                <td class="d-flex justify-content-evenly align-items-center"> 
                    <img src="${producto.imagen}" width="70px">
                    <span>${producto.nombre}</span>
                </td>
                <td class="align-middle">
                    <span>${producto.cantidad}</span>
                </td>
                <td class="text-center align-middle">
                    $ ${(producto.precio * producto.cantidad || 0.00).toFixed(3)}
                </td>
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

// Resumen de la compra
function resumeCompra() {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let dataResumen = JSON.parse(localStorage.getItem("pro-resumen")) || {};
    let datosEntrega = JSON.parse(localStorage.getItem("datosEntrega")); // Obtén el objeto datosEntrega del localStorage
    let metodoPagoSeleccionado = datosEntrega?.metodoPago || "0"; // Método de pago o "0" como valor por defecto
    let valorDomi = parseFloat(dataResumen.domicilio) || 0;

    // Determinar el método de pago seleccionado
    switch (metodoPagoSeleccionado) {
        case "1":
            metodoPagoSeleccionado = "ContraEntrega";
            break;
        case "2":
            metodoPagoSeleccionado = "PSE"; // Recargo del 3%
            break;
        default:
            metodoPagoSeleccionado = "Transferencia";
            break;
    }

    // Actualizar el contenido del DOM
    DomicilioCiudad.textContent = dataResumen.destino;
    resumenDescuento.textContent = dataResumen.descuento;
    valorDomicilio.textContent = dataResumen.domicilio; // Mostrar el domicilio con dos decimales
    resumenTotal.textContent = datosEntrega.total;
    ResumenMetodoPago.textContent = metodoPagoSeleccionado;

    // Actualizar datos del cliente
    nombreCliente.textContent = datosEntrega.nombres;
    apellidoCliente.textContent = datosEntrega.apellidos;
    direccionCliente.textContent = datosEntrega.direccion;
    direccion2Cliente.textContent = datosEntrega.direccion2;
    telefonoCliente.textContent = datosEntrega.celular;
    correoCliente.textContent = datosEntrega.email;
}

// Botón para realizar otra compra
btnOtraCompra.addEventListener("click", () => {
    location.href = "index.html";
    localStorage.clear();
});