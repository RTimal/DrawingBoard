var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs'),
	fs = require('fs');

//io.set('log level', 1);
app.engine('hbs', hbs.express3({
	partialsDir: __dirname + '/views/partials',
	defaultLayout: "views/layout/default.hbs"
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

var port;
switch(process.env.NODE_ENV) {
	case "production":
		port = 80;
		break;
	default: 
		port = 80;
		break;
	}

server.listen(port);

io.sockets.on('connection', function (socket) {

});

app.get('/', function (req, res) {
		res.render('index.hbs');
	});

app.get('/gallery', function (req, res) {
	res.render('gallery.hbs');
});

app.post('/publish', function (req, res) {
	artwork = require('./modules/Models/Artwork');
	artwork.setData(req.body);
	var saved = artwork.save();
	res.send({ok: "ok"});
});

app.post('/user', function (req, res) {
	//user = require('./modules/Models/User');
	//user.setData(req.body);
	//user.save();
});

app.get('/photos', function (req, res) {
	//res.render('gallery.hbs');
});

app.post('/save',function (req, res) {
	var b64image = req.body.image.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(b64image, 'base64');
	res.attachment('image.png');
	res.send(buf);
});