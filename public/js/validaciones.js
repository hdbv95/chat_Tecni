const configMensaje = require('../js/mail');
var validaciones={};

var validCedula={
    msjC:"",
  
    cedulaFinal:"",
    ok:""
  }

  validaciones.enviarEmail=function(usuario,token){
  
    configMensaje(usuario,token);
  }

  validaciones.validarLongitudCedula=function (cedula){
    
  var cad = cedula;
  
  var ok = false;
  var total = 0;
  var longitud = cad.length;
  var longcheck = longitud - 1;
  
  if(cad !== "" && longitud >= 9 && longitud <= 13){
  
    if(cad !== "" && longitud === 9){
      cad = '0'+cad;
      longitud = cad.length;
      if (cad !== "" && longitud === 10){
        for(i = 0; i < longcheck; i++){
          if (i%2 === 0) {
            var aux = cad.charAt(i) * 2;
            if (aux > 9) aux -= 9;
            total += aux;
          } else {
            total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
          }
        }
      
        total = total % 10 ? 10 - total % 10 : 0;
      
        if (cad.charAt(longitud-1) == total) {
          validCedula.msjC = "Cedula valida";
          validCedula.cedulaFinal = cad;
          validCedula.ok = true;
          return validCedula;
        }else{
  
          validCedula.msjC = "Cedula no valida";
          validCedula.cedulaFinal = cad;
          validCedula.ok = false;
          return validCedula;
        }
      }
    }else if (cad !== "" && longitud === 10){
  
      for(i = 0; i < longcheck; i++){
        if (i%2 === 0) {
          var aux = cad.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
    
      total = total % 10 ? 10 - total % 10 : 0;
  
      if (cad.charAt(longitud-1) == total) {
  
       
        validCedula.msjC = "Cedula valida";
          validCedula.cedulaFinal = cad;
          validCedula.ok = true;
          return validCedula;
      }else{
    
        validCedula.msjC = "Cedula no valida";
          validCedula.cedulaFinal = cad;
          validCedula.ok = false;
          return validCedula;
      }
    }else if(cad !== "" && longitud === 12){
      cad = '0'+cad;
      longitud = cad.length;
      if (cad !== "" && longitud === 13){
        var ced="";
        var rucI="";
        for(i = 0; i < 13; i++){
          
          if(i < 10){
            ced += cad[i];
          }
          if(i >= 10){
            rucI += cad[i];
          }
          
        }
      for(i = 0; i < longcheck; i++){
          if (i%2 === 0) {
            var aux = ced.charAt(i) * 2;
            if (aux > 9) aux -= 9;
            total += aux;
          } else {
            total += parseInt(ced.charAt(i)); // parseInt o concatenará en lugar de sumar
          }
        }
      
        total = total % 10 ? 10 - total % 10 : 0;
        var regExp = /^[0]{1}[0]{1}[1]{1}$/i;
        if (ced.charAt(longitud-1) == total && regExp.test(rucI)) {
          
          validCedula.msjC = "Ruc valido";
          validCedula.cedulaFinal = ced+rucI;
          validCedula.ok = true;
          return validCedula;
        }else{
          validCedula.msjC = "Ruc no valido";
          validCedula.cedulaFinal = ced+rucI;
          validCedula.ok = false;
          return validCedula;
        }
  
      }
    }else if (cad !== "" && longitud === 13){
      var ced="";
      var rucI="";
      for(i = 0; i < 13; i++){
        
        if(i < 10){
          ced += cad[i];
        }
        if(i >= 10){
          rucI += cad[i];
        }
        
      }
    for(i = 0; i < longcheck; i++){
        if (i%2 === 0) {
          var aux = ced.charAt(i) * 2;
          if (aux > 9) aux -= 9;
          total += aux;
        } else {
          total += parseInt(ced.charAt(i)); // parseInt o concatenará en lugar de sumar
        }
      }
    
      total = total % 10 ? 10 - total % 10 : 0;
      var regExp = /^[0]{1}[0]{1}[1]{1}$/i;
      if (ced.charAt(longitud-1) == total && regExp.test(rucI)) {
        
        validCedula.msjC = "Ruc valido";
        validCedula.cedulaFinal = ced+rucI;
        validCedula.ok = true;
        return validCedula;
      }else{
        validCedula.msjC = "Ruc no valido";
        validCedula.cedulaFinal = ced+rucI;
        validCedula.ok = false;
        return validCedula;
      }
  
    }
    
    
    else{
  
      validCedula.msjC = "Cedula invalida";
      validCedula.cedulaFinal = cad;
      validCedula.ok = false;
      return validCedula;
    }
    
  }else{
    validCedula.msjC = "Cedula o ruc no validos";
    validCedula.cedulaFinal = cad;
    validCedula.ok = false;
    return validCedula;
  }
  
  
   
  }  

validaciones.leerReglasTecniseguros=function(marca,modelo){
vardatos=JSON.parse(fs.readFileSync("REGLAS_TECNI.json", 'utf-8'));
varjsonResult=[]
for(vari in datos){
if(datos[i].Marca==marca){
for(var j in datos[i].Aseguradoras){
varjson={"Marca":marca,"Modelo":modelo,"Aseguradora":null,"MontoMaximo":0, "tasa":0 , "cuotas":0 , "Coberturas":null, "Exclusiones":null}
json.Aseguradora=datos[i].Aseguradoras[j].Nombre
for(var k in datos[i].Aseguradoras[j].Resultado){
letresult=datos[i].Aseguradoras[j].Resultado[k].Modelos.find(buscar=>buscar==modelo);
if(result!=undefined&&result!=null&&result==modelo){
json.MontoMaximo=datos[i].Aseguradoras[j].Resultado[k].MontoMaximo;
json.tasa=datos[i].Aseguradoras[j].Resultado[k].tasa;
json.cuotas=datos[i].Aseguradoras[j].Resultado[k].cuotas;
json.Coberturas=datos[i].Aseguradoras[j].Resultado[k].Coberturas;
json.Exclusiones=datos[i].Aseguradoras[j].Resultado[k].Exclusiones;
jsonResult.push(json);
            }
          }

        }

      }
    }
returnjsonResult;
  }



  module.exports=validaciones