const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = {
  'google-drive-icon.png': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
  'airtable-icon.png': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg',
  'quickbooks-icon.png': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Quickbooks_Logo.png'
};

const downloadImage = (url, filename) => {
  const filepath = path.join(__dirname, '../public', filename);
  const file = fs.createWriteStream(filepath);

  https.get(url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', err => {
    fs.unlink(filepath);
    console.error(`Error downloading ${filename}:`, err.message);
  });
};

Object.entries(icons).forEach(([filename, url]) => {
  downloadImage(url, filename);
});
