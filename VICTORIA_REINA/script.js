document.addEventListener('DOMContentLoaded', () => {
    // Splash Screen Logic
    const splashScreen = document.getElementById('splash-screen');
    const splashLogoContainer = document.getElementById('splash-logo-container');
    const appContainer = document.getElementById('app-container');

    setTimeout(() => {
        splashLogoContainer.classList.add('slide-up');
        splashScreen.classList.add('hidden');
        appContainer.style.visibility = 'visible';
        appContainer.style.opacity = '1';
        
        // Remove splash from DOM after animation
        setTimeout(() => {
            splashScreen.remove();
        }, 1200);
    }, 3000);

    // Initialize Icons
    lucide.createIcons();

    // Elements
    const productsContainer = document.getElementById('products-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.querySelector('.cart-count');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    // Real Data (Matches new generated photos)
    const products = [
        { 
            id: 1, 
            name: 'Biblia Juvenil', 
            category: 'biblias', 
            price: 25000, 
            desc: 'Biblia con diseño moderno y juvenil. Ideal para inspirar a las nuevas generaciones.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_15up4k15up4k15up.png' 
        },
        { 
            id: 2, 
            name: 'Banderines para Papá', 
            category: 'regalos', 
            price: 5000, 
            desc: 'Hermosos banderines decorativos con mensajes bíblicos y de amor. El regalo perfecto para el Día del Padre.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_28hqkn28hqkn28hq.png' 
        },
        { 
            id: 3, 
            name: 'Biblia Letra Grande NVI', 
            category: 'biblias', 
            price: 28000, 
            desc: 'Nueva Versión Internacional con letra grande para lectura cómoda y diseño premium en azul.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_3j6dlq3j6dlq3j6d.png' 
        },
        { 
            id: 4, 
            name: 'Gorros de Lana', 
            category: 'accesorios', 
            price: 5500, 
            desc: 'Gorros de lana súper abrigados y elegantes para el invierno, disponibles en negro y gris.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_7tvcf7tvcf7tvcf7.png' 
        },
        { 
            id: 5, 
            name: 'Vasos Térmicos Cristianos', 
            category: 'regalos', 
            price: 5000, 
            desc: 'Vasos térmicos de alta calidad con frases inspiradoras como "Jesús salva" y "Paz".',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_bomdudbomdudbomd.png' 
        },
        { 
            id: 6, 
            name: 'Medias de Invierno', 
            category: 'accesorios', 
            price: 6000, 
            desc: 'Medias súper suaves con interior térmico y base antideslizante. Variedad de colores.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_bsebtybsebtybseb.png' 
        },
        { 
            id: 7, 
            name: 'Set de Mate Argentina', 
            category: 'accesorios', 
            price: 9000, 
            desc: 'Set matero apilable de diseño minimalista con detalles de la Selección Argentina y vaso negro "Dios es fiel".',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_czqo75czqo75czqo.png' 
        },
        { 
            id: 8, 
            name: 'Gorras Clásicas', 
            category: 'accesorios', 
            price: 15000, 
            desc: 'Gorras de gabardina de primera calidad en colores neutros, ideales para el uso diario.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_j0aojxj0aojxj0ao.png' 
        },
        { 
            id: 9, 
            name: 'Biblia Reina Valera Paloma', 
            category: 'biblias', 
            price: 15000, 
            desc: 'Clásica edición Reina Valera 1960 con una hermosa ilustración celestial en la portada.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_j2ww18j2ww18j2ww.png' 
        },
        { 
            id: 10, 
            name: 'Anotadores Cristianos', 
            category: 'regalos', 
            price: 15000, 
            desc: 'Cuadernos de tapa dura con increíbles diseños de "Yeshua" y el "Espíritu Santo" para tus devocionales.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_luihsqluihsqluih.png' 
        },
        { 
            id: 11, 
            name: 'Botellas Vamos Argentina', 
            category: 'accesorios', 
            price: 8000, 
            desc: 'Botellas térmicas coleccionables edición Campeones del Mundo. Mantené tu bebida fría y tu pasión intacta.',
            image: 'Imagenes Catalogo/Nuevas imagenes/Gemini_Generated_Image_xzip6vxzip6vxzip.png' 
        },
        { 
            id: 12, 
            name: 'Billetera Premium', 
            category: 'regalos', 
            price: 10000, 
            desc: 'Billetera premium de cuero. Excelente presentación para un regalo inolvidable.',
            image: 'Imagenes Catalogo/billetera.jpeg' 
        }
    ];

    let cart = [];

    // Render Products
    function renderProducts(filter = 'all', searchQuery = '') {
        productsContainer.innerHTML = '';
        
        let filtered = products;
        
        // Filter by category
        if (filter !== 'all') {
            filtered = filtered.filter(p => p.category === filter);
        }
        
        // Filter by search
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.desc.toLowerCase().includes(lowerQuery)
            );
        }
        
        if (filtered.length === 0) {
            productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No se encontraron productos.</p>';
            return;
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <!-- If the image isn't found, it will show the alt text, until the user drops it in assets/ -->
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/logo.png'; this.style.objectFit='contain'; this.style.padding='2rem';">
                </div>
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-price">$${product.price.toLocaleString('es-AR')}</div>
                <button class="btn-add" data-id="${product.id}">Añadir al carrito</button>
                <a href="https://wa.me/5493434776553?text=Hola,%20quiero%20consultar%20por%20el%20producto:%20${encodeURIComponent(product.name)}" class="print-wa-link" target="_blank"><i data-lucide="message-circle"></i> Comprar por WhatsApp</a>
            `;
            productsContainer.appendChild(card);
        });
        
        lucide.createIcons();
        attachAddEvents();
    }

    // Interactive Search Logic
    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        renderProducts(activeFilter, e.target.value);
    });

    // Filtering logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.getAttribute('data-filter'), searchInput.value);
        });
    });

    // Cart UI Logic
    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Cart Logic
    function attachAddEvents() {
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const product = products.find(p => p.id === id);
                addToCart(product);
                toggleCart();
            });
        });
    }

    function addToCart(product) {
        cart.push(product);
        updateCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Tu carrito está vacío.</div>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                const iconName = item.category === 'biblias' ? 'book' : (item.category === 'accesorios' ? 'gem' : 'gift');
                
                cartItem.innerHTML = `
                    <div class="cart-item-img"><i data-lucide="${iconName}"></i></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toLocaleString('es-AR')}</div>
                    </div>
                    <button class="icon-btn cart-item-remove" data-index="${index}"><i data-lucide="trash-2"></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        cartCountEl.textContent = cart.length;
        cartTotalPriceEl.textContent = `$${total.toLocaleString('es-AR')}`;
        lucide.createIcons();

        // Attach remove events
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                removeFromCart(idx);
            });
        });
    }

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        let message = '¡Hola! Quiero realizar la siguiente compra en Victoria Reina:%0A%0A';
        let total = 0;
        cart.forEach(item => {
            message += `- ${item.name} ($${item.price.toLocaleString('es-AR')})%0A`;
            total += item.price;
        });
        message += `%0A*Total: $${total.toLocaleString('es-AR')}*`;
        
        window.open(`https://wa.me/5493434776553?text=${message}`, '_blank');
        cart = [];
        updateCart();
        toggleCart();
    });

    // Init
    renderProducts();
});
