// ==========================================
// Course Page JavaScript
// ==========================================

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Module Toggle (if needed in future)
document.querySelectorAll('.module-header').forEach(header => {
    header.addEventListener('click', function() {
        const module = this.parentElement;
        module.classList.toggle('collapsed');
    });
});

// Share Buttons
const shareButtons = document.querySelectorAll('.share-btn');
shareButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;
        const title = document.title;
        
        let shareUrl = '';
        
        if (this.classList.contains('facebook')) {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (this.classList.contains('twitter')) {
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        } else if (this.classList.contains('whatsapp')) {
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        } else if (this.classList.contains('linkedin')) {
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

// ==========================================
// Payment Modal
// ==========================================

// Inject modal HTML into page
const paymentModalHTML = `
<div id="paymentModal" class="payment-modal-overlay" onclick="closePaymentModal(event)">
    <div class="payment-modal-box">
        <button class="payment-modal-close" onclick="closePaymentModal()"><i class="fas fa-times"></i></button>
        
        <div class="payment-modal-header">
            <div class="payment-modal-icon">
                <i class="fas fa-credit-card"></i>
            </div>
            <h2>إتمام عملية الدفع</h2>
            <p>اتبع الخطوات التالية لإتمام التسجيل</p>
        </div>

        <div class="payment-methods">
            <div class="payment-method-card wepay-card">
                <div class="payment-method-logo">
                    <i class="fas fa-wallet"></i>
                    <span>WePay</span>
                </div>
                <div class="payment-number-display">
                    <span class="payment-number-label">رقم المحفظة</span>
                    <div class="payment-number-value">
                        <span id="wePayNumber">01555512778</span>
                        <button class="copy-btn" onclick="copyNumber('01555512778')">
                            <i class="fas fa-copy"></i>
                            <span>نسخ</span>
                        </button>
                    </div>
                </div>
                <div class="payment-steps">
                    <p class="steps-title"><i class="fas fa-list-ol"></i> خطوات الدفع:</p>
                    <ol>
                        <li>افتح تطبيق <strong>WePay</strong> على هاتفك</li>
                        <li>اختر <strong>"تحويل"</strong> أو <strong>"دفع"</strong></li>
                        <li>أدخل رقم المحفظة: <strong>01555512778</strong></li>
                        <li>أدخل مبلغ الكورس</li>
                        <li>أرسل إيصال الدفع على الواتساب</li>
                    </ol>
                </div>
            </div>
        </div>

        <div class="payment-modal-footer">
            <p class="payment-confirm-note">
                <i class="fas fa-info-circle"></i>
                بعد الدفع، أرسل إيصال الدفع على الواتساب لتفعيل الكورس فوراً
            </p>
            <a href="https://wa.me/201555512778?text=السلام%20عليكم%20أريد%20الاشتراك%20في%20الكورس%20وسأرسل%20إيصال%20الدفع" 
               target="_blank" class="whatsapp-confirm-btn">
                <i class="fab fa-whatsapp"></i>
                أرسل إيصال الدفع على واتساب
            </a>
            <div class="payment-guarantee">
                <i class="fas fa-shield-alt"></i>
                <span>ضمان استرداد المال خلال 30 يوم</span>
            </div>
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', paymentModalHTML);

function openPaymentModal() {
    document.getElementById('paymentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal(event) {
    if (!event || event.target === document.getElementById('paymentModal') || !event.target) {
        document.getElementById('paymentModal').classList.remove('active');
        document.body.style.overflow = '';
    }
}

function copyNumber(number) {
    navigator.clipboard.writeText(number).then(() => {
        const btn = document.querySelector('.copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>تم النسخ!</span>';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = number;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        const btn = document.querySelector('.copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>تم النسخ!</span>';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 2000);
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaymentModal();
});

// Enrollment Button Click
document.querySelectorAll('.btn-enroll, .btn-pay').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        openPaymentModal();
    });
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
        }
    });
});

// Animation on scroll for course elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe modules and info cards
document.querySelectorAll('.module, .info-card, .sidebar-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

console.log('Course page loaded successfully');
