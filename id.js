const {app, BrowserWindow, Menu} = require('electron');

let mainWindow = null;
//const Menu = electron.Menu
//Menu.setApplicationMenu(null)

//electron-store引入
let Store1 = {name: "userData", fileExtension: "json", cwd: app.getPath("userData"), clearInvalidConfig: true};
let Store2 = {name: "scores", fileExtension: "json", cwd: app.getPath("userData"), clearInvalidConfig: true};
const Store = require('electron-store');
const store1 = new Store(Store1);
const store2 = new Store(Store2);
//获取store
function store(doing) {
    if (doing[2] === "userData") {
        return store1;
    } else if (doing[2] === "scores") {
        return store2;
    } else {return "";};
};
//store.set('2', {'hw':'hello world'});
//console.log(store.get('2'));

//HTTP Server - 用于与前端通信
var http = require("http");
http.createServer(function (req, res) {
    console.log("http server have a sesson")
    let doing = req.url.split("/");
    //协议：/(get或put)/(userData或scores)/(具体项名称)/写入项(仅限put) 长度为4或5
    if (doing.length === 4 && doing[1] === "get") { //获取数据
        res.writeHead(200);//200:get
        res.end(JSON.stringify(store(doing).get(doing[3])));
    } else {if (doing.length === 5 && doing[1] === "put") { //写入数据
        res.writeHead(201);//200:put
        store(doing).set(doing[3], doing[4]);
        res.end("Successful");
    } else {res.writeHead(404);res.end();console.log("404");return;};
}}).listen(796,'127.0.0.1');

app.on('ready', () => {
    Menu.setApplicationMenu(null);
    mainWindow = new BrowserWindow();
    //mainWindow.webContents.loadWeb('https://www.baidu.com');
    mainWindow.webContents.openDevTools();
    //console.log(app.getPath('userData'));
    //mainWindow.webContents.loadFile('LevelOver/index.html'); //结算页面
    mainWindow.webContents.loadFile('tapToStart/index.html'); //正常情况
});
