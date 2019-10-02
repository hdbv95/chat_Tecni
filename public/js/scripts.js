function scrollDownChat(){
	var objDiv = document.getElementById("divPosts");
	objDiv.scrollTop = objDiv.scrollHeight;
}


function startChat(){
	var msg = encodeURI(document.getElementById('name').value);
	document.location = "chat?name=" + msg;
}
function consultarWatson(msg){
	
	var username = document.getElementById('hiddenUsername').value;
	var chatbot = document.getElementById('divPosts');
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		
		if (this.readyState == 4 && this.status == 200) {
			chatbot.innerHTML = chatbot.innerHTML + this.responseText;
			scrollDownChat();
			document.getElementById('watson_input').value = "";
			var snd = new Audio("https://file.sonidosgratis.net/ringtones/messenger_facebook01.mp3");  
    		snd.play();
		}
	};
	xhttp.open("GET", "/sendMessage?username=" + username + "&message=" + msg, true);
	
	xhttp.open("POST", "/cobranzas/enviarMensaje", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({'texto':msg}));
	}

function SendMessage()
{	
	var msg =encodeURI(document.getElementById('watson_input').value);
	consultarWatson(msg);
	
}
function mensaje(tipo){


	consultarWatson(tipo);
  }


function RestartChat(userName){
	document.location = "/";
}

function InitializeConversation()
{
	var chatbot = document.getElementById('divPosts');
	var username = document.getElementById('hiddenUsername');
	var xhttp = new XMLHttpRequest();
	var url = document.location.toString();
	username.value = url.substr(url.indexOf("?")+6);
	console.log(xhttp);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			chatbot.innerHTML = chatbot.innerHTML + this.responseText;
			scrollDownChat();
			var snd = new Audio("https://file.sonidosgratis.net/ringtones/messenger_facebook01.mp3");  
    		snd.play();
		}
	};
	

	xhttp.open("POST", "/cobranzas/iniciarMensaje", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify({'usuario':username.value}));
}