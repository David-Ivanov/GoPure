

function updateQuantity(change, variantId) {

    const quantityInput = document.querySelector(`.my-cart-item-quantity-${variantId}`);
    const totalItemPrice = document.querySelector(`.my-cart-item-total-price-${variantId}`);
    const totalPrice = document.querySelector(`.my-cart-footer-total-price`);

    const quantity = Number(quantityInput.value) + change;

    if (quantity >= 1) {

        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: String(variantId),
                quantity: quantity
            })
        })
            .then(response => response.json())
            .then(data => {
                // change quantity
                quantityInput.value = quantity;
                // change total item price
                const item = data.items.find(elem => elem.variant_id === variantId);
                totalItemPrice.textContent = `₴${item.final_line_price / 100}.00`;
                // change total price
                totalPrice.textContent = `₴${data.total_price / 100}.00`;
    
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
    }
}

function removeItem(variantId) {

    const totalPrice = document.querySelector(`.my-cart-footer-total-price`);
    const item = document.querySelector(`.my-cart-item-${variantId}`);

    fetch('/cart/change.js', {
        method: 'POST',
        headers: {
                    'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                id: String(variantId),
                quantity: 0
        })
    })
        .then(res => res.json())
        .then(data => {
            item.remove();
            // change total price
            totalPrice.textContent = `₴${data.total_price / 100}.00`;
        })
        .catch(err => console.error(err))
}

function openModalCart() {
    const cart = document.querySelector(".my-cart-backdrop");
    
    cart.style.display = 'flex';
    cart.style.pointerEvents = 'all'

    document.querySelector('.my-cart').addEventListener('click', (event) => {
    event.stopPropagation();
}, {once: true});
}

function closeModalCart() {
    const cart = document.querySelector(".my-cart-backdrop");

    cart.style.display = 'none';
    cart.style.pointerEvents = 'none'
}