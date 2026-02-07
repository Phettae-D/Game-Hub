"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unzipGameFile = unzipGameFile;
exports.ensureUploadsDirectory = ensureUploadsDirectory;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unzipper_1 = __importDefault(require("unzipper"));
async function unzipGameFile(zipPath, gameTitle) {
    return new Promise((resolve, reject) => {
        try {
            const sanitizedTitle = gameTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const extractPath = path_1.default.join(__dirname, '../../../uploads/games', sanitizedTitle);
            console.log('📦 Extracting to:', extractPath);
            // Remove existing directory if it exists
            if (fs_1.default.existsSync(extractPath)) {
                console.log('⚠️  Directory exists, removing...');
                fs_1.default.rmSync(extractPath, { recursive: true, force: true });
            }
            // Create directory
            fs_1.default.mkdirSync(extractPath, { recursive: true });
            const stream = fs_1.default.createReadStream(zipPath).pipe(unzipper_1.default.Extract({ path: extractPath }));
            stream.on('close', () => {
                console.log('✅ Unzip completed');
                // Verify index.html exists
                const indexPath = path_1.default.join(extractPath, 'index.html');
                if (!fs_1.default.existsSync(indexPath)) {
                    console.warn('⚠️  Warning: index.html not found in root of extracted files');
                }
                resolve(`games/${sanitizedTitle}`);
            });
            stream.on('error', (err) => {
                console.error('❌ Unzip stream error:', err);
                reject(new Error(`Failed to extract game: ${err.message}`));
            });
        }
        catch (err) {
            console.error('❌ Unzip setup error:', err);
            reject(err);
        }
    });
}
function ensureUploadsDirectory() {
    const uploadsDir = path_1.default.join(__dirname, '../../../uploads');
    const gamesDir = path_1.default.join(uploadsDir, 'games');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir);
    }
    if (!fs_1.default.existsSync(gamesDir)) {
        fs_1.default.mkdirSync(gamesDir, { recursive: true });
    }
}
//# sourceMappingURL=fileUtils.js.map