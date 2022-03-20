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

// 获取at曲目列表
var isAT = new XMLHttpRequest();
isAT.open("GET", "../charts/" + "sth" + ".json", false);
isAT.send();
var ats = JSON.parse(isAT.responseText);

function SongList(defaultLevel = "ez") {
	const listElement = document.createElement("div");
	listElement.id = "songList";
	listElement.classList.add("songList");

	const items = [];
	let selected,
		level = defaultLevel;

	return { element: listElement, items, createSong, switchSong, switchLevel };

	function createSong(id, songMeta, codename) {
		const container = new SongContainer(items.length, songMeta, codename, {
			onClick: switchSong,
			level,
		});
		listElement.appendChild(container.element);
		items[id] = container;
	}

	function switchSong(id) {
		if (id === selected) return;
		console.log(selected, id);
		var changeSongAudioElem = document.createElement("audio");
		changeSongAudioElem.src = "../assets/audio/Tap5.wav";
		changeSongAudioElem.play();

		if (selected !== undefined) items[selected].unSelect();

		if (!listElement.classList["selected"])
			listElement.classList.add("selected");

		items[id].select();

		console.log("Song", id, "Selected");
		const { songMeta, codename } = items[id];

		fetch(`../charts/${codename}/${songMeta['illustration']}`).then((response) => response.blob()).then((blob) => {
			console.log(blob);
			const imgUrl = URL.createObjectURL(blob);
			document.children[0].setAttribute(
				"style",
				`background: url(${imgUrl}); center center no-repeat fixed;
				background-size: cover;
			`
			);
			document.querySelector("img.illustration").src = imgUrl;
		})
		document.querySelector("audio#slicedAudioElement").src =
			"../charts/" + codename + "/" + songMeta["musicFile"];
		clearInterval(window.sliceAudioInterval);
		document.querySelector("audio#slicedAudioElement").currentTime =
			songMeta["sliceAudioStart"];
		document.querySelector("audio#slicedAudioElement").play();
		window.sliceAudioInterval = setInterval(() => {
			document.querySelector("audio#slicedAudioElement").currentTime =
				songMeta["sliceAudioStart"];
			document.querySelector("audio#slicedAudioElement").play();
		}, 15000);

		loadSongScore()

		console.log(window.songCodeNameList[id]);
		if (ats[window.songCodeNameList[id]] === undefined) {
			document.getElementById("at").style.display = 'none';
		} else {
			document.getElementById("at").style.display = '';
		};

		selected = id;
	}

	function switchLevel(newLevel) {
		if (level === newLevel) return;
		window.levelSelected = newLevel; //woccccccccccccccccccccccccccccccccc
		items.forEach(({ switchLevel }) => switchLevel(newLevel));
		level = newLevel;
	}
}

function SongContainer(index, songMeta, codename, { level, onClick }) {
	const container = document.createElement("div");
	container.classList.add("songItemContainer");

	const songItem = SongItem(songMeta, codename),
		songLevel = SongLevel(songMeta, level);
	container.appendChild(songItem);
	container.appendChild(songLevel.element);

	container.addEventListener("click", () => onClick(index));

	const select = () => {
		songItem.classList.add("selected");
		container.classList.add("selected");
		for (const level in gameLevels) {
			document
				.querySelector(`div.levelItem.${level}`)
				.setAttribute("data-level", Math.floor(songMeta[`${level}Ranking`]));
		}
	};

	const unSelect = () => {
		songItem.classList.remove("selected");
		container.classList.remove("selected");
	};

	return {
		element: container,
		songMeta,
		codename,
		select,
		unSelect,
		switchLevel: songLevel.switchLevel,
	};
}

function SongItem(songMeta, codename) {
	//	创建歌曲信息元素
	const songItemElement = document.createElement("div");
	songItemElement.classList.add("songItem");
	songItemElement.setAttribute("data-artist", songMeta.artist);
	songItemElement.setAttribute("data-codename", codename);
	songItemElement.innerText = songMeta.name;

	return songItemElement;
}

function SongLevel(songMeta, defaultLevel = "ez") {
	//	创建难度元素
	const songItemLevelElement = document.createElement("div");
	songItemLevelElement.classList.add("level");
	switchLevel(defaultLevel);

	return { element: songItemLevelElement, switchLevel };

	function switchLevel(level) {
		songItemLevelElement.classList.add(level);
		songItemLevelElement.setAttribute(
			"data-level",
			Math.floor(songMeta[level + "Ranking"])
		);
	}
}
export { SongList };
