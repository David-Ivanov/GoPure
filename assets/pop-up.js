const popUpBackdrop = document.querySelector('.pop-up-backdrop');
const popUp = document.querySelector('.pop-up');
const products = document.querySelectorAll('.pop-up-product');
const addBtn = document.querySelector('.pop-up-btn-add');

let isOnce;
if (popUp) {
    const storageIsOnce = localStorage['pop-up-once'] ? localStorage['pop-up-once'] : 'false';
    console.log(storageIsOnce);
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
    addBtn.addEventListener('click', () => {
        
        // form data for request
        let formData = {
            items: []
        };
        products.forEach(product => {
            formData.items.push({ id: product.dataset.id })
        });

            fetch('cart/add.js', {
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
    });

}