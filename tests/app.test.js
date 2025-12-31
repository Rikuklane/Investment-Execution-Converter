class InvestmentConverter {
    constructor() {
        this.files = [];
        this.symbolTypeMapping = {};
        this.processedData = [];
        this.symbolDatabase = {};
        this.DB_KEY = 'investment_symbol_database';

        this.loadSymbolDatabase();
        this.initializeEventListeners();
        this.setupDefaultMappings();
        this.loadAdditionalSymbolMappings();
    }

    initializeEventListeners() {
        // Mock for testing - no real DOM
    }

    setupDefaultMappings() {
        this.initializeStaticSymbolDatabase();
        this.updateSymbolMappings();
    }

    async loadAdditionalSymbolMappings() {
        try {
            const fs = require('fs');
            const path = require('path');
            const mappingsPath = path.join(__dirname, '..', 'symbol-mappings.json');
            const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));
            
            // Add static symbol mappings
            Object.entries(mappings.staticSymbolMappings).forEach(([symbol, type]) => {
                if (!this.symbolDatabase[symbol]) {
                    this.symbolDatabase[symbol] = {
                        symbol,
                        type: type,
                        lastUpdated: Date.now()
                    };
                }
            });
            
            this.saveSymbolDatabase();
            console.log(`Loaded ${Object.keys(mappings.staticSymbolMappings).length} additional symbol mappings`);
        } catch (error) {
            console.warn('Could not load additional symbol mappings:', error);
        }
    }

    initializeStaticSymbolDatabase() {
        // Static symbols are now loaded from symbol-mappings.json
        // This method is kept for compatibility but the database is populated by loadAdditionalSymbolMappings()
    }

    updateSymbolMappings() {
        // Mock for testing
        this.symbolTypeMapping = {};
        
        // Add database mappings
        Object.values(this.symbolDatabase).forEach(info => {
            if (!this.symbolTypeMapping[info.symbol]) {
                this.symbolTypeMapping[info.symbol] = info.type;
            }
        });
    }

    loadSymbolDatabase() {
        // Mock for testing
        this.symbolDatabase = {};
    }

    saveSymbolDatabase() {
        // Mock for testing
    }

    async detectSymbolTypes(symbols) {
        // Mock for testing
    }

    detectSymbolTypeByPattern(symbol) {
        const upperSymbol = symbol.toUpperCase();
        
        // Common crypto patterns
        if (['BTC', 'ETH', 'ADA', 'DOT', 'LINK', 'UNI', 'SOL', 'AVAX', 'MATIC', 'ATOM'].includes(upperSymbol)) {
            return 'Crypto';
        }
        
        // Common ETF patterns
        if (upperSymbol.includes('ETF') || upperSymbol.startsWith('VO') || upperSymbol.startsWith('SPY') || 
            upperSymbol.startsWith('QQQ') || upperSymbol.startsWith('DIA') || upperSymbol.startsWith('VTI')) {
            return 'ETF';
        }
        
        // Bond patterns
        if (upperSymbol.includes('BOND') || upperSymbol.includes('TREASURY') || upperSymbol.includes('TBILL')) {
            return 'Bond';
        }
        
        // Stock patterns (most common) - handle alphanumeric patterns
        if (upperSymbol.length <= 10 && /^[A-Z0-9]+$/.test(upperSymbol) && !upperSymbol.includes(' ')) {
            return 'Stock';
        }
        
        return null;
    }

    async parseFile(file) {
        return new Promise((resolve, reject) => {
            // Mock Papa Parse with sample data
            const mockData = [
                { TEHINGUPÄEV: '2024-10-30', SÜMBOL: 'XAD5', VÄRTPABER: 'db Physical Gold ETC (EUR)', 
                    VALUUTA: 'EUR', KOGUS: '0.080', HIND: '247.66', NETOSUMMA: '-19.80', TEENUSTASU: '-0.20' },
                { TEHINGUPÄEV: '2024-10-30', SÜMBOL: 'XAD6', VÄRTPABER: 'Xtrackers Physical Silver ETC EUR', 
                    VALUUTA: 'EUR', KOGUS: '0.067', HIND: '296.60', NETOSUMMA: '-19.80', TEENUSTASU: '-0.20' }
            ];
            
            try {
                // Extract account name from first part of filename before underscore
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                const accountName = fileNameWithoutExt.split('_')[0];
                const action = accountName.toLowerCase().includes('buy') ? 'Buy' : 'Sell';
                
                const transactions = mockData
                    .filter(row => row.TEHINGUPÄEV && row.SÜMBOL) // Filter out empty rows
                    .map(row => this.transformRow(row, accountName, action));
                
                resolve(transactions);
            } catch (error) {
                reject(error);
            }
        });
    }

    transformRow(row, accountName, action) {
        const symbol = row.SÜMBOL?.trim().toUpperCase() || '';
        const type = this.symbolTypeMapping[symbol] || 'Other';
        
        return {
            Date: new Date(row.TEHINGUPÄEV),
            Account: accountName,
            Type: type,
            Action: action,
            Symbol: symbol,
            Name: row.VÄRTPABER || '',
            Currency: row.VALUUTA || '',
            Amount: parseFloat(row.KOGUS) || 0,
            'Price(1)': parseFloat(row.HIND) || 0,
            Cost: parseFloat(row.NETOSUMMA) || 0,
            Fee: parseFloat(row.TEENUSTASU) || 0
        };
    }
}

// Expose for testing
if (typeof window !== 'undefined') {
    window.InvestmentConverter = InvestmentConverter;
} 

// Always export for Node.js
module.exports = InvestmentConverter;
