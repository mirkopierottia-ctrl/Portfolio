// Initialize Lucide Icons
lucide.createIcons();

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const hoverTargets = document.querySelectorAll('.hover-target');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add slight delay to outline for smooth effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
    });
    target.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
    });
});

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

// Initial Loader Animation
const tl = gsap.timeline();

tl.fromTo('.loader-text', 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
)
.to('.loader-text', 
    { opacity: 0, duration: 0.5, delay: 0.5 }
)
.to('.loader', 
    { y: '-100%', duration: 1, ease: "power4.inOut" }
)
.from('.hero-title', 
    { y: 100, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.2 },
    "-=0.5"
)
.from('.hero-subtitle', 
    { y: 20, opacity: 0, duration: 1, ease: "power4.out" },
    "-=0.8"
)
.from('.navbar', 
    { y: -50, opacity: 0, duration: 1, ease: "power4.out" },
    "-=1"
);

// Parallax Effects
// Hero Background
gsap.to('#hero-bg', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Gallery Items Parallax
gsap.utils.toArray('.gallery-item').forEach(item => {
    const speed = item.dataset.speed || 1;
    gsap.to(item, {
        y: () => (1 - speed) * (ScrollTrigger.maxScroll(window) - (ScrollTrigger.maxScroll(window) / 2)),
        ease: "none",
        scrollTrigger: {
            trigger: ".collection",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Lookbook Parallax
gsap.to('.lookbook-img', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".lookbook",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Marquee Text
gsap.to('.marquee-content', {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: ".marquee-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});

// Fade in elements on scroll
const fadeElements = document.querySelectorAll('.section-title, .item-info, .lookbook-text p');

fadeElements.forEach(el => {
    gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// Modals & Cart Logic
const cartTrigger = document.getElementById('cart-trigger');
const closeCart = document.getElementById('close-cart');
const cartDrawer = document.getElementById('cart-drawer');

const aboutTrigger = document.getElementById('about-trigger');
const closeAbout = document.getElementById('close-about');
const aboutModal = document.getElementById('about-modal');

const backdrop = document.getElementById('overlay-backdrop');

function openModal(modal) {
    modal.classList.add('active');
    backdrop.classList.add('active');
    lenis.stop(); // Stop scrolling while modal is open
}

function closeModal() {
    cartDrawer.classList.remove('active');
    aboutModal.classList.remove('active');
    if (typeof quickViewModal !== 'undefined' && quickViewModal) {
        quickViewModal.classList.remove('active');
    }
    backdrop.classList.remove('active');
    lenis.start();
}

cartTrigger.addEventListener('click', () => openModal(cartDrawer));
closeCart.addEventListener('click', closeModal);

aboutTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(aboutModal);
});
closeAbout.addEventListener('click', closeModal);

backdrop.addEventListener('click', closeModal);

// Cart State
let cart = [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseInt(e.target.getAttribute('data-price'));
        const img = e.target.getAttribute('data-img');
        
        cart.push({ name, price, img });
        updateCartUI();
        openModal(cartDrawer); // Open cart when item added
    });
});

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        cartTotalPrice.innerText = '$ 0 ARS';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$ ${item.price.toLocaleString('es-AR')} ARS</p>
                <button class="remove-item hover-target" data-index="${index}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    
    cartTotalPrice.innerText = `$ ${total.toLocaleString('es-AR')} ARS`;
    
    // Add remove listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateCartUI();
        });
    });
    
    // Re-attach hover targets for custom cursor on new elements
    document.querySelectorAll('.cart-item .hover-target').forEach(target => {
        target.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        target.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// Quick View Modal Logic
const quickViewTriggers = document.querySelectorAll('.quick-view-trigger');
const quickViewModal = document.getElementById('quick-view-modal');
const closeQuickView = document.getElementById('close-quick-view');
const qvImg = document.getElementById('qv-img');
const qvTitle = document.getElementById('qv-title');
const qvPrice = document.getElementById('qv-price');
const qvDesc = document.getElementById('qv-desc');
const qvAddToCart = document.getElementById('qv-add-to-cart');
const sizeBtns = document.querySelectorAll('.size-btn');

let currentQvItem = null;
let selectedSize = 'M';

quickViewTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const name = trigger.getAttribute('data-name');
        const price = parseInt(trigger.getAttribute('data-price'));
        const img = trigger.getAttribute('data-img');
        const desc = trigger.getAttribute('data-desc');
        
        currentQvItem = { name, price, img };
        
        qvTitle.innerText = name;
        qvPrice.innerText = `$ ${price.toLocaleString('es-AR')} ARS`;
        qvDesc.innerText = desc;
        qvImg.src = img;
        
        openModal(quickViewModal);
    });
});

closeQuickView.addEventListener('click', closeModal);

sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.innerText;
    });
});

qvAddToCart.addEventListener('click', () => {
    if (currentQvItem) {
        const itemWithSize = {
            ...currentQvItem,
            name: `${currentQvItem.name} (${selectedSize})`
        };
        cart.push(itemWithSize);
        updateCartUI();
        
        closeModal();
        openModal(cartDrawer);
    }
});

// Checkout Logic
const checkoutBtn = document.getElementById('checkout-btn');
const successOverlay = document.getElementById('success-overlay');

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        // Close cart
        closeModal();
        
        // Show success overlay
        successOverlay.classList.add('active');
        
        // Empty cart
        cart = [];
        updateCartUI();
        
        // Hide success overlay after 3 seconds
        setTimeout(() => {
            successOverlay.classList.remove('active');
        }, 3000);
    }
});
