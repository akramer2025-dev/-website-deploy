/**
 * Meta Pixel — إعداد موحّد لجميع صفحات الموقع
 * الموقع: akrammostafa.com
 *
 * لتفعيل الـ Pixel:
 * 1. استبدل PIXEL_ID_HERE برقم الـ Pixel الخاص بك من Meta Business Manager
 * 2. ارفع الملف على GitHub
 */

(function() {
  var PIXEL_ID = 'PIXEL_ID_HERE'; // ← ضع رقم الـ Pixel هنا

  // ---------- Base Pixel Code ----------
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // ---------- noscript fallback ----------
  var ns = document.createElement('noscript');
  var img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style = 'display:none';
  img.src = 'https://www.facebook.com/tr?id=' + PIXEL_ID + '&ev=PageView&noscript=1';
  ns.appendChild(img);
  document.body && document.body.appendChild(ns);

  // ---------- Helper: fire event ----------
  window.fbTrack = function(event, params) {
    if (typeof fbq === 'function') {
      fbq('track', event, params || {});
    }
  };

  // ---------- Auto-detect page and fire content event ----------
  var path = window.location.pathname;

  // — صفحة التطبيقات (store.html) —
  if (path.includes('store')) {
    fbq('track', 'ViewContent', {
      content_type: 'product_group',
      content_name: 'تطبيقات أكرم مصطفى',
      content_category: 'Software Apps',
      contents: [
        { id: 'app-linkcall',    quantity: 1, item_price: 0 },
        { id: 'app-almodif',     quantity: 1, item_price: 0 },
        { id: 'app-remostore',   quantity: 1, item_price: 0 },
        { id: 'app-dentasmart',  quantity: 1, item_price: 0 }
      ]
    });
  }

  // — صفحة Link Call —
  if (path.includes('linkcall')) {
    fbq('track', 'ViewContent', {
      content_ids: ['app-linkcall'],
      content_name: 'Link Call — منصة كول سنتر',
      content_type: 'product',
      content_category: 'Business Software',
      value: 0, currency: 'EGP'
    });
  }

  // — صفحة المضيف سمارت —
  if (path.includes('almodif') || path.includes('hotel')) {
    fbq('track', 'ViewContent', {
      content_ids: ['app-almodif'],
      content_name: 'المضيف سمارت — إدارة فنادق',
      content_type: 'product',
      content_category: 'Business Software',
      value: 0, currency: 'EGP'
    });
  }

  // — صفحة ريمو ستور —
  if (path.includes('remostore') || path.includes('store')) {
    fbq('track', 'ViewContent', {
      content_ids: ['app-remostore'],
      content_name: 'ريمو ستور',
      content_type: 'product',
      content_category: 'E-Commerce Software',
      value: 0, currency: 'EGP'
    });
  }

  // — صفحة Payment —
  if (path.includes('payment')) {
    var params = new URLSearchParams(window.location.search);
    var appName = params.get('app') || 'تطبيق';
    fbq('track', 'InitiateCheckout', {
      content_name: appName,
      content_type: 'product',
      currency: 'EGP'
    });
  }

  // — صفحة التسويق بالذكاء الاصطناعي —
  if (path.includes('ai-marketing')) {
    fbq('track', 'ViewContent', {
      content_ids: ['course-ai-marketing'],
      content_name: 'كورس التسويق بالذكاء الاصطناعي',
      content_type: 'product',
      content_category: 'Online Course',
      value: 597, currency: 'EGP'
    });
  }

  // — صفحات الكورسات العامة —
  if (path.includes('courses/') || path.includes('courses.html')) {
    fbq('track', 'ViewContent', {
      content_type: 'product_group',
      content_name: 'كورسات أكرم مصطفى',
      content_category: 'Online Courses'
    });
  }

  // — صفحة التسجيل / إنشاء حساب —
  if (path.includes('register')) {
    fbq('track', 'Lead');
  }

  // — صفحة تسجيل الدخول —
  if (path.includes('login')) {
    fbq('track', 'CompleteRegistration');
  }

})();
