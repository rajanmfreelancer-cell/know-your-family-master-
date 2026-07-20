gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
window.addEventListener('load', () => {
    // Fade up the general wrapper but wait for title
    gsap.fromTo('.gs-fade-up > *:not(.hero-title-dark)', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8, stagger: 0.2 }
    );

    // Letter-by-letter animation for the main title
    const title = document.querySelector('.hero-title-dark');
    if (title) {
        const nodes = Array.from(title.childNodes);
        title.innerHTML = '';
        
        nodes.forEach(node => {
            if (node.nodeType === 3) { // Text node
                const chars = node.nodeValue.split('');
                chars.forEach(char => {
                    if (char === ' ') {
                        title.innerHTML += ' ';
                    } else {
                        title.innerHTML += `<span class="char" style="opacity:0;">${char}</span>`;
                    }
                });
            } else if (node.nodeName === 'BR') {
                title.appendChild(node.cloneNode());
            }
        });

        // Add a blinking cursor at the end
        title.innerHTML += `<span class="blink-cursor">|</span>`;

        // GSAP Animate letters (typing effect)
        gsap.to('.hero-title-dark .char', {
            opacity: 1,
            duration: 0.05,
            stagger: 0.08,
            ease: "none",
            delay: 0.2
        });
    }
});

// Changing Text Logic (Aurora Demo replication)
document.addEventListener('DOMContentLoaded', () => {
    const texts = document.querySelectorAll('.changing-text');
    let currentIndex = 0;

    if (texts.length > 0) {
        setInterval(() => {
            // Remove active from current
            texts[currentIndex].classList.remove('active');
            
            // Move to next
            currentIndex = (currentIndex + 1) % texts.length;
            
            // Add active to new
            texts[currentIndex].classList.add('active');
        }, 3000); // Change text every 3 seconds
    }
});

// Subtle fade up for scroll sections
const fadeElements = gsap.utils.toArray('.gs-fade');
fadeElements.forEach(el => {
    gsap.fromTo(el, 
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            }
        }
    );
});

// FAQ Accordion Logic
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
        });

        const isOpen = item.classList.toggle('active');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
});

// Scroll to Top Button Logic
document.addEventListener('DOMContentLoaded', () => {
    // Inject the button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    // Show/Hide logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Click logic
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Note: Form submission is now handled by native HTML action="thank-you.html"

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinks.classList.toggle('active');
        });
    }

    // Initialize VanillaTilt for the museum-frame to react to mouse movement
    if (typeof VanillaTilt !== "undefined") {
        VanillaTilt.init(document.querySelectorAll(".museum-frame"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });
    }
});
