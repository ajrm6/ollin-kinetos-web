/* ==========================================================================
   OLLIN KINETOS - INTERACTIVE & LOGIC SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Navigation & Accessibility
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.contains('nav-active');
            
            navLinks.classList.toggle('nav-active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. Navbar Scroll Dynamic Shadow
    // ----------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------------------------
    // 3. Category Filter Tabs for Services
    // ----------------------------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (tabBtns.length > 0 && serviceCards.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }


    // ----------------------------------------------------------------------
    // 5. Contact Form Handler with XSS Sanitization & Honeypot Anti-Spam
    // ----------------------------------------------------------------------
    const leadForm = document.getElementById('leadForm');
    let lastSubmitTime = 0;

    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .trim();
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Honeypot Anti-Spam check
            const honeypot = leadForm.querySelector('input[name="website_url_check"]');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected and blocked via Honeypot field.');
                return; // Silent fail for bots
            }

            // Rate-limiting check (1 submission per 10 seconds)
            const now = Date.now();
            if (now - lastSubmitTime < 10000) {
                alert('Por favor espera unos segundos antes de enviar otra solicitud.');
                return;
            }

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const serviceSelect = document.getElementById('service');
            const messageTextarea = document.getElementById('message');

            const sanitizedData = {
                name: sanitizeString(nameInput ? nameInput.value : ''),
                email: sanitizeString(emailInput ? emailInput.value : ''),
                phone: sanitizeString(phoneInput ? phoneInput.value : ''),
                service: sanitizeString(serviceSelect ? serviceSelect.value : ''),
                message: sanitizeString(messageTextarea ? messageTextarea.value : '')
            };

            if (!sanitizedData.name || !sanitizedData.email) {
                alert('Por favor completa todos los campos requeridos.');
                return;
            }

            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Enviando auditoría...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            lastSubmitTime = now;

            // Prepare WhatsApp pre-filled message for instant closing
            const waMsg = `*Nuevo Lead en Ollin Kinetos*%0A` +
                `👤 *Nombre/Empresa*: ${sanitizedData.name}%0A` +
                `📧 *Email*: ${sanitizedData.email}%0A` +
                `📞 *Teléfono*: ${sanitizedData.phone || 'No especificado'}%0A` +
                `💼 *Servicio*: ${sanitizedData.service}%0A` +
                `📝 *Mensaje*: ${sanitizedData.message || 'Sin detalles extra'}`;

            setTimeout(() => {
                submitBtn.textContent = '¡Solicitud Recibida con Éxito!';
                submitBtn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
                submitBtn.style.color = '#FFFFFF';
                submitBtn.style.opacity = '1';

                // Open WhatsApp chat directly with lead details
                window.open(`https://wa.me/524612668518?text=${waMsg}`, '_blank');

                leadForm.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 4000);
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 6. Smooth Scroll with Header Offset
    // ----------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                }

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
