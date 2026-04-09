# 🎯 دليل إعداد Supabase - خطوة بخطوة

## ⚡ ملخص سريع
تم تحويل النظام بالكامل من Firebase إلى **Supabase** (مجاني 100%)!

**الوقت المتوقع:** 5-10 دقايق فقط ⏱️

---

## 📋 الخطوات (بالترتيب)

### الخطوة 1️⃣: إنشاء حساب Supabase

1. افتح https://supabase.com
2. اضغط **"Start your project"**
3. سجل دخول بـ GitHub أو Email
4. اضغط **"New Project"**
5. املأ البيانات:
   - **Name:** akram-employees (أو أي اسم)
   - **Database Password:** اختار كلمة مرور قوية (احفظها!)
   - **Region:** Europe (الأقرب لك)
6. اضغط **"Create new project"**
7. انتظر 2-3 دقايق حتى يتم إنشاء المشروع ✅

---

### الخطوة 2️⃣: إنشاء الجداول (Database)

1. من Dashboard، اضغط **SQL Editor** (من القائمة اليسار)
2. اضغط **"New query"**
3. افتح ملف `database/supabase-schema.sql`
4. **انسخ كل محتوى الملف**
5. **الصق** في Supabase SQL Editor
6. اضغط **"Run"** أو اضغط `Ctrl+Enter`
7. انتظر حتى تشوف: ✅ **Success. No rows returned**

هتلاقي 3 جداول اتعملت:
- ✅ `employees` - بيانات الموظفين
- ✅ `employee_audit_log` - سجل التغييرات
- ✅ `join_requests` - طلبات الانضمام

---

### الخطوة 3️⃣: إنشاء Storage Bucket للصور

1. من Dashboard، اضغط **Storage** (من القائمة اليسار)
2. اضغط **"New bucket"**
3. املأ البيانات:
   - **Name:** `employee-files`
   - **Public bucket:** ✅ نعم (اختار Public)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/*`
4. اضغط **"Create bucket"**

✅ Bucket جاهز! دلوقتي تقدر ترفع صور

---

### الخطوة 4️⃣: الحصول على API Keys

1. من Dashboard، اضغط **Settings** (أسفل القائمة اليسار)
2. اضغط **API**
3. هتلاقي:
   - **Project URL:** https://xxxxx.supabase.co
   - **anon public key:** eyJhbGc....

**انسخ الاتنين دول!** 📋

---

### الخطوة 5️⃣: تحديث ملف Configuration

1. افتح ملف `js/supabase-config.js` في VS Code
2. استبدل القيم:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxx.supabase.co',  // الصق Project URL هنا
    anonKey: 'eyJhbGc...',  // الصق anon key هنا
    bucketName: 'employee-files'  // ده صح، متغيرهوش
};
```

3. احفظ الملف (`Ctrl+S`)

---

### الخطوة 6️⃣: رفع التغييرات على Git

```powershell
# في PowerShell
cd D:\mysite

git add .
git commit -m "Migrate to Supabase - Complete employee system"
git push
```

---

### الخطوة 7️⃣: اختبار النظام! 🎉

#### اختبار Admin Panel:

1. افتح https://www.akrammostafa.com/admin
2. سجل دخول
3. اضغط **نظام الموظفين** → **إضافة موظف**
4. املأ البيانات:
   - Username: ahmed
   - Password: 123456
   - Phone: 01012345678
   - Job: مدير تسويق
   - Salary: 5000
   - Start Date: أي تاريخ
5. اضغط **إنشاء الحساب**

✅ لو ظهر "تم إنشاء الحساب بنجاح!" - يبقى تمام!

#### اختبار Employee Onboarding:

1. انسخ الرابط اللي ظهر لك
2. افتحه في tab جديد
3. املأ البيانات الشخصية
4. ارفع صورة البطاقة (أمامي وخلفي)
5. التقط Selfie
6. وقّع على العقد
7. اضغط **إرسال الطلب**

✅ لو ظهر "تم إرسال طلبك بنجاح!" - يبقى كل حاجة شغالة!

---

## 🔍 التحقق من البيانات

### في Supabase Dashboard:

1. اضغط **Table Editor**
2. اختار **employees** table
3. هتشوف الموظف اللي أضفته! ✅
4. اضغط **Storage**
5. اضغط **employee-files**
6. هتشوف الصور اترفعت! ✅

---

## ❓ مشاكل شائعة وحلولها

### ❌ خطأ: "Failed to fetch"

**السبب:** ملف `supabase-config.js` مش متحدث

**الحل:**
1. راجع الخطوة 5
2. تأكد من Project URL و anon key صح
3. Refresh الصفحة

---

### ❌ خطأ: "relation employees does not exist"

**السبب:** الجداول مش معمولة

**الحل:**
1. ارجع للخطوة 2
2. شغّل `database/supabase-schema.sql` في SQL Editor

---

### ❌ خطأ: "The resource already exists"

**السبب:** Bucket موجود already

**الحل:** تمام! كمّل عادي

---

### ❌ الصور مش بترفع

**السبب:** Bucket مش Public

**الحل:**
1. اضغط Storage → employee-files
2. اضغط ⚙️ Settings
3. تأكد **Public** = Yes

---

## 📊 Statistics الحدود المجانية

**Supabase Free Tier:**
- ✅ Database: 500 MB
- ✅ Storage: 1 GB
- ✅ Bandwidth: 2 GB/month
- ✅ 50,000 Active Users

**كافي لـ:**
- ~500 موظف مع صورهم
- ~5,000 request يومياً
- Uptime 99.9%

---

## 🎉 تم بنجاح!

دلوقتي عندك:
- ✅ نظام موظفين كامل
- ✅ رفع صور ومستندات
- ✅ مجاني 100% للأبد
- ✅ بدون بطاقة ائتمان
- ✅ Database آمنة ومحمية

**مبروك! النظام شغال بالكامل 🚀**

---

## 📞 محتاج مساعدة؟

- 📖 Supabase Docs: https://supabase.com/docs
- 💬 Supabase Discord: https://discord.supabase.com
- 📧 Support: https://supabase.com/support

**أو اسأل في GitHub Discussions للمشروع!**
