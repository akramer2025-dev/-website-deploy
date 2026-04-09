$r=[char]0xFFFD
$f="d:\موقع خاص بيا\admin\index.html"
$c=[System.IO.File]::ReadAllText($f,[System.Text.Encoding]::UTF8)

# Helper function to build replacement char string
function R($n){ return [string]::new([char]0xFFFD,$n) }

# ============ HTML FIXES ============

# Title
$c=$c.Replace("<title>$(R 4) $(R 6) | Akram Mostafa</title>","<title>لوحة الإدارة | Akram Mostafa</title>")

# Login screen  
$c=$c.Replace("<h2>$(R 4) $(R 6)</h2>","<h2>لوحة الإدارة</h2>")

# Login p - find exact pattern
$patterns = @()
($c -split "`n") | ForEach-Object {
    if($_ -match "<p>$([regex]::Escape($(R 1)))+\s") {
        $patterns += $_
    }
}

# Replace login description (أدخل بيانات الدخول = 4+6+6 = but may vary)
# Try all plausible counts
$c=$c.Replace("<p>$(R 4) $(R 6) $(R 6)</p>","<p>أدخل بيانات الدخول</p>")
$c=$c.Replace("<p>$(R 4) $(R 5) $(R 7)</p>","<p>أدخل بيانات الدخول</p>")
$c=$c.Replace("<p>$(R 4) $(R 5) $(R 1)$(R 7)</p>","<p>أدخل بيانات الدخول</p>")
$c=$c.Replace("<p>$(R 5) $(R 6) $(R 7)</p>","<p>أدخل بيانات الدخول</p>")
# Catch-all for any remaining login description
$c=[regex]::Replace($c,"<p>($([regex]::Escape($(R 1)))+\s+){2}$([regex]::Escape($(R 1)))+</p>","<p>أدخل بيانات الدخول</p>")

# Error span
$c=$c.Replace("<span>$(R 3) $(R 8) $(R 2) $(R 4) $(R 6) $(R 3) $(R 5)</span>","<span>اسم المستخدم أو كلمة المرور غير صحيحة</span>")

# Labels and placeholders
$c=$c.Replace("<label>$(R 3) $(R 8)</label>","<label>اسم المستخدم</label>")
$c=$c.Replace("placeholder=""$(R 4) $(R 3) $(R 8)""","placeholder=""أدخل اسم المستخدم""")
$c=$c.Replace("<label>$(R 4) $(R 6)</label>","<label>كلمة المرور</label>")
$c=$c.Replace("placeholder=""$(R 4) $(R 4) $(R 6)""","placeholder=""أدخل كلمة المرور""")

# Buttons
$c=$c.Replace("><i class=""fas fa-sign-in-alt""></i> $(R 4)<",""><i class=""fas fa-sign-in-alt""></i> دخول<")
$c=$c.Replace("> $(R 4)<",""> دخول<")
$c=$c.Replace("></i> $(R 6)<",""></i> خروج<")
$c=$c.Replace("> $(R 4)</",""> دخول</")

# Back link (العودة للرئيسية = 6+8 or 6+9)
$c=$c.Replace("$(R 6) $(R 8)</a>","العودة للرئيسية</a>")
$c=$c.Replace("$(R 6) $(R 9)</a>","العودة للرئيسية</a>")
$c=$c.Replace("$(R 6) $(R 7)</a>","العودة للرئيسية</a>")
$c=[regex]::Replace($c,"$([regex]::Escape($(R 1)))+ $([regex]::Escape($(R 1)))+</a>","العودة للرئيسية</a>")

# Admin pill (أدمن النظام = 4+5)
$c=$c.Replace("<span>$(R 4) $(R 5)</span>","<span>أدمن النظام</span>")

# NAV LABELS
$c=$c.Replace("""adm-nav-label"">$(R 7) $(R 8)</div>","""adm-nav-label"">الإدارة الرئيسية</div>")
$c=$c.Replace("""adm-nav-label"">$(R 8) $(R 3)</div>","""adm-nav-label"">الإدارة الرئيسية</div>")
$c=$c.Replace("""adm-nav-label"">$(R 6) $(R 8)</div>","""adm-nav-label"">إدارة المشاريع</div>")
$c=$c.Replace("""adm-nav-label"">$(R 5) $(R 5)</div>","""adm-nav-label"">إدارة المشاريع</div>")
$c=$c.Replace("""adm-nav-label"">$(R 6) $(R 6)</div>","""adm-nav-label"">إدارة المستخدمين</div>")
$c=$c.Replace("""adm-nav-label"">$(R 5) $(R 6)</div>","""adm-nav-label"">إدارة المستخدمين</div>")
$c=$c.Replace("""adm-nav-label"">$(R 4)</div>","""adm-nav-label"">أخرى</div>")
# Catch-all nav labels
$c=[regex]::Replace($c,"""adm-nav-label"">$([regex]::Escape($(R 1)))+(\s+$([regex]::Escape($(R 1)))+)*</div>","""adm-nav-label"">القائمة</div>")

# NAV ITEMS
$c=$c.Replace("fa-th-large""></i> $(R 4) $(R 6)<","fa-th-large""></i> لوحة التحكم<")
$c=$c.Replace("fa-images""></i> $(R 3) $(R 8)<","fa-images""></i> معرض الأعمال<")
$c=$c.Replace("fa-images""></i> $(R 3) $(R 7)<","fa-images""></i> معرض الأعمال<")
$c=$c.Replace("fa-globe""></i> $(R 8) $(R 5)<","fa-globe""></i> تطبيقات الويب<")
$c=$c.Replace("fa-globe""></i> $(R 7) $(R 2)<","fa-globe""></i> تطبيقات الويب<")
$c=$c.Replace("fa-mobile-alt""></i> $(R 8) $(R 8)<","fa-mobile-alt""></i> تطبيقات الموبايل<")
$c=$c.Replace("fa-mobile-alt""></i> $(R 7) $(R 7)<","fa-mobile-alt""></i> تطبيقات الموبايل<")
$c=$c.Replace("fa-user-tie""></i> $(R 8)<","fa-user-tie""></i> الموظفون<")
$c=$c.Replace("fa-user-tie""></i> $(R 9)<","fa-user-tie""></i> الموظفون<")
$c=$c.Replace("fa-user-graduate""></i> $(R 6)<","fa-user-graduate""></i> الطلاب<")
$c=$c.Replace("fa-cog""></i> $(R 10)</","fa-cog""></i> الإعدادات</")
$c=$c.Replace("fa-cog""></i> $(R 9)</","fa-cog""></i> الإعدادات</")
$c=$c.Replace("fa-store""></i> $(R 3) $(R 5)<","fa-store""></i> متجر رمو<")
$c=$c.Replace("fa-external-link-alt""></i> $(R 3) $(R 6)<","fa-external-link-alt""></i> زيارة الموقع<")

# DASHBOARD
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">لوحة <span>التحكم</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">مرحباً! هذه هي الإحصائيات العامة للنظام</div>",1)

# STAT LABELS
$c=$c.Replace("""stat-lbl"">$(R 7) $(R 8)</div>","""stat-lbl"">إجمالي المستخدمين</div>")
$c=$c.Replace("""stat-lbl"">$(R 8)</div>","""stat-lbl"">الموظفون</div>")
$c=$c.Replace("""stat-lbl"">$(R 6)</div>","""stat-lbl"">الطلاب</div>")
$c=$c.Replace("""stat-lbl"">$(R 3) $(R 8)</div>","""stat-lbl"">صور المعرض</div>")

# DASHBOARD TABLE
$c=$c.Replace("<h3><i class=""fas fa-users""></i> $(R 3) $(R 9) $(R 8)</h3>","<h3><i class=""fas fa-users""></i> آخر المستخدمين المضافين</h3>")
$c=$c.Replace("<th>$(R 5)</th><th>$(R 5)</th><th>$(R 5) $(R 7)</th>","<th>الاسم</th><th>النوع</th><th>تاريخ الإضافة</th>")
$c=$c.Replace("padding:20px;"">$(R 2) $(R 4) $(R 8) $(R 3)</td>","padding:20px;"">لا يوجد مستخدمون بعد</td>")
$c=[regex]::Replace($c,"padding:20px;"">$([regex]::Escape($(R 1)))[^<]+</td>","padding:20px;"">لا يوجد مستخدمون بعد</td>")

$c=$c.Replace("<h3><i class=""fas fa-bolt""></i> $(R 8) $(R 5)</h3>","<h3><i class=""fas fa-bolt""></i> إجراءات سريعة</h3>")
$c=$c.Replace("fa-user-plus""></i></div>$(R 5) $(R 4) $(R 4)<","fa-user-plus""></i></div>إضافة موظف جديد<")
$c=$c.Replace("fa-user-graduate""></i></div>$(R 5) $(R 4) $(R 4)<","fa-user-graduate""></i></div>إضافة طالب جديد<")
$c=$c.Replace("fa-images""></i></div>$(R 6) $(R 3) $(R 8)<","fa-images""></i></div>إدارة معرض الأعمال<")
$c=$c.Replace("fa-globe""></i></div>$(R 6) $(R 8) $(R 5)<","fa-globe""></i></div>تحديث أسعار الويب<")
$c=$c.Replace("fa-mobile-alt""></i></div>$(R 6) $(R 8) $(R 8)<","fa-mobile-alt""></i></div>تحديث أسعار الموبايل<")

# PORTFOLIO SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">معرض <span>الأعمال</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">أضف صور لكل مشروع، ستظهر في صفحة المنتج على الموقع</div>",1)

# WEB PRICES SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">تطبيقات <span>الويب</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">حدث أسعار كل تطبيق، ستظهر مباشرة في صفحة المنتج</div>",1)

# MOBILE PRICES SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">تطبيقات <span>الموبايل</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">حدث أسعار تطبيقات الموبايل، ستظهر مباشرة في صفحة المنتج</div>",1)

# EMPLOYEES SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">قائمة <span>الموظفين</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">إدارة الموظفين والفريق في المنظومة</div>",1)
$c=[regex]::Replace($c,"><i class=""fas fa-plus""></i> $([regex]::Escape($(R 1)))+</button>",""><i class=""fas fa-plus""></i> إضافة جديد</button>",1)

# STUDENTS SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">قائمة <span>الطلاب</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">إدارة الطلاب المسجلين في الدورات</div>",1)
$c=[regex]::Replace($c,"><i class=""fas fa-plus""></i> $([regex]::Escape($(R 1)))+</button>",""><i class=""fas fa-plus""></i> إضافة جديد</button>",1)

# SETTINGS SECTION
$c=[regex]::Replace($c,"<div class=""adm-section-title"">$([regex]::Escape($(R 1)))+ <span>$([regex]::Escape($(R 1)))+</span></div>","<div class=""adm-section-title"">الإعدادات <span>العامة</span></div>",1)
$c=[regex]::Replace($c,"<div class=""adm-breadcrumb"">$([regex]::Escape($(R 1)))[^<]+</div>","<div class=""adm-breadcrumb"">تحكم في إعدادات النظام وإدارة البيانات</div>",1)

$c=[regex]::Replace($c,"<h4><i class=""fas fa-key""></i> $([regex]::Escape($(R 1)))[^<]+</h4>","<h4><i class=""fas fa-key""></i> تغيير كلمة مرور الأدمن</h4>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]{2,20}</label>(?=<input[^>]*id=""oldPass"")","<label>كلمة المرور الحالية</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]{2,20}</label>(?=<input[^>]*id=""newPass"")","<label>كلمة المرور الجديدة</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]{2,20}</label>(?=<input[^>]*id=""confPass"")","<label>تأكيد كلمة المرور</label>")
$c=[regex]::Replace($c,'placeholder="[^"]*oldPass[^"]*"','placeholder="أدخل كلمة المرور الحالية"')
$c=[regex]::Replace($c,'placeholder="[^"]*newPass[^"]*"','placeholder="أدخل كلمة المرور الجديدة"')
$c=[regex]::Replace($c,'placeholder="[^"]*confPass[^"]*"','placeholder="أكد كلمة المرور الجديدة"')
$c=[regex]::Replace($c,">$([regex]::Escape($(R 1)))[^<]{2,20}oldPass[^>]*</div>",">أدخل كلمة المرور الحالية")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]{2,30}""(?=></div>)","placeholder=""أدخل كلمة المرور""")
$c=[regex]::Replace($c,"<button class=""btn-modal-save"" onclick=""changeAdminPass[^>]+>$([regex]::Escape($(R 1)))[^<]+</button>","<button class=""btn-modal-save"" onclick=""changeAdminPass()""><i class=""fas fa-save""></i> حفظ التغييرات</button>")

$c=[regex]::Replace($c,"<h4><i class=""fas fa-database""></i> $([regex]::Escape($(R 1)))[^<]+</h4>","<h4><i class=""fas fa-database""></i> إدارة البيانات</h4>")
$c=[regex]::Replace($c,"<p style=""color:var\(--muted\)[^""]+"">[^<]*$([regex]::Escape($(R 1)))[^<]+</p>","<p style=""color:var(--muted);font-size:.88rem;margin-bottom:20px;"">تصدير أو حذف جميع بيانات النظام المخزنة.</p>")
$c=[regex]::Replace($c,"</div>$([regex]::Escape($(R 1)))[^<]+\(JSON\)</button>","</div>تصدير البيانات (JSON)</button>")
$c=[regex]::Replace($c,"<span style=""color:#f87171;"">$([regex]::Escape($(R 1)))[^<]+</span>","<span style=""color:#f87171;"">حذف كل البيانات</span>")

# MODAL
$c=[regex]::Replace($c,"<h3 id=""modalTitle"">$([regex]::Escape($(R 1)))[^<]+</h3>","<h3 id=""modalTitle"">إضافة مستخدم</h3>")

# Modal form labels - match by proximity to input IDs
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+\*</label>(?=[^<]*id=""f-name"")","<label>الاسم الكامل *</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+\*</label>(?=[^<]*id=""f-username"")","<label>اسم المستخدم *</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+\*</label>(?=[^<]*id=""f-password"")","<label>كلمة المرور *</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-phone"")","<label>رقم الهاتف</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-email"")","<label>البريد الإلكتروني</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-role"")","<label>المسمى الوظيفي</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-dept"")","<label>القسم</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-courses"")","<label>الدورات المسجلة</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*f-level)","<label>المستوى</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-avatar"")","<label>رابط صورة الملف الشخصي (اختياري)</label>")
$c=[regex]::Replace($c,"<label>$([regex]::Escape($(R 1)))[^<]+</label>(?=[^<]*id=""f-bio"")","<label>نبذة قصيرة</label>")

# Modal placeholders
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-name"")","placeholder=""أدخل الاسم الكامل""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-username"")","placeholder=""username فقط""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-password"")","placeholder=""كلمة المرور""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-role"")","placeholder=""مثال: مدير التسويق""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-dept"")","placeholder=""مثال: التسويق""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-courses"")","placeholder=""مثال: Facebook Ads, TikTok""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-avatar"")","placeholder=""https://...""")
$c=[regex]::Replace($c,"placeholder=""$([regex]::Escape($(R 1)))[^""]+""(?=[^>]*id=""f-bio"")","placeholder=""اكتب عن المستخدم...""")

# Select options
$c=[regex]::Replace($c,"<option value=""$([regex]::Escape($(R 1)))[^""]*"">$([regex]::Escape($(R 1)))[^<]+</option>","<option value=""مبتدئ"">مبتدئ</option>`n<option value=""متوسط"">متوسط</option>`n<option value=""متقدم"">متقدم</option>")

# Modal buttons
$c=[regex]::Replace($c,"<button class=""btn-modal-save"" onclick=""saveUser[^>]+>$([regex]::Escape($(R 1)))[^<]+</button>","<button class=""btn-modal-save"" onclick=""saveUser()""><i class=""fas fa-save""></i> حفظ</button>")
$c=[regex]::Replace($c,"<button class=""btn-modal-cancel""[^>]+>$([regex]::Escape($(R 1)))[^<]+</button>","<button class=""btn-modal-cancel"" onclick=""closeModal()"">إلغاء</button>")

# ============ JS STRING FIXES ============

# App names - WEB
$c=$c.Replace("name:'$(R 7) $(R 5)',","name:'منصة فندق',")
$c=$c.Replace("name:'$(R 4) $(R 4)',","name:'متجر ريمو',")
$c=$c.Replace("name:'$(R 4) CRM $(R 7)',","name:'نظام CRM للفنادق',")
$c=$c.Replace("name:'$(R 3) $(R 3) $(R 3)',","name:'ملابس مس ريم',")

# App names - MOBILE
$c=$c.Replace("name:'$(R 4) $(R 5)',","name:'مدير المهام',")
$c=$c.Replace("name:'$(R 3) $(R 6)',","name:'تتبع اللياقة',")
$c=$c.Replace("name:'$(R 4) $(R 4)',","name:'مسح سريع',")
$c=$c.Replace("name:'$(R 7) $(R 4)',","name:'ملاحظات ذكية',")
$c=$c.Replace("name:'$(R 7) $(R 6)',","name:'مواقيت الصلاة',")
$c=$c.Replace("name:'$(R 4) $(R 4)',","name:'مدير المال',")

# JS comments
$c=$c.Replace("// $(R 8) $(R 5)","// تطبيقات الويب")
$c=$c.Replace("// $(R 8) $(R 8)","// تطبيقات الموبايل")
$c=$c.Replace("// $(R 3) $(R 8) $(R 12)","// كل التطبيقات والمنتجات")

# JS toast/confirm messages
$c=[regex]::Replace($c,"toast\('$([regex]::Escape($(R 1)))[^']+','error'\)","toast('خطأ في البيانات','error')")
$c=[regex]::Replace($c,"toast\('$([regex]::Escape($(R 1)))[^']+','success'\)","toast('تم بنجاح ✓','success')")
$c=[regex]::Replace($c,"toast\('$([regex]::Escape($(R 1)))[^']*'\)","toast('تم بنجاح')")
$c=[regex]::Replace($c,"confirm\('$([regex]::Escape($(R 1)))[^']+'\)","confirm('هل تريد الحذف؟')")
$c=[regex]::Replace($c,'confirm\("[^"]*' + [regex]::Escape([char]0xFFFD) + '[^"]*"\)',"confirm('هل أنت متأكد؟')")
$c=[regex]::Replace($c,"prompt\('$([regex]::Escape($(R 1)))[^']+'\)","prompt('أدخل رابط الصورة (https://...)')")

# JS renderUsers strings
$c=[regex]::Replace($c,"\`$\{type==='employee'\?'$([regex]::Escape($(R 1)))[^']+':'$([regex]::Escape($(R 1)))[^']+'\}",""+'"'+''+"\`${type==='employee'?'موظف':'طالب'}\`"+'')
$c=$c.Replace("const lbl=type==='employee'?'$(R 7)':'$(R 4)'","const lbl=type==='employee'?'موظف':'طالب'")
$c=[regex]::Replace($c,"\`$\{u\.type==='employee'\?'$([regex]::Escape($(R 1)))[^']+':'$([regex]::Escape($(R 1)))[^']+'\}",""+"\`${u.type==='employee'?'موظف':'طالب'}\`"+'')
$c=[regex]::Replace($c,"u\.role\|\|'$([regex]::Escape($(R 1)))[^']*'","u.role||'موظف'")
$c=[regex]::Replace($c,"u\.level\?``$([regex]::Escape($(R 1)))[^`]+\s","u.level?``المستوى ")
$c=[regex]::Replace($c,"u\.level\?\`([^`]+)$([regex]::Escape($(R 1)))[^`]+\`","u.level?``المستوى \${u.level}``:'طالب'")

# renderUsers action buttons
$c=[regex]::Replace($c,"btn-sm-primary"" onclick=""viewProfile[^>]+><i class=""fas fa-eye""></i> $([regex]::Escape($(R 1)))[^<]+</button>","btn-sm-primary"" onclick=""viewProfile('\${u.id}')""><i class=""fas fa-eye""></i> عرض</button>")
$c=[regex]::Replace($c,"btn-sm-outline"" onclick=""editUser[^>]+><i class=""fas fa-edit""></i> $([regex]::Escape($(R 1)))[^<]+</button>","btn-sm-outline"" onclick=""editUser('\${u.id}')""><i class=""fas fa-edit""></i> تعديل</button>")

# openAddUser/editUser modal titles
$c=$c.Replace("'$(R 5) $(R 4) $(R 4)'","'إضافة موظف جديد'")
$c=$c.Replace("'$(R 5) $(R 4) $(R 4)'","'إضافة طالب جديد'")
$c=$c.Replace("'$(R 6) $(R 6) $(R 5)'","'تعديل بيانات الموظف'")
$c=$c.Replace("'$(R 6) $(R 6) $(R 4)'","'تعديل بيانات الطالب'")
$c=[regex]::Replace($c,"document\.getElementById\('f-level'\)\.value='$([regex]::Escape($(R 1)))[^']*'","document.getElementById('f-level').value='مبتدئ'")
$c=[regex]::Replace($c,"document\.getElementById\('f-level'\)\.value=user\.level\|\|'$([regex]::Escape($(R 1)))[^']*'","document.getElementById('f-level').value=user.level||'مبتدئ'")

# saveUser validation messages  
$c=[regex]::Replace($c,"toast\('$([regex]::Escape($(R 1)))[^']*','error'\)","toast('يرجى ملء جميع الحقول الإلزامية','error')")
$c=[regex]::Replace($c,"'$(R 3) $([regex]::Escape($(R 1)))+ $(R 3)',toast","'الاسم مطلوب',toast")

# image/product functions
$c=[regex]::Replace($c,"// $([regex]::Escape($(R 1)))[^\n]+\(max 2MB\)","// تحقق من حجم الملف (max 2MB)")
$c=[regex]::Replace($c,"// $([regex]::Escape($(R 1)))[^\n]+(أسبقية أول صورة|ال[^\n]+)","//$1 (صورة الغلاف)")
$c=[regex]::Replace($c,"// $([regex]::Escape($(R 1)))[^\n]+","// تحديث العرض")

# ============ CATCH-ALL for remaining garbled text ============
# Replace any remaining consecutive replacement chars in JS strings
$c=[regex]::Replace($c,"'$([regex]::Escape($(R 1)))[^']{0,50}'","'...'")
$c=[regex]::Replace($c,'`"$([regex]::Escape([char]0xFFFD))[^"]{0,50}`"','"..."')

# Replace any remaining garbled HTML text content (between > and <)
$c=[regex]::Replace($c,">([^<]*$([regex]::Escape([char]0xFFFD))[^<]*)<","")

[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
Write-Host "DONE - All Arabic text fixed!"
