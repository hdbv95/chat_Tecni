var watson = require('watson-developer-cloud');
var credencialesWex=require('../Conexion/credencialesWex');
var validaciones=require('../validaciones');
var modelWatsonResultado=require('../Model/WatsonResultado');
var jwt = require('../services/jwt');
var moment= require('moment');
var JsonFind = require('json-find');
const storage = require('node-sessionstorage')
const util = require('util');
const controllerWatson={};
const anoComercial=360;


const listaMarcasModelos = {"CHEVROLET":["11000","4X4","ALTO","ASKA","ASTRA","AVALANCE","AVEO","BLAZER","C1500","CAMARO","CAMINO","CAPTIVA","CAVALIER","CHASIS","CHEVYTAXI","CHEYENNE","CHR","CK","COBALT","CORSA","CRUZE","CY251L","CYZ51L","LUV","ENJOY","ESTEEM","EXR","FORSA","FRR","FSR","FTR","FVR","FVZ","GEMINI","GRAN-BLAZER","GRAND-VITARA","GRAND-VITARA-SZ","ISUZU","JIMNY","KODIAK","LUV","MALIBU","MICROBUS","N200","N300","NHR","NKR","NLR","NMR","NMR85H","NMR85HC","NPR","NPR71L","NPR71P","NQR","NQR71L","NQR85L","OPTRA","ORLANDO","RODEO","SAIL","SAN-REMO","SILVERADO","SPARK","SPORT SIDE","SUPER BRIGADIER","SUPER-CARRY","SWIFT","TAHOE","TAXI","TRACKER","TRACTO-CAMION","TRAILBLAZER","TROOPER","VANN300","VECTRA","VITARA","VIVANT","ZAFIRA","GRAND VITARA","TRAIL BLAZER","GRAND BLAZER","TRAIL","NP200","CHASIS CABINADO NKR","SAMURAI","TRAX","CYZ51P","D-MAX","CHASIS TORPEDO","ELF","SONIC","EQUINOX","NMR 85H PARTNER","BEAT","CAVALIER SPORT LT"],
"KIA":["CADENZA","CARENS","CARNIVAL","CERATO","CERES","K2700","K3000","KIA","MAGENTIS","OPIRUS","OPTIMA","PALIO","PICANTO","PREGIO","RIO","RONDO","SORENTO","SOUL","SPECTRA","SPORTAGE","XCITE","MOHAVE","ÓPTIMA","QUORIS","GRAND PREGIO","BESTA","NIRO","STINGER","X3"],
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
  var id=req.body.id;
  //console.log(storage.getItem(id));
  var context=new modelWatsonResultado(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,false,null);
    if(storage.getItem(id)!=undefined){
      context=storage.getItem(id);
    };
    
    var resWatson=await consultaWatson(mensaje,context,req,id);
    await decisionDialogos(resWatson,req);
    //await telegram.enviarTexto(resWatson);
    res.send({resWatson});
}
async function consultaWatson(mensaje,contexto,req,id){
  var watsonPromise = util.promisify(assistant.message.bind(assistant));
  var conversacion = await watsonPromise.call(assistant, {
    workspace_id: credencialesWex.principal.wconv_workspaceId,
    input: {'text': mensaje},
    context:contexto
  }); 
  storage.setItem(id, conversacion.context)
  //req.session.context=conversacion.context;

  
  return conversacion;
}

//funciones para consultar prestamos
async function decisionDialogos(watsonResultado,req){
  var entidad=watsonResultado.entities;
  var intencion=watsonResultado.intents;
  console.log("=======");
  console.log(watsonResultado.context.system.dialog_stack);
  console.log(watsonResultado.output.nodes_visited[0]);
  console.log(watsonResultado);
  console.log("=======");
  //slots con dialoge_node
  if (watsonResultado.context.system.dialog_stack[0].dialog_node =='slot_8_1569603268764' || watsonResultado.context.system.dialog_stack[0].dialog_node =='slot_5_1569606354157') {      
    for (var i in entidad) {
        if(entidad[i].entity=="MARCA_VEHICILO" ){
          FuncionMarcasModelos(watsonResultado,entidad[i].value);
        }
      }
      if(watsonResultado.context.MARCA_VEHICILO!=null){
         FuncionMarcasModelos(watsonResultado,watsonResultado.context.MARCA_VEHICILO); 
      }
  }else if (watsonResultado.context.system.dialog_stack[0].dialog_node == 'slot_6_1570033774989' ||watsonResultado.context.system.dialog_stack[0].dialog_node=="node_4_1570033752785") {       
    //fecha del vehiculo   
    var a= new Date().getFullYear();
    for (var i in entidad) {
      if (entidad[i].entity=='sys-date') {
        var escorrecto = verificarA(watsonResultado.context.Ano_Modelo,a);
        if (escorrecto==false) {
          watsonResultado.context.Ano_Modelo=null;
          watsonResultado.output.generic[0].response_type="text";
          watsonResultado.output.generic[0].text="ingrese un valor entre "+Math.abs(a-17)+" - "+(a+1);
          watsonResultado.output.text="ingrese un valor entre "+Math.abs(a-17)+" - "+(a+1);
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "slot_6_1570033774989", "state": "in_progress"}; 
        }
      }      
    }
  }else if (watsonResultado.context.system.dialog_stack[0].dialog_node == 'slot_8_1570033947405' || watsonResultado.context.system.dialog_stack[0].dialog_node == 'slot_7_1570034829464'){
    //llenado arreglo aseguradoras para su uso
    watsonResultado.context.MODELO_VEHICULO = await watsonResultado.context.MODELO_VEHICULO.replace(/[\(\)]+/g,"");
    watsonResultado.context.arregloAseguradoras = await validaciones.leerReglasTecniseguros(watsonResultado);
  }else if (watsonResultado.output.nodes_visited[0] ==  'slot_8_1570037277161') {
   //validar cedula
    for(var i in entidad){
      if (entidad[i].entity=="documentos" && entidad[i].value=="doc") {
        var expresion = /([A-z])/g;
        var hallado = watsonResultado.input.text.replace(expresion,'').trim();    
        watsonResultado.input.text=hallado;
        var cedula = await validarCedula(watsonResultado);
        if (cedula==false) {
          watsonResultado.context.cedula=null;
          watsonResultado.output.generic[0].response_type="text";
          watsonResultado.output.generic[0].text="ingrese un numero de cedula valido"
          watsonResultado.output.text="ingrese un numero de cedula valido";
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "slot_8_1570037277161", "state": "in_progress"};
        }else{
          for(var contador in watsonResultado.context.arregloAseguradoras ){
            var texto = "La aseguradora "+watsonResultado.context.arregloAseguradoras[contador].Aseguradora+" con tasa de % "+watsonResultado.context.arregloAseguradoras[contador].tasa+" con un plan anual de $ "+watsonResultado.context.arregloAseguradoras[contador].MontoMaximo+" y hasta "+watsonResultado.context.arregloAseguradoras[contador].cuotas+" cuotas (Con cargo a Tarjeta de Crédito), tiene prima neta de "+watsonResultado.context.arregloAseguradoras[contador].primaNeta+" $ y una prima anual de "+watsonResultado.context.arregloAseguradoras[contador].primaAnual+" $";
            var respuesta={ response_type: 'text', text:texto };
            watsonResultado.output.generic.push(respuesta);
          }
          watsonResultado.output.generic.push({ response_type: 'text', text:"Desea continuar??" });
          watsonResultado.context.system.dialog_stack[0]={"dialog_node": "node_3_1566585263629", "state": "in_progress"};
        }
      }
    }
  }else if(watsonResultado.context.cedula != "" && watsonResultado.context.cedula != undefined &&  (watsonResultado.context.system.dialog_stack[0].dialog_node == 'handler_10_1570033947462' ||  watsonResultado.output.nodes_visited[0]=="slot_8_1570033947405")){
    if(watsonResultado.context.cedula != undefined ||watsonResultado.context.cedula != null || watsonResultado.context.cedula != ""){
      for(var contador in watsonResultado.context.arregloAseguradoras ){
        var texto = "La aseguradora "+watsonResultado.context.arregloAseguradoras[contador].Aseguradora+" con tasa de % "+watsonResultado.context.arregloAseguradoras[contador].tasa+" con un plan anual de $ "+watsonResultado.context.arregloAseguradoras[contador].MontoMaximo+" y hasta "+watsonResultado.context.arregloAseguradoras[contador].cuotas+" cuotas (Con cargo a Tarjeta de Crédito), tiene prima neta de "+watsonResultado.context.arregloAseguradoras[contador].primaNeta+" $ y una prima anual de "+watsonResultado.context.arregloAseguradoras[contador].primaAnual+" $";
        var respuesta={ response_type: 'text', text:texto };
        watsonResultado.output.generic.push(respuesta);
      }
      watsonResultado.output.generic.push({ response_type: 'text', text:"Desea continuar??" });
      watsonResultado.context.system.dialog_stack[0]={"dialog_node": "node_3_1566585263629", "state": "in_progress"};
    }
  }
}

//valida el nuero de cedula
async function validarCedula(watsonResultado){
    var okcedula = validaciones.validarLongitudCedula(watsonResultado.input.text);
    watsonResultado.input.text=okcedula.cedulaFinal;
    if(okcedula.ok == true){
      if(watsonResultado.context.cedula!=undefined){
        watsonResultado.context.cedula=watsonResultado.input.text;
        return true;
      }
    }else{
      watsonResultado.output.generic[0].response_type="text";
      watsonResultado.output.generic[0].text="Numero de cédula invalido";
      watsonResultado.output.text="Numero de cédula invalido";
      return false;
    }
}

//Marcas y modelos
function FuncionMarcasModelos(watsonResultado,value){
  var jsonMarcasModelos= JsonFind(listaMarcasModelos);
  var MarcaModelo=[{response_type:"option",title:"Gracias, por favor selecciona el modelo del vehículo para continuar😉😉",options: []}]
  for(var i in jsonMarcasModelos.checkKey(value)){
      MarcaModelo[0].options.push({
        label:"("+jsonMarcasModelos.checkKey(value)[i]+")" ,
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