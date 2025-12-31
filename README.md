# Investment Execution Converter

A web-based tool for converting CSV investment transaction files into a unified Excel format. This application automatically detects symbol types (Stock, Crypto, ETF, Bond) and combines multiple CSV files into a single, standardized Excel output.

## Features

- **Multi-file Upload**: Upload and process multiple CSV files simultaneously
- **Automatic Symbol Detection**: Intelligently categorizes symbols as Stock, Crypto, ETF, or Bond
- **Local Symbol Database**: Maintains a persistent database of previously seen symbols
- **Drag & Drop Interface**: Modern, user-friendly file upload experience
- **Auto Excel Export**: Automatically downloads processed data as Excel file
- **Pattern Recognition**: Uses advanced pattern matching for symbol type detection
- **GitHub Pages Ready**: Can be deployed directly to GitHub Pages

## How to Use

1. **Upload Files**: Drag and drop CSV files or click to select them
2. **Configure Symbol Mappings** (optional): Add custom crypto or stock symbols
3. **Process Files**: Click "Process Files & Download Excel" to combine and export
4. **Download**: Excel file downloads automatically with timestamp

## CSV Format Expected

The tool expects CSV files with the following columns (Estonian headers):
- `TEHINGUPÄEV` - Transaction date
- `SÜMBOL` - Symbol/ticker
- `VÄRTPABER` - Security name
- `VALUUTA` - Currency
- `KOGUS` - Quantity/amount
- `HIND` - Price
- `NETOSUMMA` - Net amount
- `TEENUSTASU` - Fee

## Symbol Detection

The application uses multiple methods to detect symbol types:

1. **Pattern Recognition**: Identifies common patterns for different asset types
2. **Local Database**: Remembers previously seen symbols
3. **Manual Override**: Users can specify custom symbol mappings
4. **API Integration**: Ready for integration with financial APIs (future enhancement)

## Supported Asset Types

- **Stocks**: Common stock symbols (AAPL, MSFT, GOOGL, etc.)
- **Cryptocurrencies**: Major crypto assets (BTC, ETH, ADA, etc.)
- **ETFs**: Exchange-traded funds (SPY, QQQ, VTI, etc.)
- **Bonds**: Bond instruments and treasury securities
- **Other**: Unclassified instruments

## Local Deployment

1. Clone this repository
2. Open `index.html` in a web browser
3. No additional setup required

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the main branch.

**Setup:**
1. Push the code to your GitHub repository
2. Go to Settings → Pages in your repository
3. Under "Build and deployment", select "GitHub Actions"
4. Your site will be automatically deployed and available at `https://[username].github.io/[repository]`

### 🧪 Automated Testing

**Pre-deployment Quality Assurance:**
- ✅ **Static Symbol Database**: Validates 150+ pre-populated symbols
- ✅ **Pattern Recognition**: Tests symbol type detection algorithms
- ✅ **Account Name Extraction**: Validates underscore-separated filename parsing
- ✅ **File Processing**: Simulates LHV CSV format processing
- ✅ **Data Transformation**: Tests complete pipeline functionality

**CI/CD Pipeline:**
1. **Test Job**: Runs comprehensive test suite
2. **Build Job**: Only runs if all tests pass
3. **Deploy Job**: Deploys to GitHub Pages

**Test Coverage:**
- Symbol detection (Stock, Crypto, ETF, Bond)
- Account name parsing (LHV_2025_Metallid.csv → LHV)
- Estonian language support ("ost" → "Buy")
- ETC symbol recognition (XAD5, XAD6)
- Data transformation accuracy

The workflow will:
- Trigger on every push to main branch
- Run comprehensive tests before deployment
- Build and deploy the static site only if tests pass
- Provide deployment status and URL
- Upload test results as artifacts for debugging

### Manual Deployment

If you prefer manual deployment:
1. Go to Settings → Pages in your repository
2. Select "Deploy from a branch" and choose the main branch
3. Your site will be available at `https://[username].github.io/[repository]`

### 🧪 Running Tests Locally

**Node.js Test Suite:**
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run CI tests (simplified for GitHub Actions)
npm run test:ci
```

**Test Coverage:**
- **Symbol Detection Tests**: Static database, patterns, edge cases
- **End-to-End Tests**: Real LHV format processing
- **Account Name Tests**: Underscore-separated filename parsing
- **File Processing Tests**: CSV parsing and data transformation

**Test Resources:**
- `tests/resources/LHV_2025_Metallid.csv` - Real LHV transaction data
- `tests/test-runner.js` - Comprehensive test suite
- `tests/test-ci.js` - Simplified CI tests

## Technical Details

- **Frontend**: HTML5, CSS3 (Tailwind), JavaScript
- **Libraries**: Papa Parse (CSV), SheetJS (Excel export)
- **Storage**: LocalStorage for symbol database
- **Compatibility**: Modern browsers with ES6+ support

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this tool for your investment tracking needs.
