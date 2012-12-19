var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs');

//io.set('log level', 1);
app.engine('hbs', hbs.express3({
	partialsDir: __dirname + '/views/partials',
	defaultLayout: "views/layout/default.hbs"
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

server.listen(83);

io.sockets.on('connection', function (socket) {

});

app.get('/', function (req, res) {
		res.render('index.hbs');
	});

app.get('/gallery', function (req, res) {
	res.render('gallery.hbs');
});

app.post('save', function (req, res) {

});

app.get('/photos', function (req, res) {
	res.render('gallery.hbs');
});