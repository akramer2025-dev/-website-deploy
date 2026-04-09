/* =========================================================
   READY WEBSITES - مواقع ووردبريس جاهزة
   نظام إدارة وعرض القوالب الجاهزة للشراء والتخصيص
   ========================================================= */

// قاعدة بيانات القوالب الجاهزة
const templatesData = [
    {
        id: 'xtra-theme',
        name: 'Xtra Premium',
        nameEn: 'Xtra Theme',
        version: '4.9.15',
        category: 'multipurpose',
        price: 3500,
        originalPrice: 5000,
        discount: 30,
        rating: 4.9,
        reviews: 12847,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&q=80',
        description: 'قالب ووردبريس متعدد الأغراض احترافي بتصميم عصري ومرن يناسب جميع أنواع المواقع',
        fullDescription: 'Xtra هو قالب ووردبريس متعدد الاستخدامات يأتي مع أكثر من 250+ قالب جاهز لأنواع مختلفة من المواقع. يشمل القالب جميع الأدوات والإضافات المطلوبة لبناء موقع احترافي بدون الحاجة لخبرة برمجية.',
        features: [
            '250+ قالب جاهز للاستخدام الفوري',
            'باني صفحات WPBakery مدمج ومُفعّل',
            'Revolution Slider للسلايدرات الاحترافية',
            'إضافة Codevz Plus الحصرية مُفعّلة',
            'متجاوب 100% مع جميع الأجهزة',
            'محسّن لمحركات البحث (SEO)',
            'سرعة تحميل فائقة',
            'متوافق مع WooCommerce',
            'تحديثات مدى الحياة',
            'دعم فني احترافي'
        ],
        includes: [
            { name: 'ملفات الثيم الأساسية', icon: 'fas fa-box', files: ['xtra.zip', 'xtra-child.zip'] },
            { name: 'إضافات مُفعّلة', icon: 'fas fa-puzzle-piece', files: ['codevz-plus-Activated.zip', 'js_composer.zip', 'revslider.zip'] },
            { name: 'التوثيق الكامل', icon: 'fas fa-book', files: ['Documentation.html'] },
            { name: 'ترخيص GPL', icon: 'fas fa-certificate', files: ['GPL.txt'] }
        ],
        plugins: [
            { name: 'Codevz Plus', description: 'إضافة حصرية للثيم', status: 'مُفعّل', price: '$39' },
            { name: 'WPBakery Page Builder', description: 'باني الصفحات المرئي', status: 'مُفعّل', price: '$64' },
            { name: 'Slider Revolution', description: 'سلايدرات احترافية', status: 'مُفعّل', price: '$29' }
        ],
        demoUrl: 'https://xtratheme.com',
        docsUrl: 'https://xtratheme.com/docs',
        downloadSize: '32 MB',
        lastUpdate: '2026-03-10',
        compatibility: 'WordPress 6.0+',
        phpVersion: 'PHP 7.4+',
        languages: ['العربية', 'English', 'Français', 'Español'],
        support: '6 أشهر دعم فني مجاني',
        license: 'GPL License',
        tags: ['متعدد الأغراض', 'احترافي', 'سريع', 'متجاوب']
    },
    {
        id: 'ecommerce-pro',
        name: 'متجر احترافي',
        nameEn: 'E-Commerce Pro',
        version: '2.5.0',
        category: 'ecommerce',
        price: 2800,
        originalPrice: 4000,
        discount: 30,
        rating: 4.8,
        reviews: 5420,
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop&q=80',
        description: 'قالب متجر إلكتروني متكامل مع WooCommerce لبيع المنتجات أونلاين بشكل احترافي',
        fullDescription: 'قالب متجر إلكتروني مصمم خصيصًا للـ WooCommerce مع واجهة حديثة وسهلة الاستخدام تدعم جميع أنواع المنتجات والخدمات.',
        features: [
            'تكامل كامل مع WooCommerce',
            'صفحات منتجات جذابة',
            'سلة تسوق متقدمة',
            'نظام دفع متعدد',
            'إدارة شحن ذكية',
            'قسائم وكوبونات خصم',
            'تقييمات ومراجعات',
            'بوابات دفع متعددة',
            'تتبع الطلبات',
            'لوحة تحكم البائع'
        ],
        includes: [
            { name: 'ملفات الثيم', icon: 'fas fa-box', files: ['ecommerce-pro.zip', 'ecommerce-child.zip'] },
            { name: 'إضافات التجارة الإلكترونية', icon: 'fas fa-shopping-cart', files: ['woocommerce.zip', 'payment-gateways.zip'] },
            { name: 'قوالب جاهزة', icon: 'fas fa-templates', files: ['shop-demos.zip'] }
        ],
        plugins: [
            { name: 'WooCommerce', description: 'منصة التجارة الإلكترونية', status: 'متضمن', price: 'مجاني' },
            { name: 'Payment Gateways', description: 'بوابات دفع متعددة', status: 'متضمن', price: '$49' }
        ],
        demoUrl: '#',
        docsUrl: '#',
        downloadSize: '28 MB',
        lastUpdate: '2026-03-08',
        compatibility: 'WordPress 6.0+',
        phpVersion: 'PHP 7.4+',
        languages: ['العربية', 'English'],
        support: '6 أشهر دعم فني',
        license: 'GPL License',
        tags: ['متجر', 'تجارة إلكترونية', 'woocommerce']
    },
    {
        id: 'portfolio-creative',
        name: 'معرض أعمال إبداعي',
        nameEn: 'Portfolio Creative',
        version: '3.2.1',
        category: 'portfolio',
        price: 2200,
        originalPrice: 3200,
        discount: 31,
        rating: 4.9,
        reviews: 3245,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&q=80',
        description: 'قالب عرض أعمال احترافي للمصممين والمبدعين والمصورين والفنانين',
        fullDescription: 'قالب مخصص لعرض الأعمال الإبداعية بطريقة جذابة واحترافية مع معارض صور متقدمة وتصميم عصري.',
        features: [
            'معارض صور متعددة الأنماط',
            'فيديوهات مدمجة',
            'تصميم متجاوب كامل',
            'أنيميشن سلس',
            'صفحات مشاريع مفصلة',
            'فلاتر بحث ذكية',
            'استعراض بملء الشاشة',
            'تصميمات جاهزة متنوعة',
            'نماذج اتصال مخصصة',
            'تكامل مع سوشيال ميديا'
        ],
        includes: [
            { name: 'ملفات الثيم', icon: 'fas fa-box', files: ['portfolio.zip'] },
            { name: 'معارض وسلايدرات', icon: 'fas fa-images', files: ['galleries.zip'] }
        ],
        plugins: [
            { name: 'Gallery Pro', description: 'معرض صور احترافي', status: 'متضمن', price: '$29' }
        ],
        demoUrl: '#',
        docsUrl: '#',
        downloadSize: '18 MB',
        lastUpdate: '2026-03-05',
        compatibility: 'WordPress 6.0+',
        phpVersion: 'PHP 7.4+',
        languages: ['العربية', 'English'],
        support: '6 أشهر دعم فني',
        license: 'GPL License',
        tags: ['معرض أعمال', 'portfolio', 'إبداعي']
    },
    {
        id: 'business-corporate',
        name: 'شركات وأعمال',
        nameEn: 'Business Corporate',
        version: '4.1.0',
        category: 'business',
        price: 2500,
        originalPrice: 3500,
        discount: 29,
        rating: 4.7,
        reviews: 6789,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80',
        description: 'قالب مواقع الشركات والأعمال الاحترافية مع صفحات خدمات ومشاريع وفريق عمل',
        fullDescription: 'قالب مصمم خصيصًا للشركات ومواقع الأعمال مع جميع الصفحات المطلوبة لعرض الخدمات والمشاريع.',
        features: [
            'صفحات خدمات احترافية',
            'عرض المشاريع',
            'صفحة فريق العمل',
            'نماذج طلب عروض',
            'مدونة متكاملة',
            'صفحة من نحن',
            'شهادات العملاء',
            'الأسئلة الشائعة',
            'صفحة اتصل بنا',
            'تكامل مع Google Maps'
        ],
        includes: [
            { name: 'ملفات الثيم', icon: 'fas fa-box', files: ['business.zip'] },
            { name: 'قوالب الصفحات', icon: 'fas fa-file', files: ['pages-templates.zip'] }
        ],
        plugins: [
            { name: 'Contact Form 7', description: 'نماذج اتصال', status: 'متضمن', price: 'مجاني' }
        ],
        demoUrl: '#',
        docsUrl: '#',
        downloadSize: '22 MB',
        lastUpdate: '2026-03-01',
        compatibility: 'WordPress 6.0+',
        phpVersion: 'PHP 7.4+',
        languages: ['العربية', 'English'],
        support: '6 أشهر دعم فني',
        license: 'GPL License',
        tags: ['أعمال', 'شركات', 'احترافي']
    },
    {
        id: 'blog-magazine',
        name: 'مدونة ومجلة',
        nameEn: 'Blog & Magazine',
        version: '2.8.5',
        category: 'blog',
        price: 1800,
        originalPrice: 2500,
        discount: 28,
        rating: 4.6,
        reviews: 4521,
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&q=80',
        description: 'قالب مدونة ومجلة إلكترونية احترافي لنشر المقالات والأخبار',
        fullDescription: 'قالب مخصص للمدونات والمجلات الإلكترونية مع تصميم جذاب وسهولة في القراءة والتصفح.',
        features: [
            'تخطيطات مقالات متنوعة',
            'أقسام وتصنيفات',
            'نظام تعليقات متقدم',
            'صفحة كاتب مخصصة',
            'مقالات ذات صلة',
            'بحث متقدم',
            'تكامل مع سوشيال ميديا',
            'نظام إعلانات',
            'رسائل إخبارية',
            'تحسين SEO'
        ],
        includes: [
            { name: 'ملفات الثيم', icon: 'fas fa-box', files: ['blog.zip'] },
            { name: 'قوالب المقالات', icon: 'fas fa-newspaper', files: ['post-layouts.zip'] }
        ],
        plugins: [
            { name: 'Yoast SEO', description: 'تحسين محركات البحث', status: 'متضمن', price: 'مجاني' }
        ],
        demoUrl: '#',
        docsUrl: '#',
        downloadSize: '15 MB',
        lastUpdate: '2026-02-28',
        compatibility: 'WordPress 6.0+',
        phpVersion: 'PHP 7.4+',
        languages: ['العربية', 'English'],
        support: '6 أشهر دعم فني',
        license: 'GPL License',
        tags: ['مدونة', 'مجلة', 'أخبار']
    }
];

// تحميل القوالب عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadTemplates('all');
});

// دالة تحميل القوالب
function loadTemplates(category = 'all') {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;

    const filteredTemplates = category === 'all' 
        ? templatesData 
        : templatesData.filter(t => t.category === category);

    if (filteredTemplates.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
                <i class="fas fa-box-open" style="font-size:4rem;color:var(--store-muted);margin-bottom:20px;"></i>
                <h3 style="color:#fff;font-size:1.5rem;margin-bottom:12px;">لا توجد قوالب في هذا التصنيف</h3>
                <p style="color:var(--store-muted);">جرب تصنيف آخر أو تواصل معنا لطلب قالب مخصص</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredTemplates.map(template => `
        <div class="product-card" data-category="${template.category}" data-aos="fade-up">
            <div class="product-image">
                <img src="${template.image}" alt="${template.name}" loading="lazy">
                ${template.discount > 0 ? `<div class="product-badge">خصم ${template.discount}%</div>` : ''}
                <div class="product-overlay">
                    <button onclick="viewTemplate('${template.id}')" class="btn-view">
                        <i class="fas fa-eye"></i> عرض التفاصيل
                    </button>
                    <a href="${template.demoUrl}" target="_blank" class="btn-demo">
                        <i class="fas fa-external-link-alt"></i> معاينة مباشرة
                    </a>
                </div>
            </div>
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${template.name}</h3>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${template.rating}</span>
                        <span class="reviews-count">(${template.reviews.toLocaleString()})</span>
                    </div>
                </div>
                <p class="product-description">${template.description}</p>
                <div class="product-meta">
                    <span class="meta-item"><i class="fas fa-code-branch"></i> ${template.version}</span>
                    <span class="meta-item"><i class="fas fa-download"></i> ${template.downloadSize}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        ${template.discount > 0 ? `<span class="old-price">${template.originalPrice} جنيه</span>` : ''}
                        <span class="current-price">${template.price} جنيه</span>
                    </div>
                    <button onclick="orderTemplate('${template.id}')" class="btn-order">
                        <i class="fab fa-whatsapp"></i> اطلب الآن
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// دالة تصفية القوالب
function filterTemplates(category, button) {
    // تحديث أزرار الفلترة
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // تحميل القوالب حسب التصنيف
    loadTemplates(category);
}

// دالة عرض تفاصيل القالب
function viewTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) return;

    const modal = document.getElementById('templateModal');
    modal.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;background:var(--store-card);border-radius:20px;overflow:hidden;position:relative;">
            <button onclick="closeModal()" style="position:absolute;top:20px;right:20px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:1.2rem;cursor:pointer;z-index:10;transition:.2s;">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
                <!-- الصورة -->
                <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);">
                    <img src="${template.image}" alt="${template.name}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                
                <!-- المحتوى -->
                <div style="padding:40px;overflow-y:auto;max-height:90vh;">
                    <div style="margin-bottom:24px;">
                        ${template.discount > 0 ? `<span style="display:inline-block;background:linear-gradient(135deg,#00E5FF,#00B8D4);color:#fff;padding:6px 16px;border-radius:20px;font-size:.85rem;font-weight:800;margin-bottom:12px;">خصم ${template.discount}%</span>` : ''}
                        <h2 style="font-size:2rem;font-weight:900;color:#fff;margin-bottom:8px;">${template.name}</h2>
                        <p style="color:var(--store-muted);font-size:.9rem;">${template.nameEn} - الإصدار ${template.version}</p>
                    </div>
                    
                    <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--store-border);">
                        <div class="product-rating" style="font-size:1.1rem;">
                            <i class="fas fa-star" style="color:#fbbf24;"></i>
                            <span style="color:#fff;font-weight:700;">${template.rating}</span>
                            <span style="color:var(--store-muted);font-size:.9rem;">(${template.reviews.toLocaleString()} تقييم)</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom:28px;">
                        <h3 style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:16px;">الوصف</h3>
                        <p style="color:var(--store-muted);line-height:1.9;font-size:.95rem;">${template.fullDescription}</p>
                    </div>
                    
                    <div style="margin-bottom:28px;">
                        <h3 style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:16px;">المميزات الرئيسية</h3>
                        <ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px;">
                            ${template.features.map(feature => `
                                <li style="display:flex;align-items:center;gap:12px;color:var(--store-muted);font-size:.9rem;">
                                    <i class="fas fa-check-circle" style="color:#22c55e;"></i>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div style="margin-bottom:28px;">
                        <h3 style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:16px;">الإضافات المُفعّلة</h3>
                        <div style="display:grid;gap:12px;">
                            ${template.plugins.map(plugin => `
                                <div style="background:rgba(255,255,255,0.03);padding:16px;border-radius:12px;border:1px solid var(--store-border);">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                        <h4 style="color:#fff;font-size:.95rem;font-weight:700;">${plugin.name}</h4>
                                        <span style="background:linear-gradient(135deg,#22c55e,#10b981);color:#fff;padding:4px 12px;border-radius:15px;font-size:.75rem;font-weight:800;">${plugin.status}</span>
                                    </div>
                                    <p style="color:var(--store-muted);font-size:.85rem;margin-bottom:4px;">${plugin.description}</p>
                                    <span style="color:var(--store-orange);font-size:.8rem;font-weight:700;">القيمة: ${plugin.price}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="margin-bottom:28px;">
                        <h3 style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:16px;">ما تحصل عليه</h3>
                        <div style="display:grid;gap:12px;">
                            ${template.includes.map(item => `
                                <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:10px;">
                                    <i class="${item.icon}" style="color:var(--store-pink);font-size:1.2rem;margin-top:2px;"></i>
                                    <div>
                                        <h4 style="color:#fff;font-size:.9rem;font-weight:700;margin-bottom:4px;">${item.name}</h4>
                                        <p style="color:var(--store-muted);font-size:.8rem;">${item.files.join(', ')}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px;padding:20px;background:rgba(0,229,255,0.05);border-radius:12px;border:1px solid rgba(0,229,255,0.2);">
                        <div>
                            <span style="display:block;color:var(--store-muted);font-size:.8rem;margin-bottom:4px;">آخر تحديث</span>
                            <span style="color:#fff;font-weight:700;font-size:.9rem;">${template.lastUpdate}</span>
                        </div>
                        <div>
                            <span style="display:block;color:var(--store-muted);font-size:.8rem;margin-bottom:4px;">التوافق</span>
                            <span style="color:#fff;font-weight:700;font-size:.9rem;">${template.compatibility}</span>
                        </div>
                        <div>
                            <span style="display:block;color:var(--store-muted);font-size:.8rem;margin-bottom:4px;">حجم التحميل</span>
                            <span style="color:#fff;font-weight:700;font-size:.9rem;">${template.downloadSize}</span>
                        </div>
                        <div>
                            <span style="display:block;color:var(--store-muted);font-size:.8rem;margin-bottom:4px;">الدعم الفني</span>
                            <span style="color:#fff;font-weight:700;font-size:.9rem;">${template.support}</span>
                        </div>
                    </div>
                    
                    <div style="background:linear-gradient(135deg,#00E5FF,#00B8D4);padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
                        <div style="margin-bottom:12px;">
                            ${template.discount > 0 ? `<span style="display:block;color:rgba(255,255,255,0.8);font-size:.9rem;text-decoration:line-through;margin-bottom:4px;">${template.originalPrice} جنيه</span>` : ''}
                            <span style="display:block;color:#fff;font-size:2.2rem;font-weight:900;">${template.price} جنيه</span>
                        </div>
                        <button onclick="orderTemplate('${template.id}')" style="background:#fff;color:#00E5FF;padding:14px 32px;border-radius:12px;border:none;font-weight:800;font-size:1rem;cursor:pointer;width:100%;transition:.2s;font-family:'Cairo',sans-serif;">
                            <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
                        </button>
                    </div>
                    
                    <div style="text-align:center;">
                        <a href="${template.demoUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;color:var(--store-orange);text-decoration:none;font-weight:700;font-size:.9rem;">
                            <i class="fas fa-external-link-alt"></i>
                            معاينة القالب مباشرة
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// دالة إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.getElementById('templateModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// دالة طلب القالب
function orderTemplate(templateId) {
    const template = templatesData.find(t => t.id === templateId);
    if (!template) return;

    const message = `مرحبًا، أنا مهتم بشراء القالب:\n\n` +
                   `📦 ${template.name} (${template.nameEn})\n` +
                   `💰 السعر: ${template.price} جنيه\n` +
                   `📌 الإصدار: ${template.version}\n\n` +
                   `أرجو إرسال تفاصيل الشراء والدفع.`;

    const whatsappUrl = `https://wa.me/201555512778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// إغلاق النافذة المنبثقة عند الضغط خارجها
document.addEventListener('click', function(e) {
    const modal = document.getElementById('templateModal');
    if (e.target === modal) {
        closeModal();
    }
});

// إغلاق النافذة المنبثقة بزر ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});