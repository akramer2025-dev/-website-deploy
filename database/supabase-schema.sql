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
