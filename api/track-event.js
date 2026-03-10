/**
 * Vercel Serverless Function - Meta Conversions API Proxy
 * 
 * Endpoint: /api/track-event
 * Method: POST
 * 
 * Body Example:
 * {
 *   "eventName": "Purchase",
 *   "eventId": "order_12345",
 *   "productId": "course-ai",
 *   "productName": "كورس AI Marketing",
 *   "value": 597,
 *   "currency": "EGP",
 *   "userEmail": "user@example.com",
 *   "userPhone": "01555512778"
 * }
 */

const crypto = require('crypto');

const PIXEL_ID = '4345157159075105';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';

// SHA-256 hashing
function hashSHA256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Main handler
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.akrammostafa.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      eventName,
      eventId,
      productId,
      productName,
      value,
      currency = 'EGP',
      userEmail,
      userPhone,
      userName,
      sourceUrl
    } = req.body;

    // Validate required fields
    if (!eventName) {
      return res.status(400).json({ error: 'eventName is required' });
    }

    // Build event data
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: sourceUrl || 'https://www.akrammostafa.com',
      action_source: 'website',
      user_data: {},
      custom_data: {}
    };

    // Add event_id for deduplication
    if (eventId) {
      eventData.event_id = eventId;
    }

    // Add custom data
    if (productId && productName) {
      eventData.custom_data = {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        value: value || 0,
        currency: currency
      };
    }

    // Enhanced Match - hash user data
    if (userEmail) {
      eventData.user_data.em = hashSHA256(userEmail.toLowerCase().trim());
    }
    if (userPhone) {
      const cleanPhone = userPhone.replace(/\D/g, '');
      eventData.user_data.ph = hashSHA256(cleanPhone);
    }
    if (userName) {
      const names = userName.split(' ');
      eventData.user_data.fn = hashSHA256(names[0].toLowerCase());
      if (names.length > 1) {
        eventData.user_data.ln = hashSHA256(names[names.length - 1].toLowerCase());
      }
    }

    // Get client IP and user agent
    eventData.user_data.client_ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    eventData.user_data.client_user_agent = req.headers['user-agent'];

    // Send to Meta Conversions API
    const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: ACCESS_TOKEN
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Meta API Error:', result);
      return res.status(response.status).json({ 
        success: false, 
        error: result 
      });
    }

    console.log('✅ Event tracked:', eventName, productName || '');
    
    return res.status(200).json({ 
      success: true, 
      result,
      eventName,
      pixelId: PIXEL_ID
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
