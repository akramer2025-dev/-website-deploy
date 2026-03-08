// 🔥 Supabase Configuration
// استبدل القيم دي بقيمك من Supabase Dashboard

const SUPABASE_CONFIG = {
    // من Settings → API
    url: 'YOUR_SUPABASE_URL',  // مثال: https://xxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY',  // anon/public key
    
    // اسم Bucket للصور
    bucketName: 'employee-files'
};

// للاستخدام في HTML files
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

// للاستخدام في Node.js
if (typeof module !== 'undefined') {
    module.exports = SUPABASE_CONFIG;
}
