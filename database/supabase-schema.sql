-- 🔥 Supabase SQL Schema لنظام الموظفين
-- نفّذ هذا الكود في Supabase Dashboard → SQL Editor

-- ==================== جدول الموظفين ====================
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    job_title TEXT,
    salary DECIMAL(10, 2),
    start_date DATE,
    contract_terms TEXT,
    
    -- بيانات الموظف الشخصية
    full_name TEXT,
    email TEXT,
    address TEXT,
    national_id TEXT,
    
    -- روابط الملفات (Supabase Storage URLs)
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    signature_url TEXT,
    
    -- حالة الطلب
    application_status TEXT DEFAULT 'incomplete',
    contract_accepted BOOLEAN DEFAULT FALSE,
    contract_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- حالة القبول والرفض
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- التواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    application_submitted_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_employees_username ON employees(username);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(application_status);
CREATE INDEX IF NOT EXISTS idx_employees_created ON employees(created_at);

-- ==================== Row Level Security ====================

-- تفعيل RLS (للحماية)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy: السماح بالقراءة والكتابة للجميع (للتجربة)
-- ⚠️ في Production، استبدل هذا بـ policies أكثر أماناً
DROP POLICY IF EXISTS "Enable all access for employees" ON employees;
CREATE POLICY "Enable all access for employees"
    ON employees
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== جدول سجل التغييرات ====================
CREATE TABLE IF NOT EXISTS employee_audit_log (
    id BIGSERIAL PRIMARY KEY,
    employee_id TEXT REFERENCES employees(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    changed_by TEXT,
    changes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index للأداء
CREATE INDEX IF NOT EXISTS idx_audit_log_employee ON employee_audit_log(employee_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON employee_audit_log(created_at);

-- Enable RLS
ALTER TABLE employee_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for audit_log" ON employee_audit_log;
CREATE POLICY "Enable all access for audit_log"
    ON employee_audit_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== جدول طلبات الانضمام ====================
CREATE TABLE IF NOT EXISTS join_requests (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_created ON join_requests(created_at);

-- Enable RLS
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for join_requests" ON join_requests;
CREATE POLICY "Enable all access for join_requests"
    ON join_requests
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== دالة تحديث updated_at تلقائياً ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتحديث updated_at في جدول employees
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger لتحديث updated_at في جدول join_requests
DROP TRIGGER IF EXISTS update_join_requests_updated_at ON join_requests;
CREATE TRIGGER update_join_requests_updated_at
    BEFORE UPDATE ON join_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== جدول الخطط التسويقية ====================
CREATE TABLE IF NOT EXISTS marketing_plans (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    company_email TEXT NOT NULL,
    company_phone TEXT,
    company_industry TEXT,
    
    -- بيانات الخطة (JSON)
    plan_data JSONB,
    
    -- حالة الخطة
    status TEXT DEFAULT 'draft', -- draft, completed, sent
    
    -- رابط العرض
    view_link TEXT,
    
    -- التواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes للأداء
CREATE INDEX IF NOT EXISTS idx_marketing_plans_company ON marketing_plans(company_name);
CREATE INDEX IF NOT EXISTS idx_marketing_plans_status ON marketing_plans(status);
CREATE INDEX IF NOT EXISTS idx_marketing_plans_created ON marketing_plans(created_at);

-- Enable RLS
ALTER TABLE marketing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for marketing_plans" ON marketing_plans;
CREATE POLICY "Enable all access for marketing_plans"
    ON marketing_plans
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_marketing_plans_updated_at ON marketing_plans;
CREATE TRIGGER update_marketing_plans_updated_at
    BEFORE UPDATE ON marketing_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== نظام CRM ====================

-- ==================== جدول العملاء المحتملين (Leads) ====================
CREATE TABLE IF NOT EXISTS crm_leads (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    company TEXT,
    industry TEXT,
    
    -- حالة العميل
    status TEXT DEFAULT 'new', -- new, interested, negotiating, converted, not_interested, no_answer
    source TEXT DEFAULT 'يدوي', -- يدوي, موقع, فيسبوك, إنستجرام, صديق
    priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
    
    -- التعيين والمتابعة
    assigned_to TEXT, -- username من جدول employees
    assigned_at TIMESTAMP WITH TIME ZONE,
    last_contact TIMESTAMP WITH TIME ZONE,
    next_followup TIMESTAMP WITH TIME ZONE,
    
    -- الإحصائيات
    call_count INTEGER DEFAULT 0,
    note_count INTEGER DEFAULT 0,
    total_value DECIMAL(12, 2) DEFAULT 0,
    
    -- معلومات إضافية
    notes TEXT,
    tags TEXT[], -- مصفوفة tags
    
    -- التواريخ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_phone ON crm_leads(phone);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created ON crm_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_leads_priority ON crm_leads(priority);

-- Enable RLS
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for crm_leads" ON crm_leads;
CREATE POLICY "Enable all access for crm_leads"
    ON crm_leads
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== سجل تغييرات حالة العملاء ====================
CREATE TABLE IF NOT EXISTS crm_status_log (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT, -- username
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_status_log_lead ON crm_status_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_status_log_created ON crm_status_log(created_at);

-- Enable RLS
ALTER TABLE crm_status_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for crm_status_log" ON crm_status_log;
CREATE POLICY "Enable all access for crm_status_log"
    ON crm_status_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== ملاحظات العملاء ====================
CREATE TABLE IF NOT EXISTS crm_notes (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    user_name TEXT, -- username
    note TEXT NOT NULL,
    note_type TEXT DEFAULT 'general', -- general, call, meeting, email
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_notes_lead ON crm_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created ON crm_notes(created_at);

-- Enable RLS
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for crm_notes" ON crm_notes;
CREATE POLICY "Enable all access for crm_notes"
    ON crm_notes
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== سجل المكالمات ====================
CREATE TABLE IF NOT EXISTS crm_calls (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES crm_leads(id) ON DELETE SET NULL,
    lead_name TEXT,
    lead_phone TEXT,
    
    employee_name TEXT,
    
    -- تفاصيل المكالمة
    status TEXT DEFAULT 'no_answer', -- answered, no_answer, busy, failed, completed
    result TEXT DEFAULT 'no_answer', -- interested, not_interested, callback, meeting_scheduled
    duration INTEGER DEFAULT 0, -- بالثواني
    
    -- ملاحظات
    notes TEXT,
    
    -- الاتجاه
    direction TEXT DEFAULT 'outbound', -- outbound, inbound
    
    -- التواريخ
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_calls_lead ON crm_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_calls_employee ON crm_calls(employee_name);
CREATE INDEX IF NOT EXISTS idx_crm_calls_created ON crm_calls(created_at);

-- Enable RLS
ALTER TABLE crm_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for crm_calls" ON crm_calls;
CREATE POLICY "Enable all access for crm_calls"
    ON crm_calls
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==================== سجل توزيع العملاء ====================
CREATE TABLE IF NOT EXISTS crm_distribution_log (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES crm_leads(id) ON DELETE CASCADE,
    from_employee TEXT,
    to_employee TEXT NOT NULL,
    distributed_by TEXT, -- username من عمل التوزيع
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_crm_distribution_lead ON crm_distribution_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_distribution_created ON crm_distribution_log(created_at);

-- Enable RLS
ALTER TABLE crm_distribution_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for crm_distribution_log" ON crm_distribution_log;
CREATE POLICY "Enable all access for crm_distribution_log"
    ON crm_distribution_log
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger لتحديث updated_at في crm_leads
DROP TRIGGER IF EXISTS update_crm_leads_updated_at ON crm_leads;
CREATE TRIGGER update_crm_leads_updated_at
    BEFORE UPDATE ON crm_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== تمام! ====================
-- ✅ الجداول جاهزة
-- ✅ RLS مفعّل
-- ✅ Indexes للأداء
-- 
-- الخطوة التالية:
-- 1. إنشاء Storage Bucket اسمه: employee-files
-- 2. Make it public
-- 3. تعديل js/supabase-config.js بقيمك
-- 4. تنفيذ هذا الكود في Supabase Dashboard → SQL Editor
