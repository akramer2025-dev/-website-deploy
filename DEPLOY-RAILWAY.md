# 🚂 Deploy على Railway - مجاناً 100%

## ✨ المميزات
- ✅ MySQL Database مجاني (1 GB)
- ✅ Node.js hosting مجاني
- ✅ Automatic deployments من GitHub
- ✅ بدون بطاقة ائتمان
- ✅ SSL مجاني
- ✅ بيانات وصور محفوظة للأبد

---

## 🚀 خطوات النشر (5 دقايق)

### 1️⃣ افتح Railway وسجل دخول

👉 **https://railway.app**

- سجل دخول بـ GitHub
- Verify Email

---

### 2️⃣ أنشئ مشروع جديد

1. اضغط **"New Project"**
2. اختار **"Deploy MySQL"**
3. انتظر حتى يتم إنشاء Database

✅ Database جاهزة! انسخ Connection String:
- اضغط على **MySQL**
- اضغط **Variables** tab
- انسخ `MYSQL_URL` (سنحتاجه لاحقاً)

---

### 3️⃣ Deploy Node.js API

1. في نفس المشروع، اضغط **"New"**
2. اختار **"GitHub Repo"**
3. اختار repository: `akramer2025-dev/-website-deploy`
4. اضغط **"Deploy"**

---

### 4️⃣ إعداد Environment Variables

اضغط على الـ service اللي اتعمل → **Variables** tab

أضف المتغيرات دي:

```bash
# من MySQL Connection String اللي انسخته
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=xxxxx
DB_NAME=railway
DB_PORT=6379

# Port
PORT=4000

# Node Environment
NODE_ENV=production
```

💡 **Tip:** Railway بيعطيك connection string كامل زي كده:
```
mysql://root:password@host:port/railway
```

فك الأجزاء دي:
- `DB_USER` = root
- `DB_PASSWORD` = password  
- `DB_HOST` = host
- `DB_PORT` = port
- `DB_NAME` = railway

---

### 5️⃣ Setup Database Tables

افتح **Railway Console** (من داخل MySQL service):

```sql
-- انسخ والصق كل محتوى database/schema.sql
CREATE TABLE employees (...);
CREATE TABLE employee_audit_log (...);
CREATE TABLE join_requests (...);
```

أو شغل من Local:
```powershell
# عدّل .env بـ Railway credentials
npm run db:setup
```

---

### 6️⃣ Get Your API URL

1. اضغط على Node.js service
2. اضغط **Settings** tab
3. اضغط **Generate Domain**
4. انسخ الـ URL (مثلاً: `akram-api.up.railway.app`)

✅ **API URL الجديد:**
```
https://akram-api.up.railway.app
```

---

### 7️⃣ اختبر API

افتح المتصفح:
```
https://your-api.up.railway.app/api/health
```

المفروض تشوف:
```json
{
  "success": true,
  "message": "API is running",
  "database": "connected"
}
```

---

## 🔗 الخطوة الأخيرة: ربط Frontend

عدّل ملفات Frontend لتستخدم Railway URL بدل localhost:

في `employee-onboarding.html` و `admin/index.html`:
```javascript
const API_URL = 'https://your-api.up.railway.app';
```

---

## 📊 Railway Dashboard

من Railway Dashboard تقدر:
- ✅ شوف logs لـ API
- ✅ راقب Database usage
- ✅ Redeploy بضغطة زر
- ✅ شوف metrics وerrors

---

## 💰 الحدود المجانية

**Railway Free Tier:**
- ✅ 1 GB MySQL Storage
- ✅ 512 MB RAM
- ✅ $5 credit شهرياً (كافي جداً)
- ✅ Automatic HTTPS
- ✅ بدون بطاقة ائتمان

**كافي لـ:**
- ~1000 موظف مع صور
- ~10,000 request يومياً
- Uptime 99.9%

---

## 🔧 Troubleshooting

### Error: Cannot connect to database
```bash
# تأكد إن Environment Variables صح
# راجع DB_HOST, DB_USER, DB_PASSWORD
```

### Error: Table doesn't exist
```bash
# شغل schema.sql في Railway Console
# أو من local: npm run db:setup
```

### API not responding
```bash
# شوف Logs في Railway Dashboard
# تأكد إن PORT = 4000 في Variables
```

---

## 🎉 تمام!

دلوقتي عندك:
- ✅ MySQL Database مجانية
- ✅ API شغالة 24/7
- ✅ HTTPS مجاني
- ✅ Auto-deploy من GitHub
- ✅ بدون تكلفة!

**Next:** عدّل Frontend files للاتصال بـ Railway API! 🚀
