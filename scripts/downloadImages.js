const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://images.pexels.com/photos/4498140/pexels-photo-4498140.jpeg',
    filename: 'study.jpg',
    description: 'Person studying with books and laptop'
  },
  {
    url: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg',
    filename: 'workout.jpg',
    description: 'Person working out in gym'
  },
  {
    url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    filename: 'meditate.jpg',
    description: 'Person meditating in peaceful environment'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '..', 'src', 'assets', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
};

async function downloadAllImages() {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

downloadAllImages();