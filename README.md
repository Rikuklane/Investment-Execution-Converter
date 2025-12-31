# Investment Execution Converter

Convert CSV investment transaction files into a unified Excel format with automatic symbol type detection.

## What It Does

- **Combines multiple CSV files** into one Excel file
- **Auto-detects symbol types**: Stock, Crypto, ETF, Bond
- **Processes LHV bank format** (Estonian headers)
- **Downloads Excel automatically** with timestamp

## How to Use

1. **Upload**: Drag & drop CSV files or click to select
2. **Process**: Click "Process Files & Download Excel"
3. **Done**: Excel file downloads automatically

## Expected CSV Format

Estonian LHV bank format with these headers:
- `TEHINGUPÄEV` - Date
- `SÜMBOL` - Symbol
- `VÄRTPABER` - Name
- `VALUUTA` - Currency
- `KOGUS` - Quantity
- `HIND` - Price
- `NETOSUMMA` - Net amount
- `TEENUSTASU` - Fee

## Symbol Detection

- **191 symbols pre-mapped** (Stock: 118, ETF: 42, Crypto: 25, Bond: 6)
- **Pattern recognition** for unknown symbols
- **Local database** remembers new symbols
- **Manual override** via text inputs

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build TypeScript
npm run build
```

## Deployment

### Local
Open `index.html` in browser - no setup needed

### GitHub Pages
Push to main branch → auto-deploys via GitHub Actions

## Tech Stack

- **Frontend**: TypeScript, HTML, Tailwind CSS
- **Libraries**: Papa Parse (CSV), SheetJS (Excel)
- **Storage**: LocalStorage for symbol database
- **Tests**: Node.js + JSDOM

## License

MIT
