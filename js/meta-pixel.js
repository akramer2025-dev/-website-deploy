/**
 * =====================================================
 *  Meta Pixel + Catalog Integration
 *  الموقع: akrammostafa.com
 *  الكتالوج: https://www.akrammostafa.com/catalog-feed.xml
 * =====================================================
 *
 *  -- لتفعيل الـ Pixel:
 *  استبدل PIXEL_ID_HERE برقم الـ Pixel من Events Manager
 *
 *  -- لربط الكتالوج في Meta Business Manager:
 *  Commerce Manager > Catalog > Data Sources > Data Feed
 *  ادخل: https://www.akrammostafa.com/catalog-feed.xml
 *
 *  -- مفاتيح المنتجات (يجب ان تطابق ids في catalog-feed.xml):
 *  التطبيقات:  linkcall | almodif | remostore | dentasmart | hotel-crm | missrim
 *  الكورسات:   course-ai | course-facebook | course-instagram | course-tiktok
 *              course-snapchat | course-twitter | course-strategy
 * =====================================================
 */

;(function () {
  'use strict';

  /* ------------------- 0. CONFIG ------------------- */

  var PIXEL_ID = 'PIXEL_ID_HERE';

  var CATALOG = {
    /* apps */
    linkcall:      { id:'linkcall',        name:'Link Call  منصة كول سنتر ذكية',              category:'Business Software',    price:1500, currency:'EGP', urlPattern:/\/products\/linkcall/ },
    almodif:       { id:'almodif',         name:'المضيف سمارت  نظام ادارة الفنادق',            category:'Hospitality Software', price:2000, currency:'EGP', urlPattern:/\/products\/almodif/ },
    remostore:     { id:'remostore',       name:'ريمو ستور  متجر الكتروني احترافي',            category:'E-Commerce Software',  price:1800, currency:'EGP', urlPattern:/\/products\/remostore/ },
    dentasmart:    { id:'dentasmart',      name:'Denta Smart  نظام ادارة عيادات الاسنان',     category:'Medical Software',     price:1200, currency:'EGP', urlPattern:/\/products\/dentasmart/ },
    'hotel-crm':   { id:'hotel-crm',       name:'نظام CRM الفنادق',                             category:'CRM Software',         price:2500, currency:'EGP', urlPattern:/\/products\/hotel-crm/ },
    missrim:       { id:'missrim',         name:'محل ميس ريم  موقع ملابس واكسسوارات',          category:'E-Commerce Software',  price:1000, currency:'EGP', urlPattern:/\/products\/missrim/ },
    /* courses */
    'course-ai':       { id:'course-ai',       name:'كورس التسويق بالذكاء الاصطناعي',           category:'Online Course', price:597, currency:'EGP', urlPattern:/\/courses\/ai-marketing/ },
    'course-facebook': { id:'course-facebook', name:'كورس اعلانات فيسبوك الاحترافي',            category:'Online Course', price:497, currency:'EGP', urlPattern:/\/courses\/facebook-ads/ },
    'course-instagram':{ id:'course-instagram',name:'كورس اعلانات انستجرام',                    category:'Online Course', price:397, currency:'EGP', urlPattern:/\/courses\/instagram/ },
    'course-tiktok':   { id:'course-tiktok',   name:'كورس تيك توك للاعمال والاعلانات',          category:'Online Course', price:397, currency:'EGP', urlPattern:/\/courses\/tiktok/ },
    'course-snapchat': { id:'course-snapchat', name:'كورس اعلانات سناب شات',                    category:'Online Course', price:397, currency:'EGP', urlPattern:/\/courses\/snapchat/ },
    'course-twitter':  { id:'course-twitter',  name:'كورس تويتر X للتسويق والاعلانات',          category:'Online Course', price:297, currency:'EGP', urlPattern:/\/courses\/twitter/ },
    'course-strategy': { id:'course-strategy', name:'كورس الاستراتيجية التسويقية المتكاملة',    category:'Online Course', price:797, currency:'EGP', urlPattern:/\/courses\/integrated-strategy/ }
  };

  /* ------------------- 1. INIT PIXEL ------------------- */

  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  document.addEventListener('DOMContentLoaded', function () {
    var ns = document.createElement('noscript');
    var img = document.createElement('img');
    img.height=1;img.width=1;img.style.cssText='display:none';
    img.src='https://www.facebook.com/tr?id='+PIXEL_ID+'&ev=PageView&noscript=1';
    ns.appendChild(img);
    if(document.body) document.body.appendChild(ns);
  });

  /* ------------------- 2. HELPERS ------------------- */

  function fire(event, params) {
    if(typeof fbq==='function') fbq('track', event, params||{});
  }

  function findProduct(path) {
    for(var key in CATALOG){
      if(CATALOG[key].urlPattern.test(path)) return CATALOG[key];
    }
    return null;
  }

  function getById(id){ return CATALOG[id]||null; }

  /* ------------------- 3. GLOBAL API ------------------- */
  /*
   * fbAddToCart('linkcall')          -- لما حد يضغط زر "شراء"
   * fbPurchase('course-ai', 597)    -- لما الدفع ينجح
   * fbLead({content_name:'...'})    -- لما حد يبعت رسالة/استفسار
   * fbTrack('Event', {...})         -- اي حدث مخصص
   */
  window.fbAddToCart = function(productId, overridePrice){
    var p=getById(productId); if(!p) return;
    fire('AddToCart',{ content_ids:[p.id], content_name:p.name, content_type:'product',
      value: overridePrice!==undefined?overridePrice:p.price, currency:p.currency });
  };

  window.fbPurchase = function(productId, paidValue){
    var p=getById(productId); if(!p) return;
    fire('Purchase',{ content_ids:[p.id], content_name:p.name, content_type:'product',
      value: paidValue!==undefined?paidValue:p.price, currency:p.currency });
  };

  window.fbLead  = function(params){ fire('Lead', params||{}); };
  window.fbTrack = function(ev,params){ fire(ev, params); };

  /* ------------------- 4. AUTO PAGE EVENTS ------------------- */

  var path   = window.location.pathname;
  var search = new URLSearchParams(window.location.search);

  /* صفحة منتج/كورس منفردة */
  var current = findProduct(path);
  if(current){
    fire('ViewContent',{
      content_ids:[current.id], content_name:current.name,
      content_type:'product',   content_category:current.category,
      value:current.price,      currency:current.currency
    });
  }

  /* صفحة المتجر */
  if(/\/store(\.html)?$/.test(path)){
    var apps=['linkcall','almodif','remostore','dentasmart','hotel-crm','missrim'];
    fire('ViewContent',{
      content_type:'product_group', content_name:'تطبيقات اكرم مصطفى',
      contents: apps.map(function(id){ var p=CATALOG[id]; return{id:p.id,quantity:1,item_price:p.price}; }),
      currency:'EGP'
    });
  }

  /* صفحة الكورسات */
  if(/\/courses(\.html)?$/.test(path)){
    var courses=['course-ai','course-facebook','course-instagram','course-tiktok','course-snapchat','course-twitter','course-strategy'];
    fire('ViewContent',{
      content_type:'product_group', content_name:'كورسات التسويق الرقمي',
      contents: courses.map(function(id){ var c=CATALOG[id]; return{id:c.id,quantity:1,item_price:c.price}; }),
      currency:'EGP'
    });
  }

  /* صفحة الدفع */
  if(/\/payment(\.html)?/.test(path)){
    var appId=search.get('app');
    var product=appId?getById(appId):null;
    fire('InitiateCheckout',{
      content_ids:  product?[product.id]:[],
      content_name: product?product.name:'منتج اكرم مصطفى',
      content_type: 'product',
      value:        product?product.price:0,
      currency:     'EGP', num_items:1
    });
  }

  /* باقي الصفحات */
  if(/\/register(\.html)?/.test(path))    fire('Lead',{ content_name:'تسجيل حساب جديد' });
  if(/\/login(\.html)?/.test(path))       fire('CompleteRegistration',{ status:'login' });
  if(/\/contact(\.html)?/.test(path))     fire('Contact');
  if(/\/akram-mostafa|\/about/.test(path)) fire('ViewContent',{ content_name:'اكرم مصطفى  السيرة الذاتية', content_type:'website' });

})();