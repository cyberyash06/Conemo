import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const adjectives = [
  'Calm', 'Brave', 'Sunny', 'Happy', 'Cool', 'Silent', 'Swift', 'Gentle', 'Wild', 'Smart',
  'Quiet', 'Neon', 'Cosmic', 'Wandering', 'Hidden', 'Misty', 'Crystal', 'Crimson', 'Azure',
];

const nouns = [
  'River', 'Tiger', 'Cloud', 'Panda', 'Eagle', 'Moon', 'Star', 'Wolf', 'Fox', 'Bear',
  'Ocean', 'Forest', 'Mountain', 'Dragon', 'Phoenix', 'Comet', 'Shadow', 'Spark', 'Wave',
];

export function generateRandomUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100 to 999
  
  return `${adj}${noun}${num}`;
}

export interface JWTPayload {
  userId: string;
  username: string;
  issuedAt: number;
}

export function signToken(payload: Omit<JWTPayload, 'issuedAt'>): string {
  return jwt.sign(
    {
      ...payload,
      issuedAt: Date.now(),
    },
    JWT_SECRET as string,
    { expiresIn: '6h' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as unknown as JWTPayload;
  } catch {
    return null;
  }
}
