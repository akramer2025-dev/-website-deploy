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

  /**
   * يُستدعى من صفحة المنتج
   * @param {string} key - مفتاح المنتج مثل 'linkcall'
   * @param {string} alt - النص البديل للصورة
   */
  window.loadProductImages = function(key, alt){
    var mainEl = document.getElementById('mainImage');
    var thumbsEl = document.getElementById('thumbnails');
    if(!mainEl || !thumbsEl) return;

    // عرض فوري من localStorage (cache)
    try{
      var cached = JSON.parse(localStorage.getItem('am_portfolio_imgs')||'{}');
      if(cached[key] && cached[key].length) renderImgs(cached[key], mainEl, thumbsEl, alt);
    }catch(e){}

    // تحديث من Firestore (المصدر الحقيقي)
    try{
      getDb().collection('admin_data').doc('portfolio').get().then(function(snap){
        if(!snap.exists) return;
        var data = snap.data().data || {};
        // حفّظ في cache
        try{ localStorage.setItem('am_portfolio_imgs', JSON.stringify(data)); }catch(e){}
        var imgs = data[key] || [];
        renderImgs(imgs, mainEl, thumbsEl, alt);
      }).catch(function(e){ console.warn('portfolio-loader:', e); });
    }catch(e){ console.warn('portfolio-loader init:', e); }
  };
})();
