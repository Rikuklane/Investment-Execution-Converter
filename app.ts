// Symbol mappings - all symbols and their types
const SYMBOL_MAPPINGS = {
    "APG1L": "Stock",
    "ARC1T": "Stock",
    "BRKB": "Stock",
    "CPA1T": "Stock",
    "DGRB100028A": "Bond",
    "ECAR": "ETF",
    "EGR1T": "Stock",
    "ESP0": "ETF",
    "EXSA": "ETF",
    "EXXT": "ETF",
    "GREG100027A": "Bond",
    "HAE1T": "Stock",
    "HAGEN": "Stock",
    "HAGENBHT2": "Stock",
    "INRG": "ETF",
    "LHV01SR": "Stock",
    "LHV1T": "Stock",
    "LHVB105033A": "Bond",
    "LHVST": "Stock",
    "MAGIC": "Stock",
    "MRK1T": "Stock",
    "NCN1T": "Stock",
    "NHCBHFFT": "ETF",
    "SABB077034A": "Bond",
    "SPYD": "ETF",
    "STOH100026A": "Bond",
    "SXR8": "ETF",
    "TAL11": "Stock",
    "TAL1T": "Stock",
    "TKM1T": "Stock",
    "TSM1T": "Stock",
    "TVE1T": "Stock",
    "WISE": "Stock",
    "XAD5": "ETF",
    "XAD6": "ETF",
    "BTC": "Crypto",
    "ETH": "Crypto",
    "BNB": "Crypto",
    "XRP": "Crypto",
    "ADA": "Crypto",
    "SOL": "Crypto",
    "DOGE": "Crypto",
    "DOT": "Crypto",
    "MATIC": "Crypto",
    "SHIB": "Crypto",
    "AVAX": "Crypto",
    "LINK": "Crypto",
    "UNI": "Crypto",
    "ATOM": "Crypto",
    "LTC": "Crypto",
    "BCH": "Crypto",
    "XLM": "Crypto",
    "VET": "Crypto",
    "FIL": "Crypto",
    "TRX": "Crypto",
    "ETC": "Crypto",
    "XMR": "Crypto",
    "THETA": "Crypto",
    "ICP": "Crypto",
    "EOS": "Crypto",
    "AAPL": "Stock",
    "MSFT": "Stock",
    "GOOGL": "Stock",
    "GOOG": "Stock",
    "AMZN": "Stock",
    "META": "Stock",
    "TSLA": "Stock",
    "NVDA": "Stock",
    "NFLX": "Stock",
    "DIS": "Stock",
    "ADBE": "Stock",
    "CRM": "Stock",
    "INTC": "Stock",
    "AMD": "Stock",
    "CSCO": "Stock",
    "PEP": "Stock",
    "COST": "Stock",
    "AVGO": "Stock",
    "TXN": "Stock",
    "QCOM": "Stock",
    "TMUS": "Stock",
    "AMAT": "Stock",
    "SBUX": "Stock",
    "INTU": "Stock",
    "JPM": "Stock",
    "BAC": "Stock",
    "WFC": "Stock",
    "GS": "Stock",
    "MS": "Stock",
    "C": "Stock",
    "AXP": "Stock",
    "BLK": "Stock",
    "SPGI": "Stock",
    "V": "Stock",
    "MA": "Stock",
    "PLTR": "Stock",
    "COIN": "Stock",
    "JNJ": "Stock",
    "PFE": "Stock",
    "UNH": "Stock",
    "ABBV": "Stock",
    "TMO": "Stock",
    "ABT": "Stock",
    "MRK": "Stock",
    "DHR": "Stock",
    "BMY": "Stock",
    "AMGN": "Stock",
    "GILD": "Stock",
    "CVS": "Stock",
    "CI": "Stock",
    "BIIB": "Stock",
    "MRNA": "Stock",
    "XOM": "Stock",
    "CVX": "Stock",
    "COP": "Stock",
    "EOG": "Stock",
    "SLB": "Stock",
    "HAL": "Stock",
    "PSX": "Stock",
    "VLO": "Stock",
    "MPC": "Stock",
    "OXY": "Stock",
    "SPY": "ETF",
    "QQQ": "ETF",
    "VTI": "ETF",
    "VOO": "ETF",
    "IVV": "ETF",
    "GLD": "ETF",
    "SLV": "ETF",
    "HYG": "ETF",
    "LQD": "ETF",
    "AGG": "ETF",
    "BND": "ETF",
    "VT": "ETF",
    "VEA": "ETF",
    "VWO": "ETF",
    "IEMG": "ETF",
    "EFA": "ETF",
    "EEM": "ETF",
    "XLF": "ETF",
    "XLE": "ETF",
    "XLK": "ETF",
    "XLI": "ETF",
    "XLV": "ETF",
    "XLU": "ETF",
    "XLP": "ETF",
    "XLY": "ETF",
    "XLB": "ETF",
    "XLC": "ETF",
    "XLRE": "ETF",
    "GDX": "ETF",
    "USO": "ETF",
    "DBC": "ETF",
    "QQQM": "ETF",
    "SPYI": "ETF",
    "SCHD": "ETF",
    "TLT": "Bond",
    "IEF": "Bond",
    "SHY": "Bond",
    "JNK": "Bond",
    "MUB": "Bond",
    "VTEB": "Bond",
    "BRK.A": "Stock",
    "BRK.B": "Stock",
    "WMT": "Stock",
    "HD": "Stock",
    "KO": "Stock",
    "MCD": "Stock",
    "NKE": "Stock",
    "UBER": "Stock",
    "LYFT": "Stock",
    "ROKU": "Stock",
    "SNAP": "Stock",
    "TWTR": "Stock",
    "ZM": "Stock",
    "DOCU": "Stock",
    "SHOP": "Stock",
    "TTWO": "Stock",
    "EA": "Stock",
    "ATVI": "Stock",
    "NTDOY": "Stock",
    "SONY": "Stock",
    "TCEHY": "Stock",
    "BABA": "Stock",
    "JD": "Stock",
    "PDD": "Stock",
    "NIO": "Stock",
    "XPEV": "Stock",
    "LI": "Stock",
    "RIVN": "Stock",
    "LCID": "Stock"
};

interface TransactionRow {
    VÄÄRTUSPÄEV: string;
    TEHINGUPÄEV: string;
    TEHING: string;
    SÜMBOL: string;
    VÄÄRTPABER: string;
    KOGUS: string;
    HIND: string;
    VALUUTA: string;
    NETOSUMMA: string;
    TEENUSTASU: string;
    KOKKU: string;
    VIIDE: string;
    KOMMENTAAR: string;
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
    type: 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing';
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
    private unknownSymbols: string[] = [];
    private readonly DB_KEY = 'investment_symbol_database';

    constructor() {
        this.loadSymbolDatabase();
        this.initializeEventListeners();
        this.loadAdditionalSymbolMappings();
    }

    private initializeEventListeners(): void {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
        const dropZone = document.querySelector('.border-dashed') as HTMLElement;

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        processBtn.addEventListener('click', () => this.processFiles());

        // Modal event listeners
        document.getElementById('cancelClassification')?.addEventListener('click', () => this.closeClassificationModal());
        document.getElementById('saveClassification')?.addEventListener('click', () => this.saveClassification());

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

    private async loadAdditionalSymbolMappings(): Promise<void> {
        try {
            // Use the imported symbol mappings
            this.symbolTypeMapping = { ...SYMBOL_MAPPINGS };
            
            // Also add to symbol database for persistence
            Object.entries(SYMBOL_MAPPINGS).forEach(([symbol, type]) => {
                if (!this.symbolDatabase[symbol]) {
                    this.symbolDatabase[symbol] = {
                        symbol,
                        type: type as 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing',
                        lastUpdated: Date.now()
                    };
                }
            });
            
            this.saveSymbolDatabase();
            console.log(`Loaded ${Object.keys(SYMBOL_MAPPINGS).length} symbol mappings`);
        } catch (error) {
            console.warn('Error loading symbol mappings:', error);
        }
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
        // Find unknown symbols
        this.unknownSymbols = symbols.filter(symbol => 
            !this.symbolTypeMapping[symbol.toUpperCase()]
        );

        if (this.unknownSymbols.length > 0) {
            // Show modal for user to classify unknown symbols
            await this.showClassificationModal();
        }
    }

    private showClassificationModal(): Promise<void> {
        return new Promise((resolve) => {
            const modal = document.getElementById('classificationModal')!;
            const symbolsList = document.getElementById('unknownSymbolsList')!;
            
            // Clear previous content
            symbolsList.innerHTML = '';
            
            // Create classification UI for each unknown symbol
            this.unknownSymbols.forEach(symbol => {
                const symbolDiv = document.createElement('div');
                symbolDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
                symbolDiv.innerHTML = `
                    <div class="flex items-center">
                        <span class="font-mono font-semibold text-gray-800">${symbol}</span>
                    </div>
                    <select class="symbol-type-select px-3 py-2 border rounded-lg" data-symbol="${symbol}">
                        <option value="">Select type...</option>
                        <option value="Stock">Stock</option>
                        <option value="Crypto">Crypto</option>
                        <option value="ETF">ETF</option>
                        <option value="Bond">Bond</option>
                        <option value="Missing">Missing</option>
                    </select>
                `;
                symbolsList.appendChild(symbolDiv);
            });
            
            // Show modal
            modal.classList.remove('hidden');
            
            // Store resolve function to be called when user saves
            (this as any).classificationResolve = resolve;
        });
    }

    private closeClassificationModal(): void {
        const modal = document.getElementById('classificationModal')!;
        modal.classList.add('hidden');
    }

    private saveClassification(): void {
        const selects = document.querySelectorAll('.symbol-type-select') as NodeListOf<HTMLSelectElement>;
        
        selects.forEach(select => {
            const symbol = select.dataset.symbol!;
            const type = select.value;
            
            if (type) {
                // Save to mappings
                this.symbolTypeMapping[symbol.toUpperCase()] = type;
                
                // Save to database for persistence
                this.symbolDatabase[symbol.toUpperCase()] = {
                    symbol: symbol.toUpperCase(),
                    type: type as 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing',
                    lastUpdated: Date.now()
                };
            }
        });
        
        this.saveSymbolDatabase();
        this.closeClassificationModal();
        
        // Resolve the promise to continue processing
        if ((this as any).classificationResolve) {
            (this as any).classificationResolve();
        }
    }

    private detectSymbolTypeByPattern(symbol: string): 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing' | null {
        const upperSymbol = symbol.toUpperCase();
        
        // Only use predefined mappings - no hardcoded patterns
        if (this.symbolTypeMapping[upperSymbol]) {
            return this.symbolTypeMapping[upperSymbol] as 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing';
        }
        
        return null; // Return null if not found in mappings
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

    private simulateAPIDetection(symbol: string): 'Stock' | 'Crypto' | 'ETF' | 'Bond' | 'Missing' | null {
        // Don't use hardcoded detection - rely only on predefined mappings
        return null;
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
                        const transactions: ProcessedTransaction[] = results.data
                            .filter((row: any) => row.TEHINGUPÄEV && row.SÜMBOL) // Filter out empty rows
                            .map((row: any) => {
                                // Determine action based on Estonian TEHING column
                                const tehing = (row.TEHING || '').toLowerCase().trim();
                                const action = tehing === 'ost' ? 'Buy' : 'Sell';
                                return this.transformRow(row, accountName, action);
                            });
                        
                        resolve(transactions);
                    } catch (error: any) {
                        reject(error);
                    }
                },
                error: (error: any) => reject(error)
            });
        });
    }

    private transformRow(row: any, accountName: string, action: string): ProcessedTransaction {
        const symbol = row.SÜMBOL?.trim().toUpperCase() || '';
        const type = this.symbolTypeMapping[symbol] || 'Missing';
        
        return {
            Date: new Date(row.TEHINGUPÄEV),
            Account: accountName,
            Type: type,
            Action: action,
            Symbol: symbol,
            Name: row.VÄÄRTPABER || '',
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
            const date = transaction.Date;
            // Convert to Excel date number (days since 1900-01-01)
            const excelDateNumber = this.dateToExcelNumber(date);
            ws_data.push([
                excelDateNumber.toString(),
                transaction.Account,
                transaction.Type,
                transaction.Action,
                transaction.Symbol,
                transaction.Name,
                transaction.Currency,
                this.formatEstonianNumber(transaction.Amount),
                this.formatEstonianNumber(transaction['Price(1)']),
                this.formatEstonianNumber(transaction.Cost),
                this.formatEstonianNumber(transaction.Fee)
            ]);
        });

        const ws = window.XLSX.utils.aoa_to_sheet(ws_data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Combined Transactions');

        // Apply Estonian date format (DD.MM.YYYY) to the date column
        if (ws['!ref']) {
            const range = (window.XLSX.utils as any).decode_range(ws['!ref']);
            for (let row = 1; row <= range.e.r; row++) {
                const cellAddress = (window.XLSX.utils as any).encode_cell({ r: row, c: 0 });
                if (ws[cellAddress]) {
                    ws[cellAddress].z = 'dd.mm.yyyy'; // Estonian date format
                    ws[cellAddress].t = 'n'; // Ensure cell type is number
                    // Convert back to number for Excel
                    ws[cellAddress].v = parseFloat(ws[cellAddress].v);
                }
            }
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `combined_transactions_${timestamp}.xlsx`;

        window.XLSX.writeFile(wb, filename);
    }

    private dateToExcelNumber(date: Date): number {
        // Excel dates start from 1900-01-01 (but Excel incorrectly treats 1900 as a leap year)
        const excelEpoch = new Date(1900, 0, 1); // January 1, 1900
        const daysSinceEpoch = Math.floor((date.getTime() - excelEpoch.getTime()) / (1000 * 60 * 60 * 24));
        
        // Add 1 because Excel counts 1900-01-01 as day 1, and add 1 more for Excel's leap year bug
        return daysSinceEpoch + 2;
    }

    private formatEstonianNumber(num: number): string {
        // Get user's decimal separator preference (default: comma for Estonian)
        const decimalSeparator = this.getDecimalSeparator();
        
        if (decimalSeparator === 'period') {
            // US/UK format: period decimal, comma thousands
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            // Estonian/European format: comma decimal, space thousands
            return num.toLocaleString('et-EE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }

    private getDecimalSeparator(): 'comma' | 'period' {
        // Get user selection from radio buttons, default to comma
        const selected = document.querySelector('input[name="decimalSeparator"]:checked') as HTMLInputElement;
        const value = selected?.value;
        
        // If no radio button is selected (page just loaded), default to comma
        if (!selected || (value !== 'comma' && value !== 'period')) {
            return 'comma';
        }
        
        return value === 'period' ? 'period' : 'comma';
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
    // Expose to global scope for testing
    (window as any).InvestmentConverter = InvestmentConverter;
    (window as any).converter = converter;
});
