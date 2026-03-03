// ==========================================
// Initialize AOS (Animate On Scroll)
// ==========================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 700,
        easing: 'ease-out',
        once: true,
        mirror: false,
        offset: 80,
        disable: window.innerWidth < 768 ? 'phone' : false
    });
}

// ==========================================
// Particles.js Configuration
// ==========================================
const isMobile = window.innerWidth <= 768;
const isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;

// Only initialize particles if the container exists and library is loaded
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: isLowEnd ? 20 : 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#e94e77', '#f7931e', '#c471ed']
            },
        shape: {
            type: isLowEnd ? 'circle' : ['circle', 'edge'],
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: !isLowEnd,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: !isLowEnd,
            distance: 150,
            color: '#e94e77',
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: isLowEnd ? 1 : 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: !isLowEnd,
                mode: 'grab'
            },
            onclick: {
                enable: !isLowEnd,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: { opacity: 0.5 }
            },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: false
});
} // End of particlesJS check

// ==========================================
// Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                if (navbar) navbar.classList.add('scrolled');
                if (scrollTop) scrollTop.classList.add('show');
            } else {
                if (navbar) navbar.classList.remove('scrolled');
                if (scrollTop) scrollTop.classList.remove('show');
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// ==========================================
// Mobile Menu Toggle
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==========================================
// Active Navigation Link on Scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');

let navTicking = false;
function activateNavLink() {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
        navTicking = false;
    });
}

window.addEventListener('scroll', activateNavLink, { passive: true });

// ==========================================
// Smooth Scroll to Top
// ==========================================
if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// Smooth Scroll for All Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Contact Form Validation & Submission
// ==========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Show success message (you can customize this)
    showNotification('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    
    // Reset form
    contactForm.reset();
    
    // Here you would typically send the data to a server
});

// ==========================================
// Notification System
// ==========================================
function showNotification(type, message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 16px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// Form Input Animations
// ==========================================
document.querySelectorAll('.form-control').forEach(control => {
    control.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    control.addEventListener('blur', function() {
        if (!this.value) this.parentElement.classList.remove('focused');
    });
});

// ==========================================
// Counter Animation for Stats
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger counter animation when stats section is in view
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach((stat, index) => {
                const target = parseInt(stat.textContent);
                setTimeout(() => {
                    animateCounter(stat, target);
                }, index * 200);
            });
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about-stats');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// ==========================================
// Typing Effect for Hero Subtitle (Optional)
// ==========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// You can uncomment this to enable typing effect
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     typeWriter(heroSubtitle, originalText, 80);
// }

// ==========================================
// Parallax Effect for Hero Section
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ==========================================
// Cursor Follow Effect (Optional - Advanced)
// ==========================================
const createCursorFollower = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e94e77, #f7931e);
        pointer-events: none;
        z-index: 9999;
        opacity: 0.5;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
    
    // Hide cursor on mobile
    if (window.innerWidth < 768) {
        cursor.style.display = 'none';
    }
};

// Uncomment to enable cursor follower
// if (window.innerWidth >= 768) {
//     createCursorFollower();
// }

// ==========================================
// Lazy Loading Images (if you add images later)
// ==========================================
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Call when images are added
// lazyLoadImages();

// ==========================================
// Course Card Tilt Effect
// ==========================================
const courseCards = document.querySelectorAll('.course-card');

courseCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ==========================================
// Service Card Interaction
// ==========================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-icon');
        icon.style.animation = 'float 2s ease-in-out infinite';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.service-icon');
        icon.style.animation = 'none';
    });
});

// ==========================================
// Dynamic Year in Footer
// ==========================================
const updateFooterYear = () => {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} Akram Mostafa. جميع الحقوق محفوظة.`;
    }
};

updateFooterYear();

// ==========================================
// Preloader (Optional)
// ==========================================
window.addEventListener('load', () => {
    // Hide preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    
    // Refresh AOS
    AOS.refresh();
});

// ==========================================
// Console Welcome Message
// ==========================================
console.log('%c🚀 Akram Mostafa - Digital Marketing Expert', 'color: #e94e77; font-size: 24px; font-weight: bold;');
console.log('%c📱 Follow me on social media!', 'color: #f7931e; font-size: 16px;');
console.log('%c🌐 www.akrammostafa.net', 'color: #c471ed; font-size: 14px;');

// ==========================================
// Enhanced Scroll Reveal
// ==========================================
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('[data-aos]');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// ==========================================
// Social Links Tracking (Optional - for Analytics)
// ==========================================
const socialLinks = document.querySelectorAll('.social-link, .social-link-contact, .footer-social a');

socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // You can add analytics tracking here
        const platform = link.classList.contains('facebook') ? 'Facebook' :
                        link.classList.contains('instagram') ? 'Instagram' :
                        link.classList.contains('tiktok') ? 'TikTok' :
                        link.classList.contains('snapchat') ? 'Snapchat' :
                        link.classList.contains('twitter') ? 'X (Twitter)' : 'Social';
        
        console.log(`Clicked on ${platform}`);
        
        // Example: Send to Google Analytics
        // gtag('event', 'social_click', { 'platform': platform });
    });
});

// ==========================================
// Hero Image Parallax & Tilt Effect
// ==========================================
const heroImage = document.querySelector('.hero-profile-image');
const heroImageFrame = document.querySelector('.hero-image-frame');

if (heroImageFrame) {
    heroImageFrame.addEventListener('mousemove', (e) => {
        const rect = heroImageFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        heroImageFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    heroImageFrame.addEventListener('mouseleave', () => {
        heroImageFrame.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// ==========================================
// Enhanced Hero Stats Counter Animation
// ==========================================
function animateHeroCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger hero stats animation when visible
const heroStats = document.querySelector('.hero-stats');
let heroStatsAnimated = false;

if (heroStats) {
    const heroStatsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !heroStatsAnimated) {
                heroStatsAnimated = true;
                const statNumbers = document.querySelectorAll('.stat-number-hero');
                statNumbers.forEach((stat, index) => {
                    const target = parseInt(stat.textContent);
                    setTimeout(() => {
                        animateHeroCounter(stat, target);
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });
    
    heroStatsObserver.observe(heroStats);
}

// ==========================================
// Smooth Scroll for Mouse Indicator
// ==========================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Hide scroll indicator when scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ==========================================
// Animated Text Gradient on Hero Title
// ==========================================
const gradientTexts = document.querySelectorAll('.gradient-text, .gradient-text-secondary');
let hue = 0;

function animateGradient() {
    hue = (hue + 0.5) % 360;
    gradientTexts.forEach(text => {
        text.style.filter = `hue-rotate(${hue}deg)`;
    });
    requestAnimationFrame(animateGradient);
}

// Uncomment to enable gradient animation
// animateGradient();

// ==========================================
// Custom Cursor Effect for Hero Section
// ==========================================
const hero = document.querySelector('.hero');
let customCursor = null;

if (hero && window.innerWidth > 991) {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    customCursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #e94e77, #f7931e);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s, transform 0.2s;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(customCursor);
    
    hero.addEventListener('mouseenter', () => {
        customCursor.style.opacity = '0.6';
    });
    
    hero.addEventListener('mouseleave', () => {
        customCursor.style.opacity = '0';
    });
    
    hero.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX - 10 + 'px';
        customCursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Enlarge on interactive elements
    const interactiveElements = hero.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'scale(1)';
        });
    });
}

// ==========================================
// Floating Badges Animation Enhancement
// ==========================================
const floatingBadges = document.querySelectorAll('.floating-badge');
floatingBadges.forEach((badge, index) => {
    // Add random floating animation
    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    badge.style.animationDelay = `${randomDelay}s`;
    badge.style.animationDuration = `${randomDuration}s`;
    
    // Add hover effect
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-10px) scale(1.1)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'translateY(0) scale(1)';
    });
});

// ==========================================
// Button Ripple Effect Enhancement
// ==========================================
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple-animation 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .custom-cursor {
        transition: all 0.1s ease;
    }
`;
document.head.appendChild(rippleStyle);

// ==========================================
// Responsive Table Handler (if needed)
// ==========================================
const makeTablesResponsive = () => {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
};

// ==========================================
// Page Load Animation
// ==========================================
window.addEventListener('load', () => {
    // Add loaded class to body
    document.body.classList.add('page-loaded');
    
    // Trigger confetti effect (optional)
    // You can add a confetti library for special occasions
});

// ==========================================
// Performance: Reduce animations on low-end devices
// ==========================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    // Reduce particle count
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 40
            }
        }
    });
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    activateNavLink();
    revealOnScroll();
    makeTablesResponsive();
    
    console.log('%c🎉 الموقع جاهز!', 'color: #e94e77; font-size: 20px; font-weight: bold;');
    console.log('%c✨ تصميم احترافي مع صورتك في الصفحة الرئيسية!', 'color: #f7931e; font-size: 14px;');
    console.log('%c🚀 Akram Mostafa - Digital Marketing Expert', 'color: #c471ed; font-size: 12px;');
});
