# 🚀 Supabase - بديل Firebase مجاني 100%

## ✨ لماذا Supabase؟

- ✅ **PostgreSQL Database** مجاني (500 MB)
- ✅ **File Storage** مجاني (1 GB)
- ✅ **Authentication** مدمج
- ✅ **Real-time subscriptions**
- ✅ **Auto-generated REST API**
- ✅ **بدون بطاقة ائتمان**
- ✅ **Open Source**

---

## 🚀 خطوات سريعة

### 1️⃣ إنشاء حساب

👉 **https://supabase.com**

- Sign up مجاناً
- Create new project
- اختار region قريب منك (Europe)

---

### 2️⃣ إنشاء الجداول

من Supabase Dashboard → **SQL Editor**:

```sql
-- جدول الموظفين
CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    job_title TEXT,
    salary DECIMAL(10, 2),
    start_date DATE,
    contract_terms TEXT,
    
    -- بيانات شخصية
    full_name TEXT,
    email TEXT,
    address TEXT,
    national_id TEXT,
    
    -- روابط الملفات
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    signature_url TEXT,
    
    -- حالة
    application_status TEXT DEFAULT 'incomplete',
    contract_accepted BOOLEAN DEFAULT FALSE,
    contract_accepted_at TIMESTAMP,
    
    -- تواريخ
    created_at TIMESTAMP DEFAULT NOW(),
    application_submitted_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy: السماح بالقراءة والكتابة للجميع (للتجربة)
CREATE POLICY "Public access" ON employees
    FOR ALL USING (true);
```

---

### 3️⃣ إعداد Storage للصور

من Dashboard → **Storage** → **New Bucket**:

1. اسم Bucket: `employee-files`
2. Public bucket: ✅ Yes
3. File size limit: 5 MB
4. Allowed MIME types: `image/*`

---

### 4️⃣ الحصول على API Keys

من Dashboard → **Settings** → **API**:

انسخ:
- `Project URL` (API endpoint)
- `anon public` key (API key)

---

### 5️⃣ تكامل مع Frontend

```javascript
// في employee-onboarding.html
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://xxxxx.supabase.co'
const SUPABASE_KEY = 'your-anon-key'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Create employee
const { data, error } = await supabase
    .from('employees')
    .insert({
        id: 'emp_' + Date.now(),
        username: 'ahmed',
        password: 'secure123',
        ...
    })

// Upload image
const { data, error } = await supabase
    .storage
    .from('employee-files')
    .upload('emp_123/id-front.jpg', file)

// Get public URL
const { data } = supabase
    .storage
    .from('employee-files')
    .getPublicUrl('emp_123/id-front.jpg')
```

---

## 💰 الحدود المجانية

**Supabase Free Tier:**
- ✅ 500 MB Database
- ✅ 1 GB File Storage
- ✅ 50,000 Active Users
- ✅ 2 GB Bandwidth/month
- ✅ بدون بطاقة ائتمان

**كافي لـ:**
- ~500 موظف مع صور
- ~5,000 request يومياً

---

## 🎯 المميزات الإضافية

### Real-time Updates
```javascript
// استمع للتحديثات الفورية
supabase
    .channel('employees')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employees' },
        (payload) => {
            console.log('تم تحديث بيانات موظف:', payload)
        }
    )
    .subscribe()
```

### Row Level Security
```sql
-- حماية متقدمة: كل موظف يشوف بياناته فقط
CREATE POLICY "Users can view own data"
    ON employees FOR SELECT
    USING (auth.uid() = id);
```

---

## 🔗 روابط مهمة

- 📖 Docs: https://supabase.com/docs
- 🎓 Tutorials: https://supabase.com/docs/guides
- 💬 Discord: https://discord.supabase.com
- 📱 Dashboard: https://app.supabase.com

---

## ⚡ Quick Start Example

```javascript
// employee-onboarding.html (updated)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function submitApplication() {
    // 1. Upload images
    const idFrontFile = document.getElementById('idFront').files[0]
    const { data: uploadData } = await supabase.storage
        .from('employee-files')
        .upload(`${empId}/id-front.jpg`, idFrontFile)
    
    // 2. Get public URL
    const { data: urlData } = supabase.storage
        .from('employee-files')
        .getPublicUrl(`${empId}/id-front.jpg`)
    
    // 3. Save to database
    const { data, error } = await supabase
        .from('employees')
        .update({
            full_name: fullName,
            id_front_url: urlData.publicUrl,
            application_status: 'pending'
        })
        .eq('id', empId)
    
    if (error) {
        alert('خطأ: ' + error.message)
    } else {
        alert('تم الإرسال بنجاح!')
    }
}
```

---

## 🎉 الخلاصة

**Supabase = أفضل بديل مجاني لـ Firebase**

- ✅ Setup أسرع من Railway
- ✅ Storage مدمج للصور
- ✅ Real-time updates
- ✅ Authentication جاهز
- ✅ Auto REST API

**عاوز أطبق Supabase؟ قولي وأعدل الكود! 🚀**
