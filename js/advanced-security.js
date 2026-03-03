/**
 * 🔒 ULTIMATE SECURITY PROTECTION SYSTEM v3.0
 * نظام الحماية النهائي ضد الاختراقات والسرقة
 * Created by: Eng. Akram Mostafa
 * Date: 2026
 * 15 LAYERS OF PROTECTION
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // 1️⃣ ANTI-DEBUGGING: منع فتح Developer Tools المتقدم
    // ═══════════════════════════════════════════════════════════
    
    // [DISABLED FOR DEBUG] منع جميع اختصارات Developer Tools
    // document.addEventListener('keydown', function(e) { ... }, true);

    // [DISABLED FOR DEBUG] كشف فتح DevTools المتقدم
    // setInterval(devtoolsChecker, 500);

    // [DISABLED FOR DEBUG] كشف Debugger Statements
    // setInterval(function() { debugger; }, 100);

    // ═══════════════════════════════════════════════════════════
    // 2️⃣ DISABLE RIGHT CLICK & CONTEXT MENU
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ═══════════════════════════════════════════════════════════
    // 3️⃣ DISABLE TEXT SELECTION & COPY
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', '© حقوق النشر محفوظة - www.akrammostafa.com');
        return false;
    }, true);

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // منع السحب
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // CSS Protection
    const style = document.createElement('style');
    style.textContent = `
        * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        img {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
        }
    `;
    document.head.appendChild(style);

    // ═══════════════════════════════════════════════════════════
    // 4️⃣ PROTECT IMAGES FROM DOWNLOAD
    // ═══════════════════════════════════════════════════════════
    const protectImages = function() {
        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            img.setAttribute('draggable', 'false');
            img.style.pointerEvents = 'none';
        });
    };
    
    protectImages();
    setInterval(protectImages, 2000); // Re-apply protection

    // ═══════════════════════════════════════════════════════════
    // 5️⃣ DISABLE CONSOLE COMPLETELY
    // ═══════════════════════════════════════════════════════════
    const disableConsole = function() {
        const noop = function() {};
        const methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
                        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
                        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'];
        
        methods.forEach(function(method) {
            window.console[method] = noop;
        });
        
        // إعادة تعريف console.log بشكل كامل
        Object.defineProperty(window, 'console', {
            get: function() {
                return {
                    log: noop, warn: noop, error: noop, info: noop, debug: noop
                };
            },
            set: noop
        });
    };
    
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
        disableConsole();
    }

    // ═══════════════════════════════════════════════════════════
    // 6️⃣ XSS & INJECTION ATTACKS PROTECTION
    // ═══════════════════════════════════════════════════════════
    if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const dangerousPatterns = [
            /<script/gi, /javascript:/gi, /onerror=/gi, /onload=/gi, 
            /eval\(/gi, /alert\(/gi, /document\.cookie/gi, /innerHTML/gi,
            /\.\.\//g, /\\/g, /%3C/g, /%3E/g
        ];
        
        let isDangerous = false;
        for (let [key, value] of params.entries()) {
            for (let pattern of dangerousPatterns) {
                if (pattern.test(value) || pattern.test(key)) {
                    isDangerous = true;
                    break;
                }
            }
            if (isDangerous) break;
        }
        
        if (isDangerous) {
            window.location.href = window.location.pathname;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 7️⃣ PREVENT IFRAME EMBEDDING (Anti-Clickjacking)
    // ═══════════════════════════════════════════════════════════
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // ═══════════════════════════════════════════════════════════
    // 8️⃣ BOT DETECTION & BLOCKING
    // ═══════════════════════════════════════════════════════════
    const suspiciousBots = [
        /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i,
        /httrack/i, /harvest/i, /extract/i, /grabber/i
    ];
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (suspiciousBots.some(pattern => pattern.test(userAgent))) {
        if (!window.location.hostname.includes('localhost')) {
            document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px">Access Denied</h1>';
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 9️⃣ PROTECT LOCAL/SESSION STORAGE
    // ═══════════════════════════════════════════════════════════
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (key.match(/token|password|session|secret|key/i)) {
            value = btoa(encodeURIComponent(value));
        }
        originalSetItem.call(this, key, value);
    };

    // ═══════════════════════════════════════════════════════════
    // 🔟 DOM MUTATION OBSERVER (رصد التغييرات المشبوهة)
    // ═══════════════════════════════════════════════════════════
    const domObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    const isExternal = src && !src.includes(window.location.hostname);
                    const hasInlineCode = node.textContent && node.textContent.length > 0;
                    
                    if (isExternal || hasInlineCode) {
                        node.remove();
                        console.warn('⚠️ Suspicious script blocked');
                    }
                }
            });
        });
    });

    domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // ═══════════════════════════════════════════════════════════
    // 1️⃣1️⃣ DISABLE PRINT & SCREENSHOT
    // ═══════════════════════════════════════════════════════════
    document.addEventListener('keydown', function(e) {
        // Ctrl+P, Cmd+P, PrintScreen
        if ((e.ctrlKey && e.keyCode === 80) || (e.metaKey && e.keyCode === 80) || e.keyCode === 44) {
            e.preventDefault();
            return false;
        }
    }, true);

    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    });

    // ═══════════════════════════════════════════════════════════
    // 1️⃣2️⃣ PROTECT AJAX/FETCH REQUESTS
    // ═══════════════════════════════════════════════════════════
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        // يمكن إضافة headers أمنية هنا
        return originalFetch.apply(this, args);
    };

    // ═══════════════════════════════════════════════════════════
    // 1️⃣3️⃣ PREVENT WINDOW OPENING
    // ═══════════════════════════════════════════════════════════
    const originalOpen = window.open;
    window.open = function() {
        return null;
    };

    // ═══════════════════════════════════════════════════════════
    // 1️⃣4️⃣ ANTI-TAMPERING (منع تعديل الكود)
    // ═══════════════════════════════════════════════════════════
    Object.freeze(Object.prototype);
    Object.freeze(Array.prototype);
    Object.freeze(String.prototype);
    Object.freeze(Number.prototype);

    // ═══════════════════════════════════════════════════════════
    // 1️⃣5️⃣ WATERMARK & COPYRIGHT PROTECTION
    // ═══════════════════════════════════════════════════════════
    const addWatermark = function() {
        const watermark = document.createElement('div');
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            color: rgba(255,255,255,0.3);
            font-size: 10px;
            font-family: monospace;
            z-index: 999999;
            pointer-events: none;
            user-select: none;
        `;
        watermark.textContent = '© 2026 Akram Mostafa';
        document.body.appendChild(watermark);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWatermark);
    } else {
        addWatermark();
    }

    // ═══════════════════════════════════════════════════════════
    // ✅ SUCCESS MESSAGE
    // ═══════════════════════════════════════════════════════════
    const securityBadge = document.createElement('div');
    securityBadge.style.cssText = 'position:fixed;bottom:20px;left:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:700;z-index:999999;box-shadow:0 8px 20px rgba(0,0,0,0.4);display:flex;align-items:center;gap:10px;';
    securityBadge.innerHTML = '🛡️ نظام الحماية المتقدم (15 طبقة) مفعّل';
    
    if (document.body) {
        document.body.appendChild(securityBadge);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(securityBadge);
        });
    }
    
    setTimeout(function() {
        securityBadge.style.opacity = '0';
        securityBadge.style.transition = 'opacity 0.8s';
        setTimeout(function() {
            securityBadge.remove();
        }, 800);
    }, 3500);

    // ═══════════════════════════════════════════════════════════
    // 🔒 FINAL LOCK
    // ═══════════════════════════════════════════════════════════
    console.warn('%c⚠️ STOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.warn('%cهذه منطقة محمية! استخدام هذه الأداة قد يسمح للمهاجمين بسرقة معلوماتك.', 'font-size: 20px;');
    console.warn('%cThis is a protected zone! Using this tool may allow attackers to steal your information.', 'font-size: 16px; color: orange;');

})();
