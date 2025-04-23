import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  },
  {
    url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
    filename: 'calendar-decoration1.jpg',
    description: 'Person writing in planner'
  },
  {
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    filename: 'calendar-decoration2.jpg',
    description: 'Organized desk with calendar'
  },
  {
    url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    filename: 'calendar-decoration3.jpg',
    description: 'Monthly planning calendar'
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