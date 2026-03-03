/**
 * SECURITY PROTECTION SYSTEM v4.0
 * Created by: Eng. Akram Mostafa
 */

(function() {
    'use strict';

    // 1: DISABLE KEYBOARD SHORTCUTS FOR DEVTOOLS
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123) { e.preventDefault(); e.stopPropagation(); return false; }
        if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) { e.preventDefault(); e.stopPropagation(); return false; }
        if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
        if (e.ctrlKey && e.keyCode === 80) { e.preventDefault(); return false; }
        if (e.keyCode === 44) { e.preventDefault(); return false; }
    }, true);

    // 2: DISABLE RIGHT CLICK
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // 3: DISABLE TEXT SELECTION AND COPY
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        return false;
    }, true);

    document.addEventListener('copy', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', '\u00A9 akrammostafa.com');
        }
        return false;
    }, true);

    document.addEventListener('cut', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        return false;
    }, true);

    // 4: PROTECT IMAGES FROM DRAG
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
    }, true);

    // CSS PROTECTION
    var style = document.createElement('style');
    style.textContent = 'body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}input,textarea,[contenteditable]{-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important;}img{-webkit-user-drag:none;pointer-events:none;}';
    document.head.appendChild(style);

    // 5: PREVENT IFRAME EMBEDDING
    try { if (window.top !== window.self) { window.top.location = window.self.location; } } catch(e) {}

    // 6: WATERMARK
    function addWatermark() {
        if (document.getElementById('sec-watermark')) return;
        var wm = document.createElement('div');
        wm.id = 'sec-watermark';
        wm.style.cssText = 'position:fixed;bottom:10px;right:10px;color:rgba(255,255,255,0.25);font-size:10px;font-family:monospace;z-index:999999;pointer-events:none;user-select:none;';
        wm.textContent = '\u00A9 2026 Akram Mostafa';
        document.body.appendChild(wm);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWatermark);
    } else {
        addWatermark();
    }

})();
