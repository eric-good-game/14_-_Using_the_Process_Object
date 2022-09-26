import { NextFunction, Request, Response } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return ['/login','/signup'].includes(req.path)? res.redirect('/') : next();
    } else {
        return ['/login','/signup'].includes(req.path)? next() : res.redirect('/auth/login'); 
    }
}

export default isAuth