"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000') }, // 500MB default
});
//# sourceMappingURL=upload.js.map