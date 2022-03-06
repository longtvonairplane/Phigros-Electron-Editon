function loadUserName () {
	const req = new XMLHttpRequest();
	req.addEventListener ("load", function () {
		const data = JSON.parse(this.responseText);
		document.querySelector('div#avatarBar').setAttribute('data-name', data["userName"]);
		document.querySelector('div#avatarBar').setAttribute('data-rks', data["rks"]);
	});
	req.open("GET", "http://127.0.0.1:796/get/userData/userInfo", true);
	req.send();
};
loadUserName();