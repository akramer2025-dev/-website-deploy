-- قاعدة بيانات نظام الموظفين
CREATE DATABASE IF NOT EXISTS akram_employees CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE akram_employees;

-- جدول الموظفين
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    salary DECIMAL(10, 2),
    start_date DATE,
    contract_terms TEXT,
    
    -- بيانات الموظف الشخصية
    full_name VARCHAR(200),
    email VARCHAR(200),
    address TEXT,
    national_id VARCHAR(50),
    
    -- روابط الملفات (نخزنها كـ Base64 أو URLs)
    id_front_url TEXT,
    id_back_url TEXT,
    selfie_url TEXT,
    signature_url TEXT,
    
    -- حالة الطلب
    application_status ENUM('pending', 'approved', 'rejected', 'incomplete') DEFAULT 'incomplete',
    contract_accepted BOOLEAN DEFAULT FALSE,
    contract_accepted_at DATETIME,
    
    -- التواريخ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_submitted_at DATETIME,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_status (application_status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول سجل التغييرات (Audit Log)
CREATE TABLE IF NOT EXISTS employee_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50),
    action VARCHAR(50),
    changed_by VARCHAR(100),
    changes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول طلبات الانضمام (من الموقع الرئيسي)
CREATE TABLE IF NOT EXISTS join_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status ENUM('new', 'contacted', 'converted', 'rejected') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
