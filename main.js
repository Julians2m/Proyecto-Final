

const url = "https://criptoya.com/api/dolar";
fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error en la solicitud: " + response.status);
        }
    })
    .then(data => {
        const cotizacionOficial = data.oficial;
        const cotizacionMep = data.mep;
        const cotizacionBlue = data.blue;
        const tiempo = data.time;

        const cotizacionElement = document.getElementById("cotizacion");
        cotizacionElement.innerHTML = `
            <p>Cotización oficial: ${cotizacionOficial}</p>
            <p>Cotización blue: ${cotizacionBlue}</p>
            <p>Cotización MEP: ${cotizacionMep}</p>
            <!-- ... (agregar más líneas para mostrar los otros valores) -->
        `;
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });

document.addEventListener("DOMContentLoaded", function () {
    const carouselSlide = document.querySelector(".carousel-slide");
    const carouselImages = carouselSlide.querySelectorAll("img");

    const totalImages = carouselImages.length;
    let counter = 0;
    const slideWidth = carouselImages[0].clientWidth;
    carouselSlide.style.width = `${slideWidth * totalImages}px`;
    carouselImages.forEach((image) => {
        image.style.width = `${slideWidth}px`;
    });
    function slideToNextImage() {
        counter++;
        carouselSlide.style.transition = "transform 0.5s ease-in-out";
        carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;
    }
    setInterval(() => {
        if (counter === totalImages - 1) {
            carouselSlide.style.transition = "none";
            counter = -1;
        }
        slideToNextImage();
    }, 5000);
});

class Producto {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = 1;
    }
}

const honda = new Producto(1, "Twister 250", 3000, "img/honda.jpg");
const Honda3 = new Producto(2, "Nc 700", 5000, "img/Honda3.jpg");
const Honda4 = new Producto(3, "CB 190R", 8000, "img/Honda4.jpg");
const Honda5 = new Producto(4, "Tornado 250", 10000, "img/Honda5.jpg");
const Honda6 = new Producto(5, "CB 600R", 80090, "img/Honda6.jpg");

const productos = [honda, Honda3, Honda4, Honda5, Honda6];

let carrito = [];

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = () => {
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error en la solicitud: " + response.status);
        }
    })
    .then(data => {
        const cotizacionOficial = data.oficial;
        const cotizacionMep = data.mep;
        const cotizacionBlue = data.blue;
        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
            card.innerHTML = `
                                <div class="card">
                                    <img class="card-img-tom imgProductos" src="${producto.img}" alt="${producto.nombre}">
                                    <div class="card-body">
                                        <h3>${producto.nombre}</h3>
                                        <p>$USD: ${producto.precio}</p>
                                        <p>$ARS CAMBIO MEP: ${producto.precio * cotizacionMep}</p>
                                        <p>$ARS CAMBIO BLUE: ${producto.precio * cotizacionBlue}</p>
                                        <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>
                                    </div>
                                </div>`
            contenedorProductos.appendChild(card);

            const boton = document.getElementById(`boton${producto.id}`);
            boton.addEventListener("click", () => {
                agregarAlCarrito(producto.id);
            })
        })
    })
    
}

mostrarProductos();

const agregarAlCarrito = (id) => {
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const producto = productos.find(producto => producto.id === id);
        carrito.push(producto);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    calcularTotal();
}

const verCarrito = document.getElementById("verCarrito");
const contenedorCarrito = document.getElementById("contenedorCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                            <div class="card">
                                <img class="card-img-tom imgProductos" src="${producto.img}" alt="${producto.nombre}">
                                <div class="card-body">
                                    <h3>${producto.nombre}</h3>
                                    <p>$${producto.precio}</p>
                                    <p>Cantidad:${producto.cantidad}</p>
                                    <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button>
                                </div>
                            </div>`
        contenedorCarrito.appendChild(card);
        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })

    })
    calcularTotal();
}

const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
    let indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}


const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})


const eliminarTodoElCarrito = () => {
    carrito = [];
    localStorage.clear();
    mostrarCarrito();
}


const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `Total: $${totalCompra}`;
}