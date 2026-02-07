import fs from 'fs';
import path from 'path';
import * as unzipper from 'unzipper';

export async function unzipGameFile(zipPath: string, gameTitle: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const sanitizedTitle = gameTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const extractPath = path.join(__dirname, '../../../uploads/games', sanitizedTitle);

      console.log('📦 Extracting to:', extractPath);

      // Remove existing directory if it exists
      if (fs.existsSync(extractPath)) {
        console.log('⚠️  Directory exists, removing...');
        fs.rmSync(extractPath, { recursive: true, force: true });
      }

      // Create directory
      fs.mkdirSync(extractPath, { recursive: true });

      const stream = fs.createReadStream(zipPath).pipe(unzipper.Extract({ path: extractPath }));

      stream.on('close', () => {
        console.log('✅ Unzip completed');

        // Verify index.html exists
        const indexPath = path.join(extractPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
          console.warn('⚠️  Warning: index.html not found in root of extracted files');
        }

        resolve(`games/${sanitizedTitle}`);
      });

      stream.on('error', (err: any) => {
        console.error('❌ Unzip stream error:', err);
        reject(new Error(`Failed to extract game: ${err?.message ?? String(err)}`));
      });
    } catch (err: any) {
      console.error('❌ Unzip setup error:', err);
      reject(err);
    }
  });
}

export function ensureUploadsDirectory(): void {
  const uploadsDir = path.join(__dirname, '../../../uploads');
  const gamesDir = path.join(uploadsDir, 'games');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  if (!fs.existsSync(gamesDir)) {
    fs.mkdirSync(gamesDir, { recursive: true });
  }
}
