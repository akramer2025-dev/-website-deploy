/**
 * =====================================================
 *  Client-Side Wrapper for Meta Conversions API
 *  
 *  يرسل الأحداث للسيرفر (Conversions API) بالإضافة للبيكسل العادي
 *  هذا يضمن تتبع دقيق حتى مع AdBlockers و iOS 14+
 * =====================================================
 */

// API endpoint (Vercel Serverless Function)
const CONVERSIONS_API_ENDPOINT = '/api/track-event';

/**
 * Send event to server-side Conversions API
 * @param {object} eventData - Event details
 */
async function sendToServer(eventData) {
  try {
    const response = await fetch(CONVERSIONS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Server-side event tracked:', eventData.eventName);
    } else {
      console.warn('⚠️ Server-side tracking failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enhanced fbAddToCart - sends to both Pixel and Conversions API
 */
window.fbAddToCartServer = async function(productId, overridePrice, userEmail = null, userPhone = null) {
  // Get product from catalog
  const product = window.fbGetProduct ? window.fbGetProduct(productId) : null;
  
  if (!product && typeof fbAddToCart === 'function') {
    // Fallback to regular pixel tracking
    return fbAddToCart(productId, overridePrice);
  }

  const value = overridePrice !== undefined ? overridePrice : (product ? product.price : 0);
  const productName = product ? product.name : productId;

  // 1. Send to Browser Pixel (client-side)
  if (typeof fbAddToCart === 'function') {
    fbAddToCart(productId, overridePrice);
  }

  // 2. Send to Conversions API (server-side)
  await sendToServer({
    eventName: 'AddToCart',
    eventId: `addtocart_${productId}_${Date.now()}`,
    productId: productId,
    productName: productName,
    value: value,
    currency: 'EGP',
    userEmail: userEmail,
    userPhone: userPhone,
    sourceUrl: window.location.href
  });
};

/**
 * Enhanced fbPurchase - sends to both Pixel and Conversions API
 */
window.fbPurchaseServer = async function(productId, paidValue, orderId, userEmail = null, userPhone = null) {
  const product = window.fbGetProduct ? window.fbGetProduct(productId) : null;
  
  if (!product && typeof fbPurchase === 'function') {
    return fbPurchase(productId, paidValue);
  }

  const value = paidValue !== undefined ? paidValue : (product ? product.price : 0);
  const productName = product ? product.name : productId;

  // 1. Send to Browser Pixel
  if (typeof fbPurchase === 'function') {
    fbPurchase(productId, paidValue);
  }

  // 2. Send to Conversions API
  await sendToServer({
    eventName: 'Purchase',
    eventId: `order_${orderId || Date.now()}`,
    productId: productId,
    productName: productName,
    value: value,
    currency: 'EGP',
    userEmail: userEmail,
    userPhone: userPhone,
    sourceUrl: window.location.href
  });
};

/**
 * Enhanced fbLead - sends to both Pixel and Conversions API
 */
window.fbLeadServer = async function(params, userName = null, userEmail = null, userPhone = null) {
  // 1. Send to Browser Pixel
  if (typeof fbLead === 'function') {
    fbLead(params);
  }

  // 2. Send to Conversions API
  await sendToServer({
    eventName: 'Lead',
    eventId: `lead_${Date.now()}`,
    productName: params.content_name || 'Lead Form',
    value: params.value || 0,
    currency: params.currency || 'EGP',
    userName: userName,
    userEmail: userEmail,
    userPhone: userPhone,
    sourceUrl: window.location.href
  });
};

/**
 * Get product helper function
 */
window.fbGetProduct = function(productId) {
  // Try to get from global CATALOG if exists
  if (typeof CATALOG !== 'undefined' && CATALOG[productId]) {
    return CATALOG[productId];
  }
  return null;
};

console.log('✅ Meta Conversions API Client loaded');
