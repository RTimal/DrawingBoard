var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs'),
	user = require('modules/user'),
	users = {};

app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

server.listen(81);

io.sockets.on('connection', function (socket) {

	socket.on('getusers', function (data) {
		socket.emit('userlist', users);
	});

	socket.on('join', function (user) {
		socket.join(user.room);
		users[user.uid] = user;
		io.sockets.in(data.room).emit('adduser', user);
	});

	socket.on('leave', function (user) { 
		socket.leave(user.room)
		io.sockets.in(user.room).emit('removeuser', user.uid);
		//remove user from other users list
	 });

	socket.on('drawevent', function (data) { 
		console.log(data);
	});
});

app.get('/', function (req, res) {
	res.render('index.hbs');
});
