"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUsername = generateRandomUsername;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const adjectives = [
    'Calm', 'Brave', 'Sunny', 'Happy', 'Cool', 'Silent', 'Swift', 'Gentle', 'Wild', 'Smart',
    'Quiet', 'Neon', 'Cosmic', 'Wandering', 'Hidden', 'Misty', 'Crystal', 'Crimson', 'Azure',
];
const nouns = [
    'River', 'Tiger', 'Cloud', 'Panda', 'Eagle', 'Moon', 'Star', 'Wolf', 'Fox', 'Bear',
    'Ocean', 'Forest', 'Mountain', 'Dragon', 'Phoenix', 'Comet', 'Shadow', 'Spark', 'Wave',
];
function generateRandomUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900) + 100; // 100 to 999
    return `${adj}${noun}${num}`;
}
function signToken(payload) {
    return jsonwebtoken_1.default.sign({
        ...payload,
        issuedAt: Date.now(),
    }, JWT_SECRET, { expiresIn: '6h' });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
