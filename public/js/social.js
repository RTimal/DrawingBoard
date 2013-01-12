var DrawingBoard = DrawingBoard || {}
DrawingBoard.Events.Social = DrawingBoard.Events.Social || {}

DrawingBoard.Events.Social.initFb = function() {
	console.log("here");
	var self = this;

	FB.getLoginStatus(function(response) {
		if(response.status === "connected") {
			this.uid = response.authResponse.uid;
			this.accessToken = response.authResponse.accessToken;
			self.saveUser();
		} else if (response.status == "not_authorized") {
			self.fBLogin();
		} else {
			self.fBLogin();
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
		self.storeUser(response.name, response.uid);
	});
}

DrawingBoard.Events.Social.storeUser = function (name, uid) {
	$.post('/user', {username: name, uid: uid, provider: "fb"}, function(data) {
		$('#username #value').text(name);
	});
}