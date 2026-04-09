# 🔧 Firebase Storage CORS Setup Guide

## ⚠️ المشكلة الحالية

Firebase Storage بيرفض رفع الصور بسبب:
1. ❌ **Storage غير مفعل في المشروع**
2. ❌ **CORS policy غير مطبق**

```
Access to XMLHttpRequest has been blocked by CORS policy
```

---

## 🚀 الحل الكامل (خطوة بخطوة):

### الخطوة 1️⃣: تفعيل Firebase Storage

**هذه الخطوة إلزامية! يجب تنفيذها أولاً:**

1. افتح Firebase Console:
   **https://console.firebase.google.com/project/akramplatform-2c6be/storage**

2. اضغط على زرار **"Get Started"** أو **"البدء"**

3. اختر:
   - ✅ **Start in production mode**
   - 📍 Location: اختر `europe-west` أو `us-central`

4. اضغط **"Done"**

5. انتظر حتى يتم إنشاء Storage bucket

---

### الخطوة 2️⃣: رفع Storage Rules

بعد تفعيل Storage، ارجع لـ PowerShell وشغل:

```powershell
cd D:\mysite
.\setup-storage.ps1
```

أو مباشرة:
```powershell
firebase deploy --only storage
```

---

### الخطوة 3️⃣: تطبيق CORS

#### الطريقة أ: من Firebase Console (الأسهل) ⭐

1. افتح: https://console.firebase.google.com/project/akramplatform-2c6be/storage
2. اضغط **Rules** tab
3. تأكد من وجود هذه الـ rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. اضغط **Publish**

#### الطريقة ب: باستخدام gsutil

```powershell
# Install Google Cloud SDK
# من: https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project akramplatform-2c6be

# Apply CORS
gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com
```

---

## 🧪 التحقق من نجاح CORS

بعد تطبيق CORS، جرب:

1. افتح: https://www.akrammostafa.com/employee-onboarding.html?id=emp_XXXXX
2. املأ بيانات التسجيل
3. ارفع صور البطاقة
4. وقّع على العقد
5. اضغط "إرسال الطلب"

**إذا اشتغل بدون أخطاء CORS = تمام!** ✅

---

## ❓ المشاكل الشائعة

### مشكلة: `gsutil: command not found`
**الحل:** ثبت Google Cloud SDK من الرابط أعلاه

### مشكلة: `authentication required`
**الحل:** شغل `gcloud auth login` الأول

### مشكلة: `AccessDeniedException: 403`
**الحل:** تأكد إنك مسجل دخول بحساب له permissions على المشروع

### مشكلة: لسه CORS مش شغال
**الحل:** 
1. امسح cache المتصفح (Ctrl+Shift+Delete)
2. جرب من incognito/private window
3. استنى 5-10 دقايق (التحديثات بتاخد وقت)

---

## 📌 ملف cors.json الحالي

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "User-Agent",
      "x-goog-resumable",
      "x-goog-acl",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ],
    "maxAgeSeconds": 3600
  }
]
```

الملف ده بيسمح بـ:
- ✅ جميع الـ origins (*)
- ✅ جميع HTTP methods
- ✅ جميع الـ headers المطلوبة

---

## 🎯 الملخص

1. ثبت Google Cloud SDK
2. شغل `gcloud auth login`
3. شغل `.\apply-cors.ps1`
4. جرب رفع الصور مرة تانية

**أو** استخدم Firebase Console لتحديث Storage Rules.
