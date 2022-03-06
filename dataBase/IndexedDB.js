import idb from "idb";

const database = idb.open('userData', 1, upgradeDB => {
	upgradeDB.createObjectStore('items', {
		keyPath: 'id',
		autoIncreament: true
	});
});