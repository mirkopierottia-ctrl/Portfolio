// Initialize Lucide Icons
lucide.createIcons();

// Initialize Lenis Smooth Scroll
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

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Dark Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle ? themeToggle.querySelector('i') : null;

// Check local storage for theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' && body) {
    body.classList.add('dark-mode');
    if (icon) icon.setAttribute('data-lucide', 'sun');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.setAttribute('data-lucide', 'sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons(); // Re-render the icon
    });
}

// Custom Cursor & Interactive Hero Logic
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
const heroGradient = document.querySelector('.hero-bg-gradient');
const heroTitle = document.querySelector('.hero-title');

document.addEventListener('mousemove', (e) => {
    // 1. Cursor Follower
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });

    // 2. Hero Interactive Glow
    if (heroGradient) {
        gsap.to(heroGradient, {
            x: e.clientX,
            y: e.clientY,
            duration: 1.5,
            ease: 'power2.out'
        });
    }

    // 3. Hero 3D Parallax Tilt
    if (heroTitle) {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 30; // Rotate between -15 and 15 deg
        const yPos = (e.clientY / window.innerHeight - 0.5) * 30;
        
        gsap.to(heroTitle, {
            rotationY: xPos,
            rotationX: -yPos,
            transformPerspective: 900,
            transformOrigin: "center center",
            duration: 1,
            ease: 'power2.out'
        });
    }

    // 4. Hero Terminal 3D Tilt
    const heroTerminal = document.querySelector('.hero-terminal');
    if (heroTerminal) {
        const xPosTerm = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPosTerm = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(heroTerminal, {
            rotationY: xPosTerm,
            rotationX: -yPosTerm,
            transformPerspective: 1000,
            transformOrigin: "center center",
            duration: 1,
            ease: 'power2.out'
        });
    }
});

// Hover effect for cursor
const links = document.querySelectorAll('a, button, .nav-btn');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(0, 102, 255, 0.1)', // Accent color glow
            borderColor: 'rgba(0, 102, 255, 0.3)',
            duration: 0.3
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, {
            width: 40,
            height: 40,
            backgroundColor: 'transparent',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            duration: 0.3
        });
    });
});

// Hero Section Entry (Constructed immediately to set initial hidden states)
const heroTl = gsap.timeline({ paused: true });

heroTl.from('.navbar', {
    y: -30,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
})
.from('.word', {
    y: '100%',
    duration: 1.5,
    stagger: 0.15,
    ease: 'power4.out'
}, "-=1")
.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 1.5,
    ease: 'power4.out'
}, "-=1")
.from('.scroll-indicator', {
    opacity: 0,
    duration: 1
}, "-=0.5");

// Interactive Hero Terminal Typing Animation
const terminalBody = document.getElementById('terminal-body');
function typeCode() {
    if (!terminalBody) return;
    
    const codeLines = [
        '<div class="code-line"><span class="keyword">const</span> <span class="variable">developer</span> = {</div>',
        '<div class="code-line indent-1"><span class="property">name</span>: <span class="string">\'Mirko Pierotti\'</span>,</div>',
        '<div class="code-line indent-1"><span class="property">role</span>: <span class="string">\'Frontend Engineer\'</span>,</div>',
        '<div class="code-line indent-1"><span class="property">skills</span>: [<span class="string">\'React\'</span>, <span class="string">\'GSAP\'</span>, <span class="string">\'WebGL\'</span>],</div>',
        '<div class="code-line indent-1"><span class="property">status</span>: <span class="string">\'Available for hire\'</span></div>',
        '<div class="code-line">};</div>',
        '<div class="code-line empty"></div>',
        '<div class="code-line"><span class="keyword">await</span> developer.<span class="method">initialize</span>();</div>',
        '<div class="code-line type-cursor">&nbsp;</div>'
    ];
    
    let currentLine = 0;
    terminalBody.innerHTML = '';
    
    function addLine() {
        if (currentLine < codeLines.length) {
            const prevCursor = terminalBody.querySelector('.type-cursor');
            if (prevCursor) prevCursor.remove();
            
            terminalBody.innerHTML += codeLines[currentLine];
            currentLine++;
            
            setTimeout(addLine, Math.random() * 200 + 100);
        }
    }
    
    setTimeout(addLine, 1000);
}

// Splash Screen Logic
const splashScreen = document.getElementById('splash-screen');
const splashProgressBar = document.getElementById('splash-progress-bar');
const splashCounter = document.getElementById('splash-counter');
const splashRest = document.querySelector('.splash-rest');
const splashDot = document.querySelector('.splash-dot');

if (splashScreen) {
    lenis.stop(); // Disable scroll during loading
    
    if(splashDot) gsap.set(splashDot, { opacity: 0, x: -20, display: 'inline-block' });
    
    let loadProgress = { val: 0 };
    gsap.to(loadProgress, {
        val: 100,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: () => {
            if (splashCounter) splashCounter.innerText = Math.round(loadProgress.val) + "%";
            if (splashProgressBar) splashProgressBar.style.width = loadProgress.val + "%";
        },
        onComplete: () => {
            const logoTl = gsap.timeline();
            
            if(splashRest && splashDot) {
                logoTl.to(splashRest, {
                    width: 0,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.inOut"
                })
                .to(splashDot, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                }, "-=0.2");
            }

            logoTl.to(splashScreen, {
                yPercent: -100,
                duration: 1.2,
                ease: "expo.inOut",
                delay: 0.4,
                onStart: () => {
                    setTimeout(() => { 
                        heroTl.play(); 
                        typeCode();
                    }, 300);
                },
                onComplete: () => {
                    lenis.start();
                    splashScreen.remove();
                }
            });
        }
    });
} else {
    heroTl.play();
    typeCode();
}

// Project Cards Scroll Animations & 3D Hover
const projects = document.querySelectorAll('.project-card');

projects.forEach((project, index) => {
    // Better Entrance Animation using fromTo to avoid GSAP recording bugs
    gsap.fromTo(project, 
        { y: 80, opacity: 0, rotationX: -10 },
        {
            scrollTrigger: {
                trigger: project,
                start: "top 90%", // Trigger slightly earlier
                toggleActions: "play none none none" // Just play once, don't hide again
            },
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            ease: "expo.out"
        }
    );

    // 3D Hover Effect on the entire card
    project.addEventListener('mousemove', (e) => {
        const rect = project.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (-15 to +15 degrees for more drama)
        const rotateY = ((x / rect.width) - 0.5) * 30;
        const rotateX = ((y / rect.height) - 0.5) * -30;
        
        gsap.to(project, {
            rotationY: rotateY,
            rotationX: rotateX,
            transformPerspective: 1200,
            scale: 1.03, // Slight scale up of the entire card
            duration: 0.6,
            ease: "power2.out",
            zIndex: 10 // bring to front when hovering
        });
    });
    
    project.addEventListener('mouseleave', () => {
        gsap.to(project, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
            zIndex: 1
        });
    });
});

// About Section Animation (Philosophy Text Reveal)
const aboutColTitle = document.querySelector('.about-col h2');
if (aboutColTitle) {
    gsap.from(aboutColTitle, {
        scrollTrigger: {
            trigger: '.about-col',
            start: "top 80%"
        },
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });
}

const aboutText = document.querySelector('.about-text');
if (aboutText) {
    const words = aboutText.innerText.split(' ');
    aboutText.innerHTML = '';
    words.forEach(word => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.style.opacity = '0.15';
        span.style.transition = 'color 0.3s';
        aboutText.appendChild(span);
    });

    gsap.to(aboutText.children, {
        scrollTrigger: {
            trigger: '.about-col',
            start: "top 75%",
            end: "bottom 50%",
            scrub: 1
        },
        opacity: 1,
        stagger: 0.1,
        ease: "none"
    });
}

// Contact Section Cascade Reveal
const contactColTitle = document.querySelector('.contact-col h2');
const formGroups = document.querySelectorAll('.form-group');
const submitBtnAnim = document.querySelector('.btn-submit');

const contactTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.contact-col',
        start: "top 75%",
        toggleActions: "play none none none"
    }
});

if (contactColTitle) {
    contactTl.from(contactColTitle, { y: 30, opacity: 0, duration: 1, ease: "power4.out" });
}
if (formGroups.length > 0) {
    contactTl.from(formGroups, { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out" }, "-=0.5");
}
if (submitBtnAnim) {
    contactTl.from(submitBtnAnim, { scale: 0.9, opacity: 0, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.5");
}

// Magnetic Button Effect
if (submitBtnAnim) {
    submitBtnAnim.addEventListener('mousemove', (e) => {
        const rect = submitBtnAnim.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(submitBtnAnim, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    submitBtnAnim.addEventListener('mouseleave', () => {
        gsap.to(submitBtnAnim, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
}

// GSAP Horizontal Scroll for Experience
const track = document.querySelector('.horizontal-track');
const experienceSection = document.querySelector('.experience');

if (track && experienceSection) {
    const trackWidth = track.offsetWidth;
    const windowWidth = window.innerWidth;
    
    const horizontalScroll = gsap.to(track, {
        x: () => -(trackWidth - windowWidth), // Exact slide to end
        ease: "none",
        scrollTrigger: {
            trigger: experienceSection,
            pin: true,
            scrub: 1,
            end: () => "+=" + trackWidth
        }
    });

    // Storytelling Focus Effect
    const cards = document.querySelectorAll('.timeline-card:not(.timeline-end)');
    cards.forEach(card => {
        gsap.set(card, { scale: 0.8, opacity: 0.4 });
        
        const tlFocus = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalScroll,
                start: "left 85%", // enters screen
                end: "right 15%",  // leaves screen
                scrub: 1
            }
        });
        
        tlFocus.to(card, { scale: 1, opacity: 1, borderColor: "var(--accent)", ease: "power1.inOut", duration: 1 })
               .to(card, { scale: 0.8, opacity: 0.4, borderColor: "var(--border-color)", ease: "power1.inOut", duration: 1 });
    });
}

// Contact Form Interactive Logic
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const btnIcon = submitBtn.querySelector('.btn-icon');
const btnText = submitBtn.querySelector('.btn-text');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        // 1. Loading State
        btnText.textContent = 'Sending...';
        btnIcon.setAttribute('data-lucide', 'loader-2');
        btnIcon.classList.add('spin');
        lucide.createIcons();
        submitBtn.style.pointerEvents = 'none'; // Prevent double click
        
        // 2. Simulate Async Network Request (2 seconds)
        setTimeout(() => {
            // Success State
            btnIcon.classList.remove('spin');
            btnIcon.setAttribute('data-lucide', 'check');
            btnText.textContent = 'Sent';
            lucide.createIcons();
            submitBtn.style.backgroundColor = '#00C853'; // Success Green
            
            // Show success message and clear form
            formSuccess.style.display = 'flex';
            contactForm.reset();
            
            // Revert button after 3 seconds
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btnIcon.setAttribute('data-lucide', 'send');
                lucide.createIcons();
                submitBtn.style.backgroundColor = '';
                submitBtn.style.pointerEvents = 'auto';
                formSuccess.style.display = 'none';
            }, 3000);
            
        }, 2000);
    });
}

// Interactive Particle Constellation System
const canvas = document.getElementById('hero-particles');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    let mouse = {
        x: undefined,
        y: undefined,
        radius: 150
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Interactive scattering
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < mouse.radius + this.size && mouse.x !== undefined) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                
                // Repel effect
                this.x -= forceDirectionX * 3;
                this.y -= forceDirectionY * 3;
            }
            
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let number = (canvas.height * canvas.width) / 10000;
        if(number > 150) number = 150; // Cap
        
        for (let i = 0; i < number; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1.5) - 0.75;
            let directionY = (Math.random() * 1.5) - 0.75;
            let color = '#0066FF';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < 15000) {
                    let mDx = (mouse.x !== undefined) ? mouse.x - particlesArray[a].x : 1000;
                    let mDy = (mouse.y !== undefined) ? mouse.y - particlesArray[a].y : 1000;
                    let mDistance = Math.sqrt(mDx*mDx + mDy*mDy);
                    
                    let opacityValue = 1 - (distance / 15000);
                    if(mDistance < mouse.radius) {
                        ctx.strokeStyle = 'rgba(0, 102, 255,' + opacityValue * 0.8 + ')'; 
                    } else {
                        ctx.strokeStyle = 'rgba(0, 102, 255,' + opacityValue * 0.15 + ')'; 
                    }
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animateParticles();

    document.addEventListener('mouseleave', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
}

// Timeline Card Expansion Logic
const globalModal = document.getElementById('global-card-modal');
const cardOverlay = document.getElementById('card-overlay');
const timelineCardsEx = document.querySelectorAll('.timeline-card:not(.timeline-end)');

if (globalModal && cardOverlay) {
    timelineCardsEx.forEach(card => {
        card.addEventListener('click', (e) => {
            const expandedContent = card.querySelector('.card-expanded-content');
            
            // Prevent multiple clicks if already animating/open
            if (expandedContent && globalModal.style.display !== 'flex') {
                const rect = card.getBoundingClientRect();
                
                // Populate modal with content
                globalModal.innerHTML = expandedContent.innerHTML;
                globalModal.style.display = 'flex';
                
                // Select elements for staggering inside the cloned content
                const childrenToAnimate = globalModal.querySelectorAll('.expanded-header, .tech-section, .tech-stack-expanded');
                gsap.set(childrenToAnimate, { opacity: 0, y: 30 });
                
                // Show overlay and modal with GSAP
                const tl = gsap.timeline();
                
                cardOverlay.classList.add('active');
                
                // Super clean morphing animation using a proxy block to avoid clipping/reflow bugs
                const morphBlock = document.createElement('div');
                morphBlock.style.position = 'fixed';
                morphBlock.style.top = rect.top + 'px';
                morphBlock.style.left = rect.left + 'px';
                morphBlock.style.width = rect.width + 'px';
                morphBlock.style.height = rect.height + 'px';
                morphBlock.style.backgroundColor = 'var(--bg-card)';
                morphBlock.style.borderRadius = '32px';
                morphBlock.style.zIndex = 9998; // below modal
                morphBlock.style.boxShadow = '0 40px 100px rgba(0,0,0,0.5)';
                document.body.appendChild(morphBlock);

                // Set initial state for modal at its final dimensions, but hidden
                gsap.set(globalModal, {
                    top: '5vh',
                    left: '5vw',
                    width: '90vw',
                    height: '90vh',
                    opacity: 0, // Start hidden
                    pointerEvents: 'auto',
                    borderRadius: '24px',
                    clipPath: 'none',
                    backgroundColor: 'transparent'
                });
                
                // Hyper-complex Animation: Proxy Morph
                tl.to(card, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to(morphBlock, {
                    top: '5vh',
                    left: '5vw',
                    width: '90vw',
                    height: '90vh',
                    borderRadius: '24px',
                    duration: 0.8,
                    ease: "expo.inOut"
                }, "-=0.1")
                .to(globalModal, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                }, "-=0.2")
                .to(childrenToAnimate, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                }, "-=0.3");
                
                // Do not hide morph block, let it serve as the background layer
                // so the text doesn't lose its background.
                
                // Initialize close button event listener for the cloned content
                const closeBtn = globalModal.querySelector('.close-card-btn');
                if (closeBtn) {
                    closeBtn.style.zIndex = "9999"; // Ensure it sits above all other content
                    closeBtn.addEventListener('click', (ev) => {
                        ev.stopPropagation(); // prevent re-triggering card
                        
                        const closeIcon = closeBtn.querySelector('i');
                        if(closeIcon) {
                            // Spin 360 degrees and shrink, Nocturno style
                            gsap.to(closeIcon, { rotation: "+=360", scale: 0, opacity: 0, duration: 0.6, ease: "back.in(2)" });
                        }
                        
                        morphBlock.style.display = 'block';
                        
                        const closeTl = gsap.timeline({
                            onComplete: () => {
                                globalModal.style.display = 'none';
                                globalModal.innerHTML = ''; // Clean up
                                cardOverlay.classList.remove('active');
                                morphBlock.remove();
                                gsap.set(card, { scale: 1, opacity: 1, clearProps: "all" }); // safety reset
                            }
                        });
                        
                        closeTl.to(childrenToAnimate, {
                            opacity: 0,
                            y: -20,
                            duration: 0.2,
                            stagger: 0.05,
                            ease: "power2.in"
                        })
                        .to(globalModal, {
                            opacity: 0,
                            duration: 0.2
                        }, "-=0.1")
                        .to(morphBlock, {
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                            borderRadius: '32px',
                            duration: 0.8,
                            ease: "expo.inOut"
                        })
                        .to(card, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.out"
                        }, "-=0.3");
                    });
                }
            }
        });
    });
    
    cardOverlay.addEventListener('click', () => {
        const closeBtn = globalModal.querySelector('.close-card-btn');
        if(closeBtn) closeBtn.click();
    });
}
