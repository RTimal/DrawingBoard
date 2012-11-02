var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs');

app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

server.listen(81);

io.sockets.on('connection', function (socket) {

	socket.on('join', function (data) { socket.join(data.room)
		//add user to other users list
	 });
	socket.on('leave', function (data) { socket.leave(data.room)
		//remove user from other users list
	 });
	socket.on('drawevent', function (data) { 
		console.log(data);
	});

});

app.get('/', function (req, res) {
	res.render('index.hbs');
});
