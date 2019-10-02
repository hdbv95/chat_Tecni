var watson = require('watson-developer-cloud');
var credencialesWex=require('../Conexion/credencialesWex');
var validaciones=require('../validaciones');
var modelWatsonResultado=require('../Model/WatsonResultado');
var jwt = require('../services/jwt');
var moment= require('moment');
var JsonFind = require('json-find');

const util = require('util');
const controllerWatson={};
const anoComercial=360;
var escorrecto=false;
const listaMarcasModelos = {"CHEVROLET":["11000","4X4","ALTO","ASKA","ASTRA","AVALANCE","AVEO","BLAZER","C1500","CAMARO","CAMINO","CAPTIVA","CAVALIER","CHASIS","CHEVYTAXI","CHEYENNE","CHR","CK","COBALT","CORSA","CRUZE","CY251L","CYZ51L","LUV","ENJOY","ESTEEM","EXR","FORSA","FRR","FSR","FTR","FVR","FVZ","GEMINI","GRAN-BLAZER","GRAND-VITARA","GRAND-VITARA-SZ","ISUZU","JIMNY","KODIAK","LUV","MALIBU","MICROBUS","N200","N300","NHR","NKR","NLR","NMR","NMR85H","NMR85HC","NPR","NPR71L","NPR71P","NQR","NQR71L","NQR85L","OPTRA","ORLANDO","RODEO","SAIL","SAN-REMO","SILVERADO","SPARK","SPORT SIDE","SUPER BRIGADIER","SUPER-CARRY","SWIFT","TAHOE","TAXI","TRACKER","TRACTO-CAMION","TRAILBLAZER","TROOPER","VANN300","VECTRA","VITARA","VIVANT","ZAFIRA","GRAND VITARA","TRAIL BLAZER","GRAND BLAZER","TRAIL","NP200","CHASIS CABINADO NKR","SAMURAI","TRAX","CYZ51P","D-MAX","CHASIS TORPEDO","ELF","SONIC","EQUINOX","NMR 85H PARTNER","BEAT","CAVALIER SPORT LT"],
"KIA":["CADENZA","CARENS","CARNIVAL","CERATO","CERES","K2700","K3000","KIA","MAGENTIS","OPIRUS","OPTIMA","PALIO","PICANTO","PREGIO","RIO","RONDO","SORENTO","SOUL","SPECTRA","SPORTAGE","XCITE","MOHAVE","ÓPTIMA","QUORIS","GRAND PREGIO","RÍO","BESTA","NIRO","STINGER","X3"],
"RENAULT":["CLIO","DUSTER","GT","KANGOO","KERAX","KOLES","LAGUNA","MEGANE","LOGAN","SANDERO"],
"SUZUKI":["VITARA","X3","SCROSS","DL1000A","GS125","GD110","SAMURAI","XF650","TS","SUPER CARRY"],
"TOYOTA":["4 RUNNER","CAMRY","COROLLA","FORTUNER","HILUX","PRIUS","LEXUS","KORONA","SAMURAY","COUPE"],
"VOLKSWAGEN":["SPACE","T5","TIGUAN","VENTO","VOLVO","VOYAGE","NEW JETTA","AMAROK","BORA","BETTLE"],
"ALFA ROMEO":["COLUMBIA","FORTUNER AC 4.0 5P 4*4 TA","DUSTER","NB150-7","AUMARK BJ1129VHPEG F","VIEW CS2 K1","RAPID SPORT","HFC5049XXYKHF","TIVOLI","OUTLANDER 450"],
"AUDI":["TT","ALLROAD","A1","A2","A3","A4","A5","A6","A7","A8"],
"CHERY":["QQ6","QQ3","X1","FULWIN","CHPV11S","Q22L","VAN","TIGGO","HO2","Q5"],
"DAEWOO":["MATRIZ,NUBIRA","RACER","TACUMA","TICO","F3DEF","CIELO","DAMAS","ESPERO","MATIZ"],
"otro":""};



var assistant = new watson.AssistantV1({
  iam_apikey: credencialesWex.principal.wconv_apikey,
  version: credencialesWex.principal.wconv_version_date,
  url: credencialesWex.principal.wconv_url
});


controllerWatson.postEnviarMensajeWex =async(req,res)=>{

    var mensaje=req.body.texto;
    var context=new modelWatsonResultado(false,null,null,null,null,null,null,false);
    if(req.session.context!=undefined){
      context=req.session.context;
    };
    var resWatson=await consultaWatson(mensaje,context,req);
    await decisionDialogos(resWatson,req);
    res.send({resWatson});
    
}
async function consultaWatson(mensaje,contexto,req){
  var watsonPromise = util.promisify(assistant.message.bind(assistant));
  var conversacion = await watsonPromise.call(assistant, {
    workspace_id: credencialesWex.principal.wconv_workspaceId,
    input: {'text': mensaje},
    context:contexto
  }); 
  req.session.context=conversacion.context;
  return conversacion;
  
}
//funciones para consultar prestamos
async function decisionDialogos(watsonResultado,req){
  var entidad=watsonResultado.entities;
  var intencion=watsonResultado.intents;
  console.log(watsonResultado.output.nodes_visited[0]);
  if (watsonResultado.output.nodes_visited[0] =='slot_8_1569603268764') {
    for (var i in entidad) {
      if(entidad[i].entity=="MARCA_VEHICILO"){
        FuncionMarcasModelos(watsonResultado,entidad[i].value);
      }
    }
  }else if (watsonResultado.output.nodes_visited[0] == 'slot_6_1570033774989'||escorrecto==false) {    
    var a= new Date().getFullYear();
    for (var i in entidad) {
      if (entidad[i].entity=='sys-date') {
        escorrecto = verificarA(watsonResultado.context.Ano_Modelo,a);
        if (escorrecto==false) {
          watsonResultado.context.Ano_Modelo=null;
          watsonResultado.output.generic[0]="ingrese un valor entre "+Math.abs(a-17)+" - "+(a+1);
          watsonResultado.output.text="ingrese un valor entre "+Math.abs(a-17)+" - "+(a+1);
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "slot_6_1570033774989", "state": "in_progress"}; 
        }
      }      
    }
  }else if (watsonResultado.output.nodes_visited[0] ==  'slot_4_1570036931289') {
    for(var i in entidad){
      if (entidad[i].value=="#doc" || entidad[i].value=="cédula") {
        var expresion = /([A-z])/g;
        var hallado = watsonResultado.input.text.replace(expresion,'').trim();    
        watsonResultado.input.text=hallado;
        await validarCedula(watsonResultado);        
      }
    }
  }
}
//valida el nuero de cedula
async function validarCedula(watsonResultado){
    var okcedula = validaciones.validarLongitudCedula(watsonResultado.input.text);
    watsonResultado.input.text=okcedula.cedulaFinal;
    if(okcedula.ok == true){
      console.log("cedula correcta");
      if(watsonResultado.context.cedula!=undefined){
        watsonResultado.context.cedula=watsonResultado.input.text;
      }
    }else{
      console.log("cedula incorrecta");
      watsonResultado.output.generic[0]="Numero de cédula invalido";
      watsonResultado.output.text="Numero de cédula invalido";
    }
}
function ConsultaPrestamo(watsonResultado){
  watsonResultado.output.generic[0]=[];
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var prestamo={response_type:"option",title:"Selecciona un prestamo para continuar",options: []}

  for(var i in json.prestamo){
    prestamo.options.push({
      label:json.prestamo[i].institucion+" numero de prestamo: "+json.prestamo[i].preNumero,
      value:{ input:{ text: json.prestamo[i].preNumero}}
   });
  }

  
 return prestamo;
}
async function SeleccionarPrestamo(watsonResultado,req){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var respuestaText={response_type: "text",text: ""}

  for(var i in watsonResultado.entities){
    if(watsonResultado.entities[i].entity=="sys-number"){
      var valorPrestamo=watsonResultado.entities[i].value;
      for(var i=0; i<json.prestamo.length;i++){
    
        if(json.prestamo[i].preNumero==valorPrestamo){
         watsonResultado.context.prestamos=json.prestamo[i];
         watsonResultado.context.numeroPrestamo=valorPrestamo;
         respuestaText.text= await "El saldo pendiente para el prestamo #"+valorPrestamo+
          " de la institucion "+json.prestamo[i].institucion+
          " es de $"+json.prestamo[i].preValorxPagar+
          ", la fecha de pago es "+moment(json.prestamo[i].preFechaVencimiento).add(1,"days").format("YYYY-MM-DD")+
          ", y los dias de atraso son "+json.prestamo[i].DIAS+" dias, ¿te gustaria cancelar?";
          watsonResultado.output.generic[0]=respuestaText;
          watsonResultado.output.text[0]=respuestaText;
          watsonResultado.context.system.dialog_stack[0]=[]; 
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "response_3_1567544098207"};        
          break;
        }else{
          watsonResultado.context.numeroPrestamo=null;
          
        }
    }
  }





  };

  
}
function redondeo(numero, decimales)
{
var flotante = parseFloat(numero);
var resultado = Math.round(flotante*Math.pow(10,decimales))/Math.pow(10,decimales);
return resultado;
}
//funciones para actualizar
async function actualizacionCorreo(correo,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarCorreo(json.Num_Identificacion, correo)
} 
async function actualizacionTelefono(numTelf,campTelf,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarTelefono(json.Num_Identificacion, numTelf,campTelf);
} 
async function actualizacionDireccion(calleP,calleS,numCasa,watsonResultado){
  var token = watsonResultado.context.token;
  var json = jwt.decodeToken(token);
  await persona.actualizarDireccion(json.Num_Identificacion, calleP,calleS,numCasa,watsonResultado.context.dirID);
}  
async function ConsultaDireccion(watsonResultado){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var direcciones={title:"Selecciona una direccion para continuar",options: []};
  var dir = await persona.consultarDireccion(json.Num_Identificacion);
  for(var i in dir){
    direcciones.options.push({
      label:dir[i].dirCallePrincipal+", "+dir[i].dirCalleSecundaria+", "+dir[i].dirNumeroCasa,
      value:{ input:{ text: dir[i].dirID}}
   });
  }
  return direcciones;
}
async function SeleccionarDireccion(watsonResultado){
  var dir=await watsonResultado.context.direcciones
  for(var i in dir.options){
    if(dir.options[i].value.input.text==watsonResultado.input.text){
     watsonResultado.context.dirID = watsonResultado.input.text;
     watsonResultado.output.text[0]= await "La direccion a actualizar es:"+dir.options[i].label+" Por favor utilice el formato [Calle Principal, Calle Secundaria, Numero de casa(xxx-xxx)]";
     watsonResultado.output.generic[0].text=await "La direccion a actualizar es:"+dir.options[i].label+" Por favor utilice el formato [Calle Principal, Calle Secundaria, Numero de casa(xxx-xxx)]";
    }
  };
}
//funciones lugares de pago
async function SeleccionarPrestamoLP(watsonResultado){
  var token=watsonResultado.context.token;
  var json=jwt.decodeToken(token);
  var respuestaText={response_type: "text",text: ""}
  for(var i in watsonResultado.entities){
    if(watsonResultado.entities[i].entity=="sys-number"){
      var valorPrestamo=watsonResultado.entities[i].value;
      for(var i=0; i<json.prestamo.length;i++){
        if(json.prestamo[i].preNumero==valorPrestamo){
         watsonResultado.context.prestamos=json.prestamo[i];
         watsonResultado.context.numeroPrestamo=valorPrestamo;
         respuestaText.response_type="link";
         respuestaText.text= await "https://www.google.com.ec/maps/search/"+json.prestamo[i].institucion.replace(' ','+');
          watsonResultado.output.generic[0]=respuestaText;
          watsonResultado.output.text[0]=respuestaText;
          watsonResultado.context.system.dialog_stack[0]=[];
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "root"};
          break;
        }else{
          watsonResultado.context.numeroPrestamo=null;
        }
      }
    }
  };
}
//actualizar compromiso de pago
async function actualizacionCompromisoPago(watsonResultado ){
  var fecha;
  for(var i in watsonResultado.entities){
    if(watsonResultado.entities[i].entity=="sys-date"){
      fecha =watsonResultado.entities[i].value
    }
     
  }
  await prestamo.CompromisoPago(fecha,watsonResultado.context.numeroPrestamo);
} 

//Marcas y modelos
function FuncionMarcasModelos(watsonResultado,value){
  var jsonMarcasModelos= JsonFind(listaMarcasModelos);
  var MarcaModelo={response_type:"option",title:"Gracias, por favor selecciona el modelo del vehículo para continuar😉😉",options: []}
  for(var i in jsonMarcasModelos.checkKey(value)){
      MarcaModelo.options.push({
        label:jsonMarcasModelos.checkKey(value)[i],
        value:{ input:{ text: "("+jsonMarcasModelos.checkKey(value)[i]+")" }}
      });
  }
  watsonResultado.output.generic=MarcaModelo;
}
//verificar año
function verificarA(value,a){
  if (Math.abs(a-17)<=value && value<=(a+1)) {return true;}
  else{return false;}
}

module.exports=controllerWatson;
