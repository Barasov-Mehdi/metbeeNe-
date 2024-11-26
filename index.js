const images = ['./imgs/FotoSLIDE1.jpg', './imgs/FotoSLIDE2.jpg', './imgs/FotoSLIDE4.jpg'];
let currentIndex = 0;

const sliderImage = document.getElementById('sliderImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Fonksiyon: Resmi güncelle
function updateImage() {
    sliderImage.src = images[currentIndex];
}

// Önceki butonuna tıklanınca
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateImage();
});

// Sonraki butonuna tıklanınca
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
});

// Otomatik kaydırma (isteğe bağlı)
setInterval(() => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
}, 3000); // Resim 3 saniyede bir değişecek

// script.js

const apiUrl = 'https://metbee-c9a5d6116dda.herokuapp.com/service/getAll';
const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');
const productBox = document.querySelector('.product_box');
const productNum = document.querySelector('.produc_num');
const card_pen = document.querySelector('.card_pen');


let products = [];
let cart = []; // Sepet için bir dizi oluştur
let cartCount = 0;

// API'den tüm ürünleri al
async function fetchProducts() {
    const response = await fetch(apiUrl);
    products = await response.json();
    displayProducts(products); // Tüm ürünleri görüntüle
}

// Ürünleri görüntüle
function displayProducts(productList) {
    productContainer.innerHTML = '';
    productList.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <div class="product">
                <div class="product_img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product_name">
                    <h2>${product.name}</h2>
                </div>
                <div class="product_info">
                    <p>${product.info}</p>
                </div>
                <div class="product_description">
                    <h4>${product.description}</h4>
                </div>
                <i class="fa-solid fa-cart-shopping add-to-cart" data-product='${JSON.stringify(product)}'></i>
            </div>
        `;
        
        // Ürün tıklama olayı
        productDiv.querySelector('.product').addEventListener('click', () => {
            // Ürün detayları sayfasına yönlendir
            window.location.href = `productDetails.html?id=${product._id}`;
        });

        productContainer.appendChild(productDiv);
    });

    // Sepete ekle butonlarına event listener ekleyelim
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.dataset.product);
            addToCart(product);
            e.stopPropagation(); // Tıklama olayını durdur
            card_pen.style.display='none';
        });
    });
}

// Kategori butonlarına event listener ekle
const categoryButtons = document.querySelectorAll('.category button');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        filterProductsByCategory(category);
    });
});

// Kategoriye göre ürünleri filtrele
function filterProductsByCategory(category) {
    const filteredProducts = category === 'Boşdur'
        ? products // 'Boşdur' için tüm ürünleri göster
        : products.filter(product => product.category === category);

    displayProducts(filteredProducts);
}

// Arama fonksiyonu
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.info.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(filteredProducts);
});

// Arama sonuçlarını görüntüle
function displaySearchResults(searchResults) {
    searchResult.innerHTML = '';
    searchResults.forEach((product) => {
        const searchDiv = document.createElement('div');
        searchDiv.innerHTML = `
            <h4 class="view-product" data-product='${JSON.stringify(product)}'>${product.name}</h4>
        `;
        searchResult.appendChild(searchDiv);
    });

    // Görüntüle butonuna tıklama olayını dinle
    const viewProductButtons = document.querySelectorAll('.view-product');
    viewProductButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.dataset.product);
            displaySingleProduct(product);
        });
    });
}

// Tekil ürünü görüntüle
function displaySingleProduct(product) {
    productContainer.innerHTML = `
        <div class="product">
        <div class="product_img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product_name">
            <h2>${product.name}</h2>
        </div>
        <div class="product_info">
            <p>${product.info}</p>
        </div>
        <div class="product_description">
            <h4>${product.description}</h4>
        </div>
        <i class="fa-solid fa-cart-shopping add-to-cart" data-product='${JSON.stringify(product)}'></i>
           
        </div>
    `;

    const addToCartButton = document.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => {
        addToCart(product);
    });
}

// Sepete ekleme işlemi
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item._id === product._id);

    if (existingProductIndex > -1) {
        // ürün zaten sepette ise, sayısını artır
        cart[existingProductIndex].quantity += 1;
    } else {
        // ürün yoksa yeni bir ürün ekle
        cart.push({ ...product, quantity: 1 });
    }

    cartCount++;
    productNum.textContent = cartCount;
    displayCart();
}

// Sepetteki ürünleri görüntüle
// Sepetteki ürünleri görüntüle
function displayCart() {
    productBox.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h4>${item.name} (x${item.quantity})</h4>
            <i class="fa-solid fa-trash remove-from-cart" data-id='${item._id}'></i>
        `;
        productBox.appendChild(cartItem);
    });

    // WhatsApp'a gönder butonunu ekleyin
    const sendMessageButton = document.createElement('button');
    sendMessageButton.innerText = 'WhatsApp ile Paylaş';
    sendMessageButton.addEventListener('click', sendWhatsAppMessage);
    productBox.appendChild(sendMessageButton);

    // Burada remove-from-cart butonları için olay dinleyicisi ekliyoruz
    const removeButtons = productBox.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
            card_pen.style.display = 'flex';
        });
    });
}

function sendWhatsAppMessage() {
    const phoneNumber = '+994605846205';  // Hedef telefon numarası
    const message = `Salam, bunların haqqında məlumat almaq istəyirəm:\n\n${cart.map(item => `${item.name} (x${item.quantity})`).join('\n')}`;
    const encodedMessage = encodeURIComponent(message); // Mesajı URL uyumlu hale getir
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank'); // Yeni sekmede WhatsApp aç
}

// Sepetten çıkarma işlemi
function removeFromCart(productId) {
    const existingProductIndex = cart.findIndex(item => item._id === productId);

    if (existingProductIndex > -1) {
        cartCount -= cart[existingProductIndex].quantity; // Tüm miktarı çıkar
        cart.splice(existingProductIndex, 1); // Ürünü sepetten çıkar
        productNum.textContent = cartCount;
        displayCart();
    }
}
fetchProducts();

var basket_card_box = document.querySelector(".basket_card_box");
basket_card_box.style.display = 'none';

function cardShowHide() {
    if (!basket_card_box.style.display === 'none') {
        basket_card_box.style.display = 'flex'
    } else {
        basket_card_box.style.display = 'none'
    }
}
function basketShowHide() {
    if (!basket_card_box.style.display === 'flex') {
        basket_card_box.style.display = 'none'
    } else {
        basket_card_box.style.display = 'flex'
    }
}

