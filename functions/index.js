const functions = require('firebase-functions');
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// تهيئة Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'https://linkcall.akrammostafa.com',
        'https://linkcall-akram.web.app',
        'https://akrammostafa.com',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعدادات Twilio من Environment Variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);

// ==================== API التوكن ====================
app.get('/api/token', async (req, res) => {
    try {
        const identity = req.query.identity || 'user_' + Date.now();
        
        const AccessToken = twilio.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;
        
        const token = new AccessToken(accountSid, twimlAppSid, authToken, {
            identity: identity,
            ttl: 3600
        });
        
        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: twimlAppSid,
            incomingAllow: true
        });
        
        token.addGrant(voiceGrant);
        
        res.json({
            token: token.toJwt(),
            identity: identity
        });
    } catch (error) {
        console.error('خطأ في إنشاء التوكن:', error);
        res.status(500).json({ 
            error: 'فشل في إنشاء التوكن',
            details: error.message 
        });
    }
});

// ==================== معالجة المكالمات ====================
app.post('/api/voice', async (req, res) => {
    try {
        const twiml = new twilio.twiml.VoiceResponse();
        const to = req.body.To;
        
        if (to) {
            const dial = twiml.dial({
                callerId: twilioPhoneNumber,
                record: 'record-from-answer',
                recordingStatusCallback: '/api/recording',
                recordingStatusCallbackMethod: 'POST'
            });
            
            if (to.startsWith('client:')) {
                dial.client(to.replace('client:', ''));
            } else {
                dial.number(to);
            }
        } else {
            twiml.say({ voice: 'Google.ar-XA-Standard-A', language: 'ar-XA' }, 
                'مرحباً بك في نظام Link Call');
        }
        
        res.type('text/xml');
        res.send(twiml.toString());
    } catch (error) {
        console.error('خطأ في معالجة المكالمة:', error);
        res.status(500).send('Error processing call');
    }
});

// ==================== حفظ التسجيلات ====================
app.post('/api/recording', async (req, res) => {
    try {
        const recordingUrl = req.body.RecordingUrl;
        const callSid = req.body.CallSid;
        const duration = req.body.RecordingDuration;
        
        // حفظ معلومات التسجيل في Firestore
        await admin.firestore().collection('recordings').add({
            callSid: callSid,
            recordingUrl: recordingUrl,
            duration: duration,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ تم حفظ التسجيل:', callSid);
        res.sendStatus(200);
    } catch (error) {
        console.error('خطأ في حفظ التسجيل:', error);
        res.status(500).send('Error saving recording');
    }
});

// ==================== حالة المكالمة ====================
app.post('/api/call-status', async (req, res) => {
    try {
        const callSid = req.body.CallSid;
        const callStatus = req.body.CallStatus;
        
        // حفظ حالة المكالمة في Firestore
        await admin.firestore().collection('calls').doc(callSid).set({
            status: callStatus,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('📞 حالة المكالمة:', callSid, callStatus);
        res.sendStatus(200);
    } catch (error) {
        console.error('خطأ في تحديث حالة المكالمة:', error);
        res.status(500).send('Error updating call status');
    }
});

// ==================== صحة النظام ====================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'LinkCall API'
    });
});

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(app);
