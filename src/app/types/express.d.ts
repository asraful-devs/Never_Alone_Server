// src/types/express.d.ts

declare global {
    namespace Express {
        interface Request {
            user?: {
                parsonId?: string; // Backend এ typo আছে
                personId?: string; // সঠিক spelling
                email: string;
                role: string;
            };
        }
    }
}

export {};
