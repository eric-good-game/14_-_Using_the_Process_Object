import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import AuthController from "../controllers/authController";
import isAuth from "../middlewares/isAuth";

const router = Router();

const formInputs = [
    {
        label: 'Correo electrónico',
        id: 'email',
        name: 'email',
        type: 'email',
        required: true
    },
    {
        id: 'password',
        label: 'Contraseña',
        name: 'password',
        type: 'password',
        required: true
    },
    {
        id: 'name',
        label: 'Nombre',
        name: 'name',
        type: 'text',
        required: true
    },
]

router
    .post('/signup', (req:Request,res:Response)=>{
        passport.authenticate('signup',{ session: true }, (err,user,info)=>{
            if(err){
                return res.status(400).json({message:err.message})
            }
            if(!user){
                if(info.message === 'User already exists'){
                    return res.status(400).json({message:"Correo Electrónico ya registrado."})
                }
            }
            req.logIn(user, (err)=>{
                if(err){
                    return res.status(400).json({message:err.message})
                }
                return res.status(201).json({message:"Usuario registrado correctamente."})
            })
        })(req,res)
    })
    .post('/login', (req:Request,res:Response)=>{
        passport.authenticate('login', {session:true}, (err,user,info)=>{
            if(err){
                return res.status(400).json({message:err.message})
            }
            if(!user){
                if(info.message === 'User not found' || info.message === 'Wrong Password'){
                    return res.status(400).json({message:"Correo y/o contraseña incorrectos."})
                } 
             }
             req.logIn(user, (err)=>{
                if(err){
                    return res.status(400).json({message:err.message})
                }
                return res.status(200).json({message:"Usuario logueado correctamente."})
             })
        })(req,res)
    } )
    .get('/logout',  isAuth, (req:Request,res:Response, next:NextFunction)=>{
        try {
            res.render('logout', { user:req.user });
            req.logout(function(err) {
                if (err) return next(err)
            })
        } catch (err) {
            console.log(err);
        }
    })
    .get('/login', isAuth, (req:Request,res:Response)=>{
        const type = 'login';
        const title = 'Iniciar Sesión';
        const inputs = ['email', 'password']
        const link = '/auth/signup';
        const linkLabel = 'Registrarse';
        res.render('auth',{type, title, inputs, formInputs, link, linkLabel});
    })
    .get('/signup', isAuth, (req:Request,res:Response)=>{
        const type = 'signup';
        const title = 'Registrarse';
        const inputs = ['name', 'email', 'password']
        const link = '/auth/login';
        const linkLabel = 'Iniciar sesión';
        res.render('auth',{type, title, inputs, formInputs, link, linkLabel});
    })

export default router;