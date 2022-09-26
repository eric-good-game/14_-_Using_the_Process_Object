import { fork } from "child_process";
import { Request, Response } from "express";

export interface Imsg {
    action: string;
    data: {
        [key: string]: any;
    }
}

class randomController {
    static getRandomNumber(req:Request,res:Response) {
        const cant = parseInt(req.query.cant as string) || 100000000;
        const child = fork('./src/child.ts');
        child.send({action: 'start',data: {cant}});
        child.on('message', (msg:Imsg) => {
            const {action,data} = msg;
            if(action === 'result') {
                res.json(data.result);
                console.log('Child process finished');
            }
        })
        child.on("close", function (code) {
            console.log("child process exited with code " + code);
        });
    }
}

export default randomController;