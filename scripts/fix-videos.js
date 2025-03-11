const fs = require('fs');
const path = require('path');

// Path to the videos.ts file
const videosPath = path.join(__dirname, '../src/lib/data/videos.ts');

// Read the file content
const content = fs.readFileSync(videosPath, 'utf8');

// Fix the duplicate previewUrl fields
const fixedContent = content.replace(/previewUrl: "[^"]+",\s+previewUrl: "[^"]+",/g, 'previewUrl: "/previews/preview-1.jpg",');

// Write the fixed content back to the file
fs.writeFileSync(videosPath, fixedContent, 'utf8');

console.log('Fixed duplicate previewUrl fields in videos.ts'); 