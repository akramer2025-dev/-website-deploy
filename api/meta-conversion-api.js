/**
 * =====================================================
 *  Meta Conversions API - Server-Side Event Tracking
 *  الموقع: akrammostafa.com
 *  Pixel ID: 1242154784695296
 * =====================================================
 * 
 *  هذا الملف يرسل الأحداث من السيرفر مباشرة لـ Meta
 *  بدون اعتماد على JavaScript في المتصفح
 *  
 *  الفائدة:
 *  - يتجاوز AdBlockers
 *  - يتجاوز iOS 14+ ATT
 *  - دقة 95%+ بدلاً من 65-70%
 * =====================================================
 */

// ⚠️ استبدل هذه القيم بالقيم الحقيقية
const PIXEL_ID = '1242154784695296';
const ACCESS_TOKEN = 'EAAWc2Eqq7AoBREVpPNYByjX9YwN9yO2cyDQAtcYvPfdTPzAeuh0xPEfAiroa6HcbgAmwsQPeZCLMvpQ4aeqBF1hwiSZAkg3goChZBBOEcXir5jkD6pqaaShFL3QCOuqY1kL3lyAqijADJ9PnHRelE1b5pLeJKQoOZAE5iuPd2y2qCC4pwWyNqSKa0E57Y1JofCyPMUG4j3NxBJeF9lfBtqK6pwuF3LhQ6HTPqpjS70SdMHxRT5IZD'; // من Events Manager → Settings → Conversions API

/**
 * Send event to Meta Conversions API
 * @param {object} eventData - Event details
 * @returns {Promise<object>} API response
 */
async function sendToConversionsAPI(eventData) {
  const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;
  
  const payload = {
    data: [eventData],
    access_token: ACCESS_TOKEN
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Conversions API Error:', result);
      return { success: false, error: result };
    }

    console.log('✅ Event sent successfully:', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Track AddToCart event (server-side)
 * Call this from your payment/checkout endpoint
 */
async function trackAddToCart(productId, productName, value, currency = 'EGP', userEmail = null, userPhone = null) {
  const eventData = {
    event_name: 'AddToCart',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: 'https://www.akrammostafa.com',
    action_source: 'website',
    user_data: {},
    custom_data: {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: currency
    }
  };

  // Enhanced Match - إضافة بيانات المستخدم (اختياري)
  if (userEmail) {
    eventData.user_data.em = hashSHA256(userEmail.toLowerCase().trim());
  }
  if (userPhone) {
    eventData.user_data.ph = hashSHA256(userPhone.replace(/\D/g, '')); // أرقام فقط
  }

  return await sendToConversionsAPI(eventData);
}

/**
 * Track Purchase event (server-side)
 * Call this AFTER successful payment
 */
async function trackPurchase(orderId, productId, productName, value, currency = 'EGP', userEmail = null, userPhone = null) {
  const eventData = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: `order_${orderId}_${Date.now()}`, // لمنع التكرار
    event_source_url: 'https://www.akrammostafa.com',
    action_source: 'website',
    user_data: {},
    custom_data: {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: currency,
      order_id: orderId
    }
  };

  // Enhanced Match
  if (userEmail) {
    eventData.user_data.em = hashSHA256(userEmail.toLowerCase().trim());
  }
  if (userPhone) {
    eventData.user_data.ph = hashSHA256(userPhone.replace(/\D/g, ''));
  }

  return await sendToConversionsAPI(eventData);
}

/**
 * Track Lead event (server-side)
 * Call this when user submits contact form or WhatsApp
 */
async function trackLead(contentName, userEmail = null, userPhone = null, userName = null) {
  const eventData = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: 'https://www.akrammostafa.com',
    action_source: 'website',
    user_data: {},
    custom_data: {
      content_name: contentName,
      content_category: 'Lead Form'
    }
  };

  // Enhanced Match
  if (userEmail) {
    eventData.user_data.em = hashSHA256(userEmail.toLowerCase().trim());
  }
  if (userPhone) {
    eventData.user_data.ph = hashSHA256(userPhone.replace(/\D/g, ''));
  }
  if (userName) {
    const names = userName.split(' ');
    eventData.user_data.fn = hashSHA256(names[0].toLowerCase());
    if (names.length > 1) {
      eventData.user_data.ln = hashSHA256(names[names.length - 1].toLowerCase());
    }
  }

  return await sendToConversionsAPI(eventData);
}

/**
 * SHA-256 hash function (required for Enhanced Match)
 * استخدم crypto في Node.js أو Web Crypto API في المتصفح
 */
async function hashSHA256(text) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Browser environment (Web Crypto API)
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

// Export للاستخدام في API endpoints
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackAddToCart,
    trackPurchase,
    trackLead,
    sendToConversionsAPI
  };
}

// Global functions للاستخدام في المتصفح (testing)
if (typeof window !== 'undefined') {
  window.ConversionsAPI = {
    trackAddToCart,
    trackPurchase,
    trackLead
  };
}
