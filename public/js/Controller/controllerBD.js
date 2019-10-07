var mongo = require('../Model/ModelMongoAutos').schemaAutos;
var moment=require('moment');
var bdVehiculos={}
var datos={
    "intents": [],
    "entities": [
    {
    "entity": "documentos",
    "location": [
    0,
    10
    ],
    "groups": [
    {
    "group": "group_0",
    "location": [
    0,
    10
    ]
    }
    ],
    "value": "doc",
    "confidence": 1
    },
    {
    "entity": "sys-number",
    "location": [
    0,
    10
    ],
    "value": "1717316549",
    "confidence": 1,
    "metadata": {
    "numeric_value": 1717316549
    }
    }
    ],
    "input": {
    "text": "1717316549"
    },
    "output": {
    "generic": [
    {
    "response_type": "text",
    "text": "Un momento estoy revisando las mejores opciones para ti ¯\\_(ツ)_/¯ "
    }
    ],
    "text": [
    "Un momento estoy revisando las mejores opciones para ti ¯\\_(ツ)_/¯ "
    ],
    "nodes_visited": [
    "slot_8_1570037277161",
    "handler_7_1570037277167",
    "node_4_1570034719471"
    ],
    "warning": "DialogNode: Event handler with ID [handler_1_1570034828939] of type [focus] has no condition, context, or output specified. It will be ignored.",
    "log_messages": [
    {
    "level": "warn",
    "msg": "DialogNode: Event handler with ID [handler_1_1570034828939] of type [focus] has no condition, context, or output specified. It will be ignored.",
    "node_id": "node_4_1570034719471",
    "node_title": "Datos_Personales"
    }
    ]
    },
    "context": {
    "asignarAsesor": false,
    "nombresCotizacion": "(David Baldassari)",
    "Provincias": "pichincha",
    "telefono": "02-222-2222",
    "Ano_Modelo": "2018",
    "Monto_Vehiculo": 5000,
    "correo": "q@q.q",
    "cedula": "1717316549",
    "primaNeta":"",
    "primeCuota":"",
    "tasa":"",
    "cuotas":"",
    "Coberturas":{}, 
    "Exclusiones":{},
    "conversation_id": "5a244a15-1036-45c6-b376-a6f7fd50490c",
    "system": {
    "initialized": true,
    "dialog_stack": [
    {
    "dialog_node": "root"
    }
    ],
    "dialog_turn_counter": 10,
    "dialog_request_counter": 10,
    "_node_output_map": {
    "node_4_1570033752785": {
    "0": [
    0
    ]
    },
    "node_4_1570033904165": {
    "0": [
    0
    ]
    },
    "handler_10_1570036931296": [
    0
    ],
    "handler_8_1570037277167": [
    0
    ],
    "node_4_1570034719471": {
    "0": [
    0
    ]
    }
    },
    "branch_exited": true,
    "branch_exited_reason": "completed"
    }
    }
    }
   
bdVehiculos.save=(req,res)=>{
    datos.id="ojooo";
    datos.fecha=moment.now();
    mongo.create(datos);
    res.send("ok");
}

module.exports=bdVehiculos;

