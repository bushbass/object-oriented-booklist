// Product class : represents a product
class Product {
    constructor(title, category, quantity, bay, sku) {
        this.title = title
        this.category = category
        this.quantity = quantity
        this.bay = bay
        this.sku = sku
    }
}

// store class: handle storage
class Store {
    static getProducts() {
        let products
        if (localStorage.getItem('products') === null) {
            products = []
        } else {
            products = JSON.parse(localStorage.getItem('products'))
        }
        return products
    }
    static addProduct(product) {
        const products = Store.getProducts()
        products.push(product)
        localStorage.setItem('products', JSON.stringify(products))
    }
    static removeProduct(sku) {
        const products = Store.getProducts()
        products.forEach((product, index) => {
            if (product.sku === sku) {
                products.splice(index, 1)
            }
        })
        localStorage.setItem('products', JSON.stringify(products))
    }
}

// UI class: handle UI tasks
class GardenUI {
    static displayProducts() {
        const products = Store.getProducts()
        products.forEach((product) => GardenUI.addProductToList(product))
    }
    static addProductToList(product) {
        const list = document.querySelector('#product-list')

        const row = document.createElement('tr')
        row.innerHTML = `
      <td>${product.title}</td>
      <td>${product.category}</td>
      <td>${product.quantity}</td>
      <td>${product.bay}</td>
      <td>${product.sku}</td>
      <td><a href="#" class='btn btn-danger btn-sm delete'>X</a></td>
      `
        list.appendChild(row)
    }
    static deleteProduct(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#product-form')
        container.insertBefore(div, form)

        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#category').value = ''
        document.querySelector('#quantity').value = ''
        document.querySelector('#bay').value = ''
        document.querySelector('#sku').value = ''
    }
}


// event: display products
document.addEventListener('DOMContentLoaded', GardenUI.displayProducts)

// event: add a product
document.querySelector('#product-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.querySelector('#title').value
    const category = document.querySelector('#category').value
    const quantity = document.querySelector('#quantity').value
    const bay = document.querySelector('#bay').value
    const sku = document.querySelector('#sku').value

    if (title === '' || category === '' || quantity === '' || bay === '' || sku === '') {
        GardenUI.showAlert('please fill in all fields', 'danger')
    } else {
        const product = new Product(title, category, quantity, bay, sku)

        GardenUI.addProductToList(product)
        Store.addProduct(product)

        GardenUI.showAlert('product added', 'success')

        GardenUI.clearFields()
    }
})
// event: remove a product
document.querySelector('#product-list').addEventListener('click', (e) => {
    GardenUI.deleteProduct(e.target)

    Store.removeProduct(e.target.parentElement.previousElementSibling.textContent)

    GardenUI.showAlert('product deleted', 'success')
})