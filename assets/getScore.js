function loadSongScore () {
	const req = new XMLHttpRequest();
	req.addEventListener ("load", function () {
		if (!data) return;
		const data = JSON.parse(this.responseText);
		document.querySelector('div#score unplayed').setAttribute('data-acc', data["acc"]);
		Object.keys(data).forEach(p => {
			const aaaaaa = document.querySelector(".score unplayed").querySelectorAll(`[data="${p}"]`);
			for (let r of aaaaaa) {
				r.textContent = data[p];
			}
		})
	});
	req.open("GET", `http://127.0.0.1:796/get/scores/${document.querySelector('div.songItem.selected').getAttribute('data-codename')}.${window.levelSelected}`, true);
	req.send();
};
//rank:0:new;1:f,2:c;3:b;4:a;5:s;6:v;7:v+fc;8:ap