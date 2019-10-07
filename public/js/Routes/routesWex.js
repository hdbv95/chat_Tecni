var express = require('express');
var router = express.Router();
var controllereWex=require('../Controller/controllerWex');
var controlBD=require('../Controller/controllerBD');
const validatePayloadMiddleware = (req,res,next)=>{

    if(req.body){
        next();
    }else{
        res.status(403).send({
            errorMessage: 'you need a parload'
        })
    }
}

router.post('/enviarMensaje', validatePayloadMiddleware,controllereWex.postEnviarMensajeWex);
router.get('/bd', controlBD.save);
//router.get('/obtener-prestamos',controllerPrestamo.ConsultarTodosPrestamos);
//router.post('/login',controllerPersona.loginUsuario);
//router.post('/enviarMail',controllerPersona.enviarMail);

module.exports=router;