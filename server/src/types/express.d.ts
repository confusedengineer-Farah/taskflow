declare global {
    namespace Express {
        interface Router {
            userId: number;
        }
    }
}

export {};