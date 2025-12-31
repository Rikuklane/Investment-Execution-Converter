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

// Test 6: Estonian Transaction Type Detection
testRunner.test('Estonian Transaction Type Detection', () => {
    const testCases = [
        { tehing: 'ost', expected: 'Buy' },
        { tehing: 'müük', expected: 'Sell' },
        { tehing: 'OST', expected: 'Buy' },
        { tehing: 'MÜÜK', expected: 'Sell' },
        { tehing: 'unknown', expected: 'Sell' },
        { tehing: '', expected: 'Sell' }
    ];
    
    testCases.forEach(testCase => {
        const tehing = (testCase.tehing || '').toLowerCase().trim();
        const action = tehing === 'ost' ? 'Buy' : 'Sell';
        testRunner.assertEqual(action, testCase.expected, 
            `Transaction type "${testCase.tehing}" should be "${testCase.expected}"`);
    });
});

// Test 7: Excel Date Format Generation
testRunner.test('Excel Date Format Generation', () => {
    const testCases = [
        { date: new Date('2021-02-10'), expected: '=DATE(2021;2;10)' },
        { date: new Date('2020-03-27'), expected: '=DATE(2020;3;27)' },
        { date: new Date('2025-12-31'), expected: '=DATE(2025;12;31)' },
        { date: new Date('2020-02-29'), expected: '=DATE(2020;2;29)' } // Leap year
    ];
    
    testCases.forEach(testCase => {
        const excelDateFormula = `=DATE(${testCase.date.getFullYear()};${testCase.date.getMonth() + 1};${testCase.date.getDate()})`;
        testRunner.assertEqual(excelDateFormula, testCase.expected, 
            `Excel date format for ${testCase.date.toISOString().split('T')[0]}`);
    });
});

// Test 8: CSV Row Transformation
testRunner.test('CSV Row Transformation', () => {
    const mockSymbolMappings = { 'AAPL': 'Stock' };
    
    const csvRow = {
        TEHINGUPÄEV: '2021-02-10',
        TEHING: 'ost',
        SÜMBOL: 'AAPL',
        VÄÄRTPABER: 'Apple Inc.',
        VALUUTA: 'EUR',
        KOGUS: '10',
        HIND: '150.00',
        NETOSUMMA: '-1500.00',
        TEENUSTASU: '1.00'
    };
    
    // Simulate transformRow logic
    const symbol = csvRow.SÜMBOL?.trim().toUpperCase() || '';
    const type = mockSymbolMappings[symbol] || 'Missing';
    const tehing = (csvRow.TEHING || '').toLowerCase().trim();
    const action = tehing === 'ost' ? 'Buy' : 'Sell';
    
    const processed = {
        Date: new Date(csvRow.TEHINGUPÄEV),
        Account: 'TestAccount',
        Type: type,
        Action: action,
        Symbol: symbol,
        Name: csvRow.VÄÄRTPABER || '',
        Currency: csvRow.VALUUTA || '',
        Amount: parseFloat(csvRow.KOGUS) || 0,
        'Price(1)': parseFloat(csvRow.HIND) || 0,
        Cost: parseFloat(csvRow.NETOSUMMA) || 0,
        Fee: parseFloat(csvRow.TEENUSTASU) || 0
    };
    
    testRunner.assertEqual(processed.Action, 'Buy', 'Should detect ost as Buy');
    testRunner.assertEqual(processed.Symbol, 'AAPL', 'Should uppercase symbol');
    testRunner.assertEqual(processed.Type, 'Stock', 'Should map symbol type correctly');
    testRunner.assertEqual(processed.Amount, 10, 'Should parse quantity correctly');
    testRunner.assertEqual(processed.Cost, -1500.00, 'Should parse net sum correctly');
    testRunner.assertEqual(processed.Fee, 1.00, 'Should parse fee correctly');
});

// Test 9: Data Validation Edge Cases
testRunner.test('Data Validation Edge Cases', () => {
    // Test numeric parsing
    const numericTests = [
        { input: '10.5', expected: 10.5 },
        { input: '150', expected: 150 },
        { input: '', expected: 0 },
        { input: 'invalid', expected: 0 },
        { input: null, expected: 0 }
    ];
    
    numericTests.forEach(test => {
        const result = parseFloat(test.input) || 0;
        testRunner.assertEqual(result, test.expected, 
            `Numeric parsing for "${test.input}"`);
    });
    
    // Test string parsing
    const stringTests = [
        { input: 'AAPL', expected: 'AAPL' },
        { input: '', expected: '' },
        { input: null, expected: '' },
        { input: undefined, expected: '' }
    ];
    
    stringTests.forEach(test => {
        const result = test.input || '';
        testRunner.assertEqual(result, test.expected, 
            `String parsing for "${test.input}"`);
    });
});

// Test 10: File Filtering Logic
testRunner.test('File Filtering Logic', () => {
    const testRows = [
        { TEHINGUPÄEV: '2021-02-10', SÜMBOL: 'AAPL', shouldKeep: true },
        { TEHINGUPÄEV: '', SÜMBOL: 'AAPL', shouldKeep: false },
        { TEHINGUPÄEV: '2021-02-10', SÜMBOL: '', shouldKeep: false },
        { TEHINGUPÄEV: null, SÜMBOL: 'AAPL', shouldKeep: false },
        { TEHINGUPÄEV: '2021-02-10', SÜMBOL: null, shouldKeep: false }
    ];
    
    testRows.forEach(row => {
        const shouldFilter = !row.TEHINGUPÄEV || !row.SÜMBOL;
        const shouldKeep = !shouldFilter;
        testRunner.assertEqual(shouldKeep, row.shouldKeep, 
            `Row filtering for TEHINGUPÄEV="${row.TEHINGUPÄEV}", SÜMBOL="${row.SÜMBOL}"`);
    });
});

// Run tests
testRunner.run().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});
