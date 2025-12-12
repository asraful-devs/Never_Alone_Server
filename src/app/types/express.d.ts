import type { File as MulterFile } from 'multer';

declare global {
    namespace Express {
        interface Request {
            file?: MulterFile;
            files?: MulterFile[];
            user?: {
                parsonId?: string;
                personId?: string;
                email: string;
                role: string;
            };
        }
    }
}

export {};
