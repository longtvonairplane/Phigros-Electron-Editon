import { SongList } from "./SongList.js";
import { gameLevels } from "../constants.js";

//加载成绩
function loadSongScore () {
	const req = new XMLHttpRequest();
	req.addEventListener ("load", function () {
		//console.log(data);
		//document.querySelector('div.score').setAttribute('data-acc', "00.00%");
		//document.querySelector("div.score.score").querySelectorAll(`[data="score"]`)[0].textContent = data["score"];
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
	req.open("GET", `http://127.0.0.1:796/get/scores/${document.querySelector('div.songItem.selected').getAttribute('data-codename')}-${window.levelSelected}`, true);
	req.send();
};

//	全局初始化鼠标滚轮/移动端滑动坐标
var yCoord = 0,
	previousTouchYCoord = 0;

const songList = SongList();

window.addEventListener("DOMContentLoaded", () => {
	document.querySelector("div.settingBtn").addEventListener("click", () => {
		location.href = "../settings/index.html";
	});
	document.querySelector('#avatarBar').addEventListener("click",(e)=>{
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
	//	获取歌曲列表并生成元素
	window.chapterName = new URLSearchParams(new URL(location.href).search).get(
		"c"
	);
	var songListXHR = new XMLHttpRequest();
	songListXHR.open("GET", "../charts/" + chapterName + ".json", false);
	songListXHR.send();
	window.songCodeNameList = JSON.parse(songListXHR.responseText);
	window.songMetaList = new Array();

	for (let i = 0; i < window.songCodeNameList.length; i++) {
		window.songMetaList.push(getSongMeta(window.songCodeNameList[i]));
	}

	const songListElement = songList.element;
	document.getElementsByClassName("leftArea")[0].appendChild(songListElement);

	for (let i = 0; i < window.songMetaList.length; i++) {
		songList.createSong(i, songMetaList[i], songCodeNameList[i]);
	}

	//	设置默认难度
	window.levelSelected = "in";
	songList.switchLevel(levelSelected);
	//	强行切换成第一首歌
	songList.switchSong(0);
	loadSongScore();

	//	调整宽度/缩放
	document.querySelector("#rightArea").style.right =
		0.2 *
		(document.body.clientHeight / document.body.clientWidth) *
		document.body.clientWidth;
	document
		.querySelector("#rightArea")
		.setAttribute(
			"style",
			"transform:skew(-15deg) scale(" +
				window.innerHeight / 400 / Math.round(window.devicePixelRatio / 2) +
				") !important;" +
				"right:" +
				0.2 *
					(document.body.clientHeight / document.body.clientWidth) *
					document.body.clientWidth +
				"px"
		);
	console.log("Resize:", document.querySelector("#rightArea").style.transform);
	console.log("Right:", document.querySelector("#rightArea").style.right);

	//	添加桌面端鼠标滚轮滚动
	document.body.addEventListener("wheel", (e) => {
		console.log("Scrolling", e.wheelDeltaY, yCoord);
		let newYCoord = yCoord + e.wheelDeltaY / 8;
		// 到顶不可再向上滚动
		if (newYCoord <= 0 || e.wheelDeltaY < 0) {
			document
				.querySelector("#songList")
				.setAttribute("style", "position: absolute;top:" + newYCoord + "px");
			yCoord = newYCoord;
		}
	});

	//	添加移动端触屏滑动
	document.body.addEventListener("touchstart", (e) => {
		//	console.log(1);
		var touchYCoord = e.changedTouches["0"].clientY;
		previousTouchYCoord = touchYCoord;
		//	console.log('prev',previousTouchYCoord);
	});
	document.body.addEventListener("touchmove", (e) => {
		//	console.log(2)
		var touchYCoord = e.changedTouches["0"].clientY;
		window.touchYCoord = e.changedTouches["0"].clientY;
		//	console.log((previousTouchYCoord- touchYCoord)*10);
		//	console.log(yCoord)
		let newYCoord =
			-0.1 * (previousTouchYCoord - touchYCoord) + parseFloat(yCoord);
		//	console.log((previousTouchYCoord- touchYCoord)*10+parseFloat(yCoord))
		//	console.log(previousTouchYCoord- touchYCoord);
		if (newYCoord <= 0 || e.wheelDeltaY < 0) {
			document
				.querySelector("#songList")
				.setAttribute("style", "position: absolute;top:" + newYCoord + "px");
			yCoord = newYCoord;
		}
	});
	document.body.addEventListener("touchend", (e) => {
		//	console.log(3)
		//	var touchYCoord=e.changedTouches["0"].clientY;
		//	console.log(previousTouchYCoord - touchYCoord);
		//	previousTouchYCoord=undefined;
	});
});
window.onresize = function () {
	document
		.querySelector("#rightArea")
		.setAttribute(
			"style",
			"transform:skew(-15deg) scale(" +
				window.innerHeight / 400 / Math.round(window.devicePixelRatio / 2) +
				") !important;" +
				"right:" +
				0.2 *
					(document.body.clientHeight / document.body.clientWidth) *
					document.body.clientWidth +
				"px"
		);
	console.log(
		"Resize:",
		document.querySelector("div.rightArea").style.transform
	);
	console.log("Right:", document.querySelector("div.rightArea").style.right);
};

function getSongMeta(songCodeName) {
	var getSongMetaXHR = new XMLHttpRequest();
	getSongMetaXHR.open("GET", "../charts/" + songCodeName + "/meta.json", false);
	getSongMetaXHR.send();
	return JSON.parse(getSongMetaXHR.responseText);
}

function changeLevel(event) {
	const e = event;
	//	0S：原选中添加淡出
	try {
		document
			.querySelector('div.levelItem.selected')
			.classList.add('fadeOut');
	} catch (e) {
		null;
	}
	setTimeout(() => {
		//	300ms后动画结束后移除选中样式，给后来选中的添加选中和淡入选择器
		try {
			document
				.querySelector('div.levelItem.selected')
				.classList.remove('selected');
		} catch (e) {
			null;
		}
		e.target.classList.add('fadeIn');
		e.target.classList.add('selected');
	}, 300);
	const levelStr = e.target.classList.toString();

	//	切换所有难度
	songList.switchLevel(levelStr.match(/ez|hd|in|at/));

	loadSongScore();

	//	最后把所有的fade选择器都删掉
	const fadeInElems = document.querySelectorAll('div.levelItem.fadeIn');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeInElems[i].classList.remove('fadeIn');
	}
	const fadeOutElems = document.querySelectorAll('div.levelItem.fadeOut');
	for (let i = 0; i < fadeInElems.length; i++) {
		fadeOutElems[i].classList.remove('fadeOut');
	}
}

document
	.querySelectorAll("div.levelItem")
	.forEach((element) => element.addEventListener("click", changeLevel));

	document.querySelector('div.playBtn').addEventListener('click', () => {
		clearInterval(window.sliceAudioInterval);
		try {
			window.sliceAudioContextSource.stop();
		} catch (error) {
			null;
		}
		document.querySelector('#readyToLoadOverlay').classList.add('go');
		const playClickedSound = new XMLHttpRequest();
		playClickedSound.open('GET', '../assets/audio/Start.mp3', true);
		playClickedSound.responseType = 'arraybuffer';
		playClickedSound.onload = function () {
			const actx = new (window.AudioContext ||
				window.webkitAudioContext ||
				window.mozAudioContext ||
				window.msAudioContext)();
			actx.decodeAudioData(this.response, function (buffer) {
				let source = actx.createBufferSource();
				source.buffer = buffer;
				source.connect(actx.destination);
				source.start(0);
			});
		};
		playClickedSound.send();
		setTimeout(() => {
			location.href =
				'../whilePlaying/index.html?play=' +
				document
					.querySelector('div.songItem.selected')
					.getAttribute('data-codename') +
				'&l=' +
				window.levelSelected +
				"&c=" +
				chapterName;
			}, 2000);
		});
