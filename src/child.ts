import {Imsg} from './controllers/randomController';

function random(cant:number) {
    const min = 1;
    const max = 1000;
    const randoms:{ [key:string]:number } = {};
    for (let i = 0; i < cant; i++) {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        const key = random.toString().padStart(4,'0');
        if(randoms[key]){
            randoms[key] += 1;
        }else{
            randoms[key] = 1;
        }
    }
    return randoms;
  }
  
process.on("message", (msg:Imsg) => {
    const {action,data} = msg;
    if (action == "start") {
        console.log('Child process started');
        const randoms = random(data.cant);
        if (process.send) {
            process.send({action: 'result', data:{result:randoms}});
            process.exit();
        }   
    }
});