var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs'),
	users = {};

io.set('log level', 1);
app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));
app.set('view engine', 'hbs');
app.set('view', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


server.listen(82)

io.sockets.on('connection', function (socket){
	socket.on('join', function (userInfo) {
		u = json.parse(userInfo);
		socket.join(u.room);
		users[userInfo.id] = u;
	});

	socket.on('chatmesage', function (message){
		this.broadcast.to(users[message.userID].room).emit(message.data);
	});

	socket.on('leave', function (data){
		users[data.userID] = null;
	});
});

app.get('/rooms', function (req, res){
	res.render('index.hbs');
});
