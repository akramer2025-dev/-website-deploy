/**
 * portfolio-loader.js
 * يجلب صور المنتجات من Firestore ويعرضها في صفحات المنتجات
 * يستخدم localStorage كـ cache للعرض السريع أثناء تحميل Firestore
 */
(function(){
  const FB_CONFIG = {
    apiKey: "AIzaSyB9rVI5Fn96Mhm6x6aVcKrf8_epQ_c9H4s",
    authDomain: "akramplatform-2c6be.firebaseapp.com",
    projectId: "akramplatform-2c6be",
    storageBucket: "akramplatform-2c6be.firebasestorage.app",
    messagingSenderId: "132959399686",
    appId: "1:132959399686:web:7f1db74b25bebe27a8f887"
  };

  function getDb(){
    try{ return firebase.firestore(firebase.app('pf_reader')); }
    catch(e){ return firebase.firestore(firebase.initializeApp(FB_CONFIG,'pf_reader')); }
  }

  function renderImgs(imgs, mainEl, thumbsEl, alt){
    if(!imgs || !imgs.length) return;
    mainEl.innerHTML = '<img src="'+imgs[0]+'" alt="'+alt+'">';
    thumbsEl.innerHTML = imgs.map(function(img,i){
      return '<div class="product-thumbnail '+(i===0?'active':'')+'" onclick="changeImage(\''+img+'\',this)"><img src="'+img+'" alt=""></div>';
    }).join('');
  }

  function renderScreenshots(imgs, gridEl){
    if(!imgs || !imgs.length || !gridEl) return;
    gridEl.innerHTML = imgs.map(function(img,i){
      return '<div class="screenshot-card" data-aos="zoom-in" data-aos-delay="'+(i*80)+'">'
        +'<img src="'+img+'" alt="صورة '+(i+1)+'" loading="lazy">'
        +'<div class="screenshot-title">صورة '+(i+1)+'</div>'
        +'</div>';
    }).join('');
    if(typeof AOS !== 'undefined') AOS.refresh();
  }

  /**
   * يُستدعى من صفحة المنتج
   * @param {string} key - مفتاح المنتج مثل 'linkcall'
   * @param {string} alt - النص البديل للصورة
   */
  window.loadProductImages = function(key, alt){
    var mainEl = document.getElementById('mainImage');
    var thumbsEl = document.getElementById('thumbnails');
    var screenshotsEl = document.getElementById('screenshotsGrid');

    // عرض فوري من localStorage (cache)
    try{
      var cached = JSON.parse(localStorage.getItem('am_portfolio_imgs')||'{}');
      if(cached[key] && cached[key].length){
        if(mainEl && thumbsEl) renderImgs(cached[key], mainEl, thumbsEl, alt);
        renderScreenshots(cached[key], screenshotsEl);
      }
    }catch(e){}

    // تحديث من Firestore (المصدر الحقيقي)
    try{
      getDb().collection('admin_data').doc('portfolio').get().then(function(snap){
        if(!snap.exists) return;
        var data = snap.data().data || {};
        // حفّظ في cache
        try{ localStorage.setItem('am_portfolio_imgs', JSON.stringify(data)); }catch(e){}
        var imgs = data[key] || [];
        if(mainEl && thumbsEl) renderImgs(imgs, mainEl, thumbsEl, alt);
        renderScreenshots(imgs, screenshotsEl);
      }).catch(function(e){ console.warn('portfolio-loader:', e); });
    }catch(e){ console.warn('portfolio-loader init:', e); }
  };
})();
