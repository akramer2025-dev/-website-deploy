# 📘 دليل تنفيذ SQL في Supabase - خطوة بخطوة

## ⚠️ مهم: الفرق بين الملفات

### 1️⃣ `add-permissions-fields.sql` ← اتنفذ قبل كده ✅
- ده migration قديم لإضافة صلاحيات الموظفين
- **مش محتاج تشغله تاني**

### 2️⃣ `supabase-schema.sql` ← ده اللي محتاج تشغله ⚡
- ده الـ schema الكامل لكل الجداول
- فيه جداول CRM + Marketing Plans
- **ده اللي لازم تنفذه دلوقتي**

---

## 🚀 خطوات التنفيذ (مش هتاخد دقيقة):

### الطريقة 1: نسخ ولصق (الأسهل) ⭐

1. **افتح PowerShell** (اللي موجود تحت) واكتب:
   ```powershell
   Get-Content database\supabase-schema.sql | Set-Clipboard
   ```
   ده هينسخ الـ SQL كامل للـ clipboard

2. **افتح Supabase Dashboard**:
   👉 https://supabase.com/dashboard/project/zwignngqrnzmlpphiqnc/sql/new

3. **الصق الكود** (Ctrl+V) في SQL Editor

4. **اضغط Run** (أو F5)

5. **انتظر لحد ما يظهر:** `Success. No rows returned`

---

### الطريقة 2: من الموقع مباشرة

1. افتح: https://supabase.com/dashboard/project/zwignngqrnzmlpphiqnc/sql/new

2. انسخ محتويات ملف `database/supabase-schema.sql` (كل الملف)

3. الصق في SQL Editor

4. اضغط Run

---

## ✅ التحقق من نجاح التنفيذ:

### 1️⃣ تحقق من الجداول:
- اذهب إلى: **Table Editor** (من القائمة الجانبية)
- لازم تشوف الجداول دي:
  - ✅ `employees` (كان موجود)
  - ✅ `join_requests` (كان موجود)
  - ✅ `crm_leads` ← **جديد**
  - ✅ `crm_status_log` ← **جديد**
  - ✅ `crm_notes` ← **جديد**
  - ✅ `crm_calls` ← **جديد**
  - ✅ `crm_distribution_log` ← **جديد**
  - ✅ `marketing_plans` ← **جديد**

### 2️⃣ اختبر إضافة عميل:
- افتح لوحة الإدارة
- روح لـ **إدارة العملاء** (CRM)
- اضغط **"إضافة عميل"**
- اكتب: اسم + تليفون
- احفظ
- **حدث الصفحة (F5)**
- لازم **العميل يظهر** ✅

---

## ❓ أسئلة شائعة:

### س: لو شغلت الـ SQL مرتين؟
ج: **مفيش مشكلة!** الكود مكتوب بطريقة آمنة:
```sql
CREATE TABLE IF NOT EXISTS crm_leads (...)
```
الـ `IF NOT EXISTS` معناها: لو الجدول موجود، هيتجاهله.

### س: هيمسح البيانات القديمة؟
ج: **لأ طبعاً!** الكود بيعمل:
- `CREATE TABLE IF NOT EXISTS` - يعني لو موجود مش هيمسحه
- `ALTER TABLE ADD COLUMN IF NOT EXISTS` - يضيف أعمدة جديدة بس
- **مش فيه أي `DROP` أو `DELETE`** ✅

### س: الـ permissions القديمة هتتأثر؟
ج: **لأ!** الملف `add-permissions-fields.sql` اتنفذ قبل كده وجدول `employees` شغال كويس.

---

## 🎯 ملخص سريع:

| الملف | الحالة | اعمل إيه؟ |
|-------|--------|-----------|
| `add-permissions-fields.sql` | ✅ اتنفذ قبل كده | **متشغلوش تاني** |
| `supabase-schema.sql` | ⏳ محتاج تنفيذ | **نفذه دلوقتي** |

---

**شغل الأمر ده في PowerShell دلوقتي:**
```powershell
Get-Content database\supabase-schema.sql | Set-Clipboard
```
**وبعدين روح على Supabase والصق الكود** 🚀
