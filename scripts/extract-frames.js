const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Read the videos data
const videosPath = path.join(__dirname, '../src/lib/data/videos.ts');
let videosContent = fs.readFileSync(videosPath, 'utf8');

// Extract video URLs using regex
const videoUrlRegex = /url: "([^"]+)"/g;
const videoIdRegex = /id: "([^"]+)"/g;
const videoUrls = [];
const videoIds = [];

let match;
while ((match = videoUrlRegex.exec(videosContent)) !== null) {
  videoUrls.push(match[1]);
}

while ((match = videoIdRegex.exec(videosContent)) !== null) {
  videoIds.push(match[1]);
}

// Create previews directory if it doesn't exist
const previewsDir = path.join(__dirname, '../public/previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

// Process each video
async function processVideos() {
  for (let i = 0; i < videoUrls.length; i++) {
    const videoUrl = videoUrls[i];
    const videoId = videoIds[i];
    const outputPath = path.join(previewsDir, `preview-${videoId}.jpg`);
    
    console.log(`Processing video ${i + 1}/${videoUrls.length}: ${videoUrl}`);
    
    try {
      await new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
          .on('end', () => {
            console.log(`Successfully extracted frame from ${videoUrl}`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error extracting frame from ${videoUrl}:`, err);
            reject(err);
          })
          .screenshots({
            count: 1,
            filename: `preview-${videoId}.jpg`,
            folder: previewsDir,
            timemarks: ['0.1'] // Extract frame at 0.1 seconds
          });
      });
    } catch (error) {
      console.error(`Failed to process ${videoUrl}:`, error);
    }
  }
  
  // Update the videos.ts file with preview URLs
  updateVideosFile();
}

function updateVideosFile() {
  // Read the file again to ensure we have the latest content
  videosContent = fs.readFileSync(videosPath, 'utf8');
  
  // Parse the file content to get the video objects
  const videoObjects = [];
  const videoRegex = /{([^{}]*)}/g;
  
  while ((match = videoRegex.exec(videosContent)) !== null) {
    videoObjects.push(match[0]);
  }
  
  // Update each video object with the preview URL
  let updatedContent = videosContent;
  
  for (let i = 0; i < videoIds.length; i++) {
    const videoId = videoIds[i];
    const previewUrl = `/previews/preview-${videoId}.jpg`;
    
    // Check if the video already has a previewUrl
    const videoObject = videoObjects[i];
    
    if (videoObject.includes('previewUrl:')) {
      // Replace existing previewUrl
      const previewUrlRegex = /(previewUrl: ")[^"]*(")/;
      updatedContent = updatedContent.replace(
        new RegExp(`(id: "${videoId}"[\\s\\S]*?)${previewUrlRegex}`, 'g'),
        `$1$2${previewUrl}$3`
      );
    } else {
      // Add new previewUrl after url
      updatedContent = updatedContent.replace(
        new RegExp(`(id: "${videoId}",[\\s\\n]*url: "[^"]+",)`, 'g'),
        `$1\n    previewUrl: "${previewUrl}",`
      );
    }
  }
  
  fs.writeFileSync(videosPath, updatedContent, 'utf8');
  console.log('Updated videos.ts with preview URLs');
}

processVideos().catch(console.error); 