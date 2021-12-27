import { Request, Response, NextFunction } from 'express';

export const user = (req: Request, res: Response, next?: NextFunction) => {
    console.log('User Auth');
    next();
};
export const business = (req: Request, res: Response, next: NextFunction) => {
    console.log('Business Auth');
    next();
};
