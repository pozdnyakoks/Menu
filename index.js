import { menuArray } from '/data.js'

const product = document.getElementById('products');
const orderSection = document.querySelector('.order-section');
let removeBtns;

let productInner = '';

menuArray.forEach(product => {
    productInner += `
                <li class="list-item">
					<img class="item-img" src="images/${product.name}.jpg" alt="${product.name}">
					<div class="info">
						<h2 class="item-title">${product.name}</h2>
						<p class="item-desc">${product.ingredients.join(', ')}</p>
						<p class="item-price">$${product.price}</p>
					</div>
					<button class="add-btn" id="${product.id}" data-price="${product.price}">+</button>
				</li>
    `
})

product.innerHTML = productInner;

const addBtns = document.querySelectorAll('.add-btn');
let sum = 0;
let order = '';
let orderList = [];

addBtns.forEach(addBtn => {
    addBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        let item = findObj(addBtn.id)

        if (orderList.includes(item)) {
            orderList[orderList.indexOf(item)].price += Number(addBtn.dataset.price)
        } else {
            orderList.push(item)
        }
        sum += Number(addBtn.dataset.price);
        rend()
    })

})

function findObj(id) {
    return menuArray.filter(el => {
        return el.id == id
    })[0];
}

function rend() {
    let orders = '';

    orderList.forEach(item => {
        orders += renderOrderObj(item)
    })

    if (sum > 0) {
        orderSection.innerHTML = ''
        order = `
                <h2 class="order-title item-title">Your order</h2>
                ${orders}
                <div class="list-item total">
                    <h2 class="item-title">Total price:</h2>
                    <p class="item-price">$${sum}</p>
                </div>
                <button class="complete-btn">Complete order</button>
            `
        orderSection.innerHTML = order
        removeBtns = document.querySelectorAll('.remove-btn');

        removeBtns.forEach(removeBtn => {
            removeBtn.addEventListener('click', () => {
                orderList.forEach(el => {
                    if (el.id == removeBtn.dataset.remove) {
                        orderList.splice(orderList.indexOf(el), 1);
                        sum -= Number(el.price);
                        rend();
                    }
                })
            })
        })

        let modal = document.querySelector('.modal-overlay')
        document.querySelector('.complete-btn').addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'
            form();
        })

    } else {
        orderSection.innerHTML = ''
    }
}

function renderOrderObj(obj) {
    return `
            	<div class="list-item">
                    <h2 class="item-title">${obj.name}</h2>
                    <button class="remove-btn" data-remove=${obj.id}>remove</button>
                    <p class="item-price">$${obj.price}</p>
			    </div>
            `
}

document.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('modal-overlay')) {
        closeModal()
    }
})

function closeModal() {
    document.querySelector('.modal-overlay').style.display = 'none';
    document.body.style.overflow = ''
}

function form() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const data = new FormData(form);
        sum = 0;
        orderList = [];
        closeModal();
        rend();
        const name = data.get('name');
        orderSection.innerHTML = `<p class="grateful">Thanks, ${name}! Your order is on its way!</p> `
    })
}



