/**
 * SECURITY PROTECTION - Optimized Version
 * دمج ملفات الأمان في ملف واحد محسّن
 * Version: 3.0
 */

(function() {
    'use strict';
    
    // منع الاختصارات
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I/J/C (DevTools)
        if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    }, false);
    
    // منع القائمة اليمنى
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // منع تحديد النصوص
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
    // منع نسخ النصوص
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    }, false);
    
})();
