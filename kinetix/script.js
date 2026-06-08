// Initialize Icons
lucide.createIcons();

// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- Three.js Setup ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// We want the shoe to really pop, so we use a relatively tight FOV
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// For realistic PBR materials
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
canvasContainer.appendChild(renderer.domElement);

// --- Lighting ---
// Ambient light to fill shadows softly
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Key directional light (main pop)
const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// Fill light from the other side (slightly blueish)
const fillLight = new THREE.DirectionalLight(0xe0eaff, 1.5);
fillLight.position.set(-5, 0, 3);
scene.add(fillLight);

// Backlight (rim light to separate shoe from background)
const backLight = new THREE.DirectionalLight(0xccff00, 2); // Neon yellow rim light
backLight.position.set(0, 5, -5);
scene.add(backLight);

// Scanner Light (Laboratory laser sweep effect)
const scannerLight = new THREE.PointLight(0x00ffff, 4, 15); // Intense Cyan beam
scannerLight.position.set(-5, 0, 4);
scene.add(scannerLight);

// --- GLTF Loader ---
const loader = new THREE.GLTFLoader();
let shoeModel;

// Public robust URL to a sneaker model (Nike Air Force style / Khronos sample)
const modelUrl = 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf';

const loaderScreen = document.getElementById('loader');
const progressText = document.querySelector('.loader-progress');

loader.load(
    modelUrl,
    (gltf) => {
        shoeModel = gltf.scene;
        
        // Center the shoe properly
        const box = new THREE.Box3().setFromObject(shoeModel);
        const center = box.getCenter(new THREE.Vector3());
        shoeModel.position.sub(center);
        
        // Wrap it in a group so we can rotate the group around the center
        const group = new THREE.Group();
        group.add(shoeModel);
        
        // Initial scale and rotation
        group.scale.set(15, 15, 15);
        group.rotation.x = 0.2;
        group.rotation.y = -0.5;
        
        scene.add(group);
        shoeModel = group; // Reassign so animations target the group

        // --- Loader Split Screen Animation ---
        const tlLoader = gsap.timeline();
        
        // Ensure counter reaches 100% fast
        tlLoader.to(progressText, {
            innerText: 100,
            duration: 0.5,
            snap: { innerText: 1 },
            onUpdate: function() {
                progressText.innerHTML = Math.round(this.targets()[0].innerText) + "%";
            }
        })
        // Fade out text
        .to('.loader-content', { opacity: 0, duration: 0.5, ease: "power2.inOut" })
        // Split screen apart
        .to('.loader-bg.top', { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2")
        .to('.loader-bg.bottom', { yPercent: 100, duration: 1, ease: "expo.inOut" }, "-=1")
        // Hide loader completely
        .set('#loader', { display: 'none' });

        // --- Shoe Entrance Animation ---
        gsap.fromTo(shoeModel.position, 
            { y: 5 }, 
            { y: 0, duration: 1.5, ease: "bounce.out", delay: 0.8 }
        );

        // Start scroll animations
        setTimeout(() => {
            initScrollAnimations();
        }, 1000);
    },
    (xhr) => {
        // Update progress text
        if (xhr.lengthComputable && progressText) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            progressText.innerHTML = Math.round(percentComplete) + "%";
        }
    },
    (error) => {
        console.error('An error happened loading the GLTF', error);
        if(loaderScreen) loaderScreen.innerHTML = '<h1 style="color:white; font-family: Oswald">ERROR LOADING 3D ASSET</h1>';
    }
);

// --- Mouse Parallax ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Render Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    if (shoeModel) {
        // Floating animation
        const time = clock.getElapsedTime();
        shoeModel.position.y = Math.sin(time * 2) * 0.1;

        // Scanner Light Sweeping Animation
        if (scannerLight) {
            scannerLight.position.x = Math.sin(time * 1.5) * 8; // Sweeps back and forth
        }

        // Parallax depth based on mouse (Clamped to prevent weird stretching)
        targetX = THREE.MathUtils.clamp(mouseX * 0.0005, -0.2, 0.2);
        targetY = THREE.MathUtils.clamp(mouseY * 0.0005, -0.2, 0.2);

        // Smoothly rotate the entire scene for perspective shift
        scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
        scene.rotation.x += 0.05 * (targetY - scene.rotation.x);
    }

    renderer.render(scene, camera);
}
animate();

// --- GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function initScrollAnimations() {
    // 1. Marquee text in background
    gsap.to('.marquee-left', {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    gsap.to('.marquee-right', {
        xPercent: 50,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // 2. Animate the Shoe through the page
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-content",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // Phase 1: Scroll to First Feature (Aero Bounce)
    tl.to(shoeModel.rotation, {
        y: 0.8, // Face the other way smoothly
        z: -0.2, // Tilt down to show top
        ease: "power1.inOut"
    }, 0)
    .to(shoeModel.position, {
        x: 1.5, // Move right
        ease: "power1.inOut"
    }, 0);

    // Phase 2: Scroll to Second Feature (Hyper Grip)
    tl.to(shoeModel.rotation, {
        y: Math.PI / 2, // Pure side profile (90 degrees)
        x: 0.8, // Tilt up significantly to show the grip/sole
        z: 0.2, // Slight tilt for dynamism
        ease: "power1.inOut"
    }, 1)
    .to(shoeModel.position, {
        x: -1.5, // Move left
        ease: "power1.inOut"
    }, 1);

    // Phase 3: Material Inspector (Mega Zoom)
    tl.to(shoeModel.rotation, {
        y: Math.PI / 2, // Show the side mesh
        x: 0.2,
        z: 0.1,
        ease: "power2.inOut"
    }, 2)
    .to(shoeModel.position, {
        x: 0, // Center
        y: -2, // Move down slightly so top mesh is visible
        ease: "power2.inOut"
    }, 2)
    .to(shoeModel.scale, {
        x: 35, y: 35, z: 35, // Mega Zoom!
        ease: "power2.inOut"
    }, 2);

    // Phase 4: Final CTA
    tl.to(shoeModel.rotation, {
        y: 0, // Face exactly front
        x: 0,
        z: 0,
        ease: "power2.out"
    }, 3)
    .to(shoeModel.position, {
        x: 0, 
        y: 0,
        ease: "power2.out"
    }, 3)
    .to(shoeModel.scale, {
        x: 20, y: 20, z: 20, // Normal Zoom
        ease: "power2.out"
    }, 3);

    // 3. Fade in Feature Blocks
    const featureBlocks = document.querySelectorAll('.feature-block');
    featureBlocks.forEach(block => {
        gsap.fromTo(block, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1,
                scrollTrigger: {
                    trigger: block,
                    start: "top 70%",
                    end: "top 30%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 4. Fade in CTA Content
    gsap.fromTo('.cta-content',
        { opacity: 0, scale: 0.9 },
        { 
            opacity: 1, 
            scale: 1, 
            duration: 1,
            scrollTrigger: {
                trigger: ".cta-section",
                start: "top 50%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // 5. Material Inspector Animations
    gsap.to('.crosshair-target', {
        opacity: 1,
        scale: 1.2,
        duration: 1,
        scrollTrigger: {
            trigger: ".material-inspector",
            start: "top 50%",
            end: "bottom 50%",
            toggleActions: "play reverse play reverse"
        }
    });

    gsap.to('.tech-line', {
        width: "100%",
        duration: 1,
        scrollTrigger: {
            trigger: ".material-inspector",
            start: "top 50%",
            end: "bottom 50%",
            toggleActions: "play reverse play reverse"
        }
    });
}

// --- Magnetic Button Logic ---
const magneticWrap = document.querySelector('.magnetic-wrap');
const massiveBtn = document.querySelector('.massive-btn');

if(magneticWrap && massiveBtn) {
    magneticWrap.addEventListener('mousemove', (e) => {
        const rect = magneticWrap.getBoundingClientRect();
        // Calculate mouse position relative to the center of the button
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the button towards the mouse (magnetic pull)
        gsap.to(massiveBtn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    magneticWrap.addEventListener('mouseleave', () => {
        // Snap back to center
        gsap.to(massiveBtn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
}
