const popUpBackdrop = document.querySelector('.pop-up-backdrop');
const popUp = document.querySelector('.pop-up');
const products = document.querySelectorAll('.pop-up-product');
const addBtn = document.querySelector('.pop-up-btn-add');
// cart
const cart = document.querySelector('.my-cart-body');
const cartCounter = document.querySelector('.cart-count-bubble-text');
const cartTotalPrice = document.querySelector('.my-cart-footer-total-price');

let isOnce;
if (popUp) {
    const storageIsOnce = localStorage['pop-up-once'] ? localStorage['pop-up-once'] : 'false';

    if (storageIsOnce === popUp.dataset.once) {
        isOnce = storageIsOnce;
    } else {
        localStorage.setItem(`pop-up-once`, popUp.dataset.once);
        isOnce = 'false';
    }
}

if (popUp && !JSON.parse(isOnce)) {

    // apperace of pop up with delay
    const delay = Number(popUp.dataset.delay) * 1000; 
    setTimeout(() => {
        popUpBackdrop.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        localStorage.setItem(`pop-up-once`, popUp.dataset.once);
    },
        delay);

    // hide pop up
    popUpBackdrop.addEventListener('click', () => {
        popUpBackdrop.style.display = 'none';
        document.body.style.overflow = 'scroll';
    });
    popUp.addEventListener('click', event => event.stopPropagation());
    
    // show once

    

    // add to cart
    addBtn.addEventListener('click', async () => {
        
        // form data for request
        let formData = {
            items: []
        };
        products.forEach(product => {
            formData.items.push({ id: product.dataset.id })
        });

            await fetch('cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        // hide pop up
        popUpBackdrop.style.display = 'none';
        document.body.style.overflow = 'scroll';

        updateCart();
    });

}

function updateCart() {
    fetch('/cart.js')
        .then(res => res.json())
        .then(data => {

            cart.classList.remove('my-cart-body-empty');
            cart.innerHTML = '';
            data.items.forEach(item => {
                innerCartItem(item);
            });

            cartCounter.textContent = data.item_count;
            cartTotalPrice.textContent = `₴${data.total_price / 100}.00`;
        })
        .catch(err => console.error(err));
}

// updateCart()

function innerCartItem({id, image, title, options_with_values, quantity, final_line_price}) {
    cart.insertAdjacentHTML('afterbegin', `
    <li class="my-cart-item my-cart-item-${id}">
        
        <img src="${image}" width="100">

        <div class="my-cart-item-first-box">

                <h3 class="my-cart-item-title">${title}</h3>
                <p class="my-cart-item-variant">${options_with_values[0].name}</p>

                <div class="my-cart-item-quantity-box">
                    <button class="my-cart-item-quantity-btn" onclick="event.preventDefault(); updateQuantity(-1, ${id})">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-minus" fill="none" viewBox="0 0 10 2">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor">
                        </svg>

                    </button>
                    <input type="number" class="my-cart-item-quantity my-cart-item-quantity-${id}" value="${quantity}" min="1" readonly>
                    <button class="my-cart-item-quantity-btn" onclick="event.preventDefault(); updateQuantity(1, ${id})">
                    
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19" stroke="{{ section.settings.color_scheme.settings.accent }}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5 12H19" stroke="{{ section.settings.color_scheme.settings.accent }}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </button>
                </div>
                
        </div>

        <div class="my-cart-item-second-box">
            <button class="my-cart-item-btn-delete" onclick="event.preventDefault(); removeItem(${id})">
            
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-close" fill="none" viewBox="0 0 18 17">
                <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor">
                </svg>

            </button>

            <p class="my-cart-item-total-price my-cart-item-total-price-${id}">${`₴${final_line_price / 100}.00`}</p>
        </div>
    </li>
    `);
}