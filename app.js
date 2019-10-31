var express = require('express');
var cfenv = require('cfenv');
var morgan=require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var pruebaRutas=require('./public/js/Routes/routesWex');
var app = express();
var cors = require('cors') 
const server = require('http').createServer(app);
var mongoose=require('mongoose');
var credencialesWex=require('./public/js/Conexion/credencialesWex');
var appEnv = cfenv.getAppEnv();
var Request = require("request");
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(credencialesWex.telegram.key, {polling: true});

mongoose.connect(credencialesWex.mongo.url,{dbName: credencialesWex.mongo.bd ,useNewUrlParser: true}
    ).then(()=>{console.log('successfully connected to MongoDB');/*mongod.cfg cambiar bindIp: de 127.0.0.1 a 0.0.0.0 */}).catch(err=>{
      console.log("error BD");
      //process.exit();
    });


// trust first proxy 
app.set('trust proxy', 1) ;
app.use(cors({origin:[
    "http://192.168.10.221:4200"
  ],credentials:true})) 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/*
app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

 next();
});
*/


//ver peticiones
app.use(morgan('dev'));


app.use("/vehiculo",pruebaRutas);

// start server on the specified port and binding host
server.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});

bot.on('message', msg => {
	//console.log(msg);
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "https://chatecniseguros.herokuapp.com/vehiculo/enviarMensaje",
        "body": JSON.stringify({
            "texto": msg.text,
            "id": msg.chat.id
        })
    }, async(error, response, body) => {
        if(error) {
            console.log("error");
            return console.dir(error);
        }
		console.log(JSON.parse(body));
		var output=await JSON.parse(body).resWatson.output;
		//var arreglo=[]
		/* 
		console.log(arreglo.length);*/
		//console.log(await JSON.parse(body).resWatson); 
        for(var i in output.generic){
            if(output.generic[i].response_type=="text"){
                await bot.sendMessage(msg.chat.id,output.generic[i].text);  
            }else if(output.generic[i].response_type=="option"){
                let replyOptions = {
                    reply_markup: {
                        resize_keyboard: true,
                        one_time_keyboard: true,
                        keyboard: [],
                    },
                };
                
                for(var j in output.generic[i].options){
                    replyOptions.reply_markup.keyboard.push([output.generic[i].options[j].label]);
                }
                await bot.sendMessage(msg.chat.id,output.generic[i].title,replyOptions); 
                
            }
        }
    });
  });
