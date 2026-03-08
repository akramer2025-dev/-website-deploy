# 🔧 Firebase Storage CORS Setup Guide

## ⚠️ المشكلة الحالية

Firebase Storage بيرفض رفع الصور بسبب CORS policy:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

## ✅ الحل: تطبيق CORS على Firebase Storage

### الطريقة 1: باستخدام Google Cloud SDK (الأسرع) 🚀

#### الخطوة 1: تثبيت Google Cloud SDK

**Windows:**
```powershell
# Run as Administrator
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\CloudSDK.exe")
Start-Process "$env:Temp\CloudSDK.exe"
```

أو حمل من الموقع مباشرة:
https://cloud.google.com/sdk/docs/install

#### الخطوة 2: تسجيل الدخول

بعد التثبيت، افتح PowerShell جديد وشغل:

```powershell
# Login to Google Cloud
gcloud auth login

# Set your Firebase project
gcloud config set project akramplatform-2c6be
```

#### الخطوة 3: تطبيق CORS

```powershell
# Navigate to your project folder
cd D:\mysite

# Apply CORS configuration
.\apply-cors.ps1
```

أو مباشرة:
```powershell
gsutil cors set cors.json gs://akramplatform-2c6be.appspot.com
```

---

### الطريقة 2: من Firebase Console (بديل)

1. افتح: https://console.firebase.google.com/project/akramplatform-2c6be/storage
2. اضغط على **Rules** tab
3. تأكد إن Rules تسمح برفع الملفات:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /employees/{employeeId}/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. اضغط **Publish**

---

### الطريقة 3: باستخدام Firebase CLI

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy storage rules
firebase deploy --only storage
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
