import { Request as ExpressRequest, Response, NextFunction } from 'express';

export interface Request {
    (req: ExpressRequest, res: Response, next?: NextFunction);
}

export interface Route {
    auth?: Request; // Authorization Middleware
    get?: Request; // GET request
    post?: Request; // POST request
    put?: Request; // PUT request
    delete?: Request; // DELETE request
}
