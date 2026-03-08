-- ✅ إضافة حقول القبول والرفض للموظفين
-- نفّذ هذا في Supabase Dashboard → SQL Editor

-- إضافة حقل approved_at
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- إضافة حقل rejected_at
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE;

-- إضافة حقل rejection_reason
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ✅ تمام! الحقول أضيفت بنجاح
