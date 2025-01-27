
    /********************************************************/ 
    /******************* Federico Pauza  ********************/ 
    /********************************************************/ 


const dataBase = "./dataBase.json"

let carritoDOM = JSON.parse(localStorage.getItem("ticketFinal")) || []

let productos = document.getElementById('cardConteiner')
let carrito = document.getElementById('carrito')
let ticket = document.getElementById('ticketFinal')

const logoCarrito = document.getElementById('iconoCarrito').addEventListener('click', () => {

        if (document.getElementById('ticket').style.display === 'none') {
            document.getElementById('ticket').style.display = 'block'
        } else {
            document.getElementById('ticket').style.display = 'none'
        }
})

let total = []

function createCard ({id, producto, descripcion, precio, stock, imagen}) {

    const card = document.createElement('div')
    const img = document.createElement('img')
    const name = document.createElement('h2')
    const description = document.createElement('p')
    const price = document.createElement('p')
    const stockDOM = document.createElement('p')
    const button = document.createElement('button')

    img.src = imagen
    name.innerText = producto
    description.innerText = descripcion
    price.innerText = "$" + precio
    stockDOM.innerText = 'Stock: ' + stock
    button.innerText = 'Agregar al carrito'

    card.classList.add('card')
    img.classList.add('img')
    name.classList.add('nombreProducto')
    description.classList.add('descripcionProducto')
    price.classList.add('precioProducto')
    stockDOM.classList.add('stockProducto')
    button.classList.add('buttonProducto')

    card.append(img, name, description, price, stockDOM, button)

    button.addEventListener('click', () => {
        if (stock > 0) {
        let index = carritoDOM.findIndex((producto) => producto.id == id)

        if (index == -1) {
            carritoDOM.push({
                producto,
                precio,
                id,
                cantidad: 1})
        } else {
            carritoDOM[index].cantidad += 1
        }

        stock -= 1
        stockDOM.innerText = 'Stock: ' + stock

        actualizadoraCarrito()
        
        swal.fire({
            position: "top-end",
            icon: "success",
            title: producto + " se agregó correctamente",
            width: 400,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            toast: true,
        })
    } else {
        swal.fire({
            position: "center",
            icon: "error",
            title: "Ups! No hay stock disponible de " + producto,
            width: 500,
            showConfirmButton: true,
            timerProgressBar: true,
        })
    }
})

    productos.appendChild(card)

}

function actualizadoraCarrito () {
    
    ticket.innerHTML = ''

    localStorage.setItem("ticketFinal", JSON.stringify(carritoDOM))
    
    carritoDOM.forEach(el => {
        const {producto, precio, cantidad} = el

        const item = document.createElement('div')
        item.classList.add('ticketFinal')
        
        const container = document.createElement('li')
        const name = document.createElement('p')
        const price = document.createElement('p')
        const cantidadDom = document.createElement('p')
        const botonComprar = document.createElement('button')

        container.classList.add('container')
        name.classList.add('name')
        price.classList.add('price')
        cantidadDom.classList.add('cantidad')
        botonComprar.classList.add('botonComprar')

        item.appendChild(container)
        
        name.innerText = producto
        price.innerText = `$${precio}`
        cantidadDom.innerText = `${cantidad}Ud.`
        botonComprar.innerText = 'Comprar'
        
        container.append(name, price, cantidadDom)
        item.append(container, botonComprar)

        botonComprar.addEventListener('click', () => {
            Swal.fire({
                title: '¡Gracias por tu compra!',
                text: `Total: $${totalFinal}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                carritoDOM = []
                actualizadoraCarrito() 
            });
        });

        ticket.appendChild(item)
    })
    
    let totalFinal = carritoDOM.reduce((acc, el) => acc + el.precio * el.cantidad, 0)

    const totalElement = document.createElement("p")
    totalElement.classList.add("total")
    totalElement.innerText = `Total: $${totalFinal}`

    ticket.appendChild(totalElement)
}



document.addEventListener('DOMContentLoaded', async () => {
    
    actualizadoraCarrito()

    const response = await fetch(dataBase) 
    const data = await response.json()


    data.forEach((producto) => {
        createCard(producto)
    })

})