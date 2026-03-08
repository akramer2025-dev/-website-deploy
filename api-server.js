const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // لدعم Base64 images
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// إعداد اتصال MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'akram_employees',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('✅ MySQL connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
    });

// ==================== EMPLOYEE ENDPOINTS ====================

// GET: Get all employees (for admin dashboard)
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM employees ORDER BY created_at DESC'
        );
        res.json({ success: true, employees: rows });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Get single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }
        
        res.json({ success: true, employee: rows[0] });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST: Create new employee (admin creates account)
app.post('/api/employees', async (req, res) => {
    try {
        const { username, password, phone, jobTitle, salary, startDate, contractTerms } = req.body;
        
        // Generate unique ID
        const employeeId = `emp_${Date.now()}`;
        
        // Insert into database
        await pool.query(
            `INSERT INTO employees 
            (id, username, password, phone, job_title, salary, start_date, contract_terms) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeId, username, password, phone, jobTitle, salary, startDate, contractTerms]
        );
        
        res.json({ 
            success: true, 
            employeeId,
            message: 'Employee account created successfully' 
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                error: 'Username already exists' 
            });
        }
        
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT: Update employee application (employee completes registration)
app.put('/api/employees/:id/application', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const {
            fullName,
            email,
            phone,
            address,
            nationalId,
            jobTitle,
            idFrontBase64,
            idBackBase64,
            selfieBase64,
            signatureBase64,
            contractAccepted
        } = req.body;
        
        // Update employee record
        await pool.query(
            `UPDATE employees SET
                full_name = ?,
                email = ?,
                phone = ?,
                address = ?,
                national_id = ?,
                job_title = ?,
                id_front_url = ?,
                id_back_url = ?,
                selfie_url = ?,
                signature_url = ?,
                contract_accepted = ?,
                contract_accepted_at = NOW(),
                application_status = 'pending',
                application_submitted_at = NOW(),
                updated_at = NOW()
            WHERE id = ?`,
            [
                fullName,
                email,
                phone,
                address,
                nationalId,
                jobTitle,
                idFrontBase64,
                idBackBase64,
                selfieBase64,
                signatureBase64,
                contractAccepted,
                employeeId
            ]
        );
        
        // Log audit
        await pool.query(
            'INSERT INTO employee_audit_log (employee_id, action, changed_by, changes) VALUES (?, ?, ?, ?)',
            [employeeId, 'application_submitted', fullName, 'Employee completed application form']
        );
        
        res.json({ 
            success: true, 
            message: 'Application submitted successfully' 
        });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT: Update employee status (admin approves/rejects)
app.put('/api/employees/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }
        
        await pool.query(
            'UPDATE employees SET application_status = ?, updated_at = NOW() WHERE id = ?',
            [status, req.params.id]
        );
        
        // Log audit
        await pool.query(
            'INSERT INTO employee_audit_log (employee_id, action, changed_by, changes) VALUES (?, ?, ?, ?)',
            [req.params.id, 'status_changed', 'admin', `Status changed to ${status}`]
        );
        
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE: Delete employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== JOIN REQUESTS ENDPOINTS ====================

// GET: Get all join requests
app.get('/api/join-requests', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM join_requests ORDER BY created_at DESC'
        );
        res.json({ success: true, requests: rows });
    } catch (error) {
        console.error('Error fetching join requests:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST: Create join request
app.post('/api/join-requests', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO join_requests (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );
        
        res.json({ 
            success: true, 
            id: result.insertId,
            message: 'Join request submitted successfully' 
        });
    } catch (error) {
        console.error('Error creating join request:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ 
            success: true, 
            message: 'API is running',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Employee API Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME || 'akram_employees'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await pool.end();
    process.exit(0);
});
