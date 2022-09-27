// Variables y Constantes
const contenedorProductos = document.querySelector("#contenedorProductos")
const carritoDeCompras = document.querySelector("#carritoDeCompras")
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const campos = document.querySelectorAll("input")
const botonBuscar = document.querySelector("#botonBuscar")
const btnAgregar = document.querySelectorAll("#botonAgregar")

//Array de productos de Coco maderas Cordoba
const productos = [
    { id: 1, producto: "Especiero Gourmet x8", precio: 1600, img: "imagenesProductos/especieroGourmet8.jpg", cantidad: "" },
    { id: 2, producto: "Especiero Gourmet x5", precio: 1200, img: "imagenesProductos/especieroGourmet5.jpg", cantidad: "" },
    { id: 3, producto: "Perchero Nordico 6 ganchos", precio: 3300, img: "imagenesProductos/percheroNordico6.jpg", cantidad: "" },
    { id: 4, producto: "Perchero Nordico 4 ganchos", precio: 3000, img: "imagenesProductos/percheroNordico4.jpg", cantidad: "" },
    { id: 5, producto: "Perchero Nordico Chico", precio: 2200, img: "imagenesProductos/percheroLineal.jpg", cantidad: "" },
    { id: 6, producto: "Huevera Premium x6", precio: 870, img: "imagenesProductos/hueveraPremium6.jpg", cantidad: "" },
    { id: 7, producto: "Huevera Premium x12", precio: 1300, img: "imagenesProductos/hueveraPremium12.jpg", cantidad: "" },
    { id: 8, producto: "Mesas Nordica x3", precio: 4950, img: "imagenesProductos/mesasNordicasX3.jpg", cantidad: "" }
];

// agregar evento a los elementos input
function focoEnCampos() {
    campos.forEach(campo => {
        campo.addEventListener("focus", () => { campo.className = "camposFoco" })
        campo.addEventListener("blur", () => { campo.className = "" })
    })
}

// agregar evento al elemento button
botonBuscar.addEventListener("mousemove", () => {
    botonBuscar.title = "Haz click para buscar un Producto"
})

//pintar los productos en la pagina con los productos del array
function crearCards() {
    productos.forEach(producto => {
        contenedorProductos.innerHTML += ` <div class="card m-3">
        <img src=${producto.img} class="img-thumbnail" alt="...">
        <div class="card-body">
          <h5 class="card-title">${producto.producto}</h5>
          <p>$${producto.precio}</p>
          <button id= "botonAgregar${producto.id}" class="btn btn-dark">AGREGAR</button>
        </div>
      </div>`
    })
    funcionalidadBotonAgregar();
}

function funcionalidadBotonAgregar() {
    productos.forEach((producto) => {
        document.querySelector(`#botonAgregar${producto.id}`)
            .addEventListener("click", () => {
                agregarAlCarrito(producto);
                alertaBotonAgregar();
            });
    });
}

function agregarAlCarrito(producto) {
    let existe = carrito.some((productoSome) => productoSome.id === producto.id);
    if (existe === false) {
        producto.cantidad = 1;
        carrito.push(producto);
    } else {
        let prodFind = carrito.find((productoFind) => productoFind === producto.id);
        producto.cantidad++;
    }
    verProductosCarrito();
    mostrarTotalCarrito();
}

function verProductosCarrito(producto) {
    carritoDeCompras.innerHTML = ""
    carrito.forEach(producto => {
        carritoDeCompras.innerHTML += `<tr>
                                        <th scope="row">${producto.id}</th>
                                        <td>${producto.cantidad}</td>
                                        <td>${producto.producto}</td>
                                        <td>${producto.precio}</td>
                                        <td> <button id= "botonBorrar${producto.id}" class="botonEliminar btn btn-dark"> - </button></td>
                                    </tr>`
    });
    localStorage.setItem("carrito", JSON.stringify(carrito))
    borrarProductoCarrito();
    mostrarTotalCarrito();
}

function borrarProductoCarrito() {
    carrito.forEach((producto) => {
        btnBorrar = document.querySelector(`#botonBorrar${producto.id}`)
        btnBorrar.addEventListener("click", () => {
            carrito = carrito.filter((productoFilter) => productoFilter.id !== producto.id);
            verProductosCarrito();
            mostrarTotalCarrito();
        });
        localStorage.setItem("carrito", JSON.stringify(carrito))
    });
}

// Agregar Libreria SweetAlert2 - Cartel de aviso para cada pruducto agregado al carrito
function alertaBotonAgregar() {
    Swal.fire({
        toast: true,
        position: 'top-start',
        icon: 'success',
        title: 'EL PRODUCTO SE AGREGO AL CARRITO',
        showConfirmButton: false,
        timer: 1500
    })
}

// Peticion de datos a un archivo JSON
const listaMasVendidos = document.querySelector('#productosMasVendidos')

fetch('/masVendidos.json')
    .then((res) => res.json())
    .then((data) => {

        data.forEach((producto) => {
            const card = document.createElement('card')
            card.innerHTML = `  <div class="card m-5 bg-dark">
                                    <img src=${producto.img} class="img-thumbnail" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title text-white">${producto.producto}</h5>
                                    </div>
                                </div>`

            listaMasVendidos.append(card)
        })
    });

// Calcular el total de la compra
function mostrarTotalCarrito() {
    let total = 0;
    const importeTotal = document.querySelector("#importeTotal");
    carrito.forEach((producto) => {
        const totalPorProducto = (producto.cantidad * producto.precio)
        total = total + totalPorProducto
    });
    importeTotal.innerHTML = `$ ${total} `
}

// Funcionalidad boton Comprar para terminar la compra y vaciar el carrito nuevamente
function finalizarCompra() {
    const btnComprar = document.querySelector("#botonComprar")
    btnComprar.addEventListener("click", () => {
        confirmacionCompra();
    });
}

// Funcion para mostrar una Alerta cuando se haga click en el boton comprar
function confirmacionCompra() {
    Swal.fire({
        title: '¡Haz click para confirmar la compra!',
        text: "______________________________________________",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'CONFIRMAR!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'FELICITACIONES POR TU COMPRA!',
                '¡Gracias por elegir Coco Maderas Cordoba!',
                'success'
            )
            carritoDeCompras.innerHTML = "";
            importeTotal.innerHTML = "";
        }
    })
}

focoEnCampos();
crearCards();
verProductosCarrito();
finalizarCompra();