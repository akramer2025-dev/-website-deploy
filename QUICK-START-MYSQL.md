# ⚡ Quick Start - نظام الموظفين مع MySQL

## 🚀 ابدأ في 5 دقايق

### 1️⃣ تثبيت MySQL

**الطريقة الأسهل - XAMPP:**
- حمل من: https://www.apachefriends.org/download.html
- ثبت البرنامج
- شغل **Apache** و **MySQL** من XAMPP Control Panel

**أو MySQL مباشرة:**
```powershell
choco install mysql  # Windows with Chocolatey
```

---

### 2️⃣ إعداد البيئة

```powershell
# انسخ .env.example إلى .env
Copy-Item .env.example .env

# افتح .env وعدل على حسب إعداداتك:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=    (فاضي لو XAMPP)
# DB_NAME=akram_employees
```

---

### 3️⃣ تثبيت وتشغيل

```powershell
# ثبت الحزم
npm install

# أنشئ قاعدة البيانات
npm run db:setup

# شغّل السيرفر
npm start
```

**✅ تمام! السيرفر شغال على: http://localhost:4000**

---

## 🧪 اختبر API

افتح المتصفح واكتب:
```
http://localhost:4000/api/health
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

## 📱 الخطوات التالية

### ✅ الخطوة التالية: ربط Frontend بـ Backend

الآن عندك:
- ✅ MySQL database جاهزة
- ✅ API server شغال
- ⏳ محتاج تعدل `employee-onboarding.html` و `admin/index.html`

**هل عاوز أعدل ملفات Frontend دلوقتي؟**

---

## 🔍 ملفات مهمة

| File | الوصف |
|------|-------|
| `api-server.js` | كود API الكامل |
| `database/schema.sql` | بنية قاعدة البيانات |
| `database/setup.js` | سكريبت إنشاء القاعدة |
| `.env.example` | إعدادات البيئة |
| `MYSQL-SETUP-GUIDE.md` | دليل كامل للإعداد |

---

## ❓ مشاكل شائعة

### 1. MySQL غير متصل

```powershell
# تأكد إن MySQL شغال
Get-Service MySQL*

# أو في XAMPP: شغل MySQL من Control Panel
```

### 2. Access denied

```sql
-- في MySQL Command Line:
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
```

### 3. Database not found

```powershell
# شغل setup تاني
npm run db:setup
```

---

## 🎯 Ready to continue?

**قول "نعم" وأنا هعدل ملفات Frontend للاتصال بـ MySQL API! 🚀**
