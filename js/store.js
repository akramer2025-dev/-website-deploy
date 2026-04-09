/**
 * Store Management System - Akram Mostafa
 * نظام إدارة المتجر الاحترافي
 * يتضمن: سلة مشتريات - حفظ دائم - تطبيقات ويب وموبايل
 */

// ============ مفاتيح التخزين ============
const STORAGE_KEYS = {
    CART: 'am_cart',
    WISHLIST: 'am_wishlist',
    APP_PRICES: 'am_app_prices',
    PORTFOLIO: 'am_portfolio_imgs',
    SETTINGS: 'am_store_settings',
    ORDERS: 'am_orders',
    MOBILE_APPS: 'am_mobile_apps',
    WEB_APPS: 'am_web_apps'
};

// ============ قاعدة بيانات التطبيقات ============
const WEB_APPS = [
    {
        key: 'almodif',
        name: 'المضيف سمارت',
        nameEn: 'Al-Modif Smart',
        icon: 'fas fa-hotel',
        color: 'linear-gradient(135deg,#667eea,#764ba2)',
        url: 'https://almodif.net',
        desc: 'نظام إدارة متكامل للفنادق والشاليهات — حجوزات، وحدات، مدفوعات وتقارير فورية.',
        features: ['إدارة الحجوزات', 'تقارير تفصيلية', 'لوحة تحكم متقدمة', 'دعم متعدد اللغات'],
        tags: ['React', 'Firebase', 'PWA', 'نظام'],
        type: 'نظام إدارة',
        category: 'management',
        rating: 5,
        reviews: 24,
        sales: 15
    },
    {
        key: 'remostore',
        name: 'ريمو ستور',
        nameEn: 'Remo Store',
        icon: 'fas fa-shopping-bag',
        color: 'linear-gradient(135deg,#a855f7,#6d28d9)',
        url: 'https://www.remostore.net',
        desc: 'متجر إلكتروني احترافي — كاتالوج، سلة مشتريات، دفع أونلاين وذكاء اصطناعي مدمج.',
        features: ['سلة مشتريات', 'دفع إلكتروني', 'ذكاء اصطناعي', 'إدارة مخزون'],
        tags: ['e-Commerce', 'AI', 'React', 'متجر'],
        type: 'متجر إلكتروني',
        category: 'ecommerce',
        rating: 5,
        reviews: 32,
        sales: 28
    },
    {
        key: 'hotel-crm',
        name: 'نظام CRM الفنادق',
        nameEn: 'Hotel CRM',
        icon: 'fas fa-building',
        color: 'linear-gradient(135deg,#10b981,#059669)',
        url: null,
        desc: 'نظام CRM متكامل لإدارة علاقات العملاء في الفنادق والمنشآت الفندقية.',
        features: ['إدارة العملاء', 'متابعة الحجوزات', 'تقارير تحليلية', 'رسائل آلية'],
        tags: ['CRM', 'Firebase', 'واجهة عربية'],
        type: 'نظام CRM',
        category: 'crm',
        rating: 4.8,
        reviews: 18,
        sales: 12
    },
    {
        key: 'linkcall',
        name: 'Link Call',
        nameEn: 'Link Call',
        icon: 'fas fa-headset',
        color: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        url: null,
        desc: 'منصة كول سنتر ذكية لإدارة المكالمات، المحادثات والفرق بكفاءة عالية.',
        features: ['إدارة المكالمات', 'تسجيل المكالمات', 'تقارير الأداء', 'توزيع ذكي'],
        tags: ['Call Center', 'VoIP', 'Dashboard', 'نظام'],
        type: 'نظام إدارة',
        category: 'management',
        rating: 4.9,
        reviews: 15,
        sales: 8
    },
    {
        key: 'missrim',
        name: 'محل ميس ريم',
        nameEn: 'Miss Rim Shop',
        icon: 'fas fa-store-alt',
        color: 'linear-gradient(135deg,#f43f5e,#e11d48)',
        url: null,
        desc: 'موقع بيع ملابس وإكسسوارات متكامل مع عروض وأكواد خصم وإدارة مخزون.',
        features: ['عروض وخصومات', 'إدارة مخزون', 'تصاميم عصرية', 'دفع متعدد'],
        tags: ['متجر', 'تصميم', 'Laravel'],
        type: 'متجر إلكتروني',
        category: 'ecommerce',
        rating: 4.7,
        reviews: 22,
        sales: 19
    },
    {
        key: 'dentasmart',
        name: 'Denta Smart',
        nameEn: 'Denta Smart',
        icon: 'fas fa-tooth',
        color: 'linear-gradient(135deg,#06b6d4,#0284c7)',
        url: 'https://dentasmart-app.web.app/',
        desc: 'نظام إدارة عيادات أسنان ذكي — سجلات مرضى، مواعيد، فواتير وتقارير طبية.',
        features: ['سجلات المرضى', 'جدولة المواعيد', 'الفواتير', 'التقارير الطبية'],
        tags: ['عيادات', 'Firebase', 'مواعيد'],
        type: 'نظام عيادات',
        category: 'medical',
        rating: 5,
        reviews: 28,
        sales: 22
    }
];

const MOBILE_APPS = [
    {
        key: 'taskmaster',
        name: 'تاسك ماستر',
        nameEn: 'Task Master',
        icon: 'fas fa-tasks',
        color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
        desc: 'تطبيق إدارة المهام والمشاريع - تخطيط، متابعة، وإنجاز بكفاءة عالية.',
        features: ['إدارة المهام', 'التذكيرات', 'تتبع التقدم', 'مزامنة سحابية'],
        tags: ['Flutter', 'Firebase', 'Cross-Platform'],
        type: 'تطبيق إنتاجية',
        category: 'productivity',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.8,
        downloads: '10K+',
        reviews: 156
    },
    {
        key: 'fittrack',
        name: 'فيت تراك',
        nameEn: 'Fit Track',
        icon: 'fas fa-heartbeat',
        color: 'linear-gradient(135deg,#ef4444,#dc2626)',
        desc: 'تطبيق تتبع اللياقة البدنية والصحة - تمارين، سعرات، وتحليلات متقدمة.',
        features: ['تتبع التمارين', 'حساب السعرات', 'خطط تدريبية', 'تحليلات صحية'],
        tags: ['React Native', 'Health Kit', 'AI'],
        type: 'تطبيق صحي',
        category: 'health',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.9,
        downloads: '25K+',
        reviews: 342
    },
    {
        key: 'quickscan',
        name: 'كويك سكان',
        nameEn: 'Quick Scan',
        icon: 'fas fa-qrcode',
        color: 'linear-gradient(135deg,#10b981,#059669)',
        desc: 'ماسح QR وباركود سريع - مسح، إنشاء، وإدارة الأكواد بسهولة.',
        features: ['مسح سريع', 'إنشاء أكواد', 'حفظ السجل', 'مشاركة فورية'],
        tags: ['Kotlin', 'Swift', 'Camera API'],
        type: 'تطبيق أدوات',
        category: 'utility',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.7,
        downloads: '50K+',
        reviews: 528
    },
    {
        key: 'smartnotes',
        name: 'سمارت نوتس',
        nameEn: 'Smart Notes',
        icon: 'fas fa-sticky-note',
        color: 'linear-gradient(135deg,#f59e0b,#d97706)',
        desc: 'تطبيق ملاحظات ذكي - كتابة، تنظيم، ومزامنة ملاحظاتك في كل مكان.',
        features: ['ملاحظات غنية', 'تصنيف وتنظيم', 'مزامنة سحابية', 'بحث متقدم'],
        tags: ['Flutter', 'Cloud Sync', 'Offline'],
        type: 'تطبيق إنتاجية',
        category: 'productivity',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.6,
        downloads: '15K+',
        reviews: 198
    },
    {
        key: 'prayertime',
        name: 'مواقيت الصلاة',
        nameEn: 'Prayer Times',
        icon: 'fas fa-mosque',
        color: 'linear-gradient(135deg,#14b8a6,#0d9488)',
        desc: 'تطبيق مواقيت الصلاة والأذكار - أوقات دقيقة، أذكار، وتذكيرات.',
        features: ['أوقات الصلاة', 'اتجاه القبلة', 'الأذكار', 'التنبيهات'],
        tags: ['Native', 'GPS', 'Notifications'],
        type: 'تطبيق ديني',
        category: 'lifestyle',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.9,
        downloads: '100K+',
        reviews: 1250
    },
    {
        key: 'moneywise',
        name: 'ماني وايز',
        nameEn: 'Money Wise',
        icon: 'fas fa-wallet',
        color: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        desc: 'تطبيق إدارة المصاريف والميزانية - تتبع، تحليل، وتوفير أموالك.',
        features: ['تتبع المصاريف', 'الميزانيات', 'تقارير مالية', 'أهداف التوفير'],
        tags: ['React Native', 'Charts', 'Secure'],
        type: 'تطبيق مالي',
        category: 'finance',
        platforms: ['android', 'ios'],
        playStore: '#',
        appStore: '#',
        rating: 4.8,
        downloads: '30K+',
        reviews: 445
    }
];

// ============ نظام التخزين المحسن ============
const Storage = {
    save(key, data) {
        try {
            const wrapper = {
                data: data,
                timestamp: Date.now(),
                version: '2.0'
            };
            localStorage.setItem(key, JSON.stringify(wrapper));
            // حفظ نسخة احتياطية
            this.backup(key, wrapper);
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },

    load(key, defaultValue = null) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return defaultValue;
            const wrapper = JSON.parse(stored);
            return wrapper.data !== undefined ? wrapper.data : wrapper;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    },

    backup(key, data) {
        try {
            const backupKey = `${key}_backup`;
            sessionStorage.setItem(backupKey, JSON.stringify(data));
        } catch (e) {
            // Ignore backup errors
        }
    },

    restore(key) {
        try {
            const backupKey = `${key}_backup`;
            const backup = sessionStorage.getItem(backupKey);
            if (backup) {
                localStorage.setItem(key, backup);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
        sessionStorage.removeItem(`${key}_backup`);
    },

    exportAll() {
        const data = {};
        Object.values(STORAGE_KEYS).forEach(key => {
            data[key] = this.load(key);
        });
        data.exportDate = new Date().toISOString();
        data.version = '2.0';
        return data;
    },

    importAll(data) {
        Object.entries(data).forEach(([key, value]) => {
            if (Object.values(STORAGE_KEYS).includes(key)) {
                this.save(key, value);
            }
        });
    }
};

// ============ نظام السلة ============
const Cart = {
    items: [],

    init() {
        this.items = Storage.load(STORAGE_KEYS.CART, []);
        this.updateUI();
    },

    add(item) {
        const existing = this.items.find(i => i.key === item.key && i.type === item.type);
        if (existing) {
            showToast('هذا المنتج موجود في السلة بالفعل', 'warning');
            return false;
        }
        
        this.items.push({
            ...item,
            addedAt: Date.now()
        });
        
        this.save();
        this.updateUI();
        showToast('تمت الإضافة إلى السلة', 'success');
        this.animateCartIcon();
        return true;
    },

    remove(key, type) {
        this.items = this.items.filter(i => !(i.key === key && i.type === type));
        this.save();
        this.updateUI();
        showToast('تم الحذف من السلة', 'success');
    },

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    },

    getTotal() {
        const prices = Storage.load(STORAGE_KEYS.APP_PRICES, {});
        return this.items.reduce((total, item) => {
            const price = prices[item.key] || 0;
            return total + Number(price);
        }, 0);
    },

    getCount() {
        return this.items.length;
    },

    save() {
        Storage.save(STORAGE_KEYS.CART, this.items);
    },

    updateUI() {
        const countEls = document.querySelectorAll('.cart-count');
        const count = this.getCount();
        countEls.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });

        // Update cart dropdown if exists
        this.renderCartDropdown();
    },

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon-wrapper');
        if (cartIcon) {
            cartIcon.classList.add('cart-bounce');
            setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
        }
    },

    renderCartDropdown() {
        const dropdown = document.getElementById('cartDropdown');
        if (!dropdown) return;

        const prices = Storage.load(STORAGE_KEYS.APP_PRICES, {});
        
        if (this.items.length === 0) {
            dropdown.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>السلة فارغة</p>
                </div>
            `;
            return;
        }

        dropdown.innerHTML = `
            <div class="cart-items-list">
                ${this.items.map(item => {
                    const price = prices[item.key] || 0;
                    return `
                        <div class="cart-item">
                            <div class="cart-item-icon" style="background:${item.color}">
                                <i class="${item.icon}"></i>
                            </div>
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <span>${price ? Number(price).toLocaleString('ar-EG') + ' ج.م' : 'تواصل للسعر'}</span>
                            </div>
                            <button class="cart-item-remove" onclick="Cart.remove('${item.key}', '${item.type}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>الإجمالي:</span>
                    <strong>${this.getTotal().toLocaleString('ar-EG')} ج.م</strong>
                </div>
                <button class="btn-checkout" onclick="goToCheckout()">
                    <i class="fas fa-credit-card"></i>
                    إتمام الشراء
                </button>
            </div>
        `;
    }
};

// ============ نظام المفضلة ============
const Wishlist = {
    items: [],

    init() {
        this.items = Storage.load(STORAGE_KEYS.WISHLIST, []);
    },

    toggle(key, type) {
        const index = this.items.findIndex(i => i.key === key && i.type === type);
        if (index > -1) {
            this.items.splice(index, 1);
            showToast('تم الحذف من المفضلة', 'success');
        } else {
            this.items.push({ key, type, addedAt: Date.now() });
            showToast('تمت الإضافة للمفضلة', 'success');
        }
        this.save();
        return index === -1;
    },

    isInWishlist(key, type) {
        return this.items.some(i => i.key === key && i.type === type);
    },

    save() {
        Storage.save(STORAGE_KEYS.WISHLIST, this.items);
    }
};

// ============ وظائف العرض ============
let currentCategory = 'all';
let currentTab = 'web';

function renderWebApps(filter = 'all') {
    currentCategory = filter;
    const grid = document.getElementById('webAppsGrid');
    if (!grid) return;

    const prices = Storage.load(STORAGE_KEYS.APP_PRICES, {});
    const portfolio = Storage.load(STORAGE_KEYS.PORTFOLIO, {});

    const apps = WEB_APPS.filter(app => {
        if (filter === 'all') return true;
        return app.category === filter || app.tags.some(t => t.includes(filter));
    });

    // Badge types based on category/ratings
    const getBadge = (app) => {
        if (app.sales >= 20) return { text: 'الأكثر مبيعاً', class: 'badge-trending', icon: 'fas fa-fire' };
        if (app.rating >= 5) return { text: 'مميز', class: 'badge-featured', icon: 'fas fa-award' };
        if (app.category === 'ecommerce') return { text: 'متجر', class: 'badge-special', icon: 'fas fa-shopping-bag' };
        return { text: 'جديد', class: 'badge-new', icon: 'fas fa-bolt' };
    };

    // Generate stars HTML
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star empty"></i>';
            }
        }
        return stars;
    };

    grid.innerHTML = apps.map((app, i) => {
        const imgs = portfolio[app.key] || [];
        const price = prices[app.key];
        const inWishlist = Wishlist.isInWishlist(app.key, 'web');
        const inCart = Cart.items.some(item => item.key === app.key && item.type === 'web');
        const badge = getBadge(app);
        
        // Generate fake original price (40% higher)
        const originalPrice = price ? Math.round(price * 1.4) : null;
        const discount = price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

        return `
            <div class="product-card" data-aos="fade-up" data-aos-delay="${i * 80}">
                <a href="products/${app.key}.html" class="product-image-link">
                    <div class="product-image">
                        ${imgs.length > 0 
                            ? `<img src="${imgs[0]}" alt="${app.name}" onerror="this.parentElement.innerHTML='<div class=product-icon-placeholder style=background:${app.color}><i class=${app.icon}></i></div>'">`
                            : `<div class="product-icon-placeholder" style="background:${app.color};display:flex;align-items:center;justify-content:center;height:100%;"><i class="${app.icon}" style="font-size:4rem;color:#fff;"></i></div>`
                        }
                    </div>
                </a>
                
                <!-- Badge -->
                <span class="product-badge ${badge.class}">
                    <i class="${badge.icon}"></i>
                    ${badge.text}
                </span>
                
                <!-- Discount Badge -->
                ${price && discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                
                <!-- Wishlist Button -->
                <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist('${app.key}', 'web', this)">
                    <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
                
                <div class="product-content">
                    <!-- Product Name -->
                    <h3 class="product-name">${app.name}</h3>
                    
                    <!-- Description -->
                    <p class="product-desc">${app.desc}</p>
                    
                    <!-- Rating -->
                    <div class="product-rating">
                        <div class="stars">${renderStars(app.rating)}</div>
                        <span class="rating-value">${app.rating}</span>
                        <span class="rating-count">(${app.reviews})</span>
                    </div>
                    
                    <!-- Meta -->
                    <div class="product-meta">
                        <span class="product-category">
                            <i class="${app.icon}"></i>
                            ${app.type}
                        </span>
                        <span class="product-sales">
                            <i class="fas fa-chart-line"></i>
                            ${app.sales}+ مبيعات
                        </span>
                    </div>
                    
                    <!-- Price -->
                    <div class="product-price">
                        ${price 
                            ? `<span class="current-price">${Number(price).toLocaleString('ar-EG')}</span>
                               <span class="price-currency">ج.م</span>
                               ${originalPrice ? `<span class="old-price">${Number(originalPrice).toLocaleString('ar-EG')}</span>` : ''}`
                            : `<span class="current-price" style="font-size:1rem;">تواصل للسعر</span>`
                        }
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="product-actions">
                        <button class="btn-cart ${inCart ? 'in-cart' : ''}" onclick="addToCart('${app.key}', 'web')" ${inCart ? 'disabled' : ''}>
                            <i class="fas ${inCart ? 'fa-check' : 'fa-shopping-cart'}"></i>
                            ${inCart ? 'في السلة' : 'للسلة'}
                        </button>
                        <a href="products/${app.key}.html" class="btn-buy">
                            <i class="fas fa-eye"></i>
                            اشتري
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (typeof AOS !== 'undefined') AOS.refresh();
}

function renderMobileApps(filter = 'all') {
    const grid = document.getElementById('mobileAppsGrid');
    if (!grid) return;

    const prices = Storage.load(STORAGE_KEYS.APP_PRICES, {});
    const portfolio = Storage.load(STORAGE_KEYS.PORTFOLIO, {});

    const apps = MOBILE_APPS.filter(app => {
        if (filter === 'all') return true;
        return app.category === filter;
    });

    // Badge types based on downloads/ratings
    const getBadge = (app) => {
        const downloads = parseInt(app.downloads) || 0;
        if (downloads >= 50) return { text: 'الأكثر تحميلاً', class: 'badge-trending', icon: 'fas fa-fire' };
        if (app.rating >= 4.8) return { text: 'مميز', class: 'badge-featured', icon: 'fas fa-award' };
        if (app.category === 'health') return { text: 'صحي', class: 'badge-special', icon: 'fas fa-heart' };
        return { text: 'جديد', class: 'badge-new', icon: 'fas fa-bolt' };
    };

    // Generate stars HTML
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star empty"></i>';
            }
        }
        return stars;
    };

    grid.innerHTML = apps.map((app, i) => {
        const price = prices[app.key];
        const imgs = portfolio[app.key] || [];
        const inWishlist = Wishlist.isInWishlist(app.key, 'mobile');
        const inCart = Cart.items.some(item => item.key === app.key && item.type === 'mobile');
        const badge = getBadge(app);
        
        // Generate fake original price (40% higher)
        const originalPrice = price ? Math.round(price * 1.4) : null;
        const discount = price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

        return `
            <div class="product-card" data-aos="fade-up" data-aos-delay="${i * 80}">
                <a href="products/${app.key}.html" class="product-image-link">
                    <div class="product-image">
                        ${imgs.length > 0 
                            ? `<img src="${imgs[0]}" alt="${app.name}" onerror="this.parentElement.innerHTML='<div class=product-icon-placeholder style=background:${app.color}><i class=${app.icon}></i></div>'">`
                            : `<div class="product-icon-placeholder" style="background:${app.color};display:flex;align-items:center;justify-content:center;height:100%;"><i class="${app.icon}" style="font-size:4rem;color:#fff;"></i></div>`
                        }
                    </div>
                </a>
                
                <!-- Badge -->
                <span class="product-badge ${badge.class}">
                    <i class="${badge.icon}"></i>
                    ${badge.text}
                </span>
                
                <!-- Discount Badge -->
                ${price && discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                
                <!-- Wishlist Button -->
                <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="event.preventDefault();event.stopPropagation();toggleWishlist('${app.key}', 'mobile', this)">
                    <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
                
                <div class="product-content">
                    <!-- Product Name -->
                    <h3 class="product-name">${app.name}</h3>
                    
                    <!-- Description -->
                    <p class="product-desc">${app.desc}</p>
                    
                    <!-- Rating -->
                    <div class="product-rating">
                        <div class="stars">${renderStars(app.rating)}</div>
                        <span class="rating-value">${app.rating}</span>
                        <span class="rating-count">(${app.reviews})</span>
                    </div>
                    
                    <!-- Meta -->
                    <div class="product-meta">
                        <span class="product-category">
                            <i class="${app.icon}"></i>
                            ${app.type}
                        </span>
                        <span class="product-sales">
                            <i class="fas fa-download"></i>
                            ${app.downloads}
                        </span>
                    </div>
                    
                    <!-- Price -->
                    <div class="product-price">
                        ${price 
                            ? `<span class="current-price">${Number(price).toLocaleString('ar-EG')}</span>
                               <span class="price-currency">ج.م</span>
                               ${originalPrice ? `<span class="old-price">${Number(originalPrice).toLocaleString('ar-EG')}</span>` : ''}`
                            : `<span class="current-price" style="font-size:1rem;">تواصل للسعر</span>`
                        }
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="product-actions">
                        <button class="btn-cart ${inCart ? 'in-cart' : ''}" onclick="addToCart('${app.key}', 'mobile')" ${inCart ? 'disabled' : ''}>
                            <i class="fas ${inCart ? 'fa-check' : 'fa-shopping-cart'}"></i>
                            ${inCart ? 'في السلة' : 'للسلة'}
                        </button>
                        <a href="products/${app.key}.html" class="btn-buy">
                            <i class="fas fa-eye"></i>
                            اشتري
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (typeof AOS !== 'undefined') AOS.refresh();
}

// ============ وظائف التفاعل ============
function addToCart(key, type) {
    const apps = type === 'web' ? WEB_APPS : MOBILE_APPS;
    const app = apps.find(a => a.key === key);
    if (!app) return;

    const item = {
        key: app.key,
        name: app.name,
        icon: app.icon,
        color: app.color,
        type: type
    };

    if (Cart.add(item)) {
        // Update button state
        const btn = event.target.closest('.btn-add-cart, .btn-mobile-cart');
        if (btn) {
            btn.classList.add('in-cart');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-check"></i><span>في السلة</span>';
        }
    }
}

function toggleWishlist(key, type, btn) {
    const isNowInWishlist = Wishlist.toggle(key, type);
    if (btn) {
        btn.classList.toggle('active', isNowInWishlist);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isNowInWishlist ? 'fas fa-heart' : 'far fa-heart';
        }
    }
}

function showProductDetails(key, type) {
    const apps = type === 'web' ? WEB_APPS : MOBILE_APPS;
    const app = apps.find(a => a.key === key);
    if (!app) return;

    const prices = Storage.load(STORAGE_KEYS.APP_PRICES, {});
    const price = prices[key];
    const portfolio = Storage.load(STORAGE_KEYS.PORTFOLIO, {});
    const imgs = portfolio[key] || [];

    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
            <div class="modal-body">
                <div class="modal-gallery">
                    ${imgs.length > 0 
                        ? `<img src="${imgs[0]}" alt="${app.name}" class="modal-main-image">`
                        : `<div class="modal-icon-placeholder" style="background:${app.color}"><i class="${app.icon}"></i></div>`
                    }
                    ${imgs.length > 1 ? `
                        <div class="modal-thumbnails">
                            ${imgs.map((img, i) => `<img src="${img}" alt="" class="${i === 0 ? 'active' : ''}" onclick="changeModalImage('${img}', this)">`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="modal-info">
                    <span class="modal-badge">${app.type}</span>
                    <h2 class="modal-title">${app.name}</h2>
                    <span class="modal-subtitle">${app.nameEn}</span>
                    <p class="modal-desc">${app.desc}</p>
                    
                    <div class="modal-rating">
                        <div class="stars">
                            ${Array(5).fill(0).map((_, i) => `<i class="${i < Math.floor(app.rating) ? 'fas' : 'far'} fa-star"></i>`).join('')}
                        </div>
                        <span>${app.rating} (${app.reviews} تقييم)</span>
                    </div>
                    
                    <div class="modal-features">
                        <h4><i class="fas fa-check-circle"></i> المميزات</h4>
                        <ul>
                            ${app.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-tags">
                        ${app.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
                    </div>
                    
                    <div class="modal-price-section">
                        ${price 
                            ? `<div class="modal-price"><span class="amount">${Number(price).toLocaleString('ar-EG')}</span><span class="currency">ج.م</span></div>`
                            : `<div class="modal-contact-price"><i class="fas fa-comments"></i> تواصل معنا للسعر</div>`
                        }
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-modal-cart" onclick="addToCart('${app.key}', '${type}'); closeModal();">
                            <i class="fas fa-cart-plus"></i>
                            أضف للسلة
                        </button>
                        <a href="https://wa.me/201555512778?text=استفسار عن ${app.name}" target="_blank" class="btn-modal-whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            تواصل واتساب
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function changeModalImage(src, thumb) {
    const mainImg = document.querySelector('.modal-main-image');
    if (mainImg) mainImg.src = src;
    
    document.querySelectorAll('.modal-thumbnails img').forEach(img => img.classList.remove('active'));
    if (thumb) thumb.classList.add('active');
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.store-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.store-tab[data-tab="${tab}"]`)?.classList.add('active');
    
    document.getElementById('webAppsSection').style.display = tab === 'web' ? 'block' : 'none';
    document.getElementById('mobileAppsSection').style.display = tab === 'mobile' ? 'block' : 'none';
    
    if (tab === 'web') renderWebApps(currentCategory);
    else renderMobileApps('all');
}

function filterProducts(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (currentTab === 'web') renderWebApps(category);
    else renderMobileApps(category);
}

function toggleCartDropdown() {
    const dropdown = document.getElementById('cartDropdownWrapper');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function goToCheckout() {
    if (Cart.getCount() === 0) {
        showToast('السلة فارغة', 'warning');
        return;
    }
    window.location.href = 'payment.html';
}

// ============ Toast Notifications ============
function showToast(message, type = 'success') {
    const existing = document.querySelector('.store-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `store-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ تهيئة الصفحة ============
document.addEventListener('DOMContentLoaded', function() {
    Cart.init();
    Wishlist.init();
    
    renderWebApps('all');
    renderMobileApps('all');
    
    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const cartWrapper = document.getElementById('cartDropdownWrapper');
        if (cartWrapper && !cartWrapper.contains(e.target)) {
            cartWrapper.classList.remove('open');
        }
    });
    
    // Close modal on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
    
    // Close modal on backdrop click
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }
});

// Export for use in other files
window.Cart = Cart;
window.Wishlist = Wishlist;
window.Storage = Storage;
window.WEB_APPS = WEB_APPS;
window.MOBILE_APPS = MOBILE_APPS;
