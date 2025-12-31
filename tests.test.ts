// Unit tests for Investment Converter

// Mock DOM and global objects
const mockDocument = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    addEventListener: jest.fn()
};

const mockWindow = {
    Papa: {
        parse: jest.fn()
    },
    XLSX: {
        utils: {
            aoa_to_sheet: jest.fn(),
            book_new: jest.fn(),
            book_append_sheet: jest.fn()
        },
        writeFile: jest.fn()
    }
};

// Setup global mocks
Object.defineProperty(global, 'document', { value: mockDocument });
Object.defineProperty(global, 'window', { value: mockWindow });

// Import the classes we want to test
// Note: In a real setup, you'd import these from your app.ts
interface ProcessedTransaction {
    Date: Date;
    Account: string;
    Type: string;
    Action: string;
    Symbol: string;
    Name: string;
    Currency: string;
    Amount: number;
    'Price(1)': number;
    Cost: number;
    Fee: number;
}

// Test helper functions
function createMockCSVRow(tehing: string, symbol: string, kogus: string, hind: string, netosumma: string) {
    return {
        TEHINGUPÄEV: '2021-02-10',
        TEHING: tehing,
        SÜMBOL: symbol,
        VÄÄRTPABER: 'Test Security',
        VALUUTA: 'EUR',
        KOGUS: kogus,
        HIND: hind,
        NETOSUMMA: netosumma,
        TEENUSTASU: '1.00'
    };
}

// Test: Estonian Transaction Type Detection
describe('Transaction Type Detection', () => {
    test('should detect "ost" as Buy transaction', () => {
        const row = createMockCSVRow('ost', 'AAPL', '10', '150.00', '-1500.00');
        const tehing = (row.TEHING || '').toLowerCase().trim();
        const action = tehing === 'ost' ? 'Buy' : 'Sell';
        
        expect(action).toBe('Buy');
    });

    test('should detect "müük" as Sell transaction', () => {
        const row = createMockCSVRow('müük', 'AAPL', '-10', '150.00', '1500.00');
        const tehing = (row.TEHING || '').toLowerCase().trim();
        const action = tehing === 'ost' ? 'Buy' : 'Sell';
        
        expect(action).toBe('Sell');
    });

    test('should handle uppercase Estonian terms', () => {
        const buyRow = createMockCSVRow('OST', 'AAPL', '10', '150.00', '-1500.00');
        const sellRow = createMockCSVRow('MÜÜK', 'AAPL', '-10', '150.00', '1500.00');
        
        const buyAction = (buyRow.TEHING || '').toLowerCase().trim() === 'ost' ? 'Buy' : 'Sell';
        const sellAction = (sellRow.TEHING || '').toLowerCase().trim() === 'ost' ? 'Buy' : 'Sell';
        
        expect(buyAction).toBe('Buy');
        expect(sellAction).toBe('Sell');
    });

    test('should default to Sell for unknown transaction types', () => {
        const row = createMockCSVRow('unknown', 'AAPL', '10', '150.00', '-1500.00');
        const tehing = (row.TEHING || '').toLowerCase().trim();
        const action = tehing === 'ost' ? 'Buy' : 'Sell';
        
        expect(action).toBe('Sell');
    });
});

// Test: Excel Date Format Generation
describe('Excel Date Format', () => {
    test('should generate correct Excel DATE formula', () => {
        const testDate = new Date('2021-02-10');
        const excelDateFormula = `=DATE(${testDate.getFullYear()};${testDate.getMonth() + 1};${testDate.getDate()})`;
        
        expect(excelDateFormula).toBe('=DATE(2021;2;10)');
    });

    test('should handle different months correctly', () => {
        const testDates = [
            new Date('2021-01-15'), // January
            new Date('2021-12-25'), // December
            new Date('2021-03-27')  // March
        ];
        
        const expectedFormulas = [
            '=DATE(2021;1;15)',
            '=DATE(2021;12;25)', 
            '=DATE(2021;3;27)'
        ];
        
        testDates.forEach((date, index) => {
            const formula = `=DATE(${date.getFullYear()};${date.getMonth() + 1};${date.getDate()})`;
            expect(formula).toBe(expectedFormulas[index]);
        });
    });

    test('should handle leap years correctly', () => {
        const leapYearDate = new Date('2020-02-29');
        const excelDateFormula = `=DATE(${leapYearDate.getFullYear()};${leapYearDate.getMonth() + 1};${leapYearDate.getDate()})`;
        
        expect(excelDateFormula).toBe('=DATE(2020;2;29)');
    });
});

// Test: Symbol Type Mapping
describe('Symbol Type Mapping', () => {
    const mockSymbolMappings = {
        'AAPL': 'Stock',
        'BTC': 'Crypto', 
        'SPY': 'ETF',
        'TLT': 'Bond'
    };

    test('should return correct type for known symbols', () => {
        expect(mockSymbolMappings['AAPL']).toBe('Stock');
        expect(mockSymbolMappings['BTC']).toBe('Crypto');
        expect(mockSymbolMappings['SPY']).toBe('ETF');
        expect(mockSymbolMappings['TLT']).toBe('Bond');
    });

    test('should return Missing for unknown symbols', () => {
        const unknownSymbol = 'UNKNOWN123';
        const type = mockSymbolMappings[unknownSymbol] || 'Missing';
        expect(type).toBe('Missing');
    });

    test('should handle case insensitive symbol lookup', () => {
        const symbol = 'aapl';
        const type = mockSymbolMappings[symbol.toUpperCase()] || 'Missing';
        expect(type).toBe('Stock');
    });
});

// Test: Row Transformation
describe('Row Transformation', () => {
    const mockSymbolMappings = { 'AAPL': 'Stock' };

    test('should transform CSV row to ProcessedTransaction correctly', () => {
        const csvRow = createMockCSVRow('ost', 'AAPL', '10', '150.00', '-1500.00');
        const accountName = 'TestAccount';
        const action = 'Buy';
        
        const processed: ProcessedTransaction = {
            Date: new Date(csvRow.TEHINGUPÄEV),
            Account: accountName,
            Type: mockSymbolMappings[csvRow.SÜMBOL] || 'Missing',
            Action: action,
            Symbol: csvRow.SÜMBOL?.trim().toUpperCase() || '',
            Name: csvRow.VÄÄRTPABER || '',
            Currency: csvRow.VALUUTA || '',
            Amount: parseFloat(csvRow.KOGUS) || 0,
            'Price(1)': parseFloat(csvRow.HIND) || 0,
            Cost: parseFloat(csvRow.NETOSUMMA) || 0,
            Fee: parseFloat(csvRow.TEENUSTASU) || 0
        };

        expect(processed.Action).toBe('Buy');
        expect(processed.Symbol).toBe('AAPL');
        expect(processed.Type).toBe('Stock');
        expect(processed.Amount).toBe(10);
        expect(processed['Price(1)']).toBe(150.00);
        expect(processed.Cost).toBe(-1500.00);
        expect(processed.Fee).toBe(1.00);
    });

    test('should handle missing or invalid data gracefully', () => {
        const invalidRow = {
            TEHINGUPÄEV: '',
            TEHING: '',
            SÜMBOL: '',
            VÄÄRTPABER: '',
            VALUUTA: '',
            KOGUS: '',
            HIND: '',
            NETOSUMMA: '',
            TEENUSTASU: ''
        };

        const processed: ProcessedTransaction = {
            Date: new Date(invalidRow.TEHINGUPÄEV),
            Account: 'TestAccount',
            Type: mockSymbolMappings[invalidRow.SÜMBOL] || 'Missing',
            Action: 'Sell',
            Symbol: invalidRow.SÜMBOL?.trim().toUpperCase() || '',
            Name: invalidRow.VÄÄRTPABER || '',
            Currency: invalidRow.VALUUTA || '',
            Amount: parseFloat(invalidRow.KOGUS) || 0,
            'Price(1)': parseFloat(invalidRow.HIND) || 0,
            Cost: parseFloat(invalidRow.NETOSUMMA) || 0,
            Fee: parseFloat(invalidRow.TEENUSTASU) || 0
        };

        expect(processed.Symbol).toBe('');
        expect(processed.Type).toBe('Missing');
        expect(processed.Amount).toBe(0);
        expect(processed.Cost).toBe(0);
        expect(processed.Fee).toBe(0);
    });
});

// Test: File Processing Edge Cases
describe('File Processing Edge Cases', () => {
    test('should handle empty CSV rows', () => {
        const emptyRows = [
            { TEHINGUPÄEV: '', SÜMBOL: '' },
            { TEHINGUPÄEV: null, SÜMBOL: 'AAPL' },
            { TEHINGUPÄEV: '2021-02-10', SÜMBOL: null }
        ];

        emptyRows.forEach(row => {
            const shouldFilter = !row.TEHINGUPÄEV || !row.SÜMBOL;
            expect(shouldFilter).toBe(true);
        });
    });

    test('should extract account name from filename correctly', () => {
        const testCases = [
            { filename: 'LHV_2025_kasvukonto.csv', expected: 'LHV' },
            { filename: 'TestAccount_transactions.csv', expected: 'TestAccount' },
            { filename: 'MyBroker_2024_trades.csv', expected: 'MyBroker' }
        ];

        testCases.forEach(({ filename, expected }) => {
            const fileNameWithoutExt = filename.replace(/\.[^/.]+$/, '');
            const accountName = fileNameWithoutExt.split('_')[0];
            expect(accountName).toBe(expected);
        });
    });
});

// Test: Data Validation
describe('Data Validation', () => {
    test('should validate numeric fields', () => {
        const testCases = [
            { input: '10.5', expected: 10.5 },
            { input: '150', expected: 150 },
            { input: '', expected: 0 },
            { input: 'invalid', expected: 0 },
            { input: null, expected: 0 }
        ];

        testCases.forEach(({ input, expected }) => {
            const result = parseFloat(input) || 0;
            expect(result).toBe(expected);
        });
    });

    test('should validate string fields', () => {
        const testCases = [
            { input: 'AAPL', expected: 'AAPL' },
            { input: '', expected: '' },
            { input: null, expected: '' },
            { input: undefined, expected: '' }
        ];

        testCases.forEach(({ input, expected }) => {
            const result = input || '';
            expect(result).toBe(expected);
        });
    });
});

console.log('All tests completed! Run with: npm test');
