
async function getResponce() {
    let responce = await fetch("./data/shop.json");
    let content = await responce.json();

    let node_for_insert = document.getElementById("node_for_insert");

    content.forEach(item => {
        node_for_insert.innerHTML += `
        <li style="width: 210px" 
            class="d-flex flex-column m-1 p-1 border bg-body">
        
            <img style="width: 180px" class="align-self-center" src="${item.img}">
            <h5 class="card-subtitle">${item.title}</h5>
            <p class="card-text">${item.description}. Цена ${item.price} ₽.</p>

            <input type="hidden" class="vendor" value="${item.vendor_code}">
            <input type="number" class="amount w-25" value="1" min="1">

            <button class="btn btn-primary mt-2 add-to-cart-btn"
                data-title="${item.title}"
                data-price="${item.price}"
                data-vendor="${item.vendor_code}">
                Добавить в корзину
            </button>
        </li>
        `;
    });
}

getResponce();


let cart = JSON.parse(localStorage.getItem("cart")) || [];


function updateCartCount() {
    document.getElementById("cartCount").innerText =
        cart.reduce((sum, item) => sum + item.amount, 0);
}


function addToCart(product) {
    let existing = cart.find(p => p.vendor_code === product.vendor_code);

    if (existing) {
        existing.amount += product.amount;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


function renderCart() {
    let container = document.getElementById("cartItems");
    let total = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {
        let sum = item.price * item.amount;
        total += sum;

        container.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.amount}</td>
                <td>${item.price} ₽</td>
                <td>${sum} ₽</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">✕</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("cartTotal").innerText = total;
}


function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}


function clearCart() {
    if (!confirm("Вы уверены, что хотите очистить корзину?")) return;

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}


function sendOrder() {
    if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }

    alert("Ваш заказ успешно отправлен! ");

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

document.getElementById("cartModal").addEventListener("shown.bs.modal", renderCart);


updateCartCount();


document.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-cart-btn")) {

        let card = e.target.closest("li, .card");

        let amountInput = card.querySelector(".amount");
        let amount = amountInput ? Number(amountInput.value) : 1;

        let product = {
            title: e.target.dataset.title,
            price: Number(e.target.dataset.price),
            vendor_code: e.target.dataset.vendor,
            amount: amount
        };

        addToCart(product);
    }
});