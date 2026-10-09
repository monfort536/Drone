// PREMIUM ANIMATIONS SYSTEM

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL PROGRESS BAR & BACK TO TOP
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);

    

    

    // 7. SAFETY FALLBACK
    // Ensure all elements become visible even if JS observer fails or scrolling is skipped
    setTimeout(() => {
        document.querySelectorAll('.reveal-assigned:not(.reveal-visible), .reveal-up:not(.reveal-visible)').forEach(el => {
            el.classList.add('reveal-visible');
        });
    }, 2500); // 2.5 seconds safety net


    // 2. SCROLL LOGIC (Progress, Sticky Nav, Back to Top)
    const navbar = document.querySelector('.navbar-custom');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';

        

        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, { passive: true });


    // 3. AUTO-ASSIGN ANIMATION CLASSES
    // Add hover-lift to all cards
    document.querySelectorAll('.card, .pricing-card').forEach(card => {
        card.classList.add('hover-lift');
        const img = card.querySelector('.card-img-top');
        if (img) {
            img.parentElement.classList.add('img-zoom-container');
        }
    });

    // Auto-assign float and cinematic zoom to hero images
    document.querySelectorAll('.premium-inner-hero img, .hero-section img').forEach((img, i) => {
        if (!img.closest('.card')) {
            if (i % 2 === 0) img.classList.add('float-anim');
            else img.classList.add('cinematic-bg-zoom');
        }
    });

    // 4. INTERSECTION OBSERVER FOR REVEALS
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                // Trigger counter if it's a number
                if (entry.target.classList.contains('counter-target')) {
                    animateCounter(entry.target);
                    entry.target.classList.remove('counter-target'); // Run once
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    
    // Automatically observe any element with hardcoded reveal-* classes
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade').forEach(el => {
        if (!el.classList.contains('reveal-assigned')) {
            el.classList.add('reveal-assigned');
            revealObserver.observe(el);
        }
    });

    // Staggered reveals for grids (rows)
    document.querySelectorAll('.row').forEach(row => {
        const cards = row.querySelectorAll('.card, .col-md-4, .col-lg-4, .col-md-6');
        let delay = 0;
        cards.forEach((card) => {
            if (!card.classList.contains('reveal-assigned')) {
                card.classList.add('reveal-up', 'reveal-assigned');
                card.style.transitionDelay = `${delay}s`;
                revealObserver.observe(card);
                delay += 0.1;
                if (delay > 0.4) delay = 0; // Cap stagger delay
            }
        });
    });

    // Regular reveals for headings, paragraphs, and solitary images
    document.querySelectorAll('section h2, section h3, section .lead').forEach(el => {
        if (!el.classList.contains('reveal-assigned')) {
            el.classList.add('reveal-up', 'reveal-assigned');
            revealObserver.observe(el);
        }
    });

    // 5. NUMBER COUNTER ANIMATION
    // Auto-detect numbers in specific classes and convert them to counters
    document.querySelectorAll('.counter-h2, .display-5.fw-bold.text-white').forEach(el => {
        const text = el.innerText.trim();
        // Check if it's mostly a number
        const match = text.match(/^([0-9,.]+)([+%A-Za-z]*)$/);
        if (match) {
            el.dataset.target = match[1].replace(/,/g, '');
            el.dataset.suffix = match[2] || '';
            el.innerText = '0' + el.dataset.suffix;
            el.classList.add('counter-target');
            // Already observed by generic observer if inside a row, but let's ensure:
            revealObserver.observe(el);
        }
    });

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix;
        const duration = 2000;
        const start = performance.now();
        
        // Detect if float
        const isFloat = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            let currentVal = target * easeProgress;
            
            if (isFloat) {
                el.innerText = currentVal.toFixed(1) + suffix;
            } else {
                el.innerText = Math.floor(currentVal).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) el.innerText = target.toFixed(1) + suffix;
                else el.innerText = target.toLocaleString() + suffix;
            }
        }
        requestAnimationFrame(update);
    }
});

    // 6. MOBILE HAMBURGER ANIMATION
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                // Wait for Bootstrap to update the aria-expanded attribute
                setTimeout(() => {
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    icon.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    icon.style.transform = 'rotate(180deg) scale(0.8)';
                    icon.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (isExpanded) {
                            icon.classList.remove('bi-list');
                            icon.classList.add('bi-x', 'fs-1');
                        } else {
                            icon.classList.remove('bi-x');
                            icon.classList.add('bi-list', 'fs-1');
                        }
                        icon.style.transform = 'rotate(0deg) scale(1)';
                        icon.style.opacity = '1';
                    }, 150);
                }, 50);
            }
        });
    }
