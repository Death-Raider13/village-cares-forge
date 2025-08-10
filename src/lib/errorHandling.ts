export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public userMessage: string
    ) {
        super(message);
    }
}

export const errorHandler = (error: unknown) => {
    if (error instanceof AppError) {
        return {
            message: error.userMessage,
            code: error.code
        };
    }

    return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
    };
};