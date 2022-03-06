//大部分来自
import 'sqlite3';
import knex from "knex";

//连接SQLite
const database = knex({
	client: 'sqlite3',
	connection: {
		filename: './db.sqlite'  //这是哪儿？
	},
	useNullAsDefualt: true
});

database.schema.hasTable('userInfo').then(exists => {
	if (!exists) {
		return database.schema.createTable('userInfo', t => {
			t.increments('id').primary();
			t.string('userName', 100);
			t.string('rankingScore',100);
			t.json('rankingScores');
		});
	}
});

database.schema.hasTable('scores').then(exists => {
	if (!exists) {
		return database.schema.createTable('userInfo', t => {
			t.increments('id').primary();
			t.string('songName', 100);
			t.string('level',100);
			t.string('score', 100);
			t.string('acc', 100);
			t.string('rank', 100);
		});
	}
});

export default database; //导出已配置数据库
console.log('?');