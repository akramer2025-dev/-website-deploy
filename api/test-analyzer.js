/**
 * Test script for Social Media Analyzer
 * Usage: node test-analyzer.js
 */

const SocialAnalyzer = require('./analyzers/social-analyzer');

async function test() {
    console.log('🧪 Testing Social Media Analyzer...\n');
    
    const analyzer = new SocialAnalyzer({
        headless: false, // Set to true for production
        timeout: 30000
    });
    
    const testLinks = {
        // Replace with real test accounts
        instagram: 'https://www.instagram.com/cristiano/', // Example: Cristiano Ronaldo
        tiktok: 'https://www.tiktok.com/@khaby.lame', // Example: Khaby Lame
        // youtube: 'https://www.youtube.com/@MrBeast',
        // facebook: 'https://www.facebook.com/facebook'
    };
    
    try {
        console.log('📊 Analyzing accounts:');
        Object.entries(testLinks).forEach(([platform, url]) => {
            console.log(`  - ${platform}: ${url}`);
        });
        console.log('');
        
        const results = await analyzer.analyzeAll(testLinks);
        
        console.log('\n✅ Analysis Complete!\n');
        console.log('📈 Results:');
        console.log(JSON.stringify(results, null, 2));
        
        console.log('\n💡 Insights:');
        console.log('Strengths:');
        results.strengths.forEach(s => console.log(`  ${s}`));
        console.log('Weaknesses:');
        results.weaknesses.forEach(w => console.log(`  ${w}`));
        console.log('Recommendations:');
        results.recommendations.forEach(r => console.log(`  ${r}`));
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
    }
}

test();
