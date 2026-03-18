# 🚀 Quick Reference - نظام التحليل الأوتوماتيكي

## ✅ النظام شغال الآن!

```
📡 API Server: http://localhost:3000
🧪 Test Page: test-analyzer.html
```

---

## 🔧 الأوامر المهمة

### تشغيل الـ Server
```powershell
cd api
./start.ps1
```

### إيقاف الـ Server
اضغط `Ctrl+C` في الـ Terminal

### اختبار الـ API
```powershell
# Health check
Invoke-RestMethod http://localhost:3000/api/health

# أو افتح في المتصفح
Start-Process http://localhost:3000/api/health
```

### فتح صفحة الاختبار
```powershell
Start-Process test-analyzer.html
```

### إيقاف عملية على port معين
```powershell
# إذا كان port 3000 مشغول
$process = Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id $process -Force
```

---

## 📝 أمثلة على الاستخدام

### Example 1: تحليل Instagram
```javascript
// في المتصفح Console أو في كود JavaScript
fetch('http://localhost:3000/api/analyze-social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        links: {
            instagram: 'https://instagram.com/cristiano'
        }
    })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Example 2: تحليل عدة منصات
```javascript
fetch('http://localhost:3000/api/analyze-social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        links: {
            instagram: 'https://instagram.com/username',
            tiktok: 'https://tiktok.com/@username',
            facebook: 'https://facebook.com/page',
            youtube: 'https://youtube.com/@channel'
        }
    })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Example 3: PowerShell
```powershell
$body = @{
    links = @{
        instagram = "https://instagram.com/cristiano"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/analyze-social" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

---

## 🧪 اختبار النظام

### Test 1: Health Check
```
URL: http://localhost:3000/api/health
Expected: {"status":"ok", ...}
```

### Test 2: تحليل حساب تجريبي
```
1. افتح test-analyzer.html
2. أدخل: https://instagram.com/cristiano
3. اضغط "تحليل تلقائي"
4. انتظر 30-60 ثانية
5. شوف النتائج!
```

### Test 3: من marketing-form-advanced.html
```
1. افتح marketing-form-advanced.html
2. املأ البيانات الأساسية
3. في خطوة "حسابات السوشيال ميديا":
   - أدخل لينكات حقيقية
4. اضغط "🤖 تحليل تلقائي"
5. النظام يتصل بالـ API تلقائياً!
```

---

## 📊 Response Format

```json
{
  "success": true,
  "data": {
    "instagram_followers": 623000000,
    "instagram_posts": 3920,
    "tiktok_followers": 160000000,
    "summary": {
      "totalFollowers": 783000000,
      "platformsCount": 2
    },
    "strengths": ["..."],
    "weaknesses": ["..."],
    "recommendations": ["..."]
  }
}
```

---

## 🛠️ تخصيص النظام

### تغيير الـ Port
في `.env`:
```env
PORT=3001
```

### تعديل الـ Timeout
في `analyzers/social-analyzer.js`:
```javascript
constructor(options = {}) {
    this.options = {
        timeout: options.timeout || 60000, // 60 seconds
        ...
    };
}
```

### إضافة منصة جديدة
في `analyzers/social-analyzer.js`:
```javascript
async analyzeTwitter(url) {
    const page = await this.browser.newPage();
    try {
        await page.goto(url);
        // ... extraction logic
        return { followers: 0 };
    } finally {
        await page.close();
    }
}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force` |
| Chromium not found | `npx puppeteer browsers install chrome` |
| npm install failed | `npm install --force` |
| CORS error | Check `.env` ALLOWED_ORIGINS |
| OCR not working | Install Tesseract: `choco install tesseract` |
| Instagram blocked | Use proxy or reduce rate |

---

## 📁 الملفات المهمة

```
api/
├── server.js                 # Main API server
├── analyzers/
│   └── social-analyzer.js    # Analysis engine
├── .env                      # Configuration
├── start.ps1                 # Launcher
├── README.md                 # Full docs
└── STATUS.md                 # Current status

test-analyzer.html            # Test page
marketing-form-advanced.html  # Main form (uses API)
js/ai-analyzer.js            # Frontend connector
```

---

## 🚀 Deploy للإنتاج

### Vercel (أسهل)
```powershell
cd api
npm install -g vercel
vercel --prod
```

### Railway
```
1. Go to https://railway.app/
2. Connect GitHub repo
3. Deploy!
```

### Heroku
```powershell
heroku create my-analyzer
heroku buildpacks:add jontewks/puppeteer
git push heroku main
```

---

## 📞 Support

**مشاكل في التشغيل؟**
- تحقق من Node.js v18+
- تحقق من `npm install` completed
- تحقق من `.env` file exists
- شوف الـ Terminal logs

**عايز تطور؟**
- كود التحليل: `api/analyzers/social-analyzer.js`
- كود الـ API: `api/server.js`
- Frontend: `js/ai-analyzer.js`

---

## ✅ Current Status

- ✅ API Server Running
- ✅ Puppeteer Ready
- ✅ OCR Ready
- ✅ Test Page Working
- ✅ Frontend Integration Ready

**Next:** Test with real accounts!

---

**Last Updated:** March 18, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
