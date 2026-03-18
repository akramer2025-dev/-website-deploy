# 🚀 دليل التشغيل السريع - نظام التحليل الأوتوماتيكي

## ✅ الخطوات المطلوبة لتفعيل النظام

### **1. تثبيت Node.js**
```powershell
# تأكد من تثبيت Node.js v18 أو أحدث
node --version
npm --version
```

إذا لم يكن مثبتاً: [تحميل Node.js](https://nodejs.org/)

---

### **2. تثبيت المكتبات**
```powershell
# انتقل لمجلد الـ API
cd api

# ثبّت كل المكتبات المطلوبة
npm install
```

**المكتبات التي سيتم تثبيتها:**
- ✅ Express (Server)
- ✅ Puppeteer (Browser Automation)
- ✅ Tesseract.js (OCR/Computer Vision)
- ✅ Sharp (Image Processing)
- ✅ Stealth Plugin (Anti-Detection)

**المدة:** 3-5 دقائق

---

### **3. إعداد الإعدادات**
```powershell
# انسخ ملف الإعدادات
copy .env.example .env

# افتحه وعدّله (اختياري)
notepad .env
```

**الإعدادات الافتراضية:**
```env
PORT=3000
NODE_ENV=development
HEADLESS=true
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500
```

---

### **4. تشغيل الـ Server**
```powershell
# للتطوير (مع auto-restart)
npm run dev

# أو للتشغيل العادي
npm start
```

**ستظهر رسالة:**
```
╔══════════════════════════════════════════════╗
║  🤖 Social Media Analyzer API               ║
║  📡 Server running on: http://localhost:3000║
║  ⚡ Ready to analyze!                       ║
╚══════════════════════════════════════════════╝
```

✅ **معنى ذلك:** النظام شغال!

---

### **5. اختبار النظام**
```powershell
# في terminal جديدة
npm test
```

ستفتح متصفح Chrome وتحلل حسابات تجريبية (Cristiano Ronaldo على Instagram مثلاً).

**النتيجة المتوقعة:**
```
✅ Instagram: 623,000,000 followers, 3,920 posts
✅ TikTok: 160,000,000 followers, 1,245 videos

💡 Insights:
  ✅ قاعدة متابعين قوية: 783,000,000 متابع إجمالاً
  💡 ركز على المحتوى التفاعلي
```

---

### **6. دمج مع الموقع**

في [marketing-form-advanced.html](marketing-form-advanced.html):

اضغط زر **"🤖 تحليل تلقائي"** → النظام سيتصل بالـ API تلقائياً!

**ملاحظة:** تأكد أن الـ server شغال (http://localhost:3000)

---

## 🔧 Troubleshooting

### ❌ "Cannot find module 'puppeteer'"
```powershell
cd api
npm install
```

### ❌ "Port 3000 already in use"
عدّل في `.env`:
```env
PORT=3001
```

### ❌ "Chromium not found"
```powershell
npx puppeteer browsers install chrome
```

### ❌ "API connection failed" في الموقع
- تأكد أن الـ server شغال
- تأكد من CORS settings في `.env`
- افتح Console في Browser وشوف الـ error

---

## 📊 كيف يعمل النظام؟

```
[Frontend]                    [API Server]                [Browser]
    |                              |                           |
    | POST /api/analyze-social     |                           |
    |----------------------------->|                           |
    |     { links: {...} }         |                           |
    |                              | Launch Puppeteer          |
    |                              |-------------------------->|
    |                              |                           |
    |                              |      Open Instagram       |
    |                              |      Take Screenshot      |
    |                              |      Extract Numbers      |
    |                              |      (OCR if needed)     |
    |                              |<--------------------------|
    |                              |                           |
    |     { followers: 15234 }     |                           |
    |<-----------------------------|                           |
    |                              |                           |
    | Display Results              |                           |
```

---

## 🚢 بعد ما أتأكد إنه شغال؟

### **Option 1: استخدام محلي فقط**
- خلّي الـ server يشتغل على جهازك
- الموقع يتصل بـ `localhost:3000`

### **Option 2: Deploy على سيرفر**
- Heroku (مجاني): 10 دقائق setup
- Railway (مجاني): 5 دقائق setup
- VPS (Contabo/DigitalOcean): احترافي

**الدليل الكامل:** [api/README.md](api/README.md)

---

## ⚡ Quick Commands

```powershell
# تثبيت
cd api && npm install

# تشغيل development
npm run dev

# تشغيل production
npm start

# اختبار
npm test

# تحديث المكتبات
npm update

# إيقاف الـ server
Ctrl + C
```

---

## 📞 محتاج مساعدة؟

**خطأ في التثبيت؟**
- تأكد من Node.js v18+
- احذف `node_modules` وشغّل `npm install` مرة تانية

**الـ server يفصل؟**
- استخدم PM2 (للخوادم):
  ```powershell
  npm install -g pm2
  pm2 start server.js
  ```

**عايز تطور النظام؟**
- الكود في: `api/analyzers/social-analyzer.js`
- أضف منصات جديدة أو حسّن الـ extraction logic

---

**Created:** March 2026  
**Status:** ✅ Ready to use  
**Next:** Run `npm install` and `npm run dev`
