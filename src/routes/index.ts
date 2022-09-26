import { fork } from "child_process";
import { Request, Response, Router } from "express";
import minimist from 'minimist';
import isAuth from "../middlewares/isAuth";
import authRouter from "./auth";
import apiRouter from "./api";

const argv = minimist(process.argv.slice(2));

const router = Router();

router.use('/auth', authRouter)
router.use('/api', apiRouter)

router.get('/', isAuth, (req:Request, res:Response) => {
    res.render('index', { user:req.user });
})
router.get('/info', (req:Request, res:Response) => {
    const title= 'Información técnica'
    const info = {
        arg:JSON.stringify(argv),
        so: process.platform,
        version: process.version,
        memory: process.memoryUsage().rss,
        path: process.execPath,
        pid: process.pid,
        rute: process.cwd()
    }
    const labels = {
        arg: "Argumentos de entrada: ",
        so: "Sistema operativo: ",
        version: "Versión de node: ",
        memory: "Memoria total reservada: ",
        path: "Path de ejecución: ",
        pid: "Id del proceso: ",
        rute: "Carpeta del proyecto: "
    }
    res.render('info', {title,labels,info});
})

router.get('/*', (req:Request, res:Response) => {
    res.render('404');
})

export default router;