const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔧 Setting up database...\n');
    
    try {
        // Connect WITHOUT specifying database (to create it)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Read and execute schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📝 Executing schema.sql...');
        await connection.query(schema);
        
        console.log('✅ Database and tables created successfully!');
        console.log('📊 Database: akram_employees');
        console.log('📋 Tables: employees, employee_audit_log, join_requests');
        
        await connection.end();
        
        console.log('\n🎉 Database setup complete!');
        console.log('\n📌 Next steps:');
        console.log('   1. Run: npm install');
        console.log('   2. Copy .env.example to .env');
        console.log('   3. Update .env with your MySQL credentials');
        console.log('   4. Run: npm start\n');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    }
}

setupDatabase();
