-- 🔥 Migration: إضافة حقول نوع الموظف والصلاحيات
-- نفّذ هذا الكود في Supabase Dashboard → SQL Editor

-- إضافة عمود نوع الموظف
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'employee_type'
    ) THEN
        ALTER TABLE employees 
        ADD COLUMN employee_type TEXT DEFAULT 'contract';
    END IF;
END $$;

-- إضافة عمود الصلاحيات
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'permissions'
    ) THEN
        ALTER TABLE employees 
        ADD COLUMN permissions JSONB DEFAULT '{}';
    END IF;
END $$;

-- إضافة عمود حالة التفعيل
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE employees 
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- تحديث الموظفين الحاليين ليكونوا موظفين دائمين بصلاحيات كاملة
UPDATE employees 
SET 
    employee_type = 'permanent',
    permissions = '{
        "dashboard": true,
        "portfolio": {"view": true, "edit": true, "delete": true},
        "projects": {"view": true, "edit": true, "delete": true},
        "marketing_plans": {"view": true, "create": true, "edit": true, "delete": true},
        "crm": {
            "leads": {"view": true, "create": true, "edit": true, "delete": true, "assign": true},
            "distribution": {"view": true, "assign": true}
        },
        "employees": {"view": true, "create": true, "edit": true, "delete": true},
        "courses": {"view": true, "create": true, "edit": true, "delete": true},
        "lectures": {"view": true, "create": true, "edit": true, "delete": true},
        "live_sessions": {"view": true, "create": true, "edit": true, "delete": true},
        "join_requests": {"view": true, "approve": true, "reject": true, "delete": true}
    }'::jsonb,
    is_active = true
WHERE employee_type IS NULL OR permissions IS NULL;

-- إنشاء Index للصلاحيات
CREATE INDEX IF NOT EXISTS idx_employees_type ON employees(employee_type);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);

-- ✅ تمام! الحقول الجديدة جاهزة
