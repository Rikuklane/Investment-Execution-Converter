// CI Test Runner - Simplified for GitHub Actions
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function runCITests() {
    console.log('🧪 Running CI Tests for Investment Converter...\n');
    
    try {
        // Setup DOM environment
        const dom = new JSDOM(`
          <!DOCTYPE html>
          <html>
            <body>
              <textarea id="cryptoSymbols">BTC,ETH</textarea>
              <textarea id="stockSymbols">AAPL,MSFT</textarea>
              <script src="../app.js"></script>
            </body>
          </html>
        `, { runScripts: "dangerously", resources: "usable" });
        
        global.window = dom.window;
        global.document = dom.window.document;
        global.localStorage = {
            data: {},
            getItem: function(key) { return this.data[key] || null; },
            setItem: function(key, value) { this.data[key] = value; }
        };
        
        // Mock external dependencies
        global.window.Papa = {
            parse: function(file, config) {
                const mockData = [
                    { TEHINGUPÄEV: '2024-10-30', SÜMBOL: 'XAD5', VÄRTPABER: 'db Physical Gold ETC (EUR)', 
                        VALUUTA: 'EUR', KOGUS: '0.080', HIND: '247.66', NETOSUMMA: '-19.80', TEENUSTASU: '-0.20' }
                ];
                setTimeout(() => config.complete({ data: mockData }), 100);
            }
        };
        
        global.window.XLSX = {
            utils: { aoa_to_sheet: () => ({}), book_new: () => ({}), book_append_sheet: () => {} },
            writeFile: () => {}
        };
        
        // Wait for app to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const converter = new global.window.InvestmentConverter();
        let passed = 0;
        let total = 0;
        
        // Test 1: Static Symbol Database
        console.log('🧪 Testing static symbol database...');
        const staticTests = [
            { symbol: 'BTC', expected: 'Crypto' },
            { symbol: 'AAPL', expected: 'Stock' },
            { symbol: 'SPY', expected: 'ETF' },
            { symbol: 'TLT', expected: 'Bond' }
        ];
        
        staticTests.forEach(test => {
            total++;
            const result = converter.symbolDatabase[test.symbol];
            if (result && result.type === test.expected) {
                console.log(`✅ ${test.symbol}: ${test.expected}`);
                passed++;
            } else {
                console.log(`❌ ${test.symbol}: Expected ${test.expected}, Got ${result?.type}`);
            }
        });
        
        // Test 2: Account Name Extraction
        console.log('\n🧪 Testing account name extraction...');
        total++;
        const testFileName = 'LHV_2025_Metallid.csv';
        const expectedAccount = 'LHV';
        const actualAccount = testFileName.replace(/\.[^/.]+$/, '').split('_')[0];
        
        if (actualAccount === expectedAccount) {
            console.log(`✅ Account extraction: ${expectedAccount}`);
            passed++;
        } else {
            console.log(`❌ Account extraction: Expected ${expectedAccount}, Got ${actualAccount}`);
        }
        
        // Test 3: Pattern Recognition
        console.log('\n🧪 Testing pattern recognition...');
        const patternTests = [
            { symbol: 'UNKNOWN1', expected: 'Stock' },
            { symbol: 'SPY ETF', expected: 'ETF' },
            { symbol: 'US_TREASURY', expected: 'Bond' }
        ];
        
        patternTests.forEach(test => {
            total++;
            const result = converter.detectSymbolTypeByPattern(test.symbol);
            if (result === test.expected) {
                console.log(`✅ Pattern ${test.symbol}: ${test.expected}`);
                passed++;
            } else {
                console.log(`❌ Pattern ${test.symbol}: Expected ${test.expected}, Got ${result}`);
            }
        });
        
        // Test 4: File Processing
        console.log('\n🧪 Testing file processing...');
        total++;
        const mockFile = new Blob(['test'], { type: 'text/csv' });
        mockFile.name = 'LHV_2025_Metallid.csv';
        
        try {
            const transactions = await converter.parseFile(mockFile);
            if (transactions.length > 0 && transactions[0].Account === 'LHV') {
                console.log(`✅ File processing: ${transactions.length} transactions`);
                passed++;
            } else {
                console.log('❌ File processing: Failed to process correctly');
            }
        } catch (error) {
            console.log(`❌ File processing failed: ${error.message}`);
        }
        
        // Results
        console.log(`\n📊 Test Results: ${passed}/${total} passed`);
        
        if (passed === total) {
            console.log('✅ All tests passed!');
            process.exit(0);
        } else {
            console.log(`❌ ${total - passed} tests failed`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error('❌ CI test setup failed:', error.message);
        process.exit(1);
    }
}

runCITests();
