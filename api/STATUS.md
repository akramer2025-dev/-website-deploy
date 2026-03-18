# ✅ Social Media Analyzer API - نظام شغال!

## 🎉 النظام يعمل الآن!

**الـ API يعمل على:**
```
http://localhost:3000
```

---

## 🧪 اختبار سريع:

### 1. Health Check
افتح المتصفح على:
```
http://localhost:3000/api/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "message": "Social Media Analyzer API is running",
  "version": "1.0.0"
}
```

### 2. تحليل حسابات (باستخدام Postman أو curl)

```bash
# باستخدام PowerShell
$body = @{
    links = @{
        instagram = "https://instagram.com/cristiano"
        tiktok = "https://tiktok.com/@khaby.lame"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/analyze-social" -Method Post -Body $body -ContentType "application/json"
```

### 3. من الموقع (marketing-form-advanced.html)

1. افتح `marketing-form-advanced.html` في المتصفح
2. املأ البيانات الأساسية
3. في خطوة "حسابات السوشيال ميديا":
   - أدخل لينكات Instagram, TikTok, Facebook...
4. اضغط **"🤖 تحليل تلقائي"**
5. النظام سيتصل بالـ API تلقائياً وسيعرض النتائج!

---

## 📊 مثال على Response:

```json
{
  "success": true,
  "data": {
    "instagram_followers": 623000000,
    "instagram_posts": 3920,
    "tiktok_followers": 160000000,
    "tiktok_videos": 1245,
    "summary": {
      "totalFollowers": 783000000,
      "totalPosts": 5165,
      "platformsCount": 2
    },
    "strengths": [
      "✅ قاعدة متابعين قوية: 783,000,000 متابع إجمالاً",
      "✅ تواجد على 2 منصات - استراتيجية قوية"
    ],
    "weaknesses": [],
    "recommendations": [
      "💡 ركز على المحتوى التفاعلي (ريلز، stories، challenges)",
      "💡 انشر بانتظام (3-5 مرات أسبوعياً على الأقل)"
    ]
  }
}
```

---

## 🛑 إيقاف الـ Server:

اضغط **Ctrl+C** في الـ Terminal الذي يشغل الـ server

---

## 🔄 إعادة التشغيل:

```powershell
cd api
./start.ps1
```

أو:
```powershell
cd api
npm start
```

---

## 🐛 حل المشاكل:

### "Port 3000 already in use"
```powershell
# إيقاف العملية على port 3000
$process = Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess -Unique
Stop-Process -Id $process -Force

# ثم شغل الـ server مرة أخرى
npm start
```

### "Cannot connect to API" من الموقع
- تأكد أن الـ server شغال (http://localhost:3000/api/health)
- افتح Console في المتصفح وشوف الـ errors
- تأكد من CORS settings في `.env`

### Chromium download failed
```powershell
npx puppeteer browsers install chrome
```

---

## 📁 الملفات المهمة:

- `server.js` - الـ API الرئيسي
- `analyzers/social-analyzer.js` - محرك التحليل
- `.env` - الإعدادات
- `start.ps1` - launcher script

---

## 🚀 الخطوات التالية:

### 1. اختبر النظام محلياً
```powershell
cd api
npm test
```

### 2. دمج مع الموقع
- الموقع جاهز للاتصال بالـ API
- فقط اضغط "تحليل تلقائي" في النموذج

### 3. Deploy للإنتاج (اختياري)
```powershell
# Vercel (مجاني)
npm install -g vercel
vercel --prod

# أو Railway
# https://railway.app/ → Connect GitHub
```

---

## 🎯 الميزات:

- ✅ Browser Automation (Puppeteer)
- ✅ Computer Vision (OCR)
- ✅ Anti-Bot Detection (Stealth mode)
- ✅ Multi-platform (Instagram, TikTok, Facebook, YouTube)
- ✅ Smart insights generation
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Error handling

---

## 📞 الدعم:

**مشاكل في التشغيل؟**
1. تأكد من Node.js v18+
2. تأكد من تثبيت dependencies: `npm install`
3. تأكد من وجود `.env` file
4. شوف الـ logs في الـ Terminal

**عايز تطور النظام؟**
- الكود في: `analyzers/social-analyzer.js`
- أضف منصات جديدة بسهولة
- عدّل الـ OCR settings
- أضف proxy support

---

**Status:** ✅ Running on http://localhost:3000  
**Version:** 1.0.0  
**Environment:** Development  
**Ready:** ✅ Yes

**Next:** افتح المتصفح على http://localhost:3000/api/health للتأكد!
