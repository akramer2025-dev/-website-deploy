# 🗄️ MySQL Setup Guide - نظام إدارة الموظفين

## المتطلبات الأساسية

- ✅ **MySQL Server** (5.7 أو أحدث) أو **MariaDB**
- ✅ **Node.js** (18 أو أحدث)
- ✅ **npm** (مدير الحزم)

---

## 📦 خطوات التثبيت

### 1️⃣ تثبيت MySQL

#### Windows:
```powershell
# Download and install MySQL from:
# https://dev.mysql.com/downloads/installer/

# أو باستخدام Chocolatey:
choco install mysql
```

#### Or use XAMPP (الأسهل):
- حمل XAMPP من: https://www.apachefriends.org/download.html
- شغل **Apache** و **MySQL** من Control Panel

---

### 2️⃣ إعداد قاعدة البيانات

```powershell
# في مجلد المشروع
cd D:\mysite

# انسخ ملف البيئة
Copy-Item .env.example .env

# عدّل .env وضع بيانات MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=akram_employees
```

---

### 3️⃣ تثبيت Dependencies

```powershell
npm install
```

---

### 4️⃣ إنشاء قاعدة البيانات

```powershell
# الطريقة التلقائية (موصى بها):
npm run db:setup
```

**أو يدوياً:**
```sql
-- 1. افتح MySQL Command Line أو phpMyAdmin
-- 2. شغّل الأوامر من: database/schema.sql
```

---

### 5️⃣ تشغيل API Server

```powershell
# وضع Production
npm start

# وضع Development (مع auto-reload)
npm run dev
```

الـ API هيشتغل على: **http://localhost:4000**

---

## 🔌 API Endpoints

### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/:id` | Get single employee |
| `POST` | `/api/employees` | Create employee account |
| `PUT` | `/api/employees/:id/application` | Submit employee application |
| `PUT` | `/api/employees/:id/status` | Update employee status |
| `DELETE` | `/api/employees/:id` | Delete employee |

### Join Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/join-requests` | Get all join requests |
| `POST` | `/api/join-requests` | Create join request |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Check API status |

---

## 📝 أمثلة الاستخدام

### 1. Create Employee (Admin)

```javascript
POST /api/employees
Content-Type: application/json

{
  "username": "ahmed.ali",
  "password": "secure123",
  "phone": "01012345678",
  "jobTitle": "مدير تسويق",
  "salary": 5000,
  "startDate": "2026-03-15",
  "contractTerms": "مهام المدير: إدارة..."
}
```

**Response:**
```json
{
  "success": true,
  "employeeId": "emp_1772992800000",
  "message": "Employee account created successfully"
}
```

---

### 2. Submit Application (Employee)

```javascript
PUT /api/employees/emp_1772992800000/application
Content-Type: application/json

{
  "fullName": "أحمد علي محمد",
  "email": "ahmed@example.com",
  "phone": "01012345678",
  "address": "القاهرة، مصر",
  "nationalId": "12345678901234",
  "jobTitle": "مدير تسويق",
  "idFrontBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "idBackBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "selfieBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "signatureBase64": "data:image/png;base64,iVBORw0KG...",
  "contractAccepted": true
}
```

---

### 3. Get All Employees (Admin Dashboard)

```javascript
GET /api/employees

// Response:
{
  "success": true,
  "employees": [
    {
      "id": "emp_1772992800000",
      "username": "ahmed.ali",
      "full_name": "أحمد علي محمد",
      "job_title": "مدير تسويق",
      "salary": 5000,
      "application_status": "pending",
      ...
    }
  ]
}
```

---

## 🚀 Deploy on Production

### Option 1: Railway (Free) ⭐

1. افتح: https://railway.app
2. اعمل حساب جديد
3. New Project → Deploy from GitHub
4. اختار المشروع
5. Add MySQL Database
6. Set Environment Variables

### Option 2: Heroku + ClearDB

```powershell
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create akram-employee-api

# Add MySQL
heroku addons:create cleardb:ignite

# Get database credentials
heroku config:get CLEARDB_DATABASE_URL

# Deploy
git push heroku master
```

### Option 3: Vercel + PlanetScale

1. افتح: https://planetscale.com (MySQL مجاني)
2. Create database
3. Get connection string
4. Deploy API on Vercel
5. Add environment variables

---

## 🔧 Troubleshooting

### مشكلة: Cannot connect to MySQL

```powershell
# تأكد إن MySQL شغال
Get-Service MySQL* | Select Name, Status

# أو في XAMPP:
# شغل MySQL من Control Panel
```

### مشكلة: Access denied for user 'root'

```sql
-- غير كلمة المرور:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### مشكلة: Database doesn't exist

```powershell
# شغل setup script تاني:
npm run db:setup
```

---

## 📊 بنية قاعدة البيانات

### employees table
- `id` - معرف الموظف الفريد
- `username` - اسم المستخدم
- `job_title` - المسمى الوظيفي
- `salary` - الراتب
- `full_name` - الاسم الكامل
- `email` - البريد الإلكتروني
- `national_id` - رقم البطاقة
- `id_front_url` - صورة البطاقة (أمامية) كـ Base64
- `id_back_url` - صورة البطاقة (خلفية) كـ Base64
- `selfie_url` - الصورة الشخصية كـ Base64
- `signature_url` - التوقيع كـ Base64
- `application_status` - حالة الطلب (pending/approved/rejected)

### employee_audit_log table
- سجل جميع التغييرات على الموظفين

### join_requests table
- طلبات الانضمام من الموقع الرئيسي

---

## 🔐 الأمان

- ✅ CORS enabled للسماح بطلبات من المتصفح
- ✅ Body size limit: 50MB (لدعم الصور Base64)
- ⚠️ **مهم:** غير كلمات المرور الافتراضية في `.env`
- ⚠️ **مهم:** استخدم HTTPS في Production
- 💡 **اختياري:** أضف JWT authentication للـ admin endpoints

---

## 📞 الدعم

عندك مشكلة؟ شوف:
- File: `api-server.js` - الكود الكامل للـ API
- File: `database/schema.sql` - بنية قاعدة البيانات
- File: `database/setup.js` - سكريبت إنشاء القاعدة

**Next Step:** عدّل `employee-onboarding.html` و `admin/index.html` للاتصال بـ API بدلاً من Firebase!
