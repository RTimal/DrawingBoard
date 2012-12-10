var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	hbs = require('express-hbs'),
	users = {};

//io.set('log level', 1);
app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

server.listen(81);

io.sockets.on('connection', function (socket) {

	socket.on('getusers', function (data) {
		socket.emit('userlist', JSON.stringify(users));
	});

	socket.on('join', function (user) {
		u = JSON.parse(user);
		socket.join(u.room);
		users[u.uid] = u;
		io.sockets.in(u.room).emit('adduser', user);
	});

	socket.on('leave', function (uid) {
		io.sockets.in(users[uid].room).emit('removeuser', uid);
		socket.leave(users[uid].room);
		users[uid] = null;
	 });

	socket.on('mousedown', function (drawevent) {
		this.broadcast.to(drawevent.room).emit('mousedown' , drawevent);
	});

	socket.on('mouseup', function (drawevent) {
		this.broadcast.to(drawevent.room).emit('mouseup' , drawevent);
	});

	socket.on('mousemove', function (drawevent) {
		this.broadcast.to(drawevent.room).emit('mousemove' , drawevent);
	});

	socket.on('changebrushcolor', function (colorinfo) {
		users[colorinfo.uid].brushData.brushColor = colorinfo.c;
		this.broadcast.to(users[colorinfo.uid].room).emit('changebrushcolor', colorinfo);
	})
});

app.get('/', function (req, res) {
		res.render('index.hbs');
	});