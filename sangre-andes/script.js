// Initialize Lenis Smooth Scroll (Cinematic & Heavy)
const lenis = new Lenis({
    duration: 2.5, // Much slower and heavier than before
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
if (cursor) {
    const xTo = gsap.quickTo(cursor, "x", {duration: 0.1, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "y", {duration: 0.1, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('button, a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursor, {scale: 3, duration: 0.3}));
        el.addEventListener('mouseleave', () => gsap.to(cursor, {scale: 1, duration: 0.3}));
    });
}

// --- Intro Reveal Animation ---
window.addEventListener('load', () => {
    // Lock scroll briefly during intro
    lenis.stop();

    const tlIntro = gsap.timeline({
        onComplete: () => lenis.start()
    });

    // Slide texts up out of their hidden overflow masks
    tlIntro.to('.reveal-text', {
        y: 0,
        duration: 1.8,
        stagger: 0.2, // Sequence: Subtitle -> Sangre -> de Los Andes -> Scroll Prompt
        ease: "power4.out",
        delay: 0.5
    });
});

// --- Scroll Animations (Ultra-Slow and Premium) ---

// 1. Image Mask Reveals (The "Vogue" effect)
const masks = document.querySelectorAll('.img-mask');
masks.forEach(mask => {
    gsap.to(mask, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: mask,
            start: "top 80%", // Start revealing when it enters the bottom 20% of screen
            end: "center center",
            scrub: 1.5 // Slow, buttery smooth scrub
        }
    });
});

// 2. Subtle Image Parallax inside the mask
const parallaxImgs = document.querySelectorAll('.parallax-img');
parallaxImgs.forEach(img => {
    gsap.to(img, {
        yPercent: -15, // Move image up slightly while scrolling down
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// 3. Fade up text blocks
const fadeUps = document.querySelectorAll('.fade-up');
fadeUps.forEach(element => {
    gsap.to(element, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: element,
            start: "top 85%", // Trigger right before it comes into full view
            toggleActions: "play none none reverse"
        }
    });
});

// 4. Background Color Shift (Obsidian to Bone)
// When a section with data-color="light" comes into view, change body background.
const sections = document.querySelectorAll('section[data-color]');
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%", // When top of section hits middle of screen
        end: "bottom 50%",
        onEnter: () => updateColors(section.dataset.color),
        onEnterBack: () => updateColors(section.dataset.color)
    });
});

function updateColors(theme) {
    const body = document.body;
    if (theme === 'light') {
        body.style.backgroundColor = 'var(--color-bg-light)';
        body.style.color = 'var(--color-text-dark)';
    } else {
        body.style.backgroundColor = 'var(--color-bg-dark)';
        body.style.color = 'var(--color-text-light)';
    }
}
