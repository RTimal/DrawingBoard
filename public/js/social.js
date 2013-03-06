var DrawingBoard = DrawingBoard || {}
DrawingBoard.Events.Social = DrawingBoard.Events.Social || {}


DrawingBoard.Events.Social.initFb = function(userData, changeUserCallback) {
	this.changeUserCallback = changeUserCallback;
	console.log("here");
	var self = this;

	FB.getLoginStatus(function(response) {
		if(response.status === "connected") {
			this.uid = response.authResponse.uid;
			this.accessToken = response.authResponse.accessToken;
			self.saveUser();
		} else if (response.status == "not_authorized") {

		} else {
			
		}
	});
}

DrawingBoard.Events.Social.fBLogin = function () {
	var self = this;
	FB.login(function (response) {
		if(response.authResponse) {
			console.log("Logged into fb, fetching your information");
			self.saveUser();
		}
	});
}

DrawingBoard.Events.Social.saveUser = function() {
	var self = this;
	FB.api("/me", function(response) {
		self.storeUser(response.username, response.id);
	});
}

DrawingBoard.Events.Social.storeUser = function (username, uid) {
	var self = this;

	$.post('/user', {username: username, uid: uid, provider: "fb"}, function(data) {
		self.changeUserCallback({username: username, uid: uid, provider: "fb"});
		console.log("received callback");
		console.log("name:" + username);
		console.log("uid:" + uid);
		console.log("data:" + data);
	});
}