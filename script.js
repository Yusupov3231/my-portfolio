const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

function initMobileMenu() {
    const hamburger = $('.hamburger');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-menu a');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            const target = href && $(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg,#6366f1,#ec4899);
        width: 0;
        z-index: 10000;
        box-shadow: 0 0 10px rgba(99,102,241,.6);
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? (window.pageYOffset / max) * 100 : 0;
        bar.style.width = progress + '%';
    });
}

function initScrollTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg,#6366f1,#ec4899);
        color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        font-size: 1.2rem;
        transition: all .3s ease;
        box-shadow: 0 4px 15px rgba(99,102,241,.4);
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
}

function initScrollParallax() {
    const heroContent = $('.hero-content');
    const heroImage = $('.hero-image');
    if (!heroContent && !heroImage) return;

    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        if (heroContent) heroContent.style.transform = `translateY(${y * 0.2}px)`;
        if (heroImage) heroImage.style.transform = `translateY(${y * 0.1}px)`;
    });
}

function initTypingEffect() {
    const heroTitle = $('.hero-title');
    if (!heroTitle) return;
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    window.addEventListener('load', () => setTimeout(type, 300));
}

function initContactForm() {
    const form = $('#contactForm');
    const messageBox = $('#formMessage');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = new FormData(form);
        const values = {
            name: data.get('name'),
            email: data.get('email'),
            subject: data.get('subject'),
            message: data.get('message')
        };

        if (!values.name || !values.email || !values.subject || !values.message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values.email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        try {
            btn.disabled = true;
            btn.textContent = 'Sending...';
            await new Promise(r => setTimeout(r, 1500));
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } catch {
            showFormMessage('An error occurred. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send Message';
        }
    });

    function showFormMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = `form-message ${type}`;
        setTimeout(() => {
            messageBox.className = 'form-message';
        }, 5000);
    }
}

function initNewsletterForm() {
    const form = $('#newsletterForm');
    if (!form) return;
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.btn');
    if (!input || !btn) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) return;

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Subscribing...';

        try {
            await new Promise(r => setTimeout(r, 1500));
            btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
            btn.textContent = '✓ Subscribed!';
            input.value = '';
            setTimeout(() => {
                btn.disabled = false;
                btn.style.background = '';
                btn.textContent = originalText;
            }, 2000);
        } catch {
            btn.textContent = 'Error! Try again';
            btn.disabled = false;
        }
    });
}

function initPortfolioFilter() {
    const buttons = $$('.filter-btn');
    const items = $$('.portfolio-item');
    if (!buttons.length || !items.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                const match = !filter || filter === 'all' || category === filter;
                item.classList.toggle('hidden', !match);
                if (match) {
                    item.style.opacity = '0';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity .4s ease';
                        item.style.opacity = '1';
                    });
                }
            });
        });
    });
}

function initScrollReveal() {
    const elements = $$('.skill-card, .project-card, .service-card, .testimonial-card, .portfolio-item, .timeline-item');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        observer.observe(el);
    });
}

function initStatsCounters() {
    const numbers = $$('.stat-number');
    const banner = $('.stats-banner');
    if (!numbers.length || !banner) return;
    let started = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || started) return;
            started = true;
            numbers.forEach(el => {
                const target = parseInt(el.dataset.target || '0', 10);
                let current = 0;
                const step = Math.max(1, Math.round(target / 60));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        el.textContent = current + '+';
                    }
                }, 20);
            });
        });
    }, { threshold: 0.5 });

    observer.observe(banner);
}

function initRippleEffect() {
    const buttons = $$('.btn, .filter-btn');
    if (!buttons.length) return;

    if (!$('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple-animation {
                from { transform: scale(0); opacity: 1; }
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const span = document.createElement('span');
            span.style.cssText = `
                position:absolute;
                width:${size}px;
                height:${size}px;
                left:${x}px;
                top:${y}px;
                border-radius:50%;
                background:rgba(255,255,255,.5);
                pointer-events:none;
                animation:ripple-animation .6s ease-out;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(span);
            setTimeout(() => span.remove(), 600);
        });
    });
}

function initFormFocusEffects() {
    const inputs = $$('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
        });
        input.addEventListener('blur', () => {
            input.style.boxShadow = 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initScrollProgress();
    initScrollTopButton();
    initScrollParallax();
    initTypingEffect();
    initContactForm();
    initNewsletterForm();
    initPortfolioFilter();
    initScrollReveal();
    initStatsCounters();
    initRippleEffect();
    initFormFocusEffects();
    console.log('Portfolio website enhanced and initialized.');
});
