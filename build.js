const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple build script to compile TypeScript
function build() {
    try {
        console.log('Compiling TypeScript...');
        
        // Run TypeScript compiler
        execSync('npx tsc', { stdio: 'inherit', cwd: __dirname });
        
        console.log('✅ TypeScript compiled successfully!');
        console.log('📁 Output: ./dist/app.js');
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Watch mode for development
function watch() {
    console.log('👀 Watching for changes...');
    
    const { spawn } = require('child_process');
    const tsc = spawn('npx', ['tsc', '--watch'], { 
        stdio: 'inherit', 
        cwd: __dirname 
    });
    
    tsc.on('close', (code) => {
        console.log(`TypeScript compiler exited with code ${code}`);
    });
}

// Command line arguments
const command = process.argv[2];

if (command === 'watch') {
    watch();
} else {
    build();
}
