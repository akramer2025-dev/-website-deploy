# 🎯 دليل التخصيص السريع

## 📝 خطوات التخصيص الأساسية

### 1️⃣ تغيير المعلومات الشخصية

#### في ملف `index.html`:

**تغيير الاسم في العنوان الرئيسي (سطر 69-70):**
```html
<span class="gradient-text">AKRAM</span>
<span class="gradient-text-secondary">MOSTAFA</span>
```
غيره إلى اسمك بالإنجليزية.

**تغيير الوصف (سطر 72):**
```html
<p class="hero-subtitle">خبير التسويق الإلكتروني والسوشيال ميديا</p>
```

**تغيير البريد الإلكتروني (سطر 359):**
```html
<p>info@akrammostafa.net</p>
```

**تغيير رقم الهاتف (سطر 368):**
```html
<p>+20 XXX XXX XXXX</p>
```

### 2️⃣ إضافة روابط السوشيال ميديا

ابحث عن `href="#"` في الأسطر (84-104) واستبدلها بروابطك:

```html
<!-- فيسبوك -->
<a href="https://facebook.com/yourpage" class="social-link facebook">

<!-- إنستغرام -->
<a href="https://instagram.com/yourusername" class="social-link instagram">

<!-- تيك توك -->
<a href="https://tiktok.com/@yourusername" class="social-link tiktok">

<!-- سناب شات -->
<a href="https://snapchat.com/add/yourusername" class="social-link snapchat">

<!-- تويتر/X -->
<a href="https://x.com/yourusername" class="social-link twitter">
```

### 3️⃣ إضافة صورتك الشخصية

**الخطوة 1:** احفظ صورتك في مجلد `images/` باسم `profile.jpg`

**الخطوة 2:** في `index.html` (حوالي سطر 146)، ابحث عن:
```html
<div class="image-placeholder">
    <i class="fas fa-user"></i>
</div>
```

**الخطوة 3:** استبدلها بـ:
```html
<img src="images/profile.jpg" alt="أكرم مصطفى" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
```

### 4️⃣ تغيير الأرقام الإحصائية

في قسم "من أنا" (حوالي سطر 172-184):
```html
<div class="stat-number">500+</div>
<div class="stat-label">طالب استفاد</div>

<div class="stat-number">50+</div>
<div class="stat-label">كورس ومحاضرة</div>

<div class="stat-number">10+</div>
<div class="stat-label">سنوات خبرة</div>
```

### 5️⃣ تخصيص الألوان

في `css/style.css` (الأسطر 5-20)، غير الألوان حسب رغبتك:

```css
:root {
    /* الألوان الرئيسية */
    --primary-blue: #0a1f44;      /* لون الخلفية */
    --gradient-pink: #e94e77;      /* اللون الوردي */
    --gradient-orange: #f7931e;    /* اللون البرتقالي */
    --gradient-red: #dc3545;       /* اللون الأحمر */
}
```

### 6️⃣ إضافة أو تعديل كورس

**لإضافة كورس جديد:**

1. في `index.html`، انسخ أي بطاقة كورس كاملة (من `<div class="course-card">` إلى `</div>`)
2. الصقها قبل نهاية `<div class="courses-grid">`
3. عدّل المحتوى:

```html
<div class="course-card" data-aos="fade-up" data-aos-delay="700">
    <div class="course-icon facebook">
        <i class="fab fa-youtube"></i>  <!-- غيّر الأيقونة -->
    </div>
    <h3>اسم الكورس الجديد</h3>
    <p>وصف مختصر عن الكورس وما سيتعلمه الطالب</p>
    <ul class="course-features">
        <li><i class="fas fa-check"></i> ميزة رقم 1</li>
        <li><i class="fas fa-check"></i> ميزة رقم 2</li>
        <li><i class="fas fa-check"></i> ميزة رقم 3</li>
    </ul>
    <a href="#" class="btn btn-outline">تفاصيل الكورس</a>
</div>
```

### 7️⃣ تعديل نص قسم "من أنا"

في `index.html` (حوالي سطر 158-165)، عدّل النص حسب سيرتك الذاتية:

```html
<h3>أكرم مصطفى</h3>
<p class="lead">خبير في التسويق الإلكتروني والسوشيال ميديا</p>
<p>
    اكتب هنا نبذة عنك وخبراتك...
</p>
<p>
    أضف المزيد من المعلومات عن تخصصاتك...
</p>
```

## 🎨 تخصيص الخطوط

### لتغيير الخط العربي:

في `index.html` (سطر 11-12)، استبدل `Cairo` بخط آخر من Google Fonts:

```html
<!-- مثال: استخدام خط Tajawal بدلاً من Cairo -->
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;600;700;900&display=swap" rel="stylesheet">
```

ثم في `css/style.css` (سطر 23):
```css
--font-ar: 'Tajawal', sans-serif;
```

### خطوط عربية مقترحة:
- **Cairo** - حديث ونظيف (الحالي)
- **Tajawal** - احترافي وواضح
- **Almarai** - عصري وأنيق
- **IBM Plex Sans Arabic** - للشركات
- **Amiri** - كلاسيكي وأنيق

## 🔧 تعديلات متقدمة

### تغيير سرعة الحركات:

في `js/script.js` (سطر 4-9):
```javascript
AOS.init({
    duration: 1000,  // غيّرها إلى 800 للحركة الأسرع أو 1500 للأبطأ
    easing: 'ease-in-out',
    once: true,
    offset: 100
});
```

### تغيير عدد الجزيئات في الخلفية:

في `js/script.js` (سطر 16):
```javascript
number: {
    value: 80,  // غيّرها إلى 50 للأقل أو 120 للأكثر
```

### إضافة أقسام جديدة:

1. في `index.html`، أضف القسم الجديد قبل الـ Footer
2. أضف رابط في الـ Navigation
3. صمم القسم بنفس نمط الأقسام الموجودة

## 📱 إضافة Favicon (أيقونة الموقع)

1. احفظ أيقونة بحجم 32x32 أو 64x64 في `images/favicon.png`
2. في `index.html`، أضف داخل `<head>`:

```html
<link rel="icon" type="image/png" href="images/favicon.png">
```

## 🌐 Meta Tags للسوشيال ميديا

أضف في `<head>` بعد سطر 9:

```html
<!-- Open Graph للفيسبوك -->
<meta property="og:title" content="أكرم مصطفى - خبير التسويق الإلكتروني">
<meta property="og:description" content="محاضرات وكورسات احترافية في التسويق الإلكتروني">
<meta property="og:image" content="https://www.akrammostafa.net/images/og-image.jpg">
<meta property="og:url" content="https://www.akrammostafa.net">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="أكرم مصطفى - خبير التسويق الإلكتروني">
<meta name="twitter:description" content="محاضرات وكورسات احترافية في التسويق الإلكتروني">
<meta name="twitter:image" content="https://www.akrammostafa.net/images/og-image.jpg">
```

## 💡 نصائح سريعة

1. **احفظ نسخة احتياطية** قبل أي تعديل كبير
2. **اختبر التغييرات** في المتصفح بعد كل تعديل
3. **استخدم Developer Tools** (F12) للتحقق من الأخطاء
4. **ابدأ بالتعديلات البسيطة** ثم انتقل للمعقدة
5. **اقرأ التعليقات** في الكود لفهم كل جزء

## 🆘 حل المشاكل الشائعة

**المشكلة: الخلفية المتحركة لا تظهر**
- الحل: تأكد من اتصالك بالإنترنت (المكتبات تُحمّل من CDN)

**المشكلة: الصورة لا تظهر**
- الحل: تأكد من مسار الصورة صحيح ومن وجود الملف

**المشكلة: الألوان لم تتغير**
- الحل: امسح الـ Cache في المتصفح (Ctrl + F5)

**المشكلة: النموذج لا يُرسل**
- الحل: النموذج حالياً للعرض فقط، راجع README.md لطرق التفعيل

---

**للمزيد من المساعدة، راجع ملف README.md الكامل!**
