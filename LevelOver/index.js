import { gameLevels } from "../constants.js";
//import database from "../dataBase/db.js";
//document.cookie="test=?????????????; expires=Jan, 1 Dec 2109 06:00:00 GMT; path=/";
//document.cookie="username=John Doe";

window.addEventListener('DOMContentLoaded',()=>{
	document.querySelector('div#avatarBar').addEventListener('click',(e)=>{
		var _element=e.target;
		if (_element.classList.toString().match('avatarBar')==null) {
			_element=e.target.parentElement;
		}
		if (_element.classList.toString().match('expand')) {
			_element.classList.remove('expand');
		} else {
			_element.classList.add('expand');
		}
	});
	if (window.localStorage.getItem('playerName')!=null) {
		console.log('Setting player name: ', window.localStorage.getItem('playerName'));
		document.querySelector('div#avatarBar').setAttribute('data-name',window.localStorage.getItem('playerName'));
	}
	// document.body.children[0].style.transform="scale("+window.innerHeight/480/window.devicePixelRatio+")";
	// console.log('Resize:',document.body.children[0].style.transform);
	const urlParams=new URL(location.href).search;
	const parsedURLParams=new URLSearchParams(urlParams)
	//	获取各种数据
	const play=parsedURLParams.get('play');
	const ap=parsedURLParams.get('ap')
	if (ap === "y"){
		document.querySelector('div#avatarBar').setAttribute('data-name', "Auto");
		document.querySelector('div#avatarBar').setAttribute('data-rks', "16.03");
	};
	const playLevel=gameLevels[parsedURLParams.get('l')];
	const playLevelString=parsedURLParams.get('l');
	const score=parseInt(parsedURLParams.get('score'));
	// const score=
	const maxCombo=parsedURLParams.get('mc');
	const perFect=parsedURLParams.get('p');
	const good=parsedURLParams.get('g');
	const bad=parsedURLParams.get('b');
	const miss=parsedURLParams.get('m');
	const early=parsedURLParams.get('e');
	const accuracy=Math.round((parseInt(perFect)+parseInt(good)*0.65)/(parseInt(perFect)+parseInt(good)+parseInt(bad)+parseInt(miss)+0)*10000)/100;
	const late=good-early;
	var grade;
	document.getElementById('retryBtn').addEventListener('click',()=>{
		location.href='../whilePlaying/index.html?play='+play+'&l='+playLevelString+'&c='+parsedURLParams.get('c');
	});
	document.getElementById('backBtn').addEventListener('click',()=>{
		location.href='../songSelect/index.html?c='+parsedURLParams.get('c');
	})
	//	判断等级（范围来自萌娘百科）
	if (score==0) {
		console.log('No grade');
		grade='';
	}
	if (score<699999&&score!=0) {
		console.log('Grade: False');
		grade='F15F';
	}
	if (700000<=score&&score<=819999) {
			console.log('Grade:C');
			grade='C15C';
	}
	if (820000<=score&&score<=879999) {
			console.log('Grade:B');
			grade='B15B';
	}
	if (880000<=score&&score<=919999) {
			console.log('Grade:A');
			grade='A15A';
	}
	if (920000<=score&&score<=959999) {
			console.log('Grade:S');
			grade='S15S';
	}
	if (960000<=score&&score<=999999) {
			console.log('Grade:V');
			grade='V15V';
			if (good==0&&bad==0&&miss==0) {
				console.log("Grade: V wih Full Combo")
				grade='V15FC'
			}
	}
	if (1000000<=score) {
			console.log('Grade:Phi');
			grade='phi15phi';
	}
	// switch (score) {
	// 	default:
	// 		console.log('Error, Fallback to False');
	// 		grade='F15F';
	// 		break;
	// }
	// gradeImage
	//	获取歌曲信息
	var songInfoXHR=new XMLHttpRequest();
	songInfoXHR.open('GET',"../charts/"+play+"/meta.json",false);
	songInfoXHR.send();
	window.playResult={
		"score":score,
		"grade": grade,
		"play":play,
		"playLevel":playLevel,
		"songInfo":JSON.parse(songInfoXHR.responseText),
		"maxCombo":maxCombo,
		"accuracy":accuracy,
		"perFect":perFect,
		"good":good,
		"bad":bad,
		"miss":miss,
		"early":early,
		"late":late,
		"playLevelString": playLevelString
	}
	console.log(playResult);
	//	操作DOM修改可见部分数据
	document.querySelector("#levelOverAudio").setAttribute('src',"../assets/audio/LevelOver"+playLevel+".wav");
	document.querySelector("#levelOverAudio").play();
	document.body.setAttribute('style',`background:url(../charts/${playResult.play}/${playResult.songInfo.illustration}) center center no-repeat;`);
	document.querySelector("#songImg").setAttribute("src","../charts/"+play+"/"+playResult.songInfo.illustration.replaceAll('#',"%23"));
	document.querySelector("#score").innerText=score.toString().padStart(7,'0');;
	document.querySelector('#gradeImage').src='../assets/images/'+grade+'.png';
	document.querySelector("#maxCombo").innerText=maxCombo;
	document.querySelector("#accuracy").innerText=accuracy+"%";
	document.querySelector("#perfect").innerText=perFect;
	document.querySelector("#good").innerText=good;
	document.querySelector("#bad").innerText=bad;
	document.querySelector("#miss").innerText=miss;
	document.querySelector("#early").innerText=early;
	document.querySelector("#late").innerText=late;
	document.querySelector('div.songName#songName').innerText=playResult.songInfo.name;
	document.querySelector('div.levelString#levelString').innerText=playResult.playLevelString.toUpperCase()+' Lv.'+Math.floor(playResult.songInfo[playResult.playLevelString.toLowerCase()+'Ranking']);
	// 加载歌曲元信息（计算RKS等）
	var deltaRKS,deltaData;
	if(playResult.accuracy>=70){
		deltaRKS= (Math.pow(((playResult.accuracy-55)/45),2)*playResult.songInfo[playResult.playLevelString.toLowerCase()+'Ranking']).toFixed(2);
	}else{
		deltaRKS=0
	}
	if (playResult.score<880000) {
		deltaData=0
	}
	document.querySelector("#rks").innerText=deltaRKS;
	document.querySelector("#data").innerText=deltaData;
	console.log('ΔRKS:',deltaRKS);
	console.log('ΔData(KB):',deltaData);
	function scoreChange (data) {
		const req = new XMLHttpRequest();
		req.addEventListener ("load", function () {
			return;
			if (this.responseText === "") {
				document.querySelector('div.score').setAttribute('data-acc', "00.00%");
				document.querySelector("div.score.score").querySelectorAll(`[data="score"]`)[0].textContent = "0000000";
				return;
			};
			const data = JSON.parse(this.responseText);
			document.querySelector('div.score').setAttribute('data-acc', data["acc"]);
			const aaaaaa = document.querySelector(".score").querySelectorAll(`[data="score"]`);
			aaaaaa[0].textContent = data["score"];
		});
		req.open("GET", `http://127.0.0.1:796/put/${play}-${playResult.playLevelString}/${score}/${accuracy}/0`, true);
		req.send();
	};
	if (ap !== "y") scoreChange();
	console.log("123");
	/*
	//加载旧数据
	function loadData () {
		const req_data = new XMLHttpRequest();
		const req_rks = new XMLHttpRequest();
		let returns = {data: "", rks: ""};
		req_data.addEventListener ("load", function () {
			const data = JSON.parse(req_data.responseText)["data"];
			returns.data = data;
		});
		req_rks.addEventListener ("load", function () {
			const rks = JSON.parse(req_rks.responseText)["data"];
			returns.rks = rks;
			return returns.rks;
		});
		req_data.open("GET", `http://127.0.0.1:796/get/userData/data`, true);
		req_rks.open("GET", `http://127.0.0.1:796/get/userData/mostGoodRKS`, true);
		req_data.send();req_rks.send();
		console.log(req_rks.responseText)
		console.log(returns.rks);
		return returns.rks;
	};
	//rks计算（？？？为啥不能用
	/*
	//let dataAndRKS = loadData();
	//console.log(dataAndRKS);
	//let b19rks = dataAndRKS["rks"][18];
	let b19rks = loadData();
	console.log(b19rks);
	//nowData = deltaData + dataAndRKS.data; //更新data，现无用
	if (b19rks < deltaRKS) {
		b19rks.pop();
		let fucking = {
			Value: 1,
			Tmp: []
		};
		for (let i = 0;i < 18;i++) {
			if (b19rks["" + i] <= deltaRKS && fucking.Value === 0) {
				fucking.Value -= 1;
				fucking.Tmp.push(b19rks[i]);
				for (let j = 18 - i;j > 0;i--) {
					b19rks.pop()
				};
				b19rks.push(deltaRKS);
				i = 18;
			};
		};
		for (let i = 0;i < fucking.Tmp.length;i++) {
			b19rks.push(fucking.Tmp[i]);
		};
	}
	console.log(b19rks);
	*/
	//上传成绩
	/*//旧版
	function scoreChange(data){
		// 初始化XMLHttpRequest对象
		createXMLHttpRequest();
		// 设置请求响应的URL
		var uri = `http://127.0.0.1/put/score/${playResult.play}`
		// 设置处理响应的回调函数
		xmlrequest.onreadystatechange = processResponse;
		// 设置以POST方式发送请求，并打开连接
		xmlrequest.open("POST", uri, true); 
		// 设置POST请求的请求头
		xmlrequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		// 发送请求
		xmlrequest.send(JSON.stringify(data));
		console.log("good...");
	};
	*/
	/*
	//加载成绩
	function loadSongScore () {
		const req = new XMLHttpRequest();
		let datas = {
			score: score,
			rank: grade,
			acc: accuracy + "%",
			racc: +accuracy
		};
		req.addEventListener ("load", function () {
			if (this.responseText === "") {
				scoreChange(datas);
				return;
			};
			const data = JSON.parse(this.responseText);
			if (data["score"] < score && data["racc"] >= accuracy) {
				datas.score = data["score"];
			} else if (data["score"] >= score && data["racc"] < accuracy) {
				datas.acc = data["acc"];
				datas.racc = data["racc"];
			} else if (data["score"] >= score && data["racc"] >= accuracy) return;
			scoreChange(datas);

		});
		req.open("GET", `http://127.0.0.1:796/get/scores/${playResult.play}-${playResult.playLevelString}`, true);
		//console.log(`http://127.0.0.1:796/get/scores/${playResult.play}-${playResult.playLevelString}`);
		req.send();
	};
	loadSongScore();
	*/
});
// window.onresize=function(){
// 	//	自动缩放
// 	document.body.children[0].style.transform="scale("+window.outerHeight/480+")";
// 	console.log('Resize:',document.body.children[0].style.transform);
// }