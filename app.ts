interface TransactionRow {
    TEHINGUPÄEV: string;
    SÜMBOL: string;
    VÄRTPABER: string;
    VALUUTA: string;
    KOGUS: string;
    HIND: string;
    NETOSUMMA: string;
    TEENUSTASU: string;
}

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

interface SymbolInfo {
    symbol: string;
    type: 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Other';
    name?: string;
    lastUpdated: number;
}

interface SymbolDatabase {
    [symbol: string]: SymbolInfo;
}

class InvestmentConverter {
    private files: File[] = [];
    private symbolTypeMapping: { [key: string]: string } = {};
    private processedData: ProcessedTransaction[] = [];
    private symbolDatabase: SymbolDatabase = {};
    private readonly DB_KEY = 'investment_symbol_database';

    constructor() {
        this.loadSymbolDatabase();
        this.initializeEventListeners();
        this.setupDefaultMappings();
    }

    private initializeEventListeners(): void {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
        const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
        const dropZone = document.querySelector('.border-dashed') as HTMLElement;

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        processBtn.addEventListener('click', () => this.processFiles());
        exportBtn.addEventListener('click', () => this.exportToExcel());

        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-400', 'bg-blue-50');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
            this.handleFileSelect(e);
        });
    }

    private setupDefaultMappings(): void {
        this.initializeStaticSymbolDatabase();
        this.updateSymbolMappings();
        
        // Update mappings when text changes
        const cryptoSymbols = document.getElementById('cryptoSymbols') as HTMLTextAreaElement;
        const stockSymbols = document.getElementById('stockSymbols') as HTMLTextAreaElement;
        
        cryptoSymbols.addEventListener('input', () => this.updateSymbolMappings());
        stockSymbols.addEventListener('input', () => this.updateSymbolMappings());
    }

    private initializeStaticSymbolDatabase(): void {
        // Comprehensive static symbol database
        const staticSymbols: { [key: string]: 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Other' } = {
            // Major Cryptocurrencies
            'BTC': 'Crypto', 'ETH': 'Crypto', 'BNB': 'Crypto', 'XRP': 'Crypto', 'ADA': 'Crypto',
            'SOL': 'Crypto', 'DOGE': 'Crypto', 'DOT': 'Crypto', 'MATIC': 'Crypto', 'SHIB': 'Crypto',
            'AVAX': 'Crypto', 'LINK': 'Crypto', 'UNI': 'Crypto', 'ATOM': 'Crypto', 'LTC': 'Crypto',
            'BCH': 'Crypto', 'XLM': 'Crypto', 'VET': 'Crypto', 'FIL': 'Crypto', 'TRX': 'Crypto',
            'ETC': 'Crypto', 'XMR': 'Crypto', 'THETA': 'Crypto', 'ICP': 'Crypto', 'EOS': 'Crypto',
            
            // Major Stocks (Tech)
            'AAPL': 'Stock', 'MSFT': 'Stock', 'GOOGL': 'Stock', 'GOOG': 'Stock', 'AMZN': 'Stock',
            'META': 'Stock', 'TSLA': 'Stock', 'NVDA': 'Stock', 'NFLX': 'Stock', 'DIS': 'Stock',
            'ADBE': 'Stock', 'CRM': 'Stock', 'INTC': 'Stock', 'AMD': 'Stock', 'CSCO': 'Stock',
            'PEP': 'Stock', 'COST': 'Stock', 'AVGO': 'Stock', 'TXN': 'Stock', 'QCOM': 'Stock',
            'TMUS': 'Stock', 'AMAT': 'Stock', 'SBUX': 'Stock', 'INTU': 'Stock',
            
            // Major Stocks (Finance)
            'JPM': 'Stock', 'BAC': 'Stock', 'WFC': 'Stock', 'GS': 'Stock', 'MS': 'Stock',
            'C': 'Stock', 'AXP': 'Stock', 'BLK': 'Stock', 'SPGI': 'Stock', 'V': 'Stock',
            'MA': 'Stock', 'PLTR': 'Stock', 'COIN': 'Stock',
            
            // Major Stocks (Healthcare)
            'JNJ': 'Stock', 'PFE': 'Stock', 'UNH': 'Stock', 'ABBV': 'Stock', 'TMO': 'Stock',
            'ABT': 'Stock', 'MRK': 'Stock', 'DHR': 'Stock', 'BMY': 'Stock', 'AMGN': 'Stock',
            'GILD': 'Stock', 'CVS': 'Stock', 'CI': 'Stock', 'BIIB': 'Stock', 'MRNA': 'Stock',
            
            // Major Stocks (Energy)
            'XOM': 'Stock', 'CVX': 'Stock', 'COP': 'Stock', 'EOG': 'Stock', 'SLB': 'Stock',
            'HAL': 'Stock', 'PSX': 'Stock', 'VLO': 'Stock', 'MPC': 'Stock', 'OXY': 'Stock',
            
            // Major ETFs
            'SPY': 'ETF', 'QQQ': 'ETF', 'VTI': 'ETF', 'VOO': 'ETF', 'IVV': 'ETF',
            'GLD': 'ETF', 'SLV': 'ETF', 'HYG': 'ETF', 'LQD': 'ETF', 'AGG': 'ETF',
            'BND': 'ETF', 'VT': 'ETF', 'VEA': 'ETF', 'VWO': 'ETF', 'IEMG': 'ETF',
            'EFA': 'ETF', 'EEM': 'ETF', 'XLF': 'ETF', 'XLE': 'ETF', 'XLK': 'ETF',
            'XLI': 'ETF', 'XLV': 'ETF', 'XLU': 'ETF', 'XLP': 'ETF', 'XLY': 'ETF',
            'XLB': 'ETF', 'XLC': 'ETF', 'XLRE': 'ETF', 'GDX': 'ETF', 'USO': 'ETF',
            'DBC': 'ETF', 'QQQM': 'ETF', 'SPYI': 'ETF', 'SCHD': 'ETF',
            
            // Bond-related symbols
            'TLT': 'Bond', 'IEF': 'Bond', 'SHY': 'Bond', 'JNK': 'Bond', 'MUB': 'Bond', 'VTEB': 'Bond',
            
            // Additional common symbols
            'BRK.A': 'Stock', 'BRK.B': 'Stock', 'WMT': 'Stock', 'HD': 'Stock', 'KO': 'Stock',
            'MCD': 'Stock', 'NKE': 'Stock', 'UBER': 'Stock', 'LYFT': 'Stock', 'ROKU': 'Stock',
            'SNAP': 'Stock', 'TWTR': 'Stock', 'ZM': 'Stock', 'DOCU': 'Stock', 'SHOP': 'Stock',
            'TTWO': 'Stock', 'EA': 'Stock', 'ATVI': 'Stock', 'NTDOY': 'Stock',
            'SONY': 'Stock', 'TCEHY': 'Stock', 'BABA': 'Stock', 'JD': 'Stock', 'PDD': 'Stock',
            'NIO': 'Stock', 'XPEV': 'Stock', 'LI': 'Stock', 'RIVN': 'Stock', 'LCID': 'Stock'
        };

        // Initialize the database with static symbols
        Object.entries(staticSymbols).forEach(([symbol, type]) => {
            if (!this.symbolDatabase[symbol]) {
                this.symbolDatabase[symbol] = {
                    symbol,
                    type,
                    lastUpdated: Date.now()
                };
            }
        });

        this.saveSymbolDatabase();
    }

    private updateSymbolMappings(): void {
        const cryptoSymbols = (document.getElementById('cryptoSymbols') as HTMLTextAreaElement).value
            .split(',')
            .map(s => s.trim().toUpperCase())
            .filter(s => s);
        
        const stockSymbols = (document.getElementById('stockSymbols') as HTMLTextAreaElement).value
            .split(',')
            .map(s => s.trim().toUpperCase())
            .filter(s => s);

        this.symbolTypeMapping = {};
        
        // Add manual mappings
        cryptoSymbols.forEach(symbol => {
            this.symbolTypeMapping[symbol] = 'Crypto';
        });
        
        stockSymbols.forEach(symbol => {
            this.symbolTypeMapping[symbol] = 'Stock';
        });

        // Add database mappings
        Object.values(this.symbolDatabase).forEach(info => {
            if (!this.symbolTypeMapping[info.symbol]) {
                this.symbolTypeMapping[info.symbol] = info.type;
            }
        });
    }

    private handleFileSelect(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files ? Array.from(target.files) : [];
        
        // Handle drag and drop
        if (event instanceof DragEvent && event.dataTransfer?.files) {
            files.push(...Array.from(event.dataTransfer.files));
        }

        this.files = files.filter(file => file.name.endsWith('.csv'));
        this.displayFileList();
        this.updateProcessButton();
    }

    private displayFileList(): void {
        const fileList = document.getElementById('fileList')!;
        fileList.innerHTML = '';

        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
            fileItem.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-file-csv text-green-600 mr-3"></i>
                    <span class="text-gray-700">${file.name}</span>
                    <span class="text-gray-500 text-sm ml-2">(${this.formatFileSize(file.size)})</span>
                </div>
                <button class="text-red-500 hover:text-red-700" onclick="converter.removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    public removeFile(index: number): void {
        this.files.splice(index, 1);
        this.displayFileList();
        this.updateProcessButton();
    }

    private loadSymbolDatabase(): void {
        const stored = localStorage.getItem(this.DB_KEY);
        if (stored) {
            try {
                this.symbolDatabase = JSON.parse(stored);
            } catch (error) {
                console.error('Error loading symbol database:', error);
                this.symbolDatabase = {};
            }
        }
    }

    private saveSymbolDatabase(): void {
        localStorage.setItem(this.DB_KEY, JSON.stringify(this.symbolDatabase));
    }

    private async detectSymbolTypes(symbols: string[]): Promise<void> {
        const unknownSymbols = symbols.filter(symbol => 
            !this.symbolDatabase[symbol] && 
            !this.symbolTypeMapping[symbol]
        );

        if (unknownSymbols.length === 0) return;

        // Try to detect using common patterns first
        unknownSymbols.forEach(symbol => {
            const detectedType = this.detectSymbolTypeByPattern(symbol);
            if (detectedType) {
                this.symbolDatabase[symbol] = {
                    symbol,
                    type: detectedType,
                    lastUpdated: Date.now()
                };
            }
        });

        // For remaining unknown symbols, try API (limited to avoid rate limits)
        const stillUnknown = unknownSymbols.filter(symbol => !this.symbolDatabase[symbol]);
        if (stillUnknown.length > 0) {
            await this.detectSymbolTypesViaAPI(stillUnknown.slice(0, 10)); // Limit to 10 API calls
        }

        this.saveSymbolDatabase();
        this.updateSymbolMappings();
    }

    private detectSymbolTypeByPattern(symbol: string): 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Other' | null {
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
        
        // Stock patterns (most common)
        if (upperSymbol.length <= 5 && /^[A-Z]+$/.test(upperSymbol)) {
            return 'Stock';
        }
        
        return null;
    }

    private async detectSymbolTypesViaAPI(symbols: string[]): Promise<void> {
        // Using a free API for symbol detection
        // This is a simplified implementation - in production you'd want more robust APIs
        try {
            // For demo purposes, we'll use a simple heuristic approach
            // In a real app, you might use Alpha Vantage, Yahoo Finance API, etc.
            symbols.forEach(symbol => {
                // Simulate API detection with basic heuristics
                const detectedType = this.simulateAPIDetection(symbol);
                if (detectedType) {
                    this.symbolDatabase[symbol] = {
                        symbol,
                        type: detectedType,
                        lastUpdated: Date.now()
                    };
                }
            });
        } catch (error) {
            console.error('Error detecting symbol types via API:', error);
        }
    }

    private simulateAPIDetection(symbol: string): 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Other' | null {
        // This is a placeholder for actual API calls
        // In production, you'd make real API calls to services like:
        // - Alpha Vantage (free tier available)
        // - Yahoo Finance API
        // - CoinGecko API for crypto
        // - Financial data providers
        
        const upperSymbol = symbol.toUpperCase();
        
        // More comprehensive crypto detection
        const cryptoList = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'MATIC', 'SHIB', 'AVAX', 'LINK', 'UNI', 'ATOM', 'LTC'];
        if (cryptoList.includes(upperSymbol)) {
            return 'Crypto';
        }
        
        // ETF detection
        const etfPatterns = ['SPY', 'QQQ', 'VTI', 'VOO', 'IVV', 'GLD', 'SLV', 'TLT', 'HYG', 'LQD'];
        if (etfPatterns.includes(upperSymbol)) {
            return 'ETF';
        }
        
        // Default to Stock for common stock-like symbols
        if (upperSymbol.length <= 5 && /^[A-Z]+$/.test(upperSymbol)) {
            return 'Stock';
        }
        
        return 'Other';
    }

    private updateProcessButton(): void {
        const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
        processBtn.disabled = this.files.length === 0;
    }

    private async processFiles(): Promise<void> {
        if (this.files.length === 0) return;

        this.showLoading(true);
        this.processedData = [];

        try {
            // First pass: collect all unique symbols
            const allSymbols = new Set<string>();
            for (const file of this.files) {
                const transactions = await this.parseFile(file);
                transactions.forEach(t => allSymbols.add(t.Symbol));
            }

            // Detect symbol types for unknown symbols
            await this.detectSymbolTypes(Array.from(allSymbols));

            // Second pass: process all files with updated mappings
            for (const file of this.files) {
                const transactions = await this.parseFile(file);
                this.processedData.push(...transactions);
            }

            this.displayResults();
            // Auto-download Excel file
            this.exportToExcel();
        } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing files. Please check the file format and try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async parseFile(file: File): Promise<ProcessedTransaction[]> {
        return new Promise((resolve, reject) => {
            window.Papa.parse(file, {
                header: true,
                encoding: 'UTF-8',
                complete: (results: any) => {
                    try {
                        // Extract account name from first part of filename before underscore
                        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                        const accountName = fileNameWithoutExt.split('_')[0];
                        const action = accountName.toLowerCase().includes('buy') ? 'Buy' : 'Sell';
                        
                        const transactions: ProcessedTransaction[] = results.data
                            .filter((row: any) => row.TEHINGUPÄEV && row.SÜMBOL) // Filter out empty rows
                            .map((row: TransactionRow) => this.transformRow(row, accountName, action));
                        
                        resolve(transactions);
                    } catch (error: any) {
                        reject(error);
                    }
                },
                error: (error: any) => reject(error)
            });
        });
    }

    private transformRow(row: TransactionRow, accountName: string, action: string): ProcessedTransaction {
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

    private displayResults(): void {
        const resultsSection = document.getElementById('resultsSection')!;
        const resultsBody = document.getElementById('resultsBody')!;
        const recordCount = document.getElementById('recordCount')!;

        resultsSection.classList.remove('hidden');
        recordCount.textContent = `Total records: ${this.processedData.length}`;

        // Sort by date
        this.processedData.sort((a, b) => a.Date.getTime() - b.Date.getTime());

        resultsBody.innerHTML = '';
        this.processedData.forEach(transaction => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="border border-gray-300 px-4 py-2">${transaction.Date.toLocaleDateString()}</td>
                <td class="border border-gray-300 px-4 py-2">${transaction.Account}</td>
                <td class="border border-gray-300 px-4 py-2">
                    <span class="px-2 py-1 text-xs rounded-full ${
                        transaction.Type === 'Crypto' ? 'bg-purple-100 text-purple-800' :
                        transaction.Type === 'Stock' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }">${transaction.Type}</span>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <span class="px-2 py-1 text-xs rounded-full ${
                        transaction.Action === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">${transaction.Action}</span>
                </td>
                <td class="border border-gray-300 px-4 py-2 font-mono">${transaction.Symbol}</td>
                <td class="border border-gray-300 px-4 py-2">${transaction.Name}</td>
                <td class="border border-gray-300 px-4 py-2">${transaction.Currency}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">${transaction.Amount.toFixed(6)}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">${transaction['Price(1)'].toFixed(4)}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">${transaction.Cost.toFixed(2)}</td>
                <td class="border border-gray-300 px-4 py-2 text-right">${transaction.Fee.toFixed(2)}</td>
            `;
            resultsBody.appendChild(row);
        });
    }

    private exportToExcel(): void {
        if (this.processedData.length === 0) return;

        // Convert data to Excel format
        const ws_data = [
            ['Date', 'Account', 'Type', 'Action', 'Symbol', 'Name', 'Currency', 'Amount', 'Price(1)', 'Cost', 'Fee']
        ];

        this.processedData.forEach(transaction => {
            ws_data.push([
                transaction.Date.toLocaleDateString(),
                transaction.Account,
                transaction.Type,
                transaction.Action,
                transaction.Symbol,
                transaction.Name,
                transaction.Currency,
                transaction.Amount.toString(),
                transaction['Price(1)'].toString(),
                transaction.Cost.toString(),
                transaction.Fee.toString()
            ]);
        });

        const ws = window.XLSX.utils.aoa_to_sheet(ws_data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Combined Transactions');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `combined_transactions_${timestamp}.xlsx`;

        window.XLSX.writeFile(wb, filename);
    }

    private showLoading(show: boolean): void {
        const loadingIndicator = document.getElementById('loadingIndicator')!;
        const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
        
        if (show) {
            loadingIndicator.classList.remove('hidden');
            processBtn.disabled = true;
        } else {
            loadingIndicator.classList.add('hidden');
            processBtn.disabled = false;
        }
    }
}

// Initialize the converter when the page loads
let converter: InvestmentConverter;
document.addEventListener('DOMContentLoaded', () => {
    converter = new InvestmentConverter();
});
