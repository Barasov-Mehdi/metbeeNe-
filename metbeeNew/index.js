const images = ['./imgs/FotoSLIDE4.jpg', './imgs/FotoSLIDE4.jpg', './imgs/FotoSLIDE4.jpg'];
let currentIndex = 0;
var container = document.querySelector('.container');

const sliderImage = document.getElementById('sliderImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

function updateImage() {
    sliderImage.src = images[currentIndex];
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateImage();
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
});

setInterval(() => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
}, 3000); 

const apiUrl = 'https://metbee-c9a5d6116dda.herokuapp.com/service/getAll';
const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');
const productBox = document.querySelector('.product_box');
const productNum = document.querySelector('.produc_num');
const card_pen = document.querySelector('.card_pen');

let products = [];
let cart = []; 
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
            card_pen.style.display = 'none';
        });
    });
}

const categoryButtons = document.querySelectorAll('.category button');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        filterProductsByCategory(category);
    });
});

function filterProductsByCategory(category) {
    const filteredProducts = category === 'Boşdur'
        ? products // 'Boşdur' için tüm ürünleri göster
        : products.filter(product => product.category === category);

    displayProducts(filteredProducts);
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Boş olup olmadığını kontrol et
    if (searchTerm === '') {
        searchResult.style.display = 'none'; // Boşsa sonuç kısmını gizle
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.info.toLowerCase().includes(searchTerm)
    );

    // Filtrelenmiş ürünleri göster
    displaySearchResults(filteredProducts);
    searchResult.style.display = 'flex'; // Sonuç kısmını göster
});

function displaySearchResults(searchResults) {
    searchResult.innerHTML = '';
    searchResults.forEach((product) => {
        const searchDiv = document.createElement('div');
        searchDiv.innerHTML = `
            <h4 class="view-product" data-product='${JSON.stringify(product)}'>${product.name}</h4>
        `;

        // Tıklanıldığında adı input'a eklemek için olay dinleyici
        searchDiv.querySelector('.view-product').addEventListener('click', (e) => {
            const product = JSON.parse(e.target.dataset.product);
            searchInput.value = product.name; // Seçilen ürün ismini input'a ekle
            searchResult.style.display = 'none'; // Sonuç kısmını gizle
            displaySingleProduct(product); // Ürünü göster
        });

        searchResult.appendChild(searchDiv);
    });

    // Eğer sonuç yoksa, sonuç kısmını gizle
    if (searchResults.length === 0) {
        searchResult.style.display = 'none';
    }
}

searchInput.addEventListener('focus', () => {
    if (searchInput.value !== '') {
        searchResult.style.display = 'flex'; // Eğer inputta değer varsa sonuçları göster
    }
});

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
        card_pen.style.display = 'none';

    });
}

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

// Sayfa yüklendiğinde olay dinleyici ekliyoruz
document.addEventListener('DOMContentLoaded', function () {
    const sendMessageButton = document.getElementById('sendWhatsAppButton');
    sendMessageButton.addEventListener('click', sendWhatsAppMessage);
});

function displayCart() {
    productBox.innerHTML = ''; // Önceki içeriği temizle
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h4>${item.name} (x${item.quantity})</h4>
            <i class="fa-solid fa-trash remove-from-cart" data-id='${item._id}'></i>
        `;
        productBox.appendChild(cartItem);
    });

    // remove-from-cart butonları için olay dinleyicisi ekliyoruz
    const removeButtons = productBox.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
            displayCart(); // Sepeti tekrar görüntüle
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
    if (basket_card_box.style.display === 'none' || basket_card_box.style.display === '') {
        basket_card_box.style.display = 'flex';
        container.style.height = '100vh';
    } else {
        basket_card_box.style.display = 'none';
        container.style.height = 'auto';
    }
}

function basketShowHide() {
    if (basket_card_box.style.display === 'none' || basket_card_box.style.display === '') {
        basket_card_box.style.display = 'flex';
        container.style.height = '100vh';

    } else {
        basket_card_box.style.display = 'none';
        container.style.height = 'auto';

    }
}

var open_mbBox = document.querySelector('.open_mbBox');
var close_mbBox = document.querySelector('.close_mbBox');
var menu_box = document.querySelector('.menu_box');

function toggleMenu(isOpen) {
    if (isOpen) {
        menu_box.style.display = 'flex';
        container.style.height = '100vh';

    } else {
        menu_box.style.display = 'none';
        // container.style.overflowY = 'scroll';
        container.style.height = 'auto';

    }
}

close_mbBox.addEventListener('click', () => toggleMenu(false));
open_mbBox.addEventListener('click', () => toggleMenu(true));

document.getElementById('toggleButton').addEventListener('click', function () {
    const icons = document.querySelectorAll('.icon');

    // İkonların var olup olmadığını kontrol edip sınıfları değiştiriyoruz
    if (icons[0].classList.contains('show')) {
        icons.forEach(icon => {
            icon.classList.remove('show');
        });
    } else {
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.classList.add('show');
            }, index * 200); // Her bir ikonun gösterimini geciktirir
        });
    }
});


