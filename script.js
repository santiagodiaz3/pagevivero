// DOM Elements
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const plantCards = document.querySelectorAll('.plant-card');
const testimonialTrack = document.querySelector('.testimonials-track');
const prevBtn = document.querySelector('.testimonial-btn.prev');
const nextBtn = document.querySelector('.testimonial-btn.next');
const addButtons = document.querySelectorAll('.btn-add');

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Animar las barras del menú
    const bars = navToggle.querySelectorAll('span');
    if (isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
}

navToggle.addEventListener('click', toggleMenu);

// Cerrar menú al hacer clic en un enlace
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// ===== FILTER PLANTS =====
function filterPlants(category) {
    plantCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategory === category;

        if (shouldShow) {
            card.classList.remove('hidden');
            // Añadir animación de fade in
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.classList.add('hidden');
        }
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Actualizar estado activo
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filtrar plantas
        const filter = btn.getAttribute('data-filter');
        filterPlants(filter);
    });
});

// ===== TESTIMONIALS SLIDER =====
let currentSlide = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalSlides = testimonialCards.length;

function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function updateSlider() {
    const cardsPerView = getCardsPerView();
    const maxSlide = totalSlides - cardsPerView;

    if (currentSlide > maxSlide) {
        currentSlide = maxSlide;
    }
    if (currentSlide < 0) {
        currentSlide = 0;
    }

    const cardWidth = testimonialCards[0].offsetWidth + 24; // ancho + gap
    const offset = currentSlide * cardWidth;
    testimonialTrack.style.transform = `translateX(-${offset}px)`;
}

function nextSlide() {
    const cardsPerView = getCardsPerView();
    const maxSlide = totalSlides - cardsPerView;

    if (currentSlide < maxSlide) {
        currentSlide++;
    } else {
        currentSlide = 0; // Volver al inicio
    }
    updateSlider();
}

function prevSlide() {
    const cardsPerView = getCardsPerView();
    const maxSlide = totalSlides - cardsPerView;

    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = maxSlide; // Ir al final
    }
    updateSlider();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Actualizar slider al redimensionar
window.addEventListener('resize', updateSlider);

// Auto-avance del slider
let autoSlide = setInterval(nextSlide, 5000);

// Pausar auto-avance al interactuar
testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
testimonialTrack.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
});

// ===== ADD TO CART ANIMATION =====
addButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const originalText = this.textContent;
        this.textContent = '✓ Agregado';
        this.style.backgroundColor = '#2d6a4f';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 1500);

        // Animación de vibración
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll('.benefit-card, .plant-card, .gallery-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// CSS para animación
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== WHATSAPP MESSAGE WITH PLANT INFO =====
addButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const card = this.closest('.plant-card');
        const plantName = card.querySelector('h3').textContent;
        const plantPrice = card.querySelector('.plant-price').textContent;

        // Opcional: Abrir WhatsApp con mensaje predefinido
        // Descomentar si se quiere funcionalidad directa
        /*
        const message = `Hola! Me interesa comprar: ${plantName} (${plantPrice})`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        */
    });
});

// ===== HEADER HIDE/SHOW ON SCROLL =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// ===== GALLERY LIGHTBOX (Simple) =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        // Crear modal simple
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const content = item.querySelector('.gallery-placeholder').innerHTML;
        modal.innerHTML = `
            <div style="text-align: center; transform: scale(0.9); transition: transform 0.3s ease;">
                <div style="font-size: 8rem; margin-bottom: 20px;">${content.split('<span>')[1].split('</span>')[0]}</div>
                <p style="color: white; font-size: 1.5rem;">${content.split('<p>')[1].split('</p>')[0]}</p>
                <p style="color: rgba(255,255,255,0.6); margin-top: 20px; font-size: 0.9rem;">Haz clic para cerrar</p>
            </div>
        `;

        document.body.appendChild(modal);

        // Animar entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'scale(1)';
        });

        // Cerrar modal
        modal.addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.querySelector('div').style.transform = 'scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        });
    });
});

// ===== FORM VALIDATION (if forms added later) =====
// Placeholder para futuras funcionalidades

console.log('🌿 Vivero La Avenida Violeta - Website loaded successfully!');
