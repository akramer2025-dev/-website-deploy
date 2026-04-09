/**
 * Social Media Analyzer API Server
 * Full automation with Puppeteer + Computer Vision (OCR)
 * By: Akram Mostafa
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SocialAnalyzer = require('./analyzers/social-analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // Or allow all origins in development
        if (!origin || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Rate limiting (simple in-memory)
const requestCounts = new Map();
const RATE_LIMIT = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10;

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = requestCounts.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < 60000);
    
    if (recentRequests.length >= RATE_LIMIT) {
        return false;
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    return true;
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Social Media Analyzer API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Main analysis endpoint
app.post('/api/analyze-social', async (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
            error: 'Too many requests',
            message: 'يرجى الانتظار قليلاً قبل إرسال طلب جديد'
        });
    }
    
    try {
        const { links, options = {} } = req.body;
        
        if (!links || typeof links !== 'object') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'يرجى تقديم روابط الحسابات بشكل صحيح'
            });
        }
        
        console.log('🔍 Starting analysis for:', Object.keys(links).filter(k => links[k]));
        
        const analyzer = new SocialAnalyzer({
            headless: process.env.HEADLESS !== 'false',
            timeout: parseInt(process.env.BROWSER_TIMEOUT) || 30000,
            ...options
        });
        
        const results = await analyzer.analyzeAll(links);
        
        console.log('✅ Analysis completed:', results.summary);
        
        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Analysis error:', error);
        
        res.status(500).json({
            error: error.message,
            message: 'حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Single platform analysis
app.post('/api/analyze/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        const { url, options = {} } = req.body;
        
        if (!url) {
            return res.status(400).json({
                error: 'Missing URL',
                message: 'يرجى تقديم رابط الحساب'
            });
        }
        
        const analyzer = new SocialAnalyzer(options);
        
        let result;
        switch(platform.toLowerCase()) {
            case 'instagram':
                result = await analyzer.analyzeInstagram(url);
                break;
            case 'tiktok':
                result = await analyzer.analyzeTikTok(url);
                break;
            case 'facebook':
                result = await analyzer.analyzeFacebook(url);
                break;
            case 'youtube':
                result = await analyzer.analyzeYouTube(url);
                break;
            default:
                return res.status(400).json({
                    error: 'Unsupported platform',
                    message: 'المنصة غير مدعومة'
                });
        }
        
        res.json({
            success: true,
            platform,
            data: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error(`❌ ${req.params.platform} analysis error:`, error);
        
        res.status(500).json({
            error: error.message,
            message: 'حدث خطأ أثناء التحليل'
        });
    }
});

// Test endpoint (development only)
if (process.env.NODE_ENV === 'development') {
    app.get('/api/test', async (req, res) => {
        const { url } = req.query;
        
        if (!url) {
            return res.json({
                message: 'استخدم: /api/test?url=https://instagram.com/example'
            });
        }
        
        try {
            const analyzer = new SocialAnalyzer({ headless: false });
            const result = await analyzer.analyzeInstagram(url);
            res.json({ success: true, result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'حدث خطأ في الخادم'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  🤖 Social Media Analyzer API                            ║
║  📡 Server running on: http://localhost:${PORT}           ║
║  🔧 Environment: ${process.env.NODE_ENV || 'production'}                      ║
║  ⚡ Ready to analyze social media accounts!              ║
╚══════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
