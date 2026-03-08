// 🔥 Supabase Configuration
// استبدل القيم دي بقيمك من Supabase Dashboard

const SUPABASE_CONFIG = {
    // من Settings → API
    url: 'https://zwignngqrnzmlpphiqnc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3aWdubmdxcm56bWxwcGhpcW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODkxNjEsImV4cCI6MjA4ODU2NTE2MX0.dCYFQkcX0n7j7ccmXSRNCFsjc8WCXM-2AecsfdUqmYg',
    
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
