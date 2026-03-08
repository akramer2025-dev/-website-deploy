// 🔥 Supabase Configuration
// استبدل القيم دي بقيمك من Supabase Dashboard

const SUPABASE_CONFIG = {
    // من Settings → API
    url: 'https://zwignngqrnzmlpphiqnc.supabase.co',
    anonKey: 'sb_publishable_zmJ35zrJxa0-xr3nwPGYyg_b6A4eV7H',
    
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
