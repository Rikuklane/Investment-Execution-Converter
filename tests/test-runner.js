// Node.js Test Runner for Investment Converter
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.setupDOM();
    }

    setupDOM() {
        // Setup DOM environment for testing
        const dom = new JSDOM(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
            </head>
            <body>
              <div id="testResults"></div>
              <textarea id="cryptoSymbols">BTC,ETH</textarea>
              <textarea id="stockSymbols">AAPL,MSFT</textarea>
              <script src="../app-test.js"></script>
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
        
        // Mock Papa Parse
        global.window.Papa = {
            parse: function(file, config) {
                // Mock CSV parsing with sample data
                const mockData = [
                    { TEHINGUPÄEV: '2024-10-30', SÜMBOL: 'XAD5', VÄRTPABER: 'db Physical Gold ETC (EUR)', 
                        VALUUTA: 'EUR', KOGUS: '0.080', HIND: '247.66', NETOSUMMA: '-19.80', TEENUSTASU: '-0.20' },
                    { TEHINGUPÄEV: '2024-10-30', SÜMBOL: 'XAD6', VÄRTPABER: 'Xtrackers Physical Silver ETC EUR', 
                        VALUUTA: 'EUR', KOGUS: '0.067', HIND: '296.60', NETOSUMMA: '-19.80', TEENUSTASU: '-0.20' }
                ];
                setTimeout(() => config.complete({ data: mockData }), 100);
            }
        };
        
        // Mock XLSX
        global.window.XLSX = {
            utils: {
                aoa_to_sheet: () => ({}),
                book_new: () => ({}),
                book_append_sheet: () => {}
            },
            writeFile: () => {}
        };
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Investment Converter Tests...\n');
        
        // Load the converter directly
        const InvestmentConverter = require(path.join(__dirname, 'app.test.js'));
        
        // Wait for app to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const converter = new InvestmentConverter();
        
        for (const test of this.tests) {
            try {
                await test.testFn(converter);
                this.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ ${test.name}: ${error.message}`);
            }
        }
        
        this.printResults();
        process.exit(this.failed > 0 ? 1 : 0);
    }

    printResults() {
        console.log('\n📊 Test Results:');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📊 Total: ${this.passed + this.failed}`);
        console.log(`🎯 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}. Expected: ${expected}, Got: ${actual}`);
        }
    }
}

// Define tests
const testRunner = new TestRunner();

// Test 1: Static Symbol Database
testRunner.test('Static Symbol Database', (converter) => {
    const testCases = [
        { symbol: 'BTC', expected: 'Crypto' },
        { symbol: 'AAPL', expected: 'Stock' },
        { symbol: 'SPY', expected: 'ETF' },
        { symbol: 'TLT', expected: 'Bond' }
    ];
    
    testCases.forEach(testCase => {
        const result = converter.symbolDatabase[testCase.symbol];
        testRunner.assert(result && result.type === testCase.expected, 
            `Expected ${testCase.symbol} to be ${testCase.expected}`);
    });
});

// Test 2: Account Name Extraction
testRunner.test('Account Name Extraction', () => {
    const testFileName = 'LHV_2025_Metallid.csv';
    const expectedAccount = 'LHV';
    const actualAccount = testFileName.replace(/\.[^/.]+$/, '').split('_')[0];
    
    testRunner.assertEqual(actualAccount, expectedAccount, 
        'Account name extraction should work with underscore separation');
});

// Test 3: Pattern Recognition
testRunner.test('Pattern Recognition', (converter) => {
    const testCases = [
        { symbol: 'UNKNOWN1', expected: 'Stock' },
        { symbol: 'SPY ETF', expected: 'ETF' },
        { symbol: 'US_TREASURY', expected: 'Bond' }
    ];
    
    testCases.forEach(testCase => {
        const result = converter.detectSymbolTypeByPattern(testCase.symbol);
        testRunner.assertEqual(result, testCase.expected, 
            `Pattern recognition for ${testCase.symbol}`);
    });
});

// Test 4: File Processing
testRunner.test('File Processing', async (converter) => {
    const mockFile = new Blob(['test'], { type: 'text/csv' });
    mockFile.name = 'LHV_2025_Metallid.csv';
    
    const transactions = await converter.parseFile(mockFile);
    
    testRunner.assert(transactions.length > 0, 'Should process transactions');
    testRunner.assertEqual(transactions[0].Account, 'LHV', 
        'Should extract account name correctly');
});

// Test 5: Real CSV File Processing
testRunner.test('Real CSV File Processing', async (converter) => {
    const csvPath = path.join(__dirname, 'resources', 'LHV_2025_Metallid.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.log('⚠️  Skipping real CSV test - file not found');
        return;
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const mockFile = new Blob([csvContent], { type: 'text/csv' });
    mockFile.name = 'LHV_2025_Metallid.csv';
    
    // Override Papa Parse to use real data
    global.window.Papa.parse = function(file, config) {
        fs.readFile(csvPath, 'utf8', (err, data) => {
            if (err) {
                config.error(err);
                return;
            }
            
            // Parse CSV manually for simplicity
            const lines = data.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
            const results = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                results.push(row);
            }
            
            config.complete({ data: results });
        });
    };
    
    const transactions = await converter.parseFile(mockFile);
    
    testRunner.assert(transactions.length > 0, 'Should process real CSV file');
    testRunner.assertEqual(transactions[0].Account, 'LHV', 
        'Should extract account name from real file');
    
    // Check for ETC symbols
    const etcSymbols = transactions.filter(t => t.Symbol === 'XAD5' || t.Symbol === 'XAD6');
    testRunner.assert(etcSymbols.length > 0, 'Should find ETC symbols in real file');
});

// Run tests
testRunner.run().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});
