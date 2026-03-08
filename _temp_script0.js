
const ADMIN_USER = 'akram';
const ADMIN_PASS = 'Aazxc';
const ADMIN_PASS_KEY = 'am_admin_pass';
const USERS_KEY = 'am_users';
const PORTFOLIO_KEY = 'am_portfolio_imgs';
const APP_PRICES_KEY = 'am_app_prices';

// تطبيقات الويب
const WEB_APPS = {
  'almodif':   { name:'منصة فندق',      icon:'fas fa-hotel',       color:'linear-gradient(135deg,#667eea,#764ba2)' },
  'remostore': { name:'متجر ريمو',          icon:'fas fa-shopping-bag', color:'linear-gradient(135deg,#a855f7,#6d28d9)' },
  'hotel-crm': { name:'نظام CRM للفنادق',  icon:'fas fa-building',     color:'linear-gradient(135deg,#10b981,#059669)' },
  'linkcall':  { name:'Link Call',           icon:'fas fa-headset',      color:'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  'missrim':   { name:'متجر مس ريم',        icon:'fas fa-store-alt',    color:'linear-gradient(135deg,#f43f5e,#e11d48)' },
  'dentasmart':{ name:'Denta Smart',         icon:'fas fa-tooth',        color:'linear-gradient(135deg,#06b6d4,#0284c7)' }
};

// تطبيقات الموبايل
const MOBILE_APPS = {
  'taskmaster':  { name:'مدير المهام',      icon:'fas fa-tasks',       color:'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  'fittrack':    { name:'تتبع اللياقة',         icon:'fas fa-heartbeat',   color:'linear-gradient(135deg,#ef4444,#dc2626)' },
  'quickscan':   { name:'مسح سريع',        icon:'fas fa-qrcode',      color:'linear-gradient(135deg,#10b981,#059669)' },
  'smartnotes':  { name:'ملاحظات ذكية',       icon:'fas fa-sticky-note', color:'linear-gradient(135deg,#f59e0b,#d97706)' },
  'prayertime':  { name:'مواقيت الصلاة',    icon:'fas fa-mosque',      color:'linear-gradient(135deg,#14b8a6,#0d9488)' },
  'moneywise':   { name:'مدير المال',        icon:'fas fa-wallet',      color:'linear-gradient(135deg,#6366f1,#4f46e5)' }
};

// آخر المستخدمين المضافين
const ALL_APPS = {...WEB_APPS, ...MOBILE_APPS};

// ── Firebase in-memory caches (كل البيانات بتتحمل من الكلاود عند الدخول)
let _fsUsers = null, _fsAppPrices = null, _fsRecLecs = null;
let _fsLectures = null, _fsLiveSessions = null;

function getUsers(){ return _fsUsers!==null ? _fsUsers.slice() : (()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]');}catch(e){return [];}})(); }
function saveUsers(arr){
  _fsUsers = arr.slice();
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  _fdb.collection('admin_data').doc('users').set({data:arr,updatedAt:Date.now()}).catch(e=>console.warn('FS users',e));
}
let _fsPortfolio = null;
let _fsPortfolioSavedAt = 0; // timestamp of last LOCAL save (to detect race conditions)
function getPortfolio(){ return _fsPortfolio!==null ? Object.assign({},_fsPortfolio) : (()=>{try{return JSON.parse(localStorage.getItem(PORTFOLIO_KEY)||'{}')||{};}catch(e){return {};}})(); }
function savePortfolio(p){
  // تنظيف البيانات: إزالة أي قيمة غير صالحة (File object أو blob URL أو غير ذلك)
  const cleaned = {};
  Object.keys(p).forEach(key => {
    const arr = p[key];
    if (Array.isArray(arr)) {
      cleaned[key] = arr.filter(v =>
        typeof v === 'string' &&
        (v.startsWith('data:image') || v.startsWith('http'))
      );
    }
  });
  p = cleaned;
  _fsPortfolio = Object.assign({}, p);
  _fsPortfolioSavedAt = Date.now();
  
  // فحص حجم البيانات
  const jsonStr = JSON.stringify(p);
  const sizeInMB = (jsonStr.length / (1024 * 1024)).toFixed(2);
  console.log('Portfolio size:', sizeInMB, 'MB');
  
  // تحذير إذا اقترب من الحد (1MB limit لـ Firestore)
  if(jsonStr.length > 900 * 1024){
    toast('⚠️ حجم البيانات كبير (' + sizeInMB + 'MB). قد يفشل الحفظ. احذف بعض الصور.', 'warning', 5000);
  }
  
  // Don't save to localStorage if data is too large (> 4MB)
  try {
    if (jsonStr.length < 4 * 1024 * 1024) {
      localStorage.setItem(PORTFOLIO_KEY, jsonStr);
    } else {
      console.warn('Portfolio data too large for localStorage, saving to Firestore only');
      localStorage.removeItem(PORTFOLIO_KEY);
    }
  } catch(e) {
    console.warn('localStorage quota exceeded, using Firestore only:', e);
    localStorage.removeItem(PORTFOLIO_KEY);
  }
  
  // حفظ في Firestore مع معالجة خطأ الحجم
  _fdb.collection('admin_data').doc('portfolio').set({data:p,updatedAt:Date.now()})
    .catch(e => {
      console.error('Firestore save failed:', e);
      if(e.code === 'invalid-argument' || e.message.includes('exceeds the maximum allowed size')){
        toast('❌ فشل الحفظ: حجم البيانات أكبر من 1MB! احذف بعض الصور أو استخدم روابط URL.', 'error', 8000);
      } else {
        toast('❌ فشل الحفظ في Firestore: ' + e.message, 'error');
      }
    });
}
function getAdminPass(){ return ADMIN_PASS; }
function getAppPrices(){ return _fsAppPrices!==null ? Object.assign({},_fsAppPrices) : (()=>{try{return JSON.parse(localStorage.getItem(APP_PRICES_KEY))||{};}catch(e){return {};}})(); }
function saveAppPrices(obj){
  _fsAppPrices = Object.assign({},obj);
  localStorage.setItem(APP_PRICES_KEY, JSON.stringify(obj));
  _fdb.collection('admin_data').doc('app_prices').set({data:obj,updatedAt:Date.now()}).catch(e=>console.warn('FS prices',e));
}
function genId(){ return Date.now().toString(36)+Math.random().toString(36).substr(2,6); }

/* ══════════════════════════════════════════════
   FIREBASE FIRESTORE SYNC
══════════════════════════════════════════════ */
const _fbAdmin = firebase.initializeApp({
  apiKey: "AIzaSyB9rVI5Fn96Mhm6x6aVcKrf8_epQ_c9H4s",
  authDomain: "akramplatform-2c6be.firebaseapp.com",
  projectId: "akramplatform-2c6be",
  storageBucket: "akramplatform-2c6be.appspot.com",
  messagingSenderId: "132959399686",
  appId: "1:132959399686:web:7f1db74b25bebe27a8f887"
}, 'admin');
const _fdb = firebase.firestore(_fbAdmin);
const _fst = firebase.storage(_fbAdmin);

// Initialize Supabase Client for Employee System
const { createClient } = supabase;
const _supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);
console.log('✅ Supabase client initialized for admin');

// join_requests in-memory cache + real-time listener
let _fsReqs = [];
let _fsEmployees = [];
let _fsUnsubscribe = null;

// Load all admin collections from Firestore on login
async function _loadAdminData(){
  const cols = ['users','app_prices','recorded_lectures','live_sessions','portfolio'];
  try {
    // Load admin docs + lectures collection in parallel
    const [snaps, lecsSnap] = await Promise.all([
      Promise.all(cols.map(d=>_fdb.collection('admin_data').doc(d).get())),
      _fdb.collection('lectures').get()
    ]);
    snaps.forEach((snap,i)=>{
      if(!snap.exists) return;
      const d = snap.data().data;
      if(i===0){ _fsUsers = Array.isArray(d)?d:[]; localStorage.setItem(USERS_KEY, JSON.stringify(_fsUsers)); }
      if(i===1){ _fsAppPrices = d||{}; localStorage.setItem(APP_PRICES_KEY, JSON.stringify(_fsAppPrices)); }
      if(i===2){ _fsRecLecs = Array.isArray(d)?d:[]; localStorage.setItem(REC_LECS_KEY, JSON.stringify(_fsRecLecs)); }
      if(i===3){ _fsLiveSessions = Array.isArray(d)?d:[]; localStorage.setItem('am_live_sessions', JSON.stringify(_fsLiveSessions)); }
      if(i===4){
        // لا تكتب فوق بيانات محلية حديثة (تجنب race condition)
        const fsUpdatedAt = (snap.data().updatedAt) || 0;
        if(_fsPortfolioSavedAt === 0 || fsUpdatedAt >= _fsPortfolioSavedAt) {
          _fsPortfolio = d||{};
          try{ localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(_fsPortfolio)); }catch(e){}
        }
      }
    });
    // Rebuild lectures object from individual docs (avoids 1MB Firestore limit)
    const lecturesObj = {};
    lecsSnap.forEach(doc=>{
      const data = doc.data();
      const ck = data.courseKey;
      if(ck){
        if(!lecturesObj[ck]) lecturesObj[ck] = [];
        const {courseKey:_ck, savedAt:_sa, ...lecData} = data;
        lecturesObj[ck].push(lecData);
      }
    });
    // If lectures collection is empty, try to migrate from old admin_data/lectures doc
    if(lecsSnap.empty){
      try{
        const oldDoc = await _fdb.collection('admin_data').doc('lectures').get();
        if(oldDoc.exists){
          const oldData = oldDoc.data().data||{};
          Object.entries(oldData).forEach(([ck, lecs])=>{
            if(!lecturesObj[ck]) lecturesObj[ck] = [];
            (lecs||[]).forEach(lec=>{
              if(!lec.id) return;
              lecturesObj[ck].push(lec);
              // migrate to new structure
              _fdb.collection('lectures').doc(lec.id).set({...lec, courseKey:ck, savedAt:Date.now()}).catch(()=>{});
            });
          });
          console.log('✅ Migrated lectures from old format');
        }
      }catch(e){ console.warn('Migration attempt failed:', e); }
    }
    // Sort each course lectures by createdAt
    Object.keys(lecturesObj).forEach(ck=>{
      lecturesObj[ck].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    });
    _fsLectures = lecturesObj;
    try{ localStorage.setItem(LECTURES_KEY, JSON.stringify(lecturesObj)); }catch(e){}
    renderDashboard(); renderWebPrices(); renderMobilePrices();
    renderUsers('employee'); renderUsers('student');
    renderRecordedLectures(); updateBadges();
    try{ renderLiveSessions(); }catch(e){}
    // seed default lectures if free course is empty
    try{ seedFreeLectures(); }catch(e){}
  } catch(err){ console.warn('Firebase _loadAdminData failed:', err); }
}

function initFirestore(){
  if(_fsUnsubscribe) _fsUnsubscribe();
  _loadAdminData();
  const jrEl = document.getElementById('joinRequestsList');
  if(jrEl) jrEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem"></i><br><br>جاري تحميل البيانات...</div>';
  _fsUnsubscribe = _fdb.collection('join_requests')
    .onSnapshot(snapshot=>{
      const _prevPending = _fsReqs.filter(r=>r.status==='pending').length;
      const _isFirstLoad = (_fsReqs.length === 0);
      _fsReqs = [];
      snapshot.forEach(doc=>{ _fsReqs.push(doc.data()); });
      // ترتيب client-side بدل orderBy (لا يحتاج index)
      _fsReqs.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
      const _newPending = _fsReqs.filter(r=>r.status==='pending').length;
      if (!_isFirstLoad && _newPending > _prevPending) {
        toast('🔔 طلب انضمام جديد! تحقق من قسم طلبات الانضمام', 'info');
      }
      renderJoinRequests(_currentReqFilter||'all');
      updateBadges();
    }, err=>{
      console.warn('Firestore snapshot error:', err);
      try{ _fsReqs = JSON.parse(localStorage.getItem(JOIN_KEY)||'[]'); }catch(e){ _fsReqs=[]; }
      renderJoinRequests(_currentReqFilter||'all');
      updateBadges();
    });
}

function genStudentId(){
  const users = getUsers().filter(u=>u.type==='student');
  let max = 0;
  users.forEach(u=>{
    const m = String(u.id||'').match(/^STU-(\d+)$/);
    if(m) max = Math.max(max, parseInt(m[1]));
  });
  return 'STU-'+String(max+1).padStart(3,'0');
}

function doAdminLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const err=document.getElementById('loginErr');
  if(u.toLowerCase()===ADMIN_USER.toLowerCase() && p===ADMIN_PASS){
    localStorage.setItem('am_admin_auth','1');
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('adminApp').style.display='block';
    try { initApp(); } catch(e) { console.error('initApp error:', e); }
  } else {
    err.classList.add('show');
    const box=document.querySelector('.login-box');
    box.style.transition='transform .08s';
    [8,-6,4,0].forEach((x,i)=>setTimeout(()=>box.style.transform=`translateX(${x}px)`,i*80));
  }
}
function doLogout(){
  localStorage.removeItem('am_admin_auth');
  localStorage.removeItem('akram_logged_in');
  localStorage.removeItem('akram_client_name');
  localStorage.removeItem('akram_username');
  sessionStorage.clear();
  document.getElementById('adminApp').style.display='none';
  document.getElementById('loginScreen').style.display='flex';
}
document.addEventListener('DOMContentLoaded',()=>{
  ['loginUser','loginPass'].forEach(id=>document.getElementById(id).addEventListener('keydown',e=>{if(e.key==='Enter')doAdminLogin();}));
  if(localStorage.getItem('am_admin_auth')==='1'){
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('adminApp').style.display='block';
    try { initApp(); } catch(e) { console.error('initApp error:', e); }
  }
});

/* ══════════════════════════════════════════════
   RECORDED LECTURES
══════════════════════════════════════════════ */
const REC_LECS_KEY = 'am_recorded_lectures';
function getRecordedLectures(){ return _fsRecLecs!==null ? _fsRecLecs.slice() : (()=>{try{return JSON.parse(localStorage.getItem(REC_LECS_KEY)||'[]');}catch(e){return [];}})(); }
function saveRecordedLectures(arr){
  _fsRecLecs = arr.slice();
  localStorage.setItem(REC_LECS_KEY, JSON.stringify(arr));
  _fdb.collection('admin_data').doc('recorded_lectures').set({data:arr,updatedAt:Date.now()}).catch(e=>console.warn('FS rec_lecs',e));
}

let _editingRecLecId = null;

function openAddRecordedLecture(){
  _editingRecLecId = null;
  ['rlTitle','rlUrl','rlDuration','rlDesc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('rlDate').value = new Date().toISOString().slice(0,10);
  document.getElementById('recLecModal').classList.add('open');
}

function saveRecordedLecture(){
  const title = document.getElementById('rlTitle').value.trim();
  const url   = document.getElementById('rlUrl').value.trim();
  const course= document.getElementById('rlCourse').value;
  const date  = document.getElementById('rlDate').value;
  const dur   = document.getElementById('rlDuration').value.trim();
  const desc  = document.getElementById('rlDesc').value.trim();
  if(!title||!url){ toast('العنوان والرابط مطلوبان','error'); return; }
  const recs = getRecordedLectures();
  if(_editingRecLecId){
    const idx = recs.findIndex(r=>r.id===_editingRecLecId);
    if(idx>-1) recs[idx]={...recs[idx],title,courseKey:course,date,videoUrl:url,duration:dur,description:desc,updatedAt:Date.now()};
  } else {
    recs.push({id:'rl_'+Date.now(), title, courseKey:course, date, videoUrl:url, duration:dur, description:desc, createdAt:Date.now()});
  }
  saveRecordedLectures(recs);
  document.getElementById('recLecModal').classList.remove('open');
  renderRecordedLectures();
  updateBadges();
  toast(_editingRecLecId?'تم التحديث':'تم إضافة المحاضرة ✓','success');
}

function editRecordedLecture(id){
  const r = getRecordedLectures().find(x=>x.id===id);
  if(!r) return;
  _editingRecLecId = id;
  document.getElementById('rlTitle').value = r.title||'';
  document.getElementById('rlCourse').value = r.courseKey||'free';
  document.getElementById('rlDate').value = r.date||'';
  document.getElementById('rlUrl').value = r.videoUrl||'';
  document.getElementById('rlDuration').value = r.duration||'';
  document.getElementById('rlDesc').value = r.description||'';
  document.getElementById('recLecModal').classList.add('open');
}

function deleteRecordedLecture(id){
  if(!confirm('حذف هذه المحاضرة المسجلة؟')) return;
  saveRecordedLectures(getRecordedLectures().filter(r=>r.id!==id));
  renderRecordedLectures();
  updateBadges();
  toast('تم الحذف','success');
}

function renderRecordedLectures(){
  const recs = getRecordedLectures().sort((a,b)=>b.createdAt-a.createdAt);
  const grid = document.getElementById('recLecsGrid');
  if(!grid) return;
  if(!recs.length){
    grid.innerHTML='<div class="req-empty"><i class="fas fa-video"></i><p>لا توجد محاضرات مسجلة بعد — أضف من زرار "إضافة يدوي" أو ارفع من داخل المحاضرة المباشرة</p></div>';
    return;
  }
  const CNAMES = {free:'مجاني',programming:'برمجة','facebook-ads':'فيسبوك',instagram:'إنستاجرام',tiktok:'تيك توك',snapchat:'سناب',twitter:'X/تويتر','integrated-strategy':'متكاملة','ai-marketing':'ذكاء اصطناعي'};
  grid.innerHTML = recs.map(r=>`
    <div class="req-card">
      <div class="req-card-top">
        <div class="req-avatar" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);font-size:.85rem"><i class="fas fa-video"></i></div>
        <div class="req-card-info">
          <div class="req-card-name">${r.title}</div>
          <div class="req-card-email"><i class="fas fa-book" style="margin-left:4px"></i>${CNAMES[r.courseKey]||r.courseKey} ${r.duration?'&bull; '+r.duration:''}</div>
          <div class="req-card-date"><i class="far fa-calendar"></i> ${r.date||'—'}</div>
        </div>
        ${r.description?`<div style="font-size:.75rem;color:var(--muted);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.description}</div>`:''}
      </div>
      <div class="req-card-actions">
        <a href="${r.videoUrl}" target="_blank" class="btn-approve"><i class="fas fa-play"></i> مشاهدة</a>
        <button class="btn-view-req" onclick="editRecordedLecture('${r.id}')"><i class="fas fa-edit"></i> تعديل</button>
        <button class="btn-view-req" style="color:#f87171;border-color:rgba(239,68,68,.3)" onclick="deleteRecordedLecture('${r.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function initApp(){ updateBadges(); renderDashboard(); renderPortfolio(); renderWebPrices(); renderMobilePrices(); renderUsers('employee'); renderUsers('student'); renderJoinRequests('all'); renderRecordedLectures(); renderEmployeeRequests(); initFirestore(); }

const JOIN_KEY = 'am_join_requests';
// ددالتي جلب وحفظ طلبات الانضمام — تستخدم كاش Firebase
function getJoinRequests(){ return _fsReqs.slice(); }
function saveJoinRequests(newArr){
  const newIds = new Set(newArr.map(r=>r.id));
  newArr.forEach(r=>{
    const old = _fsReqs.find(x=>x.id===r.id);
    if(!old || JSON.stringify(old)!==JSON.stringify(r)){
      _fdb.collection('join_requests').doc(r.id).set(r).catch(e=>console.warn('FS set err',e));
    }
  });
  _fsReqs.forEach(r=>{ if(!newIds.has(r.id)){ _fdb.collection('join_requests').doc(r.id).delete().catch(e=>console.warn('FS del err',e)); } });
  _fsReqs = newArr.slice();
}

function updateBadges(){
  const users=getUsers(); const emps=users.filter(u=>u.type==='employee'); const stus=users.filter(u=>u.type==='student');
  const portfolio=getPortfolio(); const totalImgs=Object.values(portfolio).reduce((s,imgs)=>s+(imgs||[]).length,0);
  const reqs=getJoinRequests(); const pending=reqs.filter(r=>r.status==='pending');
  document.getElementById('empCount').textContent=emps.length;
  document.getElementById('stuCount').textContent=stus.length;
  document.getElementById('portfolioImgCount').textContent=totalImgs;
  document.getElementById('pendingCount').textContent=pending.length;
  document.getElementById('dash-total').textContent=users.length;
  document.getElementById('dash-emp').textContent=emps.length;
  document.getElementById('dash-stu').textContent=stus.length;
  document.getElementById('dash-imgs').textContent=totalImgs;
  // update filter counts
  const rfAll=document.getElementById('rfAllCount'), rfP=document.getElementById('rfPendingCount'), rfA=document.getElementById('rfApprovedCount'), rfR=document.getElementById('rfRejectedCount');
  if(rfAll) rfAll.textContent=`(${reqs.length})`;
  if(rfP) rfP.textContent=`(${pending.length})`;
  if(rfA) rfA.textContent=`(${reqs.filter(r=>r.status==='approved').length})`;
  if(rfR) rfR.textContent=`(${reqs.filter(r=>r.status==='rejected').length})`;
  // employee requests badge
  const empReqEl = document.getElementById('empRequestCount');
  if(empReqEl){
    const empReqsSnapshot = _fsEmployees.filter(e=>e.applicationStatus==='pending');
    empReqEl.textContent = empReqsSnapshot.length;
  }
  // lectures badge
  const allLecs = getLectures();
  let totalLecs = 0; Object.values(allLecs).forEach(v=>{ totalLecs += v.length; });
  const lecsEl = document.getElementById('lecsCount'); if(lecsEl) lecsEl.textContent = totalLecs;
  const recLecsEl = document.getElementById('recLecsBadge'); if(recLecsEl) recLecsEl.textContent = getRecordedLectures().length;
}

function showSection(name){
  document.querySelectorAll('.adm-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.adm-nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('sec-'+name).classList.add('active');
  document.querySelectorAll('.adm-nav-item').forEach(item=>{
    if(item.getAttribute('onclick')&&item.getAttribute('onclick').includes("'"+name+"'")) item.classList.add('active');
  });
}

function renderDashboard(){
  const users=getUsers(); const recent=users.slice(-5).reverse(); const tbody=document.getElementById('recentUsersTable');
  if(!recent.length){ tbody.innerHTML='<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:20px;">لا يوجد مستخدمون بعد</td></tr>'; return; }
  tbody.innerHTML=recent.map(u=>`<tr><td><strong>${u.name}</strong></td><td><span class="user-type-badge ${u.type==='employee'?'emp':'stu'}">${u.type==='employee'?'موظف':'طالب'}</span></td><td style="color:var(--muted)">${new Date(u.createdAt).toLocaleDateString('ar-EG')}</td></tr>`).join('');
}

function renderPortfolio(){
  const portfolio=getPortfolio(); const grid=document.getElementById('portfolioProjectsGrid');
  grid.innerHTML=Object.entries(ALL_APPS).map(([key,p])=>{
    const imgs=portfolio[key]||[];
    return `<div class="project-img-card" id="proj-${key}">
      <div class="project-card-header"><div class="project-card-icon" style="background:${p.color}"><i class="${p.icon}"></i></div><div><h4>${p.name}</h4><small>${imgs.length} صورة <span class="img-count-badge" id="imgBadge-${key}">${imgs.length}</span></small></div></div>
      <div class="project-card-body">
        <div class="img-thumbs" id="thumbs-${key}">${renderThumbs(key,imgs)}</div>
        <div class="img-add-form"><input type="url" id="imgUrl-${key}" placeholder="رابط الصورة (https://...)"><button onclick="addProjectImage('${key}')"><i class="fas fa-plus"></i> إضافة</button></div>
      </div></div>`;
  }).join('');
}

function renderThumbs(key,imgs){
  if(!imgs.length) return '<span class="no-imgs">لا توجد صور، أضف صورة من أعلاه</span>';
  return imgs.map((url,i)=>`<div class="img-thumb"><img src="${url}" onerror="this.src='https://via.placeholder.com/70x55?text=Error'" onclick="openLb('${url}')"><button class="img-thumb-del" onclick="removeProjectImage('${key}',${i})"><i class="fas fa-times"></i></button></div>`).join('');
}

function addProjectImage(key){
  const input=document.getElementById('imgUrl-'+key); const url=input.value.trim();
  if(!url){toast('أدخل رابط الصورة','error');return;}
  if(!url.startsWith('http')){toast('الرابط يجب أن يبدأ بـ http','error');return;}
  const portfolio=getPortfolio(); if(!portfolio[key])portfolio[key]=[];
  portfolio[key].push(url); savePortfolio(portfolio);
  document.getElementById('thumbs-'+key).innerHTML=renderThumbs(key,portfolio[key]);
  document.getElementById('imgBadge-'+key).textContent=portfolio[key].length;
  input.value=''; updateBadges(); toast('تم إضافة الصورة بنجاح ✓','success');
}

function removeProjectImage(key,index){
  if(!confirm('هل تريد حذف هذه الصورة من المعرض؟'))return;
  const portfolio=getPortfolio(); portfolio[key].splice(index,1); savePortfolio(portfolio);
  document.getElementById('thumbs-'+key).innerHTML=renderThumbs(key,portfolio[key]);
  document.getElementById('imgBadge-'+key).textContent=portfolio[key].length;
  updateBadges(); toast('تم حذف الصورة بنجاح','success');
}

function renderWebPrices(){
  const prices=getAppPrices(); const portfolio=getPortfolio(); const grid=document.getElementById('webPricesGrid'); if(!grid)return;
  grid.innerHTML=Object.entries(WEB_APPS).map(([key,p])=>{
    const cp=prices[key]?prices[key]:'';
    const imgs=portfolio[key]||[];
    const mainImg=imgs[0]||'';
    return renderProductCard(key, p, cp, mainImg, imgs, 'web');
  }).join('');
  initDragDrop();
}

function renderMobilePrices(){
  const prices=getAppPrices(); const portfolio=getPortfolio(); const grid=document.getElementById('mobilePricesGrid'); if(!grid)return;
  grid.innerHTML=Object.entries(MOBILE_APPS).map(([key,p])=>{
    const cp=prices[key]?prices[key]:'';
    const imgs=portfolio[key]||[];
    const mainImg=imgs[0]||'';
    return renderProductCard(key, p, cp, mainImg, imgs, 'mobile');
  }).join('');
  initDragDrop();
}

function renderProductCard(key, p, price, mainImg, allImgs, type){
  const hasPrice = price && Number(price) > 0;
  const hasImg = mainImg && mainImg.length > 0;
  
  return `<div class="project-card" data-key="${key}" data-type="${type}">
    <div class="project-card-header">
      <div class="project-icon" style="background:${p.color}"><i class="${p.icon}"></i></div>
      <div>
        <h4>${p.name}</h4>
        <small style="color:var(--muted);">${type==='web'?'تطبيق ويب':'تطبيق موبايل'}</small>
      </div>
    </div>
    <div class="project-card-body">
      <!-- منطقة رفع صورة الغلاف -->
      <input type="file" id="fileInput-${key}" accept="image/*" style="display:none" onchange="handleFileSelect(event,'${key}','${type}')">
      <div class="product-img-zone ${hasImg?'has-img':''}" id="imgZone-${key}"
           ondragover="handleDragOver(event,'${key}')" 
           ondragleave="handleDragLeave(event,'${key}')"
           ondrop="handleDrop(event,'${key}')">
        ${hasImg ? `
          <img src="${mainImg}" class="product-preview" id="preview-${key}" onerror="this.style.display='none'">
          <div class="img-overlay">
            <button class="img-action-btn view" onclick="openLb('${mainImg}')" title="عرض"><i class="fas fa-eye"></i></button>
            <label class="img-action-btn change" for="fileInput-${key}" title="تغيير"><i class="fas fa-sync-alt"></i></label>
            <button class="img-action-btn delete" onclick="deleteMainImage('${key}','${type}')" title="حذف"><i class="fas fa-trash"></i></button>
          </div>
        ` : `
          <label for="fileInput-${key}" class="img-upload-label">
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <span class="upload-text">اسحب صورة هنا أو انقر للاختيار</span>
          </label>
        `}
      </div>
      
      <!-- معرض الصور الإضافية -->
      ${allImgs.length > 0 ? `
      <div class="gallery-section">
        <div class="gallery-label"><i class="fas fa-images"></i> الصور الإضافية (${allImgs.length})</div>
        <div class="gallery-thumbs">
          ${allImgs.map((img,i)=>`
            <div class="gallery-thumb" onclick="openLb('${img}')">
              <img src="${img}" onerror="this.src='https://via.placeholder.com/50x40?text=X'">
              <div class="thumb-del" onclick="event.stopPropagation();removeGalleryImage('${key}',${i},'${type}')"><i class="fas fa-times"></i></div>
            </div>
          `).join('')}
          <div class="gallery-add-btn" onclick="openGalleryModal('${key}','${type}')" title="إضافة صورة"><i class="fas fa-plus"></i></div>
        </div>
      </div>
      ` : `
      <div class="gallery-section">
        <div class="gallery-label"><i class="fas fa-images"></i> الصور الإضافية</div>
        <div class="gallery-thumbs">
          <div class="gallery-add-btn" onclick="openGalleryModal('${key}','${type}')" title="إضافة صورة"><i class="fas fa-plus"></i></div>
        </div>
      </div>
      `}
      
      <!-- خانة السعر -->
      <div class="price-row">
        <div class="price-input-wrap">
          <input type="number" id="price-${key}" value="${price}" placeholder="أدخل السعر..." min="0">
          <span class="currency">ج.م</span>
        </div>
        <button class="btn-save-product" onclick="saveProductData('${key}','${type}')">
          <i class="fas fa-save"></i> حفظ
        </button>
      </div>
      <div class="price-status ${hasPrice?'has-price':'no-price'}">
        <i class="fas ${hasPrice?'fa-check-circle':'fa-exclamation-circle'}"></i>
        ${hasPrice ? Number(price).toLocaleString('ar-EG')+' ج.م' : 'السعر: غير محدد'}
      </div>
    </div>
  </div>`;
}

// === IMAGE UPLOAD FUNCTIONS ===
function triggerImageUpload(key){
  document.getElementById('fileInput-'+key).click();
}

function handleDragOver(e, key){
  e.preventDefault(); e.stopPropagation();
  document.getElementById('imgZone-'+key).classList.add('dragover');
}

function handleDragLeave(e, key){
  e.preventDefault(); e.stopPropagation();
  document.getElementById('imgZone-'+key).classList.remove('dragover');
}

function handleDrop(e, key){
  e.preventDefault(); e.stopPropagation();
  const zone = document.getElementById('imgZone-'+key);
  zone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if(files.length > 0 && files[0].type.startsWith('image/')){
    processImageFile(files[0], key);
  }
}

function handleFileSelect(e, key, type){
  const file = e.target.files[0];
  if(file && file.type.startsWith('image/')){
    processImageFile(file, key);
  }
}

// ضغط الصورة لتقليل الحجم
function compressImage(file, maxWidth = 800, quality = 0.7){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e){
      const img = new Image();
      img.onload = function(){
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // تصغير الأبعاد مع الحفاظ على النسبة
        if(width > maxWidth){
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // تحويل لـ base64 مع ضغط الجودة
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function processImageFile(file, key){
  if(file.size > 5 * 1024 * 1024){
    toast('⚠️ حجم الصورة كبير جداً (أقصى 5MB)', 'error');
    return;
  }
  
  toast('جاري ضغط وحفظ الصورة...', 'info');
  
  // ضغط الصورة أولاً
  compressImage(file, 800, 0.7).then(compressedBase64 => {
    // تحديث الـ preview محلياً فوراً
    const previewEl = document.getElementById('preview-'+key);
    if(previewEl){ previewEl.src = compressedBase64; previewEl.style.display=''; }
    const zone = document.getElementById('imgZone-'+key);
    if(zone) zone.classList.add('has-img');
    
    // حفظ الصورة المضغوطة في Firestore
    saveProductImage(key, compressedBase64);
    toast('تم حفظ الصورة ✓', 'success');
  }).catch(err => {
    console.error('Compression failed:', err);
    toast('فشل ضغط الصورة. جرب صورة أصغر.', 'error');
  });
}

async function uploadAvatarFile(input){
  const file = input.files[0];
  if(!file) return;
  if(file.size > 5*1024*1024){ 
    toast('حجم الصورة أكبر من 5MB','error'); 
    return; 
  }
  
  toast('جاري ضغط الصورة...', 'info');
  
  // ضغط صورة الـ avatar
  compressImage(file, 400, 0.8).then(compressedBase64 => {
    document.getElementById('f-avatar').value = compressedBase64;
    document.getElementById('f-avatar-img').src = compressedBase64;
    document.getElementById('f-avatar-preview').style.display = 'block';
    toast('تم تحميل الصورة ✓','success');
  }).catch(err => {
    console.error('Avatar compression failed:', err);
    toast('فشل ضغط الصورة', 'error');
  });
}

function saveProductImage(key, imageData){
  const portfolio = getPortfolio();
  if(!portfolio[key]) portfolio[key] = [];
  
// إضافة الصورة في المقدمة (صورة الغلاف)
  portfolio[key].unshift(imageData);
  savePortfolio(portfolio);
  
  // تحديث العرض
  const card = document.querySelector(`[data-key="${key}"]`);
  if(card){
    const type = card.dataset.type;
    if(type === 'web') renderWebPrices();
    else renderMobilePrices();
  }
  
  updateBadges();
  toast('تم رفع صورة الغلاف بنجاح ✓', 'success');
}

function deleteMainImage(key, type){
if(!confirm('هل تريد حذف هذه الصورة؟')) return;
  
  const portfolio = getPortfolio();
  if(portfolio[key] && portfolio[key].length > 0){
    portfolio[key].shift(); // حذف صورة الغلاف
    savePortfolio(portfolio);
  }
  
  if(type === 'web') renderWebPrices();
  else renderMobilePrices();
  
  updateBadges();
  toast('تم الحذف بنجاح', 'success');
}

function removeGalleryImage(key, index, type){
  if(!confirm('هل تريد حذف هذه الصورة؟')) return;
  
  const portfolio = getPortfolio();
  if(portfolio[key]){
    portfolio[key].splice(index, 1);
    savePortfolio(portfolio);
  }
  
  if(type === 'web') renderWebPrices();
  else renderMobilePrices();
  
  updateBadges();
  toast('تم الحذف بنجاح', 'success');
}

// ======= JOIN REQUESTS FUNCTIONS =======
const COURSES_NAMES = {
  'free':'الكورس المجاني','facebook-ads':'إعلانات فيسبوك',
  'instagram':'إنستجرام','tiktok':'تيك توك','snapchat':'سناب شات',
  'twitter':'تويتر / X','ai-marketing':'ذكاء اصطناعي',
  'integrated-strategy':'استراتيجية متكاملة','programming':'البرمجة'
};

let _currentReqFilter = 'all';

function filterReqs(status){
  _currentReqFilter = status;
  ['All','Pending','Approved','Rejected'].forEach(s=>{
    document.getElementById('rf'+s).classList.remove('active');
  });
  document.getElementById('rf'+(status==='all'?'All':status.charAt(0).toUpperCase()+status.slice(1))).classList.add('active');
  renderJoinRequests(status);
}

function buildWaLink(phone, name){
  // normalise Egyptian number → international format
  let num = (phone||'').replace(/\D/g,'');
  if(num.startsWith('0')) num = '2' + num;  // 01xxxxxxxx → 201xxxxxxxx
  const msg = encodeURIComponent('السلام عليكم ورحمة الله وبركاته 🌟\n\nتم قبول طلب انضمامك للكورس بنجاح ✅\n\nخليك جاهز، أول يوم للكورس هيكون يوم 1 مارس 🗓️\n\nهنبعتلك كل التفاصيل قريباً إن شاء الله 💪');
  return 'https://wa.me/' + num + '?text=' + msg;
}

function renderJoinRequests(filter){
  _currentReqFilter = filter||'all';
  const reqs = getJoinRequests().sort((a,b)=>b.createdAt-a.createdAt);
  const filtered = filter==='all' ? reqs : reqs.filter(r=>r.status===filter);
  const grid = document.getElementById('reqCardsGrid'); if(!grid) return;
  if(!filtered.length){
    grid.innerHTML=`<div class="req-empty"><i class="fas fa-inbox"></i><p>لا توجد طلبات ${filter==='all'?'':filter==='pending'?'قيد الانتظار':filter==='approved'?'مقبولة':'مرفوضة'} بعد</p></div>`;
    return;
  }
  const statusLabel={'pending':'<span class="req-status-badge pending"><i class="fas fa-clock"></i> قيد المراجعة</span>','approved':'<span class="req-status-badge approved"><i class="fas fa-check"></i> مقبول</span>','rejected':'<span class="req-status-badge rejected"><i class="fas fa-times"></i> مرفوض</span>'};
  grid.innerHTML = filtered.map(r=>{
    const initial = r.name?r.name.trim().charAt(0).toUpperCase():'?';
    const dt = new Date(r.createdAt).toLocaleString('ar-EG',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    const courses = (r.courses||[]).map(c=>`<span class="req-course-tag">${COURSES_NAMES[c]||c}</span>`).join('');
    const payKeys = Object.keys(r.payments||{});
    return `<div class="req-card" id="rcard-${r.id}">
      <div class="req-card-top">
        <div class="req-avatar">${initial}</div>
        <div class="req-card-info">
          <div class="req-card-name">${r.name}</div>
          <div class="req-card-email">${r.email}</div>
          <div class="req-card-date"><i class="far fa-clock"></i> ${dt}</div>
        </div>
        ${statusLabel[r.status]||''}
      </div>
      <div class="req-card-body">
        <div class="req-card-meta">
          <span><i class="fas fa-phone"></i>${r.phone||'—'}</span>
          <span><i class="fas fa-briefcase"></i>${r.field||'—'}</span>
        </div>
        <div class="req-tags">${courses}</div>
        ${payKeys.length?`<div class="req-proofs">${payKeys.map(k=>`<div class="req-proof-thumb" onclick="openLb('${r.payments[k].substring(0,30)===r.payments[k].substring(0,30)?r.payments[k]:r.payments[k]}')"><img src="${r.payments[k]}" alt="إيصال"></div>`).join('')}</div>`:''}
      </div>
      ${r.status==='approved'?`<div class="req-approved-info"><i class="fas fa-check-circle"></i> تمت الموافقة بتاريخ ${new Date(r.reviewedAt).toLocaleDateString('ar-EG')} ${r.adminNote?'&bull; '+r.adminNote:''}</div>`:''}
      ${r.status==='rejected'?`<div class="req-rejected-info"><i class="fas fa-times-circle"></i> تم الرفض ${r.adminNote?'&bull; '+r.adminNote:''}</div>`:''}
      <div class="req-card-actions">
        ${r.status==='pending'?`
          <button class="btn-approve" onclick="approveReq('${r.id}')"><i class="fas fa-check"></i> قبول</button>
          <button class="btn-reject" onclick="rejectReq('${r.id}')"><i class="fas fa-times"></i> رفض</button>
        `:r.status==='approved'?`
          <a class="btn-whatsapp-notify" href="${buildWaLink(r.phone, r.name)}" target="_blank" rel="noopener">
            <i class="fab fa-whatsapp"></i> إرسال رسالة القبول
          </a>
          <button class="btn-reject" onclick="rejectReq('${r.id}')"><i class="fas fa-undo"></i> إلغاء القبول</button>
        `:r.status==='rejected'?`
          <button class="btn-approve" onclick="approveReq('${r.id}')"><i class="fas fa-redo"></i> قبول بدلاً</button>
        `:''
        }
        <button class="btn-view-req" onclick="viewReqDetail('${r.id}')"><i class="fas fa-eye"></i> تفاصيل</button>
        <button class="btn-view-req" style="color:#f87171;border-color:rgba(239,68,68,.3)" onclick="deleteReq('${r.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function approveReq(id){
  const reqs = getJoinRequests();
  const r = reqs.find(x=>x.id===id);
  if(!r) return;
  // create student user
  const users = getUsers();
  const exists = users.find(u=>u.username===r.username||u.email===r.email);
  if(exists && r.status!=='approved'){ toast('يوجد مستخدم بنفس البيانات مسبقاً','error'); return; }
  if(r.status!=='approved'){
    const newId = genStudentId();
    users.push({ id:newId, name:r.name, username:r.username, password:r.password, email:r.email, phone:r.phone, type:'student', level:'مبتدئ', courses:(r.courses||[]), field:r.field||'', createdAt:r.createdAt });
    saveUsers(users);
    r.approvedId = newId;
    setTimeout(()=>{
      alert('✅ تمت الموافقة على الطالب\n\n👤 الاسم: '+r.name+'\n🆔 الرقم التعريفي: '+newId+'\n👤 اسم المستخدم: '+(r.username||'—')+'\n🔒 كلمة المرور: '+(r.password||'—')+'\n\n📲 ابعت للطالب:\nالرقم التعريفي: '+newId+'\nاسم المستخدم: '+(r.username||'—')+'\nكلمة المرور: '+(r.password||'—')+'\n\n✔️ يدخل بـ اسم المستخدم أو الرقم التعريفي + كلمة المرور');
    },300);
  }
  r.status='approved'; r.reviewedAt=Date.now();
  saveJoinRequests(reqs);
  renderJoinRequests(_currentReqFilter);
  updateBadges();
  toast('تمت الموافقة وإضافة الطالب ✓','success');
}

function rejectReq(id){
  const note = prompt('سبب الرفض (اختياري):','');
  if(note===null) return;
  const reqs = getJoinRequests();
  const r = reqs.find(x=>x.id===id);
  if(r){
    // if was approved, remove from students
    if(r.status==='approved'){
      let users=getUsers();
      users=users.filter(u=>u.username!==r.username&&u.email!==r.email);
      saveUsers(users);
    }
    r.status='rejected'; r.reviewedAt=Date.now(); r.adminNote=note.trim();
    saveJoinRequests(reqs);
  }
  renderJoinRequests(_currentReqFilter);
  updateBadges();
  toast('تم رفض الطلب','success');
}

function deleteReq(id){
  if(!confirm('حذف هذا الطلب نهائياً؟')) return;
  let reqs=getJoinRequests().filter(r=>r.id!==id);
  saveJoinRequests(reqs);
  renderJoinRequests(_currentReqFilter);
  updateBadges();
  toast('تم الحذف','success');
}

function viewReqDetail(id){
  const r = getJoinRequests().find(x=>x.id===id);
  if(!r) return;
  const payEntries = Object.entries(r.payments||{});
  const statusLabel={'pending':'<span class="req-status-badge pending">قيد المراجعة</span>','approved':'<span class="req-status-badge approved">مقبول</span>','rejected':'<span class="req-status-badge rejected">مرفوض</span>'};
  document.getElementById('reqDetailContent').innerHTML=`
    <div class="rd-section">
      <div class="rd-section-title"><i class="fas fa-user"></i> بيانات شخصية</div>
      <div class="rd-row"><div class="rd-lbl">الاسم</div><div class="rd-val">${r.name}</div></div>
      <div class="rd-row"><div class="rd-lbl">البريد الإلكتروني</div><div class="rd-val">${r.email}</div></div>
      <div class="rd-row"><div class="rd-lbl">اسم المستخدم</div><div class="rd-val">${r.username}</div></div>
      <div class="rd-row"><div class="rd-lbl">كلمة المرور</div><div class="rd-val"><code style="background:var(--bg2);padding:2px 8px;border-radius:6px;font-size:.85rem">${r.password}</code></div></div>
      <div class="rd-row"><div class="rd-lbl">الهاتف</div><div class="rd-val">${r.phone||'—'}</div></div>
      <div class="rd-row"><div class="rd-lbl">المجال</div><div class="rd-val">${r.field||'—'}</div></div>
      <div class="rd-row"><div class="rd-lbl">الحالة</div><div class="rd-val">${statusLabel[r.status]||''}</div></div>
      ${r.notes?`<div class="rd-row"><div class="rd-lbl">ملاحظات</div><div class="rd-val">${r.notes}</div></div>`:''}
    </div>
    <div class="rd-section">
      <div class="rd-section-title"><i class="fas fa-graduation-cap"></i> الكورسات المختارة</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;padding-top:4px">${(r.courses||[]).map(c=>`<span class="summary-course-tag">${COURSES_NAMES[c]||c}</span>`).join('')}</div>
    </div>
    ${payEntries.length?`<div class="rd-section"><div class="rd-section-title"><i class="fas fa-receipt"></i> إيصالات السداد</div><div class="rd-proofs-grid">${payEntries.map(([k,v])=>`<div><div style="font-size:.72rem;color:var(--muted);margin-bottom:4px">${COURSES_NAMES[k]||k}</div><div class="rd-proof-img" onclick="openLb('${v}')"><img src="${v}" alt="إيصال"></div></div>`).join('')}</div></div>`:''}
    <div class="rd-section admin-note-area">
      <div class="rd-section-title"><i class="fas fa-comment-alt"></i> ملاحظة الأدمن</div>
      <textarea id="rdNote" placeholder="أضف ملاحظة اختيارية...">${r.adminNote||''}</textarea>
    </div>
  `;
  document.getElementById('reqDetailActions').innerHTML=`
    ${r.status==='pending'?
      `<button class="btn-modal-save" onclick="approveFromDetail('${r.id}')"><i class="fas fa-check"></i> موافقة</button>
       <button class="btn-modal-cancel" style="background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.3);color:#f87171" onclick="rejectFromDetail('${r.id}')"><i class="fas fa-times"></i> رفض</button>`
      :r.status==='rejected'?
      `<button class="btn-modal-save" onclick="approveFromDetail('${r.id}')"><i class="fas fa-check"></i> قبول بدلاً</button>`
      :`<button class="btn-modal-cancel" style="background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.3);color:#f87171" onclick="rejectFromDetail('${r.id}')"><i class="fas fa-undo"></i> إلغاء القبول</button>`
    }
    <button class="btn-modal-cancel" onclick="document.getElementById('reqDetailModal').classList.remove('open')"><i class="fas fa-times"></i> إغلاق</button>
  `;
  document.getElementById('reqDetailModal').classList.add('open');
}

function approveFromDetail(id){
  const note = document.getElementById('rdNote').value.trim();
  const reqs = getJoinRequests(); const r=reqs.find(x=>x.id===id);
  if(r && note){ r.adminNote=note; saveJoinRequests(reqs); }
  document.getElementById('reqDetailModal').classList.remove('open');
  approveReq(id);
}
function rejectFromDetail(id){
  const note = document.getElementById('rdNote').value.trim();
  const reqs = getJoinRequests(); const r=reqs.find(x=>x.id===id);
  if(r && note){ r.adminNote=note; saveJoinRequests(reqs); }
  document.getElementById('reqDetailModal').classList.remove('open');
  rejectReq(id);
}

// ======= JOIN REQUESTS FUNCTIONS END =======

// ======= GALLERY MODAL FUNCTIONS =======
let _galFiles = [];

function openGalleryModal(key, type){
  _galFiles = [];
  document.getElementById('galKey').value = key;
  document.getElementById('galType').value = type;
  document.getElementById('galFileInput').value = '';
  document.getElementById('galUrlInput').value = '';
  document.getElementById('galSelectedInfo').style.display = 'none';
  document.getElementById('galSelectedInfo').textContent = '';
  document.getElementById('galPreviewStrip').innerHTML = '';
  document.getElementById('galUrlPreview').style.display = 'none';
  document.getElementById('galDropZone').querySelector('.dz-text').textContent = 'اسحب الصور هنا أو انقر للاختيار';
  switchGalTab('file');
  document.getElementById('galleryModal').classList.add('open');
}

function closeGalleryModal(){
  document.getElementById('galleryModal').classList.remove('open');
  _galFiles = [];
}

function switchGalTab(tab){
  document.getElementById('galTabBtnFile').classList.toggle('active', tab==='file');
  document.getElementById('galTabBtnUrl').classList.toggle('active', tab==='url');
  document.getElementById('galPaneFile').classList.toggle('active', tab==='file');
  document.getElementById('galPaneUrl').classList.toggle('active', tab==='url');
}

function galDragOver(e){
  e.preventDefault();
  document.getElementById('galDropZone').classList.add('dragover');
}
function galDragLeave(e){
  document.getElementById('galDropZone').classList.remove('dragover');
}
function galDrop(e){
  e.preventDefault();
  document.getElementById('galDropZone').classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/'));
  if(files.length) galLoadFiles(files);
}
function galFilesSelected(e){
  const files = Array.from(e.target.files);
  if(files.length) galLoadFiles(files);
}
function galLoadFiles(files){
  _galFiles = files.slice(0, 15);
  const info = document.getElementById('galSelectedInfo');
  info.style.display = 'block';
  info.textContent = _galFiles.length === 1 ? 'تم اختيار صورة واحدة ✓' : `تم اختيار ${_galFiles.length} صور ✓`;
  document.getElementById('galDropZone').querySelector('.dz-text').textContent = _galFiles.length === 1 ? 'تم اختيار صورة واحدة' : `تم اختيار ${_galFiles.length} صور`;
  const strip = document.getElementById('galPreviewStrip');
  strip.innerHTML = '';
  _galFiles.slice(0,8).forEach((f,i)=>{
    const reader = new FileReader();
    reader.onload = function(e){
      const div = document.createElement('div');
      div.className = 'gal-preview-thumb';
      div.innerHTML = `<img src="${e.target.result}"><div class="rm" onclick="galRemoveFile(${i})"><i class="fas fa-times"></i></div>`;
      strip.appendChild(div);
    };
    reader.readAsDataURL(f);
  });
}
function galRemoveFile(i){
  _galFiles.splice(i,1);
  galLoadFiles(_galFiles);
}
function galPreviewUrl(){
  const url = document.getElementById('galUrlInput').value.trim();
  const pv = document.getElementById('galUrlPreview');
  if(url.startsWith('http')){
    document.getElementById('galUrlPreviewImg').src = url;
    pv.style.display = 'block';
  } else {
    pv.style.display = 'none';
  }
}

function submitGalleryImages(){
  const key = document.getElementById('galKey').value;
  const type = document.getElementById('galType').value;
  const activeTab = document.getElementById('galPaneFile').classList.contains('active') ? 'file' : 'url';

  if(activeTab === 'file'){
    if(!_galFiles.length){ toast('اختر صورة أولاً', 'error'); return; }
    const portfolio = getPortfolio();
    if(!portfolio[key]) portfolio[key] = [];
    
    // Warn if portfolio is getting large
    const currentSize = JSON.stringify(portfolio).length;
    if (currentSize > 3 * 1024 * 1024) {
      toast('⚠️ البيانات كبيرة جداً! استخدم روابط URL بدلاً من رفع ملفات', 'warning');
    }
    
    let loaded = 0, added = 0;
    const total = _galFiles.length;

    // ضغط الصورة بـ Canvas قبل الحفظ (max 900px, JPEG 0.72)
    function compressAndSave(file){
      const r = new FileReader();
      r.onload = function(ev){
        const img = new Image();
        img.onload = function(){
          const MAX = 900;
          let w = img.width, h = img.height;
          if(w > MAX || h > MAX){
            if(w >= h){ h = Math.round(h * MAX / w); w = MAX; }
            else{ w = Math.round(w * MAX / h); h = MAX; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          const sizKB = Math.round(compressed.length * 0.75 / 1024);
          console.log(`Compressed ${file.name}: ${sizKB}KB`);
          portfolio[key].push(compressed);
          loaded++; added++;
          if(loaded === total) finishGalSave(portfolio, key, type, added);
        };
        img.onerror = function(){
          // إذا فشل تحميل الصورة نضيف الـ base64 الأصلي
          portfolio[key].push(ev.target.result);
          loaded++; added++;
          if(loaded === total) finishGalSave(portfolio, key, type, added);
        };
        img.src = ev.target.result;
      };
      r.readAsDataURL(file);
    }

    _galFiles.forEach(file => {
      if(file.size > 15*1024*1024){
        toast(`الصورة "${file.name}" أكبر من 15MB – تم تخطيها`, 'error');
        loaded++;
        if(loaded===total) finishGalSave(portfolio, key, type, added);
        return;
      }
      compressAndSave(file);
    });
  } else {
    const url = document.getElementById('galUrlInput').value.trim();
    if(!url || !url.startsWith('http')){ toast('أدخل رابط صورة صحيح يبدأ بـ http', 'error'); return; }
    const portfolio = getPortfolio();
    if(!portfolio[key]) portfolio[key] = [];
    portfolio[key].push(url);
    savePortfolio(portfolio);
    if(type==='web') renderWebPrices(); else renderMobilePrices();
    updateBadges();
    closeGalleryModal();
    toast('تم إضافة الصورة بنجاح ✓', 'success');
  }
}

function finishGalSave(portfolio, key, type, count){
  savePortfolio(portfolio);
  if(type==='web') renderWebPrices(); else renderMobilePrices();
  updateBadges();
  closeGalleryModal();
  toast(count===1 ? 'تم إضافة الصورة بنجاح ✓' : `تم إضافة ${count} صور بنجاح ✓`, 'success');
}

function saveProductData(key, type){
  const val = document.getElementById('price-'+key).value.trim();
  const prices = getAppPrices();
  
  if(val === '' || isNaN(val) || Number(val) < 0){
    delete prices[key];
  } else {
    prices[key] = Number(val);
  }
  
  const apps = type === 'web' ? WEB_APPS : MOBILE_APPS;
  saveAppPrices(prices);
  
  if(type === 'web') renderWebPrices();
  else renderMobilePrices();
  
toast('تم حفظ بيانات ' + apps[key].name + ' بنجاح ✓', 'success');
}

function initDragDrop(){
  // تفعيل dragenter لمنع التأثيرات الافتراضية
  document.querySelectorAll('.product-img-zone').forEach(zone => {
    zone.addEventListener('dragenter', function(e){
      e.preventDefault();
    });
  });
}

function renderUsers(type){
  const users=getUsers().filter(u=>u.type===type);
  const grid=document.getElementById(type==='employee'?'employeesGrid':'studentsGrid');
  if(!users.length){const lbl=type==='employee'?'موظف':'طالب';grid.innerHTML=`<div class="no-users-msg" style="grid-column:1/-1"><div><i class="fas fa-${type==='employee'?'user-tie':'user-graduate'}"></i></div><p>لا يوجد ${lbl} بعد</p><button class="btn-add-user" onclick="openAddUser('${type}')" style="margin-top:14px;display:inline-flex;"><i class="fas fa-plus"></i> إضافة ${type==='employee'?'موظف':'طالب'}</button></div>`;return;}
  grid.innerHTML=users.map(u=>{
    const isEmp=u.type==='employee';
    const avatarBg=isEmp?'linear-gradient(135deg,#3b82f6,#6366f1)':'linear-gradient(135deg,#22c55e,#16a34a)';
    const initial=u.name?u.name.charAt(0):'?';
    const avatarHtml=u.avatar?`<img class="user-avatar" src="${u.avatar}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="user-avatar-placeholder" style="background:${avatarBg};display:none">${initial}</div>`:`<div class="user-avatar-placeholder" style="background:${avatarBg}">${initial}</div>`;
    const sub=isEmp?(u.role||'موظف'):(u.level?`المستوى: ${u.level}`:'طالب');
    return `<div class="user-card"><div class="user-card-header">${avatarHtml}<div><div class="user-card-name">${u.name}</div><div class="user-card-sub">${sub}</div></div></div>
      <div class="user-card-body"><div class="user-card-info">
        <div class="user-info-row"><i class="fas fa-at"></i><span>${u.username}</span></div>
        ${u.phone?`<div class="user-info-row"><i class="fas fa-phone"></i><span>${u.phone}</span></div>`:''}
        ${u.email?`<div class="user-info-row"><i class="fas fa-envelope"></i><span>${u.email}</span></div>`:''}
        ${isEmp&&u.department?`<div class="user-info-row"><i class="fas fa-building"></i><span>${u.department}</span></div>`:''}
        ${!isEmp&&u.id?`<div class="user-info-row" style="color:#fbbf24"><i class="fas fa-id-badge"></i><span>ID: <strong>${u.id}</strong></span></div>`:''}
        ${!isEmp&&u.courses?`<div class="user-info-row"><i class="fas fa-graduation-cap"></i><span>${Array.isArray(u.courses)?u.courses.map(c=>COURSES_NAMES[c]||c).join('، '):u.courses}</span></div>`:''}
      </div>
      <div class="user-card-actions">
        <button class="btn-sm btn-sm-primary" onclick="viewProfile('${u.id}')"><i class="fas fa-eye"></i> عرض</button>
        <button class="btn-sm btn-sm-outline" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i> تعديل</button>
        <button class="btn-sm btn-sm-danger" onclick="deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
      </div></div></div>`;
  }).join('');
}

function viewProfile(id){ window.open('../profile.html?id='+id,'_blank'); }

function openAddUser(type){
  ['f-name','f-username','f-password','f-phone','f-email','f-role','f-dept','f-courses','f-avatar','f-bio'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-avatar-preview').style.display='none';
  document.getElementById('f-avatar-file').value='';
  document.getElementById('f-level').value='مبتدئ';
  document.getElementById('f-editId').value=''; document.getElementById('f-type').value=type;
  const isEmp=type==='employee';
  document.getElementById('modalTitle').textContent=isEmp?'إضافة موظف جديد':'إضافة طالب جديد';
  document.getElementById('empFields').style.display=isEmp?'':'none';
  document.getElementById('stuFields').style.display=isEmp?'none':'';
  document.getElementById('userModal').classList.add('open');
}

function editUser(id){
  const user=getUsers().find(u=>u.id===id); if(!user)return;
  document.getElementById('f-name').value=user.name||''; document.getElementById('f-username').value=user.username||'';
  document.getElementById('f-password').value=user.password||''; document.getElementById('f-phone').value=user.phone||'';
  document.getElementById('f-email').value=user.email||''; document.getElementById('f-role').value=user.role||'';
  document.getElementById('f-dept').value=user.department||''; document.getElementById('f-courses').value=user.courses||'';
  document.getElementById('f-level').value=user.level||'مبتدئ'; document.getElementById('f-avatar').value=user.avatar||'';
  document.getElementById('f-bio').value=user.bio||''; document.getElementById('f-editId').value=id; document.getElementById('f-type').value=user.type;
  // عرض الصورة الحالية
  const prevBox = document.getElementById('f-avatar-preview');
  const prevImg = document.getElementById('f-avatar-img');
  if(user.avatar){ prevImg.src=user.avatar; prevBox.style.display='block'; } else { prevBox.style.display='none'; }
  const isEmp=user.type==='employee';
  document.getElementById('modalTitle').textContent=isEmp?'تعديل موظف':'تعديل طالب';
  document.getElementById('empFields').style.display=isEmp?'':'none';
  document.getElementById('stuFields').style.display=isEmp?'none':'';
  document.getElementById('userModal').classList.add('open');
}

function saveUser(){
  const name=document.getElementById('f-name').value.trim(); const username=document.getElementById('f-username').value.trim();
  const password=document.getElementById('f-password').value.trim(); const type=document.getElementById('f-type').value;
  const editId=document.getElementById('f-editId').value;
  if(!name){toast('الاسم مطلوب','error');return;}
  if(!username){toast('اسم المستخدم مطلوب','error');return;}
  if(!password&&!editId){toast('كلمة المرور مطلوبة','error');return;}
  const users=getUsers();
  const existing=users.find(u=>u.username===username&&u.id!==editId);
  if(existing){toast('اسم المستخدم موجود مسبقاً','error');return;}
  const userData={name,username,password:password||(users.find(u=>u.id===editId)||{}).password||'',type,
    phone:document.getElementById('f-phone').value.trim(),email:document.getElementById('f-email').value.trim(),
    bio:document.getElementById('f-bio').value.trim(),avatar:document.getElementById('f-avatar').value.trim(),
    role:document.getElementById('f-role').value.trim(),department:document.getElementById('f-dept').value.trim(),
    courses:document.getElementById('f-courses').value.trim(),level:document.getElementById('f-level').value};
  if(editId){ const idx=users.findIndex(u=>u.id===editId); if(idx!==-1){users[idx]={...users[idx],...userData};} toast('جم بنجاح الرابطجم بنجاح ','success'); }
  else { userData.id=genId(); userData.createdAt=new Date().toISOString(); users.push(userData); toast('تم بنجاح '+(type==='employee'?'الرابط':'الرابط')+' بنجاح ','success'); }
  saveUsers(users); closeModal(); renderUsers('employee'); renderUsers('student'); renderDashboard(); updateBadges();
}

function deleteUser(id){
  if(!confirm('هل تريد حذف هذا المستخدم نهائياً؟'))return;
  saveUsers(getUsers().filter(u=>u.id!==id));
  renderUsers('employee'); renderUsers('student'); renderDashboard(); updateBadges(); toast('تم حذف المستخدم بنجاح','success');
}

function closeModal(){ document.getElementById('userModal').classList.remove('open'); }
document.getElementById('userModal').addEventListener('click',function(e){if(e.target===this)closeModal();});

function openLb(url){ document.getElementById('lbImg').src=url; document.getElementById('lbOverlay').classList.add('open'); }
function closeLb(){ document.getElementById('lbOverlay').classList.remove('open'); }

function changeAdminPass(){
  const old=document.getElementById('oldPass').value; const n=document.getElementById('newPass').value; const c=document.getElementById('confPass').value;
  if(old!==getAdminPass()){toast('كلمة المرور الحالية خطأ','error');return;}
  if(n.length<4){toast('كلمة المرور الجديدة قصيرة جداً','error');return;}
  if(n!==c){toast('كلمة المرور غير متطابقة','error');return;}
  localStorage.setItem(ADMIN_PASS_KEY,n);
  document.getElementById('oldPass').value=''; document.getElementById('newPass').value=''; document.getElementById('confPass').value='';
  toast('تم تغيير كلمة المرور بنجاح ✓','success');
}

function exportData(){
  const data={users:getUsers(),portfolio:getPortfolio(),appPrices:getAppPrices(),exportDate:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='akram-admin-data-'+Date.now()+'.json'; a.click();
  toast('جم بنجاح الرابطجم بنجاح ','success');
}

function clearAllData(){
  if(!confirm(' بنجاح: موظف تم موظف الرابطجم تمإضافة موظف جديد!\n\nجم تم موظفϿ'))return;
  if(!confirm('بنجاح موظف  تم الرابط# جم موظف الرابط# تم!'))return;
  [USERS_KEY,PORTFOLIO_KEY,APP_PRICES_KEY].forEach(k=>localStorage.removeItem(k));
  initApp(); toast('جم تم موظف الرابطجم','error');
}

function toast(msg,type='success'){
  const el=document.getElementById('toast'); el.textContent=msg; el.className='toast show '+type;
  setTimeout(()=>el.classList.remove('show'),3000);
}

// ══════════════════════════════════════
//  LECTURES MANAGEMENT
// ══════════════════════════════════════
const LECTURES_KEY = 'am_lectures';
const LEC_COURSES = [
  {key:'free',        name:'الكورس المجاني',          icon:'fa-gift'},
  {key:'facebook-ads',name:'إعلانات فيسبوك',           icon:'fa-facebook'},
  {key:'instagram',   name:'إنستجرام',                 icon:'fa-instagram'},
  {key:'tiktok',      name:'تيك توك',                  icon:'fa-music'},
  {key:'snapchat',    name:'سناب شات',                 icon:'fa-snapchat'},
  {key:'twitter',     name:'تويتر / X',                icon:'fa-x-twitter'},
  {key:'ai-marketing',name:'الذكاء الاصطناعي',          icon:'fa-robot'},
  {key:'integrated-strategy',name:'الاستراتيجية المتكاملة',icon:'fa-layer-group'},
  {key:'programming', name:'البرمجة',                   icon:'fa-code'},
];

let activeLecCourse = null;
let editingLecId = null;
var slideRows = []; // must be var for inline HTML handlers to access it

function getLectures(){ return _fsLectures!==null ? Object.assign({},_fsLectures) : (()=>{try{return JSON.parse(localStorage.getItem(LECTURES_KEY)||'{}');}catch(e){return {};}})(); }

/* ══ SEED: الكورس المجاني — 8 محاضرات افتراضية ══ */
function getDefaultFreeLectures(){
  const ts = Date.now();
  const sl=(id,title,notes)=>({id,type:'image',src:'',title,notes});
  return [
    { id:'lec_free_1', title:'رحلتي مع التسويق… بدأت من كيس تمر هندي', description:'قصة حقيقية من الطفولة تكشف كيف تبدأ رحلة التسويق من أبسط المواقف — وتنتهي بدروس لا تُنسى', createdAt:ts, updatedAt:ts, slides:[
      {id:'s1_0',type:'html',src:'/images/free-course-cover.html',title:'غلاف المحاضرة',notes:'🎬 البانر الرسمي للمحاضرة الأولى\n\n"رحلتي مع التسويق… بدأت من كيس تمر هندي"\n\nسنشوف في المحاضرة دي إزاي أي حدث بسيط في طفولتي علّمني 5 دروس تسويق ما اتعلمتهمش في أي جامعة.'},
      {id:'s1_1',type:'image',src:'/images/slides/lec1-01.png',title:'البداية — رحلتي مع التسويق',notes:'🎬 Fade in بطيء + موسيقى خفيفة\n\n"قبل ما أكون مدرب تسويق… كنت طفل عادي جدًا… أو يمكن مش عادي قوي."'},
      {id:'s1_2',type:'image',src:'/images/slides/lec1-02.png',title:'الرجوع للماضي — ولد عنده 9 سنين',notes:'🎬 Zoom خفيف على الطفل\n\n"خلّوني أرجع بيكم لولد عنده 9 سنين… بيقضي نص حياته في الشارع."'},
      {id:'s1_3',type:'image',src:'/images/slides/lec1-03.png',title:'وقت الفسحة — الأكل أهم حاجة',notes:'🎬 حركة أطفال / ضحك\n\n"في الفسحة… كان أهم حدث في اليوم… الأكل!"'},
      {id:'s1_4',type:'image',src:'/images/slides/lec1-04.png',title:'أبلة نبيلة — منتج بـ 10 قروش',notes:'🎬 Highlight على الكيس\n\n"كان فيه ست اسمها أبلة نبيلة… بتبيع تمر هندي متلج… بـ 10 قروش بس."'},
      {id:'s1_5',type:'image',src:'/images/slides/lec1-05.png',title:'المشكلة — محدش شايفها',notes:'🎬 Blur على الباعة → Focus عليها\n\n"بس مشكلتها؟\nمكانها بعيد… محدش شايفها."'},
      {id:'s1_6',type:'image',src:'/images/slides/lec1-06.png',title:'القرار المجنون — نطّ السور',notes:'🎬 Motion jump أو Freeze frame\n\n"وأنا… الطفل الشقي… قررت أنط السور."'},
      {id:'s1_7',type:'image',src:'/images/slides/lec1-07.png',title:'حلاوة المغامرة — الزحمة والفرصة',notes:'🎬 Crowd movement\n\n"رجعت… وشفت الطلب… زحمة… ناس عاوزة تشتري."'},
      {id:'s1_8',type:'image',src:'/images/slides/lec1-08.png',title:'الفكرة — مين عاوز؟',notes:'🎬 تكبير على الفم/الصوت\n\n"فقلت… مين عاوز تمر هندي من أبلة نبيلة؟"'},
      {id:'s1_9',type:'image',src:'/images/slides/lec1-09.png',title:'أول عملاء — 3 جريوا عليه',notes:'🎬 Slide سريعة توحي بالحماس\n\n"فجأة… 3 جريوا عليا!"'},
      {id:'s1_10',type:'image',src:'/images/slides/lec1-10.png',title:'أول تسعير — خدمة توصيل بقى!',notes:'🎬 الأرقام 10 → 15 تظهر Animated\n\n"الكيس بـ 15 قرش… خدمة توصيل بقى!"'},
      {id:'s1_11',type:'image',src:'/images/slides/lec1-11.png',title:'فرحة الربح — 45 قرش!',notes:'🎬 Coins تتساقط\n\n"رجعت فرحان… فاكر نفسي كسبت 45 قرش!"'},
      {id:'s1_12',type:'image',src:'/images/slides/lec1-12.png',title:'صدمة المصروفات — معايا 15 بس!',notes:'🎬 Error / X أحمر\n\n"بس الحقيقة؟ معايا 15 بس!"'},
      {id:'s1_13',type:'image',src:'/images/slides/lec1-13.png',title:'احسب حساباتك — الحساب الصح',notes:'🎬 كتابة المعادلة خطوة خطوة\n\n"نسيت أحسب تكلفة المنتج."\n\n45 (المبيعات) – 30 (التكلفة) = 15 (الربح الفعلي)'},
      {id:'s1_14',type:'image',src:'/images/slides/lec1-14.png',title:'أول صفقة مدروسة — البيع الذكي',notes:'🎬 Multiply effect\n\n"تاني يوم… اتفقت مع أبلة نبيلة… وبقيت أبيع 10 أكياس بصفقة مدروسة."'},
      {id:'s1_15',type:'image',src:'/images/slides/lec1-15.png',title:'الحساب النهائي — 10 أكياس!',notes:'🎬 حساب تفصيلي\n\n"10 أكياس × 5 قروش ربح = 50 قرش صافي!"\n\nده الفرق بين اللي بيبيع بالحظ… واللي بيبيع بحساب.'},
    ]},
    { id:'lec_free_2', title:'أدوات الذكاء الاصطناعي الأساسية', description:'ChatGPT + Canva AI + Leonardo AI وكيفية كتابة Prompts احترافية', createdAt:ts+1000, updatedAt:ts+1000, slides:[
      sl('s2_1','فن كتابة الـ Prompt','الصيغة الاحترافية = الدور + المهمة + التفاصيل + الشكل\nمثال ضعيف: "اكتبلي بوست"\nمثال قوي: "أنت خبير تسويق — اكتب بوست انستجرام لعيادة أسنان في القاهرة عن خصم 30% رمضان — جمهور أمهات 25-45 — 80 كلمة — ودود مع إيموجي وCTA"'),
      sl('s2_2','ChatGPT — الاستخدام الاحترافي','سجّل على chat.openai.com مجاناً.\nالـ GPT-4o مجاناً مع حدود يومية.\nاستخدم Custom Instructions عشان تعرّفه على بيزنسك.\nاحفظ أفضل Prompts بتاعتك في ملف.'),
      sl('s2_3','Canva AI — تصميم بدون مصمم','Text to Image: اكتب وصف → صورة جاهزة\nMagic Design: مواصفات → تصميم كامل\nMagic Resize: حوّل التصميم لكل المنصات\nBackground Remover: إزالة الخلفية بضغطة\nMagic Write: كتابة محتوى مباشرة في Canva'),
      sl('s2_4','Leonardo AI — 150 صورة مجاناً يومياً','الموقع: leonardo.ai\nأفضل للمبتدئين — مجاني وسهل\nاختار نموذج Anime Pastel Dream للتصاميم الجذابة\nاستخدم الـ Negative Prompt لإزالة العيوب\nاحفظ الصور اللي عجبتك في Favorites'),
      sl('s2_5','تكليف المحاضرة الثانية','اصنع بوست كامل خلال 5 دقايق:\n① اكتب كاب شن في ChatGPT للمنتج اللي اخترته\n② افتح Canva وجهّز تصميم\n③ ولّد صورة من Leonardo أو Canva AI\nشارك النتيجة وقارن بالوقت المعتاد.'),
    ]},
    { id:'lec_free_3', title:'إنشاء المحتوى الاحترافي بالـ AI', description:'إنتاج محتوى شهر كامل في يوم واحد وتحويل فكرة لـ 10 محتويات', createdAt:ts+2000, updatedAt:ts+2000, slides:[
      sl('s3_1','قاعدة 3-3-3 للمحتوى','33% محتوى تعليمي: نصايح، أخطاء شايعة، معلومات مفيدة\n33% محتوى تفاعلي: أسئلة، استطلاعات، تحديات\n33% محتوى ترويجي: عروض، منتجات، خدمات\nالجمهور مش هيشتري من حد بيبيع بس — لازم يثق أول.'),
      sl('s3_2','الكتابة لكل منصة','فيسبوك: 100-150 كلمة — أسلوب قصصي عاطفي\nانستجرام: 80-120 كلمة — جمالي إلهامي\nTikTok: 50-80 كلمة — مباشر شبابي مثير\nلينكدإن: 150-300 كلمة — احترافي تعليمي\nX/تويتر: أقل من 280 حرف — ذكي ومثير للجدل'),
      sl('s3_3','Hook الفيديو — أول 3 ثوانٍ','أول 3 ثوانٍ بتحدد كل شيء في الفيديو.\nصيغ جاهزة للـ Hook:\n"اللي معظم الناس مش عارفينه عن..."\n"3 أخطاء بتخسّرك... كل يوم"\n"لو بتعمل... وقّف الفيديو ده"\n"الطريقة دي غيّرت... لـ أكتر من 1000 شخص"'),
      sl('s3_4','Content Multiplier — فكرة × 10','فكرة واحدة = بوست فيسبوك + كاروسيل انستجرام + Reels Script + Story + تغريدة + بوست لينكدإن + Quote + إنفوجرافيك + سؤال تفاعلي + Before/After\nخليك دايماً تسأل "إزاي أحوّل ده لشكل تاني؟"'),
      sl('s3_5','تكليف المحاضرة الثالثة','اطلب من ChatGPT:\n"اعملي خطة محتوى لمدة أسبوع (7 بوستات) لـ [بيزنسك]\n3 تعليمية + 2 تفاعلية + 2 ترويجية\nالكاب شن كامل لكل بوست بالعامية المصرية + هاشتاجز"\nاختار أحسن 3 وعدّل عليهم.'),
    ]},
    { id:'lec_free_4', title:'إدارة السوشيال ميديا بالذكاء الاصطناعي', description:'إدارة حسابات متعددة وعمل الأسبوع كله في 3 ساعات يوم الأحد', createdAt:ts+3000, updatedAt:ts+3000, slides:[
      sl('s4_1','نظام الـ 3 ساعات الأسبوعي','يوم الأحد (2 ساعة): ChatGPT ← خطة محتوى ← Canva ← تصاميم ← Buffer ← جدولة\nباقي الأسبوع (ساعة إجمالي): رد على تعليقات + متابعة أرقام\nالنتيجة: أسبوع محتوى كامل بدون ضغط يومي!'),
      sl('s4_2','الهاشتاجز بالطريقة الصح','المعادلة: 10 شعبية (1M+) + 10 متوسطة (100K-500K) + 10 متخصصة (أقل من 50K)\nالهاشتاجز المتخصصة هي اللي بتجيب جمهور حقيقي مهتم.\nاطلب من ChatGPT: "إديني 30 هاشتاج لـ [مجالك] مقسمة لـ 3 مستويات"'),
      sl('s4_3','نمو الفولورز بدون إعلانات','Engagement Formula: Hook ← قيمة ← سؤال ← هاشتاجز\nارد على كل تعليق في أول 30 دقيقة — الخوارزمية بتلاحظ ده.\nاطلب من ChatGPT "20 سؤال مثير للجدل في مجال [كذا]" واستخدمها كبوستات تفاعلية.\nBest time to post: اتعرف من Insights بتاع الصفحة.'),
      sl('s4_4','تحليل المنافسين بالـ AI','صف محتوى منافسيك لـ ChatGPT وقوله يطلعلك:\n3 حاجات بيعملها كويس ← اتعلم منها\n3 ثغرات في محتواه ← استغلها\n5 أفكار تتميز بيها\nنوع محتوى مش بيعمله ← ابدأ بيه أنت'),
      sl('s4_5','تكليف المحاضرة الرابعة','اعمل التجربة دي:\n① اختار منافس في مجالك\n② راقب آخر 10 بوستات\n③ ابعت وصفها لـ ChatGPT واطلب التحليل\n④ خد أهم 3 فرص واعمل منها 3 بوستات الأسبوع الجاي.'),
    ]},
    { id:'lec_free_5', title:'الإعلانات المدفوعة والذكاء الاصطناعي', description:'إعلانات فيسبوك ناجحة، A/B Testing، وقراءة الأرقام بذكاء', createdAt:ts+4000, updatedAt:ts+4000, slides:[
      sl('s5_1','كيف تفكر خوارزمية Meta؟','فيسبوك سؤاله الوحيد: "الإعلان ده هيجيب قيمة لمستخدميني؟"\nأهم المقاييس: Relevance Score + CTR + Engagement + Conversion\nكلما ارتفع الـ CTR كلما انخفضت التكلفة تلقائياً.\nالإعلان الكويس بيعلّم الخوارزمية تلاقي جمهور أفضل.'),
      sl('s5_2','قراءة الأرقام الأساسية','CTR أكتر من 1% = إعلان جذاب\nROAS 3x فأكتر = ربح حقيقي\nFrequency بين 2-4 = تكرار مناسب (أكتر = إرهاق)\nCPM عالي = منافسة على الجمهور\nاطلب من ChatGPT يفسرلك الأرقام لو مش فاهم معناها.'),
      sl('s5_3','A/B Testing بالترتيب الصح','اختبر واحدة بس في كل مرة:\n1️⃣ الصورة / الفيديو — أكبر تأثير\n2️⃣ الـ Headline\n3️⃣ الـ Primary Text\n4️⃣ الجمهور المستهدف\nلو غيّرت أكتر من حاجة مش هتعرف إيه اللي نجح.'),
      sl('s5_4','كتابة إعلانات بالـ AI','اطلب من ChatGPT 3 نسخ لكل إعلان:\nالنسخة 1: تعتمد على الفائدة المباشرة والنتيجة\nالنسخة 2: تعتمد على الخوف من الخسارة\nالنسخة 3: تعتمد على Social Proof وتجارب حقيقية\nشغّل 2 مع بعض وشوف مين بيكسب بعد 3 أيام.'),
      sl('s5_5','تكليف المحاضرة الخامسة','اعمل 3 نسخ إعلانية لمنتج أو خدمة حقيقية:\n① ابعت الـ Prompt الخاص بمنتجك لـ ChatGPT\n② اقرأ النسخ الثلاثة وحدد اللي أقوى في رأيك\n③ لو عندك بيزنس — شغّل أفضل 2 منهم وشوف النتيجة.'),
    ]},
    { id:'lec_free_6', title:'تحليل البيانات واتخاذ القرارات', description:'قراءة الأرقام بذكاء، Customer Persona، وتقارير احترافية', createdAt:ts+5000, updatedAt:ts+5000, slides:[
      sl('s6_1','Vanity vs Real Metrics','لايكات وفولورز = Vanity (مش مهمة)\nConversion Rate + CTR + Revenue = Real Metrics\nسؤال المليون: "المحتوى ده بيبيع ولا بيجمع فقط لايكات؟"\nركّز على الحاجات اللي بتأثر في المبيعات والأرباح الفعلية.'),
      sl('s6_2','Customer Persona — عميلك المثالي','صورة تفصيلية لعميلك المثالي:\n- الديموغرافيا: عمره، جنسه، منطقته، دخله\n- مشاكله: إيه اللي بيصعّب حياته؟\n- سلوكه الرقمي: أكتر منصة بيستخدمها ووقت استخدامها\n- قرار الشراء: ليه يشتري منك؟ وليه مش هيشتري؟'),
      sl('s6_3','Persona Prompt احترافي','اطلب من ChatGPT:\n"أنا عندي [بيزنس + موقعه + السعر].\nاعملي Customer Persona كاملة تشمل:\nالاسم + العمر + الوظيفة + الدخل + مشاكله الـ 3 + كيف بياخد قرار الشراء + الرسالة التسويقية المثالية له في جملة واحدة"'),
      sl('s6_4','تقرير شهري في 30 دقيقة','اجمع الأرقام من التحليلات: Reach + Engagement + تحويلات + مبيعات\nابعتهم لـ ChatGPT مع هذا الطلب:\n"اعملي تقرير تسويق شهري يشمل: ملخص تنفيذي + النجاحات + التحديات + توصيات الشهر الجاي"\nالتقرير جاهز في دقيقتين بدل ساعات.'),
      sl('s6_5','تكليف المحاضرة السادسة','ابني Persona لبيزنسك:\n① ابعت Prompt الـ Persona لـ ChatGPT\n② اقرأ النتيجة وقارنها بعملاءك الحقيقيين\n③ عدّل على أي حاجة مش دقيقة\n④ من دلوقتي — في كل Prompt اكتب "الجمهور: [الـ Persona دي]"'),
    ]},
    { id:'lec_free_7', title:'بناء استراتيجية تسويق متكاملة', description:'Marketing Funnel ذكي، خطة 90 يوم، وتسعير خدماتك', createdAt:ts+6000, updatedAt:ts+6000, slides:[
      sl('s7_1','الـ Marketing Funnel المتكامل','Awareness: محتوى تعليمي + Short Videos + إعلانات Reach رخيصة\nConsideration: Case Studies + شهادات عملاء + Retargeting\nConversion: عروض محدودة + WhatsApp Bot + Urgency\nRetention: متابعة بعد الشراء + Upsell + Loyalty Program\nكل مرحلة تحتاج نوع محتوى مختلف.'),
      sl('s7_2','خطة 90 يوم','الشهر الأول — Awareness: 20 بوست تعليمي + إعلانات Reach صغيرة\nالشهر الثاني — Leads: 15 بوست إقناعي + إعلانات Lead Generation\nالشهر الثالث — Sales: 10 بوست ترويجي + إعلانات Conversion\nراجع الأرقام كل 2 أسبوع وعدّل.'),
      sl('s7_3','تسعير خدماتك كـ Freelancer','باقة أساسية: 12 بوست + تصميم = 2000-3500 ج/شهر\nباقة متوسطة: 20 بوست + إعلانات = 4000-7000 ج/شهر\nباقة احترافية: 30 بوست + إعلانات + تقارير = 8000-15000 ج/شهر\nFreelance دولي: Full Package = 800-2500 دولار/شهر\nبدأ بالأقل وارفع بعد أول نتيجة.'),
      sl('s7_4','إزاي تشتغل بالـ AI مع عملاء','خدمات تقدر تقدمها بالـ AI:\nخطة محتوى شهرية (كانت بتاخد أسبوع — دلوقتي يوم)\nكتابة إعلانات A/B Testing (كانت 3 أيام — دلوقتي ساعة)\nتحليل المنافسين (كان يحتاج خبير — دلوقتي 30 دقيقة)\nهذا هو الفرق اللي بيسمح لك بأخذ عملاء أكتر.'),
      sl('s7_5','تكليف المحاضرة السابعة','اطلب من ChatGPT خطة 90 يوم لبيزنسك:\n"اعملي خطة تسويقية 90 يوم لـ [بيزنسك] — الهدف: [الأرقام المطلوبة] — الميزانية: [المبلغ] — المنصات: [فيسبوك + انستجرام]"\nحوّلها لـ Tasks أسبوعية في Notion أو Trello.'),
    ]},
    { id:'lec_free_8', title:'مشروع التخرج + أول عميل حقيقي', description:'تطبيق كل ما تعلمته وبناء Portfolio وإيجاد أول عميل', createdAt:ts+7000, updatedAt:ts+7000, slides:[
      sl('s8_1','مشروع التخرج الكامل','اختار بيزنس حقيقي أو خيالي وابني:\n✅ Customer Persona كاملة\n✅ خطة محتوى 30 بوست\n✅ 5 تصاميم بـ Canva AI\n✅ 3 نصوص إعلانية لفيسبوك\n✅ Script Reels واحد\n✅ استراتيجية 90 يوم\nده الـ Portfolio بتاعك للعملاء.'),
      sl('s8_2','أسرع 5 طرق لأول عميل','1. الشبكة الشخصية: أصدقاءك وعيلتك عندهم بيزنس\n2. Facebook Groups: مجموعات أصحاب المشاريع الصغيرة\n3. LinkedIn: 20 رسالة يومياً لأصحاب الشركات الصغيرة\n4. Cold DM: حسابات أعمال محتواها قديم أو ضعيف\n5. Mostaql / Fiverr: منصات Freelance (ابدأ بسعر تنافسي)'),
      sl('s8_3','Proposal احترافي في 5 دقايق','الـ Proposal = بوابة العميل الأول.\nاطلب من ChatGPT:\n"اكتب Proposal لـ [نوع البيزنس] — المشكلة: [ما لاحظته] — الخدمات: [ما ستقدمه] — النتائج المتوقعة في 90 يوم — 3 باقات بأسعار مختلفة"\nعدّل وأضف أرقام وتفاصيل حقيقية.'),
      sl('s8_4','رسالة المحاضرة الأخيرة','"الـ AI مش هيستبدلك — هيضاعف قدرتك × 10 لو استخدمته صح"\n\nأهم 3 حاجات تفضل معاك:\n1. الـ Prompt هو سلاحك — احسن في كتابته كل يوم\n2. الانتظام أهم من الكمال — انشر حتى لو مش perfect\n3. الأرقام بتحكي — راقعها وبناءً عليها غيّر استراتيجيتك'),
      sl('s8_5','تكليف التخرج','اعمل مشروع التخرج الكامل:\n① اختار بيزنس حقيقي (ممكن بتاعك أو صاحبك)\n② طبّق كل خطوات المشروع باستخدام الـ AI\n③ نظّم الشغل في PDF أو Canva Presentation\n④ ابعت Proposal لأول عميل محتمل\nمبروك — أنت دلوقتي مسوّق رقمي بالـ AI! 🎉'),
    ]},
  ];
}

async function seedFreeLectures(){
  try {
    const all = getLectures();
    const existing = all['free']||[];
    // re-seed if empty, less than 8, first lecture has < 10 slides, or first slide has no image
    if(existing.length >= 8 && (existing[0].slides||[]).length >= 10) return;
    all['free'] = getDefaultFreeLectures();
    // update in-memory immediately so UI reads it right away
    _fsLectures = Object.assign({}, all);
    try{ localStorage.setItem(LECTURES_KEY, JSON.stringify(all)); }catch(e){}
    // save to Firestore in background
    _fdb.collection('admin_data').doc('lectures').set({data:all, updatedAt:Date.now()})
      .catch(e=>console.warn('FS seed lectures:', e));
    updateBadges();
    // refresh UI if lectures section is open
    try{ initLecturesSection(); }catch(e){}
    if(activeLecCourse === 'free'){ try{ renderLecList('free'); }catch(e){} }
    console.log('✅ Free course lectures seeded successfully');
  } catch(e){ console.warn('Seed failed:', e); }
}

// Compress a base64 image to max maxW px wide at given quality (0-1)
function compressImg(src, maxW, quality){
  return new Promise(resolve=>{
    if(!src || !src.startsWith('data:image')){ resolve(src); return; }
    const img = new Image();
    img.onload = ()=>{
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d', {willReadFrequently: true}).drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = ()=>resolve(src);
    img.src = src;
  });
}

async function saveLectures(obj){
  _fsLectures = Object.assign({},obj);
  // Strip base64 images from localStorage (only keep http:// URLs) to avoid quota errors
  try{
    const localSafe = {};
    for(const [k,lecs] of Object.entries(obj)){
      localSafe[k] = (lecs||[]).map(l=>({
        ...l,
        slides:(l.slides||[]).map(s=>({
          ...s,
          src: (s.src&&(s.src.startsWith('http')||s.src.startsWith('/'))) ? s.src : ''
        }))
      }));
    }
    localStorage.setItem(LECTURES_KEY, JSON.stringify(localSafe));
  }catch(e){ console.warn('localStorage quota, skipping local save'); }

  // Build compressed versions — two quality levels:
  // • HQ  (per-lecture doc): 800px / 0.78 quality  ≈ 35-60KB per image (good quality, safe under Firestore 1MB)
  // • LQ  (grouped fallback): 400px / 0.45 quality  ≈ 8-15KB per image  (thumbnail)
  const buildCompressed = async (lecs, maxW, quality) => {
    const out = [];
    for(const lec of (lecs||[])){
      const slides = [];
      for(const s of (lec.slides||[])){
        const compSrc = await compressImg(s.src, maxW, quality);
        slides.push({...s, src: compSrc});
      }
      out.push({...lec, slides});
    }
    return out;
  };

  // Save each lecture as its own Firestore doc with HQ images (1080px / 0.82)
  const pairs = Object.entries(obj);
  for(const [courseKey, lecs] of pairs){
    const hqLecs  = await buildCompressed(lecs, 800, 0.78);
    const lqLecs  = await buildCompressed(lecs,  400, 0.45);
    for(const lec of hqLecs){
      if(!lec.id) continue;
      _fdb.collection('lectures').doc(lec.id)
        .set({...lec, courseKey, savedAt: Date.now()})
        .catch(e=>console.warn('FS lec save', lec.id, e));
    }
    // Grouped fallback doc uses LQ to stay well under 1MB
    _fdb.collection('admin_data').doc('lectures_'+courseKey)
      .set({data: lqLecs, courseKey, updatedAt: Date.now()})
      .catch(e=>console.warn('FS lectures_'+courseKey, e));
  }
  toast('تم الحفظ على السحابة ✓','success');
}

function initLecturesSection(){
  const tabs = document.getElementById('lecCourseTabs');
  const all = getLectures();
  let total = 0;
  Object.values(all).forEach(v=>{ total += v.length; });
  document.getElementById('lecsCount').textContent = total;

  tabs.innerHTML = LEC_COURSES.map(c=>`
    <button class="lec-tab${activeLecCourse===c.key?' active':''}" onclick="selectLecCourse('${c.key}')">
      <i class="fab ${c.icon}" style="margin-left:6px;"></i>${c.name}
      <span style="margin-right:6px;font-size:.7rem;color:inherit;opacity:.7;">${(all[c.key]||[]).length}</span>
    </button>
  `).join('');

  if(activeLecCourse) renderLecList(activeLecCourse);
}

function selectLecCourse(key){
  activeLecCourse = key;
  initLecturesSection();
  // seed free course if empty
  if(key === 'free'){ try{ seedFreeLectures(); }catch(e){} }
  renderLecList(key);
}

function renderLecList(key){
  const meta = LEC_COURSES.find(c=>c.key===key);
  document.getElementById('lecPanelTitle').textContent = (meta?meta.name:key) + ' – المحاضرات';
  document.getElementById('btnAddLec').style.display = 'flex';
  const all = getLectures();
  const lecs = all[key]||[];
  const list = document.getElementById('lecList');
  if(!lecs.length){
    list.innerHTML = `<div class="lec-empty"><i class="fas fa-inbox" style="font-size:2rem;margin-bottom:10px;display:block;opacity:.3;"></i>لا توجد محاضرات لهذا الكورس بعد</div>`;
    return;
  }
  list.innerHTML = lecs.map((l,i)=>`
    <div class="lec-card">
      <div class="lec-card-num">${i+1}</div>
      <div class="lec-card-info">
        <div class="lec-card-title">${l.title||'محاضرة '+(i+1)}</div>
        <div class="lec-card-meta">
          <span><i class="fas fa-images"></i> ${(l.slides||[]).length} شريحة</span>
          ${l.description?`<span><i class="fas fa-align-left"></i> ${l.description.substring(0,40)}...</span>`:''}
        </div>
      </div>
      <div class="lec-card-btns">
        <button class="lec-btn lec-btn-view" onclick="window.open('../lecture-viewer.html?course=${key}&id=${l.id}','_blank')"><i class="fas fa-eye"></i> معاينة</button>
        <button class="lec-btn lec-btn-edit" onclick="openEditLecture('${l.id}')"><i class="fas fa-edit"></i> تعديل</button>
        <button class="lec-btn lec-btn-del" onclick="deleteLecture('${l.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function openAddLecture(){
  if(!activeLecCourse){toast('اختر كورساً أولاً','error');return;}
  editingLecId = null;
  document.getElementById('lecModalTitle').textContent = 'محاضرة جديدة';
  document.getElementById('lecTitleInput').value = '';
  document.getElementById('lecDescInput').value = '';
  slideRows = [];
  renderSlideEditor();
  addSlideRow();
  document.getElementById('lecModal').classList.add('open');
}

function openEditLecture(id){
  if(!activeLecCourse)return;
  const all = getLectures();
  const lec = (all[activeLecCourse]||[]).find(l=>l.id===id);
  if(!lec)return;
  editingLecId = id;
  document.getElementById('lecModalTitle').textContent = 'تعديل: '+lec.title;
  document.getElementById('lecTitleInput').value = lec.title||'';
  document.getElementById('lecDescInput').value = lec.description||'';
  slideRows = (lec.slides||[]).map(s=>({...s}));
  renderSlideEditor();
  document.getElementById('lecModal').classList.add('open');
}

function closeLecModal(){
  document.getElementById('lecModal').classList.remove('open');
  slideRows = [];
  editingLecId = null;
}

// collect current DOM values into slideRows before any re-render
function collectSlideValues(){
  slideRows.forEach((s,i)=>{
    const titleEl = document.getElementById('sf-title-'+i);
    const srcEl   = document.getElementById('sf-src-'+i);
    const notesEl = document.getElementById('sf-notes-'+i);
    const typeEl  = document.getElementById('sf-type-'+i);
    if(titleEl) s.title = titleEl.value;
    // لا تقرأ قيمة الـ input لو كانت نص عرض فقط (مش رابط حقيقي)
    // الـ src الحقيقي محفوظ مسبقاً في slideRows[i].src من onSlideFileChange أو من renderSlideEditor
    if(srcEl && !srcEl.disabled){
      s.src = srcEl.value;
    }
    // لو كانت disabled ومحتواها نص placeholder نتركها كما هي في s.src
    if(notesEl) s.notes = notesEl.value;
    if(typeEl)  s.type  = typeEl.value;
  });
}

function addSlideRow(){
  collectSlideValues();
  slideRows.push({id:'s'+Date.now()+Math.random().toString(36).slice(2),type:'image',src:'',title:'',notes:''});
  renderSlideEditor();
  // scroll to bottom of editor
  const ed=document.getElementById('slidesEditor');
  setTimeout(()=>ed.lastElementChild&&ed.lastElementChild.scrollIntoView({behavior:'smooth'}),100);
}

function removeSlideRow(idx){
  collectSlideValues();
  slideRows.splice(idx,1);
  renderSlideEditor();
}

function changeSlideType(idx){
  collectSlideValues();
  renderSlideEditor();
}

function pickSlideImage(idx){
  document.getElementById('sf-file-'+idx).click();
}

function onSlideFileChange(idx, input){
  const file = input.files[0];
  if(!file) return;
  if(file.size > 20*1024*1024){ toast('حجم الصورة أكبر من 20MB','error'); return; }

  const reader = new FileReader();
  reader.onload = async e=>{
    const preview = document.getElementById('sf-imgpreview-'+idx);
    const srcInput = document.getElementById('sf-src-'+idx);
    if(srcInput){ srcInput.value='جاري الضغط...'; srcInput.disabled=true; }

    // ضغط الصورة (max 900px, quality 0.65) → حوالي 80-150KB
    const compressed = await compressImage(e.target.result, 1200, 0.88);

    // حفظ base64 مباشرة — لا Storage لا CORS
    slideRows[idx].src = compressed;
    if(preview){ preview.src=compressed; preview.style.display='block'; }
    if(srcInput){ srcInput.value='✓ جاهزة للحفظ'; srcInput.disabled=true; }
    toast('تم تحضير الصورة — اضغط حفظ المحاضرة','success');
  };
  reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth, quality){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload = ()=>{
      let w = img.width, h = img.height;
      if(w > maxWidth){ h = Math.round(h * maxWidth / w); w = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d', {willReadFrequently: true}).drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

function clearSlideImage(idx){
  slideRows[idx].src = '';
  const preview = document.getElementById('sf-imgpreview-'+idx);
  const srcInput = document.getElementById('sf-src-'+idx);
  if(preview){ preview.src=''; preview.style.display='none'; }
  if(srcInput){ srcInput.value=''; srcInput.disabled=false; }
  const fileInput = document.getElementById('sf-file-'+idx);
  if(fileInput) fileInput.value='';
}

function renderSlideEditor(){
  const ed = document.getElementById('slidesEditor');
  if(!slideRows.length){
    ed.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:.85rem;"><i class="fas fa-layer-group" style="font-size:2rem;display:block;margin-bottom:10px;opacity:.3;"></i>لا توجد شرائح – اضغط "+شريحة" لإضافة</div>';
    return;
  }
  ed.innerHTML = slideRows.map((s,i)=>{
    const isImg = s.type==='image';
    const hasBase64 = s.src && s.src.startsWith('data:');
    const imgSrcDisplay = hasBase64 ? '[صورة مرفوعة]' : (s.src||'');
    const imgDisabled = hasBase64 ? 'disabled' : '';
    return `
    <div class="slide-row" id="sr-${i}">
      <div class="slide-row-head">
        <span class="slide-row-num"><i class="fas fa-layer-group" style="margin-left:5px;"></i>شريحة ${i+1}</span>
        <div style="display:flex;gap:6px;">
          ${i>0?`<button onclick="collectSlideValues();slideRows.splice(${i}-1,0,slideRows.splice(${i},1)[0]);renderSlideEditor()" style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:#93c5fd;border-radius:7px;padding:4px 9px;font-size:.75rem;cursor:pointer;" title="تحريك لأعلى"><i class="fas fa-arrow-up"></i></button>`:''}
          ${i<slideRows.length-1?`<button onclick="collectSlideValues();slideRows.splice(${i}+1,0,slideRows.splice(${i},1)[0]);renderSlideEditor()" style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:#93c5fd;border-radius:7px;padding:4px 9px;font-size:.75rem;cursor:pointer;" title="تحريك لأسفل"><i class="fas fa-arrow-down"></i></button>`:''}
          <button onclick="removeSlideRow(${i})" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#f87171;border-radius:7px;padding:4px 9px;font-size:.75rem;cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
      <div class="slide-row-fields">
        <div class="slide-field full">
          <label>عنوان الشريحة</label>
          <input id="sf-title-${i}" type="text" value="${escHtml(s.title||'')}" placeholder="عنوان يظهر في العارض، مثال: ما هو التسويق الرقمي؟">
        </div>
        <div class="slide-field">
          <label>نوع الوسائط</label>
          <select id="sf-type-${i}" onchange="changeSlideType(${i})">
            <option value="image"${s.type==='image'?' selected':''}>🌄 صورة</option>
            <option value="video"${s.type==='video'?' selected':''}>🎬 فيديو</option>
            <option value="pdf"${s.type==='pdf'?' selected':''}>📄 PDF</option>
          </select>
        </div>
        ${isImg?`
        <div class="slide-field">
          <label>الصورة</label>
          <div style="display:flex;gap:6px;">
            <input id="sf-src-${i}" type="text" value="${escHtml(imgSrcDisplay)}" ${imgDisabled} placeholder="https://... رابط الصورة" style="flex:1;">
            <button onclick="pickSlideImage(${i})" style="padding:0 12px;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.3);color:#c4b5fd;border-radius:9px;font-size:.78rem;cursor:pointer;white-space:nowrap;"><i class="fas fa-upload" style="margin-left:4px;"></i>رفع</button>
            ${s.src?`<button onclick="clearSlideImage(${i})" style="padding:0 10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#f87171;border-radius:9px;font-size:.78rem;cursor:pointer;"><i class="fas fa-times"></i></button>`:''}
          </div>
          <input id="sf-file-${i}" type="file" accept="image/*" style="display:none" onchange="onSlideFileChange(${i},this)">
          ${s.src?`<img id="sf-imgpreview-${i}" src="${s.src.startsWith('data:')?s.src:''}" style="margin-top:8px;max-height:90px;border-radius:8px;display:${s.src.startsWith('data:')?'block':'none'};">`:`<img id="sf-imgpreview-${i}" style="display:none;">`}
          ${s.src && (s.src.startsWith('http')||s.src.startsWith('/'))?`<img src="${s.src}" style="margin-top:8px;max-height:90px;border-radius:8px;border:1px solid var(--border)" onerror="this.style.display='none'">`:''}
          ${s.src && !s.src.startsWith('http') && !s.src.startsWith('data:') && !s.src.startsWith('/') && s.src.trim()?`<div style="margin-top:6px;font-size:.75rem;color:#f87171;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:6px 10px;"><i class="fas fa-exclamation-triangle" style="margin-left:5px;"></i>الصورة مفقودة — أعد رفعها</div>`:''}
        </div>`:`
        <div class="slide-field">
          <label>${s.type==='video'?'رابط الفيديو (يوتيوب أو mp4)':'رابط PDF'}</label>
          <input id="sf-src-${i}" type="text" value="${escHtml(s.src||'')}" placeholder="${s.type==='video'?'https://youtube.com/...':'https://...pdf'}">
        </div>`}
        <div class="slide-field full">
          <label>الشرح / النص التفصيلي <span style="color:var(--muted);font-size:.7rem;font-weight:400;">(يظهر في جانب العارض)</span></label>
          <textarea id="sf-notes-${i}" rows="5" placeholder="اكتب الشرح التفصيلي هنا، كل سطر جديد = فقرة جديدة..." style="width:100%;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Cairo',sans-serif;font-size:.85rem;resize:vertical;line-height:1.8;">${s.notes||''}</textarea>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function saveLecture(){
  const title = document.getElementById('lecTitleInput').value.trim();
  if(!title){toast('أدخل عنوان المحاضرة','error');return;}
  if(!activeLecCourse){toast('اختر كورساً','error');return;}
  collectSlideValues();

  // ── show loading state ──
  const btn = document.getElementById('btnSaveLec');
  if(btn){ btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...'; }

  const FAKE_SRCS = ['[صورة مرفوعة]','[محلي]','✓ تم الرفع','✓ محفوظة','✓ جاهزة للحفظ','جاري الضغط...','جاري الرفع...',''];
  const all = getLectures();
  if(!all[activeLecCourse]) all[activeLecCourse]=[];

  const lecData = {
    id: editingLecId || ('lec'+Date.now()),
    title,
    description: document.getElementById('lecDescInput').value.trim(),
    slides: slideRows.map(s=>{
      const cleanSrc = FAKE_SRCS.includes((s.src||'').trim()) ? '' : s.src;
      return {...s, src: cleanSrc};
    }),
    createdAt: editingLecId ? undefined : Date.now(),
    updatedAt: Date.now(),
  };

  if(editingLecId){
    const idx = all[activeLecCourse].findIndex(l=>l.id===editingLecId);
    if(idx>=0){ lecData.createdAt = all[activeLecCourse][idx].createdAt; all[activeLecCourse][idx]=lecData; }
    else all[activeLecCourse].push(lecData);
  } else {
    all[activeLecCourse].push(lecData);
  }

  // ── 1. حفّظ في الذاكرة فوراً ──
  _fsLectures = Object.assign({}, all);

  // ── 2. حفّظ في localStorage (بدون base64 لتوفير المساحة) ──
  try{
    const localSafe = {};
    for(const [k,lecs] of Object.entries(all)){
      localSafe[k] = (lecs||[]).map(l=>({
        ...l,
        slides:(l.slides||[]).map(s=>({
          ...s,
          src: (s.src&&(s.src.startsWith('http')||s.src.startsWith('/'))) ? s.src : ''
        }))
      }));
    }
    localStorage.setItem(LECTURES_KEY, JSON.stringify(localSafe));
  }catch(e){ console.warn('localStorage quota:',e); }

  // ── 3. اضغط الصور وارفع على Firestore (await حقيقي) ──
  try{
    const compSlides = [];
    for(const s of lecData.slides){
      const compSrc = await compressImg(s.src, 800, 0.78);
      compSlides.push({...s, src: compSrc});
    }
    const compLec = {...lecData, slides: compSlides};
    await _fdb.collection('lectures').doc(compLec.id)
      .set({...compLec, courseKey: activeLecCourse, savedAt: Date.now()});

    // Grouped fallback (LQ)
    const lqSlides = [];
    for(const s of lecData.slides){
      const lqSrc = await compressImg(s.src, 400, 0.45);
      lqSlides.push({...s, src: lqSrc});
    }
    const courseLecs = (all[activeLecCourse]||[]).map(l=>{
      if(l.id !== lecData.id) return l;
      return {...l, slides: lqSlides};
    });
    await _fdb.collection('admin_data').doc('lectures_'+activeLecCourse)
      .set({data: courseLecs, courseKey: activeLecCourse, updatedAt: Date.now()});

    closeLecModal();
    initLecturesSection();
    renderLecList(activeLecCourse);
    toast('✅ تم الحفظ على السحابة بنجاح','success');
  } catch(err){
    console.error('Firestore save error:', err);
    // Close modal anyway — data is in memory
    closeLecModal();
    initLecturesSection();
    renderLecList(activeLecCourse);
    toast('⚠️ حُفظت محلياً — تحقق من الانترنت وأعد الحفظ','error');
  }
}

function deleteLecture(id){
  if(!activeLecCourse)return;
  if(!confirm('هل تريد حذف هذه المحاضرة نهائياً؟'))return;
  const all = getLectures();
  all[activeLecCourse] = (all[activeLecCourse]||[]).filter(l=>l.id!==id);
  saveLectures(all);
  // Delete individual Firestore doc
  _fdb.collection('lectures').doc(id).delete().catch(e=>console.warn('FS del lec',e));
  initLecturesSection();
  renderLecList(activeLecCourse);
  toast('تم حذف المحاضرة','success');
}

function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Close lecture modal on overlay click
document.getElementById('lecModal').addEventListener('click',function(e){if(e.target===this)closeLecModal();});

/* =============================================
   LIVE SESSIONS
   ============================================= */
const LIVE_COURSE_NAMES = {
  free:'كورس التسويق المجاني', programming:'برمجة المواقع',
  facebook:'إعلانات فيسبوك', instagram:'إنستاغرام', tiktok:'تيك توك',
  snapchat:'سناب شات', twitter:'إكس (تويتر)', integrated:'استراتيجية متكاملة'
};

function getLiveSessions(){ return _fsLiveSessions!==null ? _fsLiveSessions.slice() : (()=>{try{return JSON.parse(localStorage.getItem('am_live_sessions')||'[]');}catch(e){return [];}})(); }
function saveLiveSessions(arr){
  _fsLiveSessions = arr.slice();
  localStorage.setItem('am_live_sessions', JSON.stringify(arr));
  updateBadges();
  _fdb.collection('admin_data').doc('live_sessions').set({data:arr,updatedAt:Date.now()}).catch(e=>console.warn('FS live_sessions',e));
}

function renderLiveSessions(){
  const sessions = getLiveSessions();
  const grid = document.getElementById('liveSessionsGrid');
  const badge = document.getElementById('liveBadge');
  const activeCnt = sessions.filter(s=>s.status==='live').length;
  if(badge) badge.textContent = activeCnt || sessions.length;
  if(!sessions.length){
    grid.innerHTML = `<div class="ls-empty" style="grid-column:1/-1">
      <i class="fas fa-broadcast-tower"></i>
      <p>مفيش جلسات بعد — اضغط «جلسة جديدة» وابدأ!</p>
    </div>`;
    return;
  }
  grid.innerHTML = sessions.slice().reverse().map(s=>{
    const statusMap = {live:'مباشر 🔴', scheduled:'مجدولة ⏰', ended:'انتهت'};
    const dt = s.scheduledAt ? new Date(s.scheduledAt).toLocaleString('ar-EG',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
    const previewUrl = `../live-session.html?id=${s.id}`;
    const adminPreviewUrl = `../live-session.html?room=${encodeURIComponent(s.room)}&title=${encodeURIComponent(s.title)}&course=${s.courseKey}`;
    return `<div class="ls-card">
      <div class="ls-card-header">
        <div class="ls-status-dot ${s.status}"></div>
        <span class="ls-card-title">${escHtml(s.title)}</span>
        <span class="ls-status-badge ${s.status}">${statusMap[s.status]||s.status}</span>
      </div>
      <div class="ls-card-body">
        <div class="ls-info-row"><i class="fas fa-graduation-cap"></i>${LIVE_COURSE_NAMES[s.courseKey]||s.courseKey}</div>
        <div class="ls-info-row"><i class="fas fa-clock"></i>${dt}</div>
        ${s.notes?`<div class="ls-info-row"><i class="fas fa-sticky-note"></i>${escHtml(s.notes)}</div>`:''}
        <div class="ls-info-row" style="margin-top:8px"><i class="fas fa-link"></i><span class="ls-room-tag">${escHtml(s.room)}</span></div>
        <div class="ls-card-actions">
          <button class="ls-btn ls-btn-go" onclick="window.open('${adminPreviewUrl}&adminSkip=1','_blank')"><i class="fas fa-play"></i> افتح</button>
          ${s.status!=='live'&&s.status!=='ended'?`<button class="ls-btn ls-btn-live" onclick="setLiveStatus('${s.id}','live')"><i class="fas fa-broadcast-tower"></i> ابدأ</button>`:''}
          ${s.status==='live'?`<button class="ls-btn ls-btn-end" onclick="setLiveStatus('${s.id}','ended')"><i class="fas fa-stop"></i> أنهي</button>`:''}
          <button class="ls-btn" style="background:var(--bg2);color:var(--muted);border:1px solid var(--border)" onclick="editLiveSession('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="ls-btn ls-btn-del" onclick="deleteLiveSession('${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
        <div style="margin-top:12px">
          <div style="font-size:.72rem;color:var(--muted);margin-bottom:5px">رابط الطالب</div>
          <div style="display:flex;gap:6px;align-items:center">
            <input readonly value="${location.origin}/live-session.html?id=${s.id}" style="flex:1;padding:7px 10px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:.72rem;outline:none;direction:ltr;font-family:monospace">
            <button onclick="copyLink('${s.id}')" style="padding:7px 12px;background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);border-radius:8px;color:#60a5fa;font-size:.75rem;white-space:nowrap">نسخ</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

var editingLiveId = null;
function openAddLiveSession(){
  editingLiveId = null;
  document.getElementById('liveModalTitle').textContent = 'جلسة جديدة';
  document.getElementById('lsTitle').value = '';
  document.getElementById('lsCourse').value = 'free';
  document.getElementById('lsRoom').value = '';
  document.getElementById('lsStatus').value = 'scheduled';
  document.getElementById('lsNotes').value = '';
  document.getElementById('lsMeetLink').value = 'https://meet.google.com/mkf-dkez-qkw';
  const now = new Date(); now.setMinutes(Math.ceil(now.getMinutes()/15)*15,0,0);
  document.getElementById('lsScheduled').value = now.toISOString().slice(0,16);
  generateRoom();
  document.getElementById('liveModal').classList.add('open');
}

function editLiveSession(id){
  const s = getLiveSessions().find(x=>x.id===id);
  if(!s) return;
  editingLiveId = id;
  document.getElementById('liveModalTitle').textContent = 'تعديل الجلسة';
  document.getElementById('lsTitle').value = s.title;
  document.getElementById('lsCourse').value = s.courseKey;
  document.getElementById('lsRoom').value = s.room;
  document.getElementById('lsStatus').value = s.status;
  document.getElementById('lsNotes').value = s.notes||'';
  document.getElementById('lsMeetLink').value = s.meetLink||'';
  document.getElementById('lsScheduled').value = s.scheduledAt||'';
  document.getElementById('liveModal').classList.add('open');
}

function closeLiveModal(){ document.getElementById('liveModal').classList.remove('open'); }

function generateRoom(){
  /* timestamp كامل = مستحيل يتكرر اسم = مفيش lobby قديمة */
  const words = ['learn','class','live','akram','digital','course'];
  const word = words[Math.floor(Math.random()*words.length)];
  const uniq = Date.now().toString(36);  // e.g. "m9x4k2"
  document.getElementById('lsRoom').value = 'akram-' + word + '-' + uniq;
}

function saveLiveSession(){
  const title = document.getElementById('lsTitle').value.trim();
  const room = document.getElementById('lsRoom').value.trim();
  if(!title){ alert('اكتب عنوان الجلسة'); return; }
  if(!room){ alert('لازم يكون فيه اسم غرفة'); return; }
  const sessions = getLiveSessions();
  const now = new Date().toISOString();
  if(editingLiveId){
    const idx = sessions.findIndex(s=>s.id===editingLiveId);
    if(idx>-1){
      sessions[idx] = {...sessions[idx], title, courseKey:document.getElementById('lsCourse').value,
        room, status:document.getElementById('lsStatus').value,
        notes:document.getElementById('lsNotes').value.trim(),
        meetLink:document.getElementById('lsMeetLink').value.trim(),
        scheduledAt:document.getElementById('lsScheduled').value, updatedAt:now};
    }
  } else {
    sessions.push({id:'ls_'+Date.now(), title, courseKey:document.getElementById('lsCourse').value,
      room, status:document.getElementById('lsStatus').value,
      notes:document.getElementById('lsNotes').value.trim(),
      meetLink:document.getElementById('lsMeetLink').value.trim(),
      scheduledAt:document.getElementById('lsScheduled').value, createdAt:now});
  }
  saveLiveSessions(sessions);
  closeLiveModal();
  renderLiveSessions();
  toast(editingLiveId?'تم التحديث':'تم إضافة الجلسة','success');
}

function setLiveStatus(id, status){
  const sessions = getLiveSessions();
  const idx = sessions.findIndex(s=>s.id===id);
  if(idx>-1){
    sessions[idx].status = status;
    sessions[idx].updatedAt = new Date().toISOString();
    /* غرفة جديدة كل مرة تبدأ الجلسة ← مفيش lock قديم من meet.jit.si */
    if(status === 'live'){
      const words = ['learn','class','live','akram','digital','course'];
      const word = words[Math.floor(Math.random()*words.length)];
      sessions[idx].room = 'akram-' + word + '-' + Date.now().toString(36);
    }
  }
  saveLiveSessions(sessions);
  renderLiveSessions();
  toast(status==='live'?'تم بدء الجلسة 🔴':'تم إنهاء الجلسة','success');
}

function deleteLiveSession(id){
  if(!confirm('لو حذفت الجلسة هيتتحذف نهائياً — متأكد؟')) return;
  const sessions = getLiveSessions().filter(s=>s.id!==id);
  saveLiveSessions(sessions);
  renderLiveSessions();
  toast('تم الحذف','success');
}

function copyLink(id){
  const url = location.origin + '/live-session.html?id=' + id;
  navigator.clipboard.writeText(url).then(()=>toast('تم نسخ الرابط 👌','success')).catch(()=>{
    const el = document.createElement('textarea'); el.value=url; document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove(); toast('تم نسخ الرابط','success');
  });
}

document.getElementById('liveModal').addEventListener('click',function(e){if(e.target===this)closeLiveModal();});


