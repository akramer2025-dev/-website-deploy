/**
 * Social Media Analyzer with Puppeteer + Computer Vision
 * Fully automated analysis with OCR support
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Enable stealth mode to avoid detection
puppeteer.use(StealthPlugin());

class SocialMediaAnalyzer {
    constructor(options = {}) {
        this.options = {
            headless: options.headless !== false,
            timeout: options.timeout || 30000,
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ...options
        };
        
        this.browser = null;
        this.screenshotsDir = path.join(__dirname, '../screenshots');
    }
    
    async init() {
        if (this.browser) return;
        
        console.log('🚀 Launching browser...');
        
        // Ensure screenshots directory exists
        try {
            await fs.mkdir(this.screenshotsDir, { recursive: true });
        } catch (err) {
            // Directory already exists
        }
        
        this.browser = await puppeteer.launch({
            headless: this.options.headless ? 'new' : false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled'
            ],
            defaultViewport: this.options.viewport
        });
        
        console.log('✅ Browser launched');
    }
    
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            console.log('👋 Browser closed');
        }
    }
    
    /**
     * Analyze all provided social media links
     */
    async analyzeAll(links) {
        await this.init();
        
        const results = {
            platforms: [],
            summary: {
                totalFollowers: 0,
                totalPosts: 0,
                avgEngagement: 0,
                platformsCount: 0
            },
            strengths: [],
            weaknesses: [],
            recommendations: []
        };
        
        try {
            // Instagram
            if (links.instagram) {
                console.log('📸 Analyzing Instagram...');
                const igData = await this.analyzeInstagram(links.instagram);
                if (igData) {
                    results.instagram_followers = igData.followers;
                    results.instagram_posts = igData.posts;
                    results.instagram_engagement = igData.engagement;
                    results.platforms.push({ platform: 'Instagram', ...igData });
                    results.summary.totalFollowers += igData.followers || 0;
                    results.summary.totalPosts += igData.posts || 0;
                }
            }
            
            // TikTok
            if (links.tiktok) {
                console.log('🎵 Analyzing TikTok...');
                const ttData = await this.analyzeTikTok(links.tiktok);
                if (ttData) {
                    results.tiktok_followers = ttData.followers;
                    results.tiktok_videos = ttData.videos;
                    results.platforms.push({ platform: 'TikTok', ...ttData });
                    results.summary.totalFollowers += ttData.followers || 0;
                    results.summary.totalPosts += ttData.videos || 0;
                }
            }
            
            // Facebook
            if (links.facebook) {
                console.log('📘 Analyzing Facebook...');
                const fbData = await this.analyzeFacebook(links.facebook);
                if (fbData) {
                    results.facebook_followers = fbData.followers;
                    results.platforms.push({ platform: 'Facebook', ...fbData });
                    results.summary.totalFollowers += fbData.followers || 0;
                }
            }
            
            // YouTube
            if (links.youtube) {
                console.log('📹 Analyzing YouTube...');
                const ytData = await this.analyzeYouTube(links.youtube);
                if (ytData) {
                    results.youtube_subscribers = ytData.subscribers;
                    results.platforms.push({ platform: 'YouTube', ...ytData });
                    results.summary.totalFollowers += ytData.subscribers || 0;
                }
            }
            
            results.summary.platformsCount = results.platforms.length;
            
            // Generate insights
            this.generateInsights(results);
            
        } finally {
            await this.close();
        }
        
        return results;
    }
    
    /**
     * Analyze Instagram profile
     */
    async analyzeInstagram(url) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent(this.options.userAgent);
            
            console.log(`  → Opening ${url}`);
            await page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: this.options.timeout 
            });
            
            // Wait for content to load
            await page.waitForTimeout(3000);
            
            // Try to extract from meta tags first (faster)
            let followers = await page.evaluate(() => {
                const meta = document.querySelector('meta[property="og:description"]');
                if (meta) {
                    const match = meta.content.match(/(\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?[KMB]?)\s*(?:Followers|followers|متابع)/i);
                    if (match) {
                        let num = match[1].replace(/[,\s]/g, '');
                        if (num.includes('K')) return parseFloat(num) * 1000;
                        if (num.includes('M')) return parseFloat(num) * 1000000;
                        if (num.includes('B')) return parseFloat(num) * 1000000000;
                        return parseInt(num);
                    }
                }
                return null;
            });
            
            // If meta extraction failed, try selectors
            if (!followers) {
                followers = await page.evaluate(() => {
                    // Try multiple selectors
                    const selectors = [
                        'header section ul li:first-child span[title]',
                        'header section ul li:first-child span',
                        'a[href*="followers"] span'
                    ];
                    
                    for (const selector of selectors) {
                        const el = document.querySelector(selector);
                        if (el) {
                            const text = el.title || el.textContent;
                            const num = text.replace(/[^0-9KMB.]/g, '');
                            if (num) {
                                if (num.includes('K')) return parseFloat(num) * 1000;
                                if (num.includes('M')) return parseFloat(num) * 1000000;
                                return parseInt(num.replace(/,/g, ''));
                            }
                        }
                    }
                    return null;
                });
            }
            
            // If still no data, use OCR on screenshot
            if (!followers) {
                console.log('  → Using OCR for Instagram followers...');
                const screenshotPath = path.join(this.screenshotsDir, `ig_${Date.now()}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: false });
                
                followers = await this.extractNumberFromImage(screenshotPath, ['followers', 'متابع']);
            }
            
            // Extract posts count
            const posts = await page.evaluate(() => {
                const selectors = [
                    'header section ul li:nth-child(1) span',
                    'span:has-text("posts")',
                    'span:has-text("منشور")'
                ];
                
                for (const selector of selectors) {
                    const el = document.querySelector(selector);
                    if (el && /\d+/.test(el.textContent)) {
                        return parseInt(el.textContent.replace(/[^0-9]/g, ''));
                    }
                }
                return null;
            });
            
            console.log(`  ✅ Instagram: ${followers?.toLocaleString() || 'N/A'} followers, ${posts || 'N/A'} posts`);
            
            return {
                followers: followers || 0,
                posts: posts || 0,
                engagement: null,
                url
            };
            
        } catch (error) {
            console.error('  ❌ Instagram error:', error.message);
            return null;
        } finally {
            await page.close();
        }
    }
    
    /**
     * Analyze TikTok profile
     */
    async analyzeTikTok(url) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent(this.options.userAgent);
            
            console.log(`  → Opening ${url}`);
            await page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: this.options.timeout 
            });
            
            await page.waitForTimeout(4000);
            
            // Extract followers
            const followers = await page.evaluate(() => {
                const selectors = [
                    '[data-e2e="followers-count"]',
                    '[title*="Followers"]',
                    'strong[data-e2e="followers-count"]'
                ];
                
                for (const selector of selectors) {
                    const el = document.querySelector(selector);
                    if (el) {
                        let text = el.textContent || el.title;
                        text = text.replace(/[^0-9KMB.]/g, '');
                        if (text.includes('K')) return parseFloat(text) * 1000;
                        if (text.includes('M')) return parseFloat(text) * 1000000;
                        return parseInt(text.replace(/,/g, ''));
                    }
                }
                return null;
            });
            
            // Extract videos count
            const videos = await page.evaluate(() => {
                const el = document.querySelector('[data-e2e="videos-count"]');
                return el ? parseInt(el.textContent.replace(/[^0-9]/g, '')) : null;
            });
            
            console.log(`  ✅ TikTok: ${followers?.toLocaleString() || 'N/A'} followers, ${videos || 'N/A'} videos`);
            
            return {
                followers: followers || 0,
                videos: videos || 0,
                url
            };
            
        } catch (error) {
            console.error('  ❌ TikTok error:', error.message);
            return null;
        } finally {
            await page.close();
        }
    }
    
    /**
     * Analyze Facebook page
     */
    async analyzeFacebook(url) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent(this.options.userAgent);
            
            console.log(`  → Opening ${url}`);
            await page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: this.options.timeout 
            });
            
            await page.waitForTimeout(3000);
            
            // Facebook is tricky, use OCR
            const screenshotPath = path.join(this.screenshotsDir, `fb_${Date.now()}.png`);
            await page.screenshot({ path: screenshotPath });
            
            const followers = await this.extractNumberFromImage(screenshotPath, ['followers', 'likes', 'متابع', 'إعجاب']);
            
            console.log(`  ✅ Facebook: ${followers?.toLocaleString() || 'N/A'} followers`);
            
            return {
                followers: followers || 0,
                url
            };
            
        } catch (error) {
            console.error('  ❌ Facebook error:', error.message);
            return null;
        } finally {
            await page.close();
        }
    }
    
    /**
     * Analyze YouTube channel
     */
    async analyzeYouTube(url) {
        const page = await this.browser.newPage();
        
        try {
            await page.setUserAgent(this.options.userAgent);
            
            console.log(`  → Opening ${url}`);
            await page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: this.options.timeout 
            });
            
            await page.waitForTimeout(3000);
            
            const subscribers = await page.evaluate(() => {
                const el = document.querySelector('#subscriber-count');
                if (el) {
                    const text = el.textContent;
                    const match = text.match(/(\d+\.?\d*)\s*([KMB]?)/);
                    if (match) {
                        let num = parseFloat(match[1]);
                        if (match[2] === 'K') num *= 1000;
                        if (match[2] === 'M') num *= 1000000;
                        if (match[2] === 'B') num *= 1000000000;
                        return Math.round(num);
                    }
                }
                return null;
            });
            
            console.log(`  ✅ YouTube: ${subscribers?.toLocaleString() || 'N/A'} subscribers`);
            
            return {
                subscribers: subscribers || 0,
                url
            };
            
        } catch (error) {
            console.error('  ❌ YouTube error:', error.message);
            return null;
        } finally {
            await page.close();
        }
    }
    
    /**
     * Extract number from image using OCR
     */
    async extractNumberFromImage(imagePath, keywords = []) {
        try {
            // Enhance image for better OCR
            const enhancedPath = imagePath.replace('.png', '_enhanced.png');
            await sharp(imagePath)
                .greyscale()
                .normalize()
                .sharpen()
                .threshold(128)
                .toFile(enhancedPath);
            
            // Run OCR
            const { data: { text } } = await Tesseract.recognize(enhancedPath, 'eng+ara', {
                logger: () => {} // Suppress logs
            });
            
            // Extract numbers near keywords
            const lines = text.split('\n');
            for (const line of lines) {
                const lowerLine = line.toLowerCase();
                const hasKeyword = keywords.some(kw => lowerLine.includes(kw.toLowerCase()));
                
                if (hasKeyword) {
                    const match = line.match(/(\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?)\s*([KMB]?)/i);
                    if (match) {
                        let num = parseFloat(match[1].replace(/[,\s]/g, ''));
                        if (match[2] === 'K') num *= 1000;
                        if (match[2] === 'M') num *= 1000000;
                        if (match[2] === 'B') num *= 1000000000;
                        return Math.round(num);
                    }
                }
            }
            
            // Clean up
            await fs.unlink(enhancedPath).catch(() => {});
            await fs.unlink(imagePath).catch(() => {});
            
            return null;
        } catch (error) {
            console.error('OCR error:', error.message);
            return null;
        }
    }
    
    /**
     * Generate insights from analyzed data
     */
    generateInsights(results) {
        const { summary } = results;
        
        // Strengths
        if (summary.totalFollowers > 5000) {
            results.strengths.push(`✅ قاعدة متابعين قوية: ${summary.totalFollowers.toLocaleString()} متابع إجمالاً`);
        }
        
        if (summary.platformsCount >= 3) {
            results.strengths.push(`✅ تواجد على ${summary.platformsCount} منصات - استراتيجية قوية`);
        }
        
        // Weaknesses
        if (summary.totalFollowers < 1000) {
            results.weaknesses.push(`⚠️ قاعدة المتابعين صغيرة - محتاج حملات نمو`);
        }
        
        if (summary.platformsCount < 2) {
            results.weaknesses.push(`⚠️ تواجد محدود - يُنصح بزيادة المنصات`);
        }
        
        // Recommendations
        results.recommendations.push(`💡 ركز على المحتوى التفاعلي (ريلز، stories، challenges)`);
        results.recommendations.push(`💡 انشر بانتظام (3-5 مرات أسبوعياً على الأقل)`);
        
        if (results.instagram_followers) {
            results.recommendations.push(`💡 استخدم Instagram Ads لزيادة الوصول`);
        }
        
        if (!results.tiktok_followers) {
            results.recommendations.push(`💡 افتح حساب TikTok - المنصة الأسرع نمواً حالياً`);
        }
    }
}

module.exports = SocialMediaAnalyzer;
