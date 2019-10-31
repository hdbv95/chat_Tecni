var express = require('express');
var morgan=require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var pruebaRutas=require('./public/js/Routes/routesWex');
var app = express();
const server = require('http').createServer(app);
var credencialesWex=require('./public/js/Conexion/credencialesWex');
var Request = require("request");
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(credencialesWex.telegram.key, {polling: true});



// trust first proxy 
app.set('trust proxy', 1) ;

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));
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
server.listen(7000, '0.0.0.0', function() {
  console.log("server starting on " + 7000);
});

bot.on('message', msg => {
	console.log(msg);
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://192.168.10.239:7000/vehiculo/enviarMensaje",
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
