
// ══════════ ADMIN ANNOTATION ENGINE ══════════
(function(){
  const canvas  = document.getElementById('annoAdminCanvas');
  const ctx     = canvas.getContext('2d', {willReadFrequently: true});
  const txtInp  = document.getElementById('aAnnoTextInput');
  let tool='pointer', color='#e94e77';
  let drawing=false, sx=0, sy=0, snap=null;
  let hist=[];

  function resize(){
    const img = canvas.width ? ctx.getImageData(0,0,canvas.width,canvas.height) : null;
    canvas.width=innerWidth; canvas.height=innerHeight;
    if(img) try{ ctx.putImageData(img,0,0); }catch(e){}
  }
  window.addEventListener('resize', resize); resize();

  window.aSetTool=function(t){
    tool=t;
    document.querySelectorAll('.anno-tool-btn[id^="aat"]').forEach(b=>b.classList.remove('active','hl-active'));
    const m={pointer:'aatPointer',pen:'aatPen',hl:'aatHl',rect:'aatRect',circle:'aatCircle',arrow:'aatArrow',text:'aatText',eraser:'aatEraser'};
    if(m[t]){ const el=document.getElementById(m[t]); if(el) el.classList.add(t==='hl'?'hl-active':'active'); }
    canvas.classList.toggle('drawing', t!=='pointer');
    document.body.classList.remove('stage-pen','stage-hl','stage-rect','stage-circle','stage-arrow','stage-eraser','stage-text');
    if(t!=='pointer') document.body.classList.add('stage-'+t);
    if(t!=='text') txtInp.style.display='none';
  };
  window.aSetColor=function(c,el){
    color=c;
    document.querySelectorAll('.anno-color-swatch').forEach(s=>s.classList.remove('selected'));
    if(el) el.classList.add('selected');
  };
  window.aAnnoUndo=function(){if(hist.length) ctx.putImageData(hist.pop(),0,0);};
  window.aAnnoClear=function(){ savH(); ctx.clearRect(0,0,canvas.width,canvas.height); };
  window.aHideToolbar=function(){ document.getElementById('annoAdminToolbar').classList.add('hidden'); document.getElementById('annoAdminShowBtn').classList.add('show'); };
  window.aShowToolbar=function(){ document.getElementById('annoAdminToolbar').classList.remove('hidden'); document.getElementById('annoAdminShowBtn').classList.remove('show'); };

  function savH(){ hist.push(ctx.getImageData(0,0,canvas.width,canvas.height)); if(hist.length>30) hist.shift(); }
  function pos(e){ const src=e.touches?e.touches[0]:e; return {x:src.clientX,y:src.clientY}; }
  function applyStroke(){
    ctx.lineCap='round'; ctx.lineJoin='round';
    if(tool==='hl'){ ctx.strokeStyle=hexA(color,.4); ctx.lineWidth=22; ctx.globalCompositeOperation='multiply'; }
    else if(tool==='eraser'){ ctx.globalCompositeOperation='destination-out'; ctx.lineWidth=28; }
    else { ctx.strokeStyle=color; ctx.lineWidth=3; ctx.globalCompositeOperation='source-over'; }
  }
  function hexA(h,a){ const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; }
  function dRect(x0,y0,x1,y1){ ctx.strokeStyle=color;ctx.lineWidth=3;ctx.globalCompositeOperation='source-over';ctx.strokeRect(x0,y0,x1-x0,y1-y0); }
  function dCircle(x0,y0,x1,y1){ const rx=(x1-x0)/2,ry=(y1-y0)/2;ctx.strokeStyle=color;ctx.lineWidth=3;ctx.globalCompositeOperation='source-over';ctx.beginPath();ctx.ellipse(x0+rx,y0+ry,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2);ctx.stroke(); }
  function dArrow(x0,y0,x1,y1){ const ang=Math.atan2(y1-y0,x1-x0),hw=14,ha=.45;ctx.strokeStyle=color;ctx.lineWidth=3;ctx.globalCompositeOperation='source-over';ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-hw*Math.cos(ang-ha),y1-hw*Math.sin(ang-ha));ctx.lineTo(x1-hw*Math.cos(ang+ha),y1-hw*Math.sin(ang+ha));ctx.closePath();ctx.fillStyle=color;ctx.fill(); }

  function start(e){
    if(tool==='pointer') return;
    const p=pos(e);
    if(tool==='text'){ placeText(p.x,p.y); return; }
    drawing=true; sx=p.x; sy=p.y; savH(); snap=ctx.getImageData(0,0,canvas.width,canvas.height);
    if(tool==='pen'||tool==='hl'||tool==='eraser'){ applyStroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); }
  }
  function move(e){
    if(!drawing) return;
    const p=pos(e);
    if(tool==='pen'||tool==='hl'||tool==='eraser'){ applyStroke(); ctx.lineTo(p.x,p.y); ctx.stroke(); }
    else{ ctx.putImageData(snap,0,0); if(tool==='rect') dRect(sx,sy,p.x,p.y); if(tool==='circle') dCircle(sx,sy,p.x,p.y); if(tool==='arrow') dArrow(sx,sy,p.x,p.y); }
  }
  function end(){ drawing=false; ctx.globalCompositeOperation='source-over'; }

  canvas.addEventListener('mousedown',start);
  canvas.addEventListener('mousemove',move);
  canvas.addEventListener('mouseup',end);
  canvas.addEventListener('mouseleave',end);
  canvas.addEventListener('touchstart',e=>{e.preventDefault();start(e);},{passive:false});
  canvas.addEventListener('touchmove', e=>{e.preventDefault();move(e); },{passive:false});
  canvas.addEventListener('touchend',  e=>{e.preventDefault();end(e);  },{passive:false});

  function placeText(x,y){ txtInp.style.display='block'; txtInp.style.left=x+'px'; txtInp.style.top=y+'px'; txtInp.value=''; txtInp.focus(); }
  window.aAnnoTextKeydown=function(ev){ if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); aCommitText(); } if(ev.key==='Escape'){ txtInp.value=''; txtInp.style.display='none'; } };
  let _aCommitLock=false;
  window.aCommitText=function(){
    if(_aCommitLock) return; _aCommitLock=true; setTimeout(()=>_aCommitLock=false,50);
    const x=parseFloat(txtInp.style.left), y=parseFloat(txtInp.style.top), val=txtInp.value.trim();
    if(val){ savH(); ctx.globalCompositeOperation='source-over'; ctx.font='bold 22px Cairo,sans-serif'; const m=ctx.measureText(val); ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(x-4,y-24,m.width+12,32); ctx.fillStyle=color; ctx.fillText(val,x+2,y); }
    txtInp.style.display='none'; txtInp.value='';
  };

  // Keyboard
  document.addEventListener('keydown',ev=>{
    if(document.activeElement && ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
    if((ev.ctrlKey||ev.metaKey)&&ev.key==='z'){ aAnnoUndo(); ev.preventDefault(); return; }
    const calcOpen = document.getElementById('calcWidgetAdmin').classList.contains('show');
    if(calcOpen){ const k=ev.key; if(/^[0-9]$/.test(k)){aCalcDigit(k);ev.stopImmediatePropagation();return;} if(k==='+'||k==='-'){aCalcOp(k);ev.stopImmediatePropagation();return;} if(k==='*'){aCalcOp('×');ev.stopImmediatePropagation();return;} if(k==='/'&&!ev.ctrlKey){aCalcOp('÷');ev.preventDefault();ev.stopImmediatePropagation();return;} if(k==='Enter'||k==='='){aCalcEquals();ev.stopImmediatePropagation();return;} if(k==='Backspace'){if(aCC.length>1)aCC=aCC.slice(0,-1);else aCC='0';aCalcRefresh();ev.stopImmediatePropagation();return;} }
    switch(ev.key){
      case 'p':case 'P': aSetTool('pen'); break;
      case 'h':case 'H': aSetTool('hl'); break;
      case 'r':case 'R': aSetTool('rect'); break;
      case 'c':case 'C': aSetTool('circle'); break;
      case 'a':case 'A': aSetTool('arrow'); break;
      case 't':case 'T': aSetTool('text'); break;
      case 'e':case 'E': aSetTool('eraser'); break;
      case 'Escape': aSetTool('pointer'); txtInp.style.display='none'; break;
    }
  });
})();

// ══════════ ADMIN CALCULATOR ══════════
let aCC='0',aCP='',aCOp='',aCWait=false;
function aCalcRefresh(){ let d=aCC; if(d.length>12) d=parseFloat(d).toExponential(4); document.getElementById('aCalcDisplay').textContent=d; }
function aCalcDigit(d){ if(aCWait){aCC=d;aCWait=false;}else aCC=aCC==='0'?d:aCC+d; aCalcRefresh(); }
function aCalcDot(){ if(aCWait){aCC='0.';aCWait=false;aCalcRefresh();return;} if(!aCC.includes('.')) aCC+='.'; aCalcRefresh(); }
function aCalcOp(op){ if(aCOp&&!aCWait) aCalcEquals(true); aCP=aCC;aCOp=op;aCWait=true; document.getElementById('aCalcExpr').textContent=aCP+' '+op; }
function aCalcEquals(chain=false){ if(!aCOp) return; const a=parseFloat(aCP),b=parseFloat(aCC); let r; if(aCOp==='÷') r=b?a/b:'خطأ'; if(aCOp==='×') r=a*b; if(aCOp==='+') r=a+b; if(aCOp==='-') r=a-b; document.getElementById('aCalcExpr').textContent=aCP+' '+aCOp+' '+aCC+'='; aCC=r==='خطأ'?'خطأ':String(parseFloat(r.toFixed(10))); if(!chain){aCOp='';aCP='';} aCWait=true; aCalcRefresh(); }
function aCalcAC(){ aCC='0';aCP='';aCOp='';aCWait=false; document.getElementById('aCalcExpr').textContent='\u00a0'; aCalcRefresh(); }
function aCalcToggleSign(){ aCC=String(-parseFloat(aCC)); aCalcRefresh(); }
function aCalcPercent(){ aCC=String(parseFloat(aCC)/100); aCalcRefresh(); }
function aToggleCalc(){ document.getElementById('calcWidgetAdmin').classList.toggle('show'); }

// Draggable calc
(function(){
  let drag=false,ox=0,oy=0;
  const h=document.getElementById('calcAdminHead'), w=document.getElementById('calcWidgetAdmin');
  h.addEventListener('mousedown',e=>{drag=true;ox=e.clientX-w.getBoundingClientRect().left;oy=e.clientY-w.getBoundingClientRect().top;e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!drag)return;w.style.left=(e.clientX-ox)+'px';w.style.top=(e.clientY-oy)+'px';w.style.transform='none';});
  document.addEventListener('mouseup',()=>drag=false);
})();

// ══════════ MOBILE SIDEBAR TOGGLE ══════════
function toggleAdminSidebar(){
  const sb = document.getElementById('adminSidebar');
  const ov = document.getElementById('sidebarOverlay');
  const tog = document.getElementById('menuToggle');
  const isOpen = sb.classList.contains('open');
  if(isOpen){ closeAdminSidebar(); }
  else {
    sb.classList.add('open');
    ov.classList.add('show');
    tog.innerHTML = '<i class="fas fa-times"></i>';
    document.body.style.overflow = 'hidden';
  }
}
function closeAdminSidebar(){
  const sb = document.getElementById('adminSidebar');
  const ov = document.getElementById('sidebarOverlay');
  const tog = document.getElementById('menuToggle');
  sb.classList.remove('open');
  ov.classList.remove('show');
  tog.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.style.overflow = '';
}
// Close sidebar when nav item clicked on mobile
document.querySelectorAll('.adm-nav-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    if(window.innerWidth <= 768) closeAdminSidebar();
  });
});

/* ══════════════════════════════════════════════
   EMPLOYEE ONBOARDING SYSTEM
══════════════════════════════════════════════ */

// إضافة موظف جديد مع إرسال رابط التسجيل
async function addEmployeeWithOnboarding(){
  // Open the modal
  document.getElementById('employeeContractModal').classList.add('open');
  
  // Reset form
  document.getElementById('empUsername').value = '';
  document.getElementById('empPassword').value = '';
  document.getElementById('empPhone').value = '';
  document.getElementById('empJobTitle').value = '';
  document.getElementById('empSalary').value = '';
  document.getElementById('empStartDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('empContractTerms').value = '';
  
  // Hide send section, show form section
  document.getElementById('empFormSection').style.display = 'block';
  document.getElementById('empSendSection').style.display = 'none';
  document.getElementById('empBtnCreate').style.display = 'flex';
}

// Contract terms based on job title
const JOB_CONTRACT_TERMS = {
  'مدير تسويق': `• قيادة فريق التسويق وتطوير استراتيجيات التسويق الرقمي
• إدارة الحملات الإعلانية على منصات التواصل الاجتماعي
• تحليل البيانات وإعداد التقارير الشهرية
• التواصل مع العملاء وبناء العلاقات التجارية
• دوام من 9 صباحاً حتى 5 مساءً
• إجازة أسبوعية يوم الجمعة
• فترة تجربة: شهر واحد`,
  
  'موظف مبيعات': `• التواصل مع العملاء المحتملين وعرض المنتجات والخدمات
• تحقيق الأهداف البيعية الشهرية المحددة
• متابعة العملاء الحاليين وضمان رضاهم
• إعداد تقارير المبيعات الأسبوعية
• دوام من 9 صباحاً حتى 5 مساءً
• إجازة أسبوعية يوم الجمعة
• عمولة على المبيعات حسب الأداء
• فترة تجربة: شهر واحد`,
  
  'محاسب': `• إدارة الحسابات المالية وإعداد القوائم المالية
• مراجعة الفواتير والمصروفات
• إعداد التقارير المالية الشهرية والسنوية
• متابعة الضرائب والالتزامات المالية
• دوام من 9 صباحاً حتى 5 مساءً
• إجازة أسبوعية يوم الجمعة
• فترة تجربة: شهر واحد`,
  
  'مصمم جرافيك': `• تصميم المواد التسويقية والإعلانية
• إنشاء تصاميم للسوشيال ميديا والمواقع الإلكترونية
• تطوير الهوية البصرية للعلامة التجارية
• العمل بالتنسيق مع فريق التسويق
• دوام من 9 صباحاً حتى 5 مساءً (مع إمكانية العمل عن بعد)
• إجازة أسبوعية يوم الجمعة
• فترة تجربة: شهر واحد`,
  
  'مدير عام': `• الإشراف على جميع أقسام الشركة
• وضع الخطط الاستراتيجية وتحقيق الأهداف
• اتخاذ القرارات الإدارية والمالية الهامة
• قيادة الفرق وتطوير الأداء المؤسسي
• التواصل مع الشركاء والعملاء الرئيسيين
• دوام من 9 صباحاً حتى 5 مساءً
• إجازة أسبوعية يوم الجمعة
• فترة تجربة: شهرين`
};

function updateContractTerms(){
  const jobTitle = document.getElementById('empJobTitle').value;
  const termsField = document.getElementById('empContractTerms');
  
  if(jobTitle && JOB_CONTRACT_TERMS[jobTitle]){
    termsField.value = JOB_CONTRACT_TERMS[jobTitle];
  } else {
    termsField.value = '';
  }
}

let currentEmployeeData = {};

function closeEmployeeModal(){
  document.getElementById('employeeContractModal').classList.remove('open');
}

async function createEmployeeAccount(){
  const username = document.getElementById('empUsername').value.trim();
  const password = document.getElementById('empPassword').value.trim();
  const phone = document.getElementById('empPhone').value.trim();
  const jobTitle = document.getElementById('empJobTitle').value;
  const salary = document.getElementById('empSalary').value.trim();
  const startDate = document.getElementById('empStartDate').value;
  const contractTerms = document.getElementById('empContractTerms').value;
  
  // Validation
  if(!username){
    toast('يرجى إدخال اسم المستخدم', 'error');
    return;
  }
  
  if(!/^[a-zA-Z0-9_]+$/.test(username)){
    toast('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط', 'error');
    return;
  }
  
  if(!password || password.length < 6){
    toast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
    return;
  }
  
  // Phone is optional, but validate format if provided
  if(phone && !/^01[0-9]{9}$/.test(phone)){
    toast('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 01 ويحتوي على 11 رقم', 'error');
    return;
  }
  
  if(!jobTitle){
    toast('يرجى اختيار الوظيفة', 'error');
    return;
  }
  
  if(!salary || isNaN(salary) || parseFloat(salary) <= 0){
    toast('يرجى إدخال راتب صحيح', 'error');
    return;
  }
  
  if(!startDate){
    toast('يرجى اختيار تاريخ بدء العمل', 'error');
    return;
  }
  
  try {
    // Check if username already exists
    const { data: existing } = await _supabase
      .from('employees')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (existing) {
      toast('اسم المستخدم موجود بالفعل! اختر اسم آخر', 'error');
      return;
    }
    
    // Create employee in Supabase
    const empId = 'emp_' + Date.now();
    const employeeData = {
      id: empId,
      username,
      password,
      phone,
      job_title: jobTitle,
      salary: parseFloat(salary),
      start_date: startDate,
      contract_terms: contractTerms,
      application_status: 'incomplete',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await _supabase
      .from('employees')
      .insert([employeeData]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    console.log('✅ Employee created in Supabase:', empId);
    
    // Generate onboarding link
    const onboardingLink = `${window.location.origin}/employee-onboarding.html?id=${empId}`;
    window.currentOnboardingLink = onboardingLink;
    
    // Store data for sending
    currentEmployeeData = { username, phone, jobTitle, salary, empId };
    
    // Show success and send options
    document.getElementById('empFormSection').style.display = 'none';
    document.getElementById('empSendSection').style.display = 'block';
    document.getElementById('empBtnCreate').style.display = 'none';
    document.getElementById('empLinkInput').value = onboardingLink;
    
    // Show contract summary
    const formattedDate = new Date(startDate).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    document.getElementById('empContractSummary').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
          <span style="color:var(--muted);font-size:.85rem;">👤 اسم المستخدم:</span>
          <span style="color:#fff;font-weight:700;font-size:.9rem;">${username}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
          <span style="color:var(--muted);font-size:.85rem;">💼 الوظيفة:</span>
          <span style="color:#fff;font-weight:700;font-size:.9rem;">${jobTitle}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">
          <span style="color:var(--muted);font-size:.85rem;">💰 الراتب:</span>
          <span style="color:var(--pink);font-weight:700;font-size:.9rem;">${parseFloat(salary).toLocaleString('ar-EG')} جنيه</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;">
          <span style="color:var(--muted);font-size:.85rem;">📅 تاريخ البدء:</span>
          <span style="color:#fff;font-weight:700;font-size:.9rem;">${formattedDate}</span>
        </div>
      </div>
    `;
    
    toast('✅ تم إنشاء الحساب بنجاح!', 'success');
    
    renderEmployeeRequests();
    updateBadges();
    
  } catch(error){
    console.error('Error creating employee account:', error);
    toast('حدث خطأ أثناء إنشاء الحساب: ' + error.message, 'error');
  }
}

function sendViaWhatsApp(){
  if(!window.currentOnboardingLink){
    toast('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
    return;
  }
  
  if(!currentEmployeeData.phone){
    toast('لم يتم إدخال رقم هاتف للموظف', 'error');
    return;
  }
  
  const phone = currentEmployeeData.phone.replace(/\D/g, '');
  const message = `مرحباً! 👋\n\n` +
    `تم إنشاء حساب لك في منصة أكرم مصطفى.\n\n` +
    `🔐 اسم المستخدم: ${currentEmployeeData.username}\n` +
    `💼 الوظيفة: ${currentEmployeeData.jobTitle}\n` +
    `💰 الراتب: ${parseFloat(currentEmployeeData.salary).toLocaleString('ar-EG')} جنيه\n\n` +
    `يرجى إكمال بياناتك الشخصية والتوقيع على العقد من الرابط التالي:\n\n` +
    `${window.currentOnboardingLink}\n\n` +
    `⚠️ هذا الرابط خاص بك ولا يجب مشاركته مع أحد.\n\n` +
    `مع تحياتنا 🌟`;
  
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
  
  toast('تم فتح واتساب', 'success');
  setTimeout(() => {
    closeEmployeeModal();
  }, 1500);
}

function copyEmployeeLink(){
  if(!window.currentOnboardingLink){
    toast('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
    return;
  }
  
  const linkInput = document.getElementById('empLinkInput');
  linkInput.select();
  navigator.clipboard.writeText(window.currentOnboardingLink);
  toast('✅ تم نسخ الرابط بنجاح', 'success');
}

function sendViaEmail(){
  if(!window.currentOnboardingLink){
    toast('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
    return;
  }
  
  const subject = `دعوة للانضمام - منصة أكرم مصطفى`;
  const body = `مرحباً،\n\n` +
    `تم إنشاء حساب لك في منصة أكرم مصطفى.\n\n` +
    `اسم المستخدم: ${currentEmployeeData.username}\n\n` +
    `يرجى إكمال بياناتك الشخصية والتوقيع على العقد من الرابط التالي:\n` +
    `${window.currentOnboardingLink}\n\n` +
    `هذا الرابط خاص بك ولا يجب مشاركته مع أحد.\n\n` +
    `مع تحياتنا،\nفريق منصة أكرم مصطفى`;
  
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
  
  toast('تم فتح تطبيق البريد', 'success');
}

// عرض طلبات الموظفين  
async function renderEmployeeRequests(){
  const grid = document.getElementById('employeeRequestsGrid');
  if(!grid) return;
  
  try {
    // Load employees from Supabase
    const { data, error } = await _supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    const requests = data || [];
    
    // Update global cache
    _fsEmployees = requests;
    
    if(requests.length === 0){
      grid.innerHTML = `
        <div class="emp-req-empty">
          <i class="fas fa-clipboard-list"></i>
          <p>لا توجد طلبات حالياً</p>
          <button class="btn-add-user" onclick="addEmployeeWithOnboarding()" style="margin-top:16px;display:inline-flex;">
            <i class="fas fa-plus"></i> إضافة موظف جديد
          </button>
        </div>`;
      return;
    }
    
    grid.innerHTML = requests.map(req => {
      const statusClass = req.application_status === 'approved' ? 'approved' : 
                          req.application_status === 'rejected' ? 'rejected' : 'pending';
      
      const avatarHtml = req.selfie_url ? 
        `<img src="${req.selfie_url}" alt="${req.full_name||req.username}">` :
        `${(req.full_name||req.username||'?').charAt(0)}`;
      
      const submittedDate = req.application_submitted_at ? 
        new Date(req.application_submitted_at).toLocaleDateString('ar-EG') : 
        'غير محدد';
      
      return `
        <div class="emp-req-card ${statusClass}">
          <div class="emp-req-header">
            <div class="emp-req-avatar">${avatarHtml}</div>
            <div class="emp-req-info">
              <h4>${req.full_name || req.username || 'موظف جديد'}</h4>
              <p>${req.job_title || 'لم يكمل البيانات بعد'}</p>
            </div>
          </div>
          <div class="emp-req-body">
            <div class="emp-req-row">
              <i class="fas fa-envelope"></i>
              <span>${req.email || 'لم يدخل البريد بعد'}</span>
            </div>
            ${req.phone ? `
            <div class="emp-req-row">
              <i class="fas fa-phone"></i>
              <span>${req.phone}</span>
            </div>` : ''}
            ${req.national_id ? `
            <div class="emp-req-row">
              <i class="fas fa-id-card"></i>
              <span>${req.national_id}</span>
            </div>` : ''}
            ${req.salary ? `
            <div class="emp-req-row">
              <i class="fas fa-money-bill-wave"></i>
              <span>${req.salary} جنيه / شهر</span>
            </div>` : ''}
            <div class="emp-req-row">
              <i class="fas fa-calendar"></i>
              <span>تاريخ التقديم: ${submittedDate}</span>
            </div>
            ${req.id_front_url || req.id_back_url || req.selfie_url ? `
            <div class="emp-req-docs">
              ${req.id_front_url ? `<div class="emp-req-doc-thumb" onclick="openLb('${req.id_front_url}')">
                <img src="${req.id_front_url}" alt="البطاقة الأمامية">
              </div>` : ''}
              ${req.id_back_url ? `<div class="emp-req-doc-thumb" onclick="openLb('${req.id_back_url}')">
                <img src="${req.id_back_url}" alt="البطاقة الخلفية">
              </div>` : ''}
              ${req.selfie_url ? `<div class="emp-req-doc-thumb" onclick="openLb('${req.selfie_url}')">
                <img src="${req.selfie_url}" alt="الصورة الشخصية">
              </div>` : ''}
            </div>` : ''}
          </div>
          ${req.application_status === 'pending' && req.application_submitted_at ? `
          <div class="emp-req-actions">
            <button class="btn-approve" onclick="approveEmployeeRequest('${req.id}')">
              <i class="fas fa-check"></i> قبول
            </button>
            <button class="btn-reject" onclick="rejectEmployeeRequest('${req.id}')">
              <i class="fas fa-times"></i> رفض
            </button>
            <button class="btn-view-req" onclick="viewEmployeeRequestDetails('${req.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </div>` : ''}
          ${req.applicationStatus === 'approved' ? `
          <div class="emp-req-status">
            <i class="fas fa-check-circle"></i>
            <span>تم قبول الطلب وإضافة الموظف</span>
          </div>` : ''}
          ${req.applicationStatus === 'rejected' ? `
          <div class="emp-req-status rejected">
            <i class="fas fa-times-circle"></i>
            <span>تم رفض الطلب</span>
          </div>` : ''}
          ${!req.applicationSubmittedAt ? `
          <div class="emp-req-actions">
            <button class="btn-whatsapp-notify" onclick="resendEmployeeLink('${req.id}', '${req.email}', '${req.name||''}')">
              <i class="fab fa-whatsapp"></i> إعادة إرسال الرابط
            </button>
          </div>` : ''}
        </div>`;
    }).join('');
    
  } catch(error){
    console.error('Error loading employee requests:', error);
    grid.innerHTML = `<div class="emp-req-empty"><i class="fas fa-exclamation-triangle"></i><p>حدث خطأ في تحميل الطلبات</p></div>`;
  }
}

// قبول طلب موظف
async function approveEmployeeRequest(empId){
  if(!confirm('هل تريد قبول هذا الطلب وإضافة الموظف للنظام؟')) return;
  
  try {
    const empDoc = await _fdb.collection('employees').doc(empId).get();
    if(!empDoc.exists){
      toast('الطلب غير موجود', 'error');
      return;
    }
    
    const empData = empDoc.data();
    
    // Update application status
    await _fdb.collection('employees').doc(empId).update({
      applicationStatus: 'approved',
      approvedAt: new Date().toISOString()
    });
    
    // Add to users list
    const users = getUsers();
    users.push({
      id: empId,
      type: 'employee',
      name: empData.fullName,
      username: empData.email.split('@')[0],
      password: 'employee123',
      email: empData.email,
      phone: empData.phone,
      role: empData.jobTitle,
      department: 'قيد التحديد',
      avatar: empData.selfieURL || '',
      bio: '',
      createdAt: new Date().toISOString(),
      nationalId: empData.nationalId,
      salary: empData.salary
    });
    
    saveUsers(users);
    renderEmployeeRequests();
    renderUsers('employee');
    updateBadges();
    
    toast('✅ تم قبول الطلب وإضافة الموظف بنجاح', 'success');
    
  } catch(error){
    console.error('Error approving request:', error);
    toast('حدث خطأ أثناء قبول الطلب', 'error');
  }
}

// قبول طلب موظف
async function approveEmployeeRequest(empId){
  try {
    const { error } = await _supabase
      .from('employees')
      .update({
        application_status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', empId);
    
    if (error) throw error;
    
    // Close modal if open
    const modal = document.getElementById('reqDetailModal');
    if (modal) modal.classList.remove('open');
    
    renderEmployeeRequests();
    updateBadges();
    toast('تم قبول الطلب بنجاح', 'success');
    
  } catch(error){
    console.error('Error approving request:', error);
    toast('حدث خطأ أثناء قبول الطلب', 'error');
  }
}

// رفض طلب موظف
async function rejectEmployeeRequest(empId){
  const reason = prompt('سبب الرفض (اختياري):');
  
  try {
    const { error } = await _supabase
      .from('employees')
      .update({
        application_status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason || ''
      })
      .eq('id', empId);
    
    if (error) throw error;
    
    // Close modal if open
    const modal = document.getElementById('reqDetailModal');
    if (modal) modal.classList.remove('open');
    
    renderEmployeeRequests();
    updateBadges();
    toast('تم رفض الطلب', 'success');
    
  } catch(error){
    console.error('Error rejecting request:', error);
    toast('حدث خطأ أثناء رفض الطلب', 'error');
  }
}

// تحميل عقد الموظف بصيغة PDF
async function downloadEmployeeContractPDF(empId){
  try {
    toast('جاري إنشاء العقد...', 'info');
    
    // Load employee data
    const { data: emp, error } = await _supabase
      .from('employees')
      .select('*')
      .eq('id', empId)
      .single();
    
    if (error || !emp) {
      toast('لم يتم العثور على بيانات الموظف', 'error');
      return;
    }
    
    const contractDate = emp.approved_at ? new Date(emp.approved_at).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG');
    const startDate = emp.start_date ? new Date(emp.start_date).toLocaleDateString('ar-EG') : '-';
    
    // Create hidden container for the contract HTML
    const contractDiv = document.createElement('div');
    contractDiv.id = 'contractPrintArea';
    contractDiv.style.cssText = 'position:fixed;top:-9999px;left:0;width:794px;background:#fff;z-index:-1;font-family:Cairo,sans-serif;';
    
    contractDiv.innerHTML = `
      <div style="padding:40px 50px;color:#1a1a1a;direction:rtl;">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #3498db;padding-bottom:20px;margin-bottom:30px;">
          <div style="text-align:right;">
            <h1 style="margin:0;font-size:22px;color:#2c3e50;font-weight:900;">RemuStore</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#7f8c8d;">Digital Marketing Solutions</p>
            <p style="margin:2px 0 0;font-size:11px;color:#95a5a6;">www.remostoreegy.com</p>
          </div>
          <div style="text-align:left;">
            <img src="../images/1772173627537.png" style="width:70px;height:70px;object-fit:contain;" onerror="this.style.display='none'">
          </div>
        </div>
        
        <!-- Contract Title -->
        <div style="text-align:center;margin-bottom:30px;">
          <h2 style="margin:0;font-size:28px;color:#2c3e50;font-weight:900;">عقد عمل</h2>
          <p style="margin:5px 0 0;font-size:14px;color:#7f8c8d;">Employment Contract</p>
          <p style="margin:8px 0 0;font-size:13px;color:#555;">تاريخ العقد: ${contractDate}</p>
        </div>
        
        <!-- Employee Info Section -->
        <div style="margin-bottom:25px;">
          <h3 style="font-size:16px;color:#3498db;border-bottom:2px solid #ecf0f1;padding-bottom:8px;margin-bottom:15px;">
            <span style="background:#3498db;color:#fff;padding:3px 10px;border-radius:4px;font-size:13px;margin-left:8px;">1</span>
            البيانات الشخصية للموظف
          </h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;width:35%;">الاسم الكامل:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.full_name || '-'}</td>
            </tr>
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;">البريد الإلكتروني:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.email || '-'}</td>
            </tr>
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;">رقم الهاتف:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.phone || '-'}</td>
            </tr>
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;">رقم البطاقة:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.national_id || '-'}</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:700;color:#555;">العنوان:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.address || '-'}</td>
            </tr>
          </table>
        </div>
        
        <!-- Job Details Section -->
        <div style="margin-bottom:25px;">
          <h3 style="font-size:16px;color:#3498db;border-bottom:2px solid #ecf0f1;padding-bottom:8px;margin-bottom:15px;">
            <span style="background:#3498db;color:#fff;padding:3px 10px;border-radius:4px;font-size:13px;margin-left:8px;">2</span>
            بيانات الوظيفة
          </h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;width:35%;">المسمى الوظيفي:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.job_title || '-'}</td>
            </tr>
            <tr style="border-bottom:1px solid #ecf0f1;">
              <td style="padding:10px;font-weight:700;color:#555;">الراتب الشهري:</td>
              <td style="padding:10px;color:#1a1a1a;">${emp.salary || '-'} جنيه مصري</td>
            </tr>
            <tr>
              <td style="padding:10px;font-weight:700;color:#555;">تاريخ بدء العمل:</td>
              <td style="padding:10px;color:#1a1a1a;">${startDate}</td>
            </tr>
          </table>
        </div>
        
        <!-- Contract Terms -->
        ${emp.contract_terms ? `
        <div style="margin-bottom:25px;">
          <h3 style="font-size:16px;color:#3498db;border-bottom:2px solid #ecf0f1;padding-bottom:8px;margin-bottom:15px;">
            <span style="background:#3498db;color:#fff;padding:3px 10px;border-radius:4px;font-size:13px;margin-left:8px;">3</span>
            شروط وأحكام العقد
          </h3>
          <div style="padding:15px;background:#f8f9fa;border-radius:8px;font-size:13px;line-height:2;white-space:pre-wrap;color:#333;">${emp.contract_terms}</div>
        </div>` : ''}
        
        <!-- Signatures Section -->
        <div style="margin-top:40px;padding-top:20px;border-top:2px solid #ecf0f1;">
          <div style="display:flex;justify-content:space-between;">
            <!-- Employee Signature -->
            <div style="text-align:center;width:45%;">
              <p style="font-size:14px;font-weight:700;color:#2c3e50;margin-bottom:10px;">توقيع الموظف</p>
              ${emp.signature_url ? `<img src="${emp.signature_url}" style="max-width:150px;max-height:60px;margin-bottom:8px;" crossorigin="anonymous" onerror="this.style.display='none'">` : '<div style="height:60px;"></div>'}
              <div style="border-top:1px solid #bdc3c7;padding-top:8px;">
                <p style="font-size:12px;color:#555;margin:0;">${emp.full_name || '-'}</p>
                <p style="font-size:11px;color:#999;margin:2px 0 0;">${contractDate}</p>
              </div>
            </div>
            <!-- Company Signature -->
            <div style="text-align:center;width:45%;">
              <p style="font-size:14px;font-weight:700;color:#2c3e50;margin-bottom:10px;">توقيع ممثل الشركة</p>
              <div style="height:60px;"></div>
              <div style="border-top:1px solid #bdc3c7;padding-top:8px;">
                <p style="font-size:12px;color:#555;margin:0;">إدارة RemuStore</p>
                <p style="font-size:11px;color:#999;margin:2px 0 0;">${contractDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top:30px;padding-top:15px;border-top:1px solid #ecf0f1;text-align:center;">
          <p style="font-size:10px;color:#bdc3c7;margin:0;">هذا العقد ملزم قانونياً لكلا الطرفين بمجرد التوقيع عليه</p>
          <p style="font-size:10px;color:#bdc3c7;margin:3px 0 0;">RemuStore - Digital Marketing Solutions | www.remostoreegy.com</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(contractDiv);
    
    // Wait for images to load
    await new Promise(r => setTimeout(r, 500));
    
    // Use html2canvas to render the contract
    const canvas = await html2canvas(contractDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      logging: false
    });
    
    // Create PDF from canvas
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Handle multi-page if content is long
    let position = 0;
    const pageHeight = 297; // A4 height in mm
    let remainingHeight = imgHeight;
    
    while (remainingHeight > 0) {
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        doc.addPage();
        position -= pageHeight;
      }
    }
    
    // Clean up
    document.body.removeChild(contractDiv);
    
    // Save PDF
    const fileName = `عقد_عمل_${emp.full_name || emp.id}.pdf`;
    doc.save(fileName);
    
    toast('تم تحميل العقد بنجاح', 'success');
    
  } catch(error){
    console.error('Error generating PDF:', error);
    // Clean up on error
    const el = document.getElementById('contractPrintArea');
    if (el) el.remove();
    toast('حدث خطأ أثناء إنشاء ملف PDF', 'error');
  }
}

// إرسال العقد للموظف عبر واتساب
async function sendContractToEmployee(empId, phone, name){
  if (!phone) {
    phone = prompt('أدخل رقم واتساب الموظف:\nمثال: 01012345678');
    if (!phone || !phone.trim()) return;
  }
  
  // Normalize phone number
  let formattedPhone = phone.replace(/\s+/g, '').replace(/^0/, '20');
  if (!formattedPhone.startsWith('20')) formattedPhone = '20' + formattedPhone;
  
  // Build contract download link message
  const siteUrl = window.location.origin || 'https://remostoreegy.com';
  const contractMsg = encodeURIComponent(
    `مرحباً ${name}! 🎉\n\n` +
    `تم قبول طلبك للعمل في RemuStore بنجاح! ✅\n\n` +
    `📋 تفاصيل العقد:\n` +
    `• الوظيفة: سيتم إرفاق العقد\n` +
    `• يرجى الاحتفاظ بنسخة من العقد\n\n` +
    `ملاحظة: سيتم إرسال نسخة PDF من العقد في رسالة منفصلة.\n\n` +
    `مرحباً بك في فريق العمل! 🚀\n` +
    `RemuStore - Digital Marketing`
  );
  
  window.open(`https://wa.me/${formattedPhone}?text=${contractMsg}`, '_blank');
  toast('تم فتح واتساب لإرسال العقد', 'success');
}

// إعادة إرسال رابط التسجيل للموظف
function resendEmployeeLink(empId, email, name){
  const onboardingLink = `${window.location.origin}/employee-onboarding.html?id=${empId}`;
  
  const whatsappMsg = encodeURIComponent(`مرحباً ${name}!\n\nتذكير: يرجى إكمال بياناتك والتوقيع على العقد من الرابط التالي:\n\n${onboardingLink}`);
  
  const phone = prompt('أدخل رقم الواتساب:\nمثال: 01012345678');
  
  if(phone && phone.trim()){
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;
    window.open(whatsappLink, '_blank');
  } else {
    // Copy link if no phone provided
    navigator.clipboard.writeText(onboardingLink);
    toast('تم نسخ الرابط - يمكنك إرساله عبر البريد الإلكتروني', 'success');
  }
}

// عرض تفاصيل طلب الموظف
async function viewEmployeeRequestDetails(empId){
  try {
    // Load from Supabase
    const { data: emp, error } = await _supabase
      .from('employees')
      .select('*')
      .eq('id', empId)
      .single();
    
    if (error || !emp) {
      console.error('Error loading employee:', error);
      toast('لم يتم العثور على الموظف', 'error');
      return;
    }
    
    const modal = document.getElementById('reqDetailModal') || createReqDetailModal();
    const content = document.getElementById('reqDetailContent');
    
    const startDate = emp.start_date ? new Date(emp.start_date).toLocaleDateString('ar-EG') : '-';
    const submittedDate = emp.application_submitted_at ? new Date(emp.application_submitted_at).toLocaleDateString('ar-EG') : '-';
    const statusMap = {pending:'معلّق',approved:'مقبول',rejected:'مرفوض',incomplete:'غير مكتمل'};
    const statusClass = emp.application_status || 'incomplete';
    const initials = (emp.full_name || 'م').split(' ').map(w=>w[0]).join('').slice(0,2);
    
    content.innerHTML = `
      <!-- Employee Hero -->
      <div class="rd-emp-hero">
        <div class="rd-emp-avatar">
          ${emp.selfie_url ? `<img src="${emp.selfie_url}" alt="صورة">` : initials}
        </div>
        <div class="rd-emp-info">
          <div class="rd-emp-name">${emp.full_name || '-'}</div>
          <div class="rd-emp-meta">
            <span><i class="fas fa-briefcase"></i> ${emp.job_title || '-'}</span>
            <span><i class="fas fa-calendar"></i> ${submittedDate}</span>
          </div>
        </div>
        <span class="rd-emp-status ${statusClass}">${statusMap[statusClass] || statusClass}</span>
      </div>
      
      <!-- Personal Info -->
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-user"></i> البيانات الشخصية</div>
        <div class="rd-section-body">
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-id-badge"></i> الاسم الكامل</div><div class="rd-val">${emp.full_name || '-'}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-envelope"></i> البريد</div><div class="rd-val">${emp.email || '-'}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-phone"></i> الهاتف</div><div class="rd-val">${emp.phone || '-'}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-map-marker-alt"></i> العنوان</div><div class="rd-val">${emp.address || '-'}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-id-card"></i> رقم البطاقة</div><div class="rd-val">${emp.national_id || '-'}</div></div>
        </div>
      </div>
      
      <!-- Job Info -->
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-briefcase"></i> بيانات الوظيفة</div>
        <div class="rd-section-body">
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-user-tie"></i> المسمى الوظيفي</div><div class="rd-val">${emp.job_title || '-'}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-coins"></i> الراتب</div><div class="rd-val">${emp.salary || '-'} جنيه / شهر</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-calendar-check"></i> تاريخ البدء</div><div class="rd-val">${startDate}</div></div>
          <div class="rd-row"><div class="rd-lbl"><i class="fas fa-clock"></i> تاريخ التقديم</div><div class="rd-val">${submittedDate}</div></div>
        </div>
      </div>
      
      <!-- ID Photos -->
      ${emp.id_front_url || emp.id_back_url ? `
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-id-card"></i> صور البطاقة</div>
        <div class="rd-proofs-grid">
          ${emp.id_front_url ? `<div class="rd-proof-item">
            <div class="rd-proof-img" onclick="openLb('${emp.id_front_url}')">
              <img src="${emp.id_front_url}" alt="أمامية">
            </div>
            <div class="rd-proof-label">الوجه الأمامي</div>
          </div>` : ''}
          ${emp.id_back_url ? `<div class="rd-proof-item">
            <div class="rd-proof-img" onclick="openLb('${emp.id_back_url}')">
              <img src="${emp.id_back_url}" alt="خلفية">
            </div>
            <div class="rd-proof-label">الوجه الخلفي</div>
          </div>` : ''}
        </div>
      </div>` : ''}
      
      <!-- Selfie -->
      ${emp.selfie_url ? `
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-camera"></i> الصورة الشخصية</div>
        <div class="rd-selfie-wrap">
          <div class="rd-selfie" onclick="openLb('${emp.selfie_url}')">
            <img src="${emp.selfie_url}" alt="سيلفي">
          </div>
        </div>
      </div>` : ''}
      
      <!-- Signature -->
      ${emp.signature_url ? `
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-signature"></i> التوقيع</div>
        <div class="rd-sig-wrap">
          <div class="rd-sig" onclick="openLb('${emp.signature_url}')">
            <img src="${emp.signature_url}" alt="التوقيع">
          </div>
        </div>
      </div>` : ''}
      
      <!-- Contract Terms -->
      ${emp.contract_terms ? `
      <div class="rd-section">
        <div class="rd-section-title"><i class="fas fa-file-contract"></i> شروط العقد</div>
        <div class="rd-terms-box">${emp.contract_terms}</div>
      </div>` : ''}
      
      <!-- Actions: Pending -->
      ${emp.application_status === 'pending' ? `
      <div class="rd-actions">
        <button class="rd-action-btn rd-btn-approve" onclick="approveEmployeeRequest('${emp.id}')">
          <i class="fas fa-check-circle"></i> قبول الطلب
        </button>
        <button class="rd-action-btn rd-btn-reject" onclick="rejectEmployeeRequest('${emp.id}')">
          <i class="fas fa-times-circle"></i> رفض الطلب
        </button>
      </div>` : ''}
      
      <!-- Actions: Approved -->
      ${emp.application_status === 'approved' ? `
      <div class="rd-actions">
        <button class="rd-action-btn rd-btn-pdf" onclick="downloadEmployeeContractPDF('${emp.id}')">
          <i class="fas fa-file-pdf"></i> تحميل العقد PDF
        </button>
        <button class="rd-action-btn rd-btn-send" onclick="sendContractToEmployee('${emp.id}','${(emp.phone||'').replace(/'/g,'')}','${(emp.full_name||'').replace(/'/g,'')}')">
          <i class="fab fa-whatsapp"></i> إرسال العقد للموظف
        </button>
      </div>` : ''}
    `;
    
    modal.classList.add('open');
    
  } catch(error){
    console.error('Error viewing details:', error);
    toast('حدث خطأ في عرض التفاصيل', 'error');
  }
}

// Create modal if doesn't exist
function createReqDetailModal(){
  const modal = document.createElement('div');
  modal.id = 'reqDetailModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h3><i class="fas fa-user-clock" style="color:var(--pink);margin-left:8px"></i> تفاصيل الطلب</h3>
        <button class="modal-close" onclick="document.getElementById('reqDetailModal').classList.remove('open')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div id="reqDetailContent"></div>
    </div>`;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('open');
  });
  
  return modal;
}

// Update init to load employee requests
const _originalInitApp = initApp;
initApp = function(){
  _originalInitApp();
  renderEmployeeRequests();
};


