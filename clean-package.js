const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, 'package.json');
const distPath = path.resolve(__dirname, 'dist', 'package.json');

const raw = fs.readFileSync(packagePath, 'utf-8');
const packageData = JSON.parse(raw);

delete packageData.scripts;
delete packageData.devDependencies;

if (!fs.existsSync(path.dirname(distPath))) {
    fs.mkdirSync(path.dirname(distPath), { recursive: true });
}

fs.writeFileSync(distPath, JSON.stringify(packageData, null, 2), 'utf-8');

console.log('package.json nettoyé et copié dans dist/');
