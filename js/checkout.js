// Selección de elementos del DOM
let resumenSubTotal = document.querySelector('.res-sub-total');
let valorDomicilio = document.querySelector('.valor-domi');
let valorDomicilioCiudad = document.querySelector('.destino');
let resumenDescuento = document.querySelector('.promo');
let resumenTotal = document.querySelector('.total');
let tablaCarrito = document.querySelector('.productosO');
let metodoPago = document.querySelectorAll('.payment-method input[name="radio"]');

const nombresInput = document.getElementById('nombres-input');
const apellidosInput = document.getElementById('apellidos-input');
const emailInput = document.getElementById('email-input');
const celularInput = document.getElementById('celular-input');
const direccionInput = document.getElementById('direccion-input');
const btnPagar = document.querySelector('.btn-checkout');
const faltanDatos = document.getElementById('error-message');

// Formato de números
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

    resumenOrden();
}

// Resumen de la orden
function resumenOrden() {
    let TodosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let metodoPagoSeleccionado = document.querySelector('.payment-method input[name="radio"]:checked');
    let dataResumen = JSON.parse(localStorage.getItem("pro-resumen")) || {};
    let valorDomi = parseFloat(dataResumen.domicilio) || 0;
    let subtotalPro = 0;
    let descuento = 0;

    TodosProductos.forEach(producto => {
        subtotalPro += producto.precio * producto.cantidad; // Calcular subtotal
    });

    descuento = (subtotalPro > 100.000) ? subtotalPro * 0.1 : 0; // Aplicar descuento
    subtotalPro += valorDomi - descuento; // Añadir domicilio y restar descuento

    let metodoPago0;
    switch (metodoPagoSeleccionado.value) {
        case "1":
            metodoPago0 = subtotalPro * 0.05;
            break;
        case "2":
            metodoPago0 = subtotalPro * 0.03;
            break;
        default:
            metodoPago0 = 0;
            break;
    }

    let total = subtotalPro + metodoPago0;

    // Actualizar valores en el DOM
    valorDomicilio.textContent = formatNumber(valorDomi);
    resumenSubTotal.textContent = formatNumber(subtotalPro);
    valorDomicilioCiudad.textContent = dataResumen.destino;
    resumenDescuento.textContent = dataResumen.descuento;
    resumenTotal.textContent = formatNumber(total);
}

// Actualizar resumen al cambiar el método de pago
metodoPago.forEach(radio => {
    radio.addEventListener("change", () => {
        resumenOrden();
    });
});

// Manejar el botón de pago
btnPagar.addEventListener('click', function () {
    faltanDatos.textContent = '';

    // Validar campos requeridos
    if (!nombresInput.value || !apellidosInput.value || !emailInput.value || !celularInput.value || !direccionInput.value) {
        faltanDatos.textContent = "Por favor, completa todos los campos requeridos.";
        return;
    }

    const metodoPago = document.querySelector('input[name="radio"]:checked').value;

    // Capturar los valores de los campos
    const datosEntrega = {
        nombres: nombresInput.value,
        apellidos: apellidosInput.value,
        email: emailInput.value,
        celular: celularInput.value,
        direccion: direccionInput.value,
        direccion2: document.getElementById('direccion-2-input').value,
        metodoPago: metodoPago,
        total: resumenTotal.textContent
    };

    // Guardar los datos en localStorage y redirigir
    localStorage.setItem("datosEntrega", JSON.stringify(datosEntrega));
    location.href = "thankyou.html";
});