const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../public/assets');
const outputFile = path.join(__dirname, '../public/assets.json');

const files = fs.readdirSync(assetsDir)
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
  .map(file => `/assets/${file}`);

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log('assets.json generated:', files.length, 'files');