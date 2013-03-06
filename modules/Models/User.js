var storage = require('../storage');

var userSchema = storage.getMongoose().Schema({
	uid: "string",
	username: "string",
	provider: "string",
	updated: { type: Date, default: Date.now }  
});

function User () {

	this.setData = function(data) {
		this.properties = data;
		this.userModel =  storage.getMongoose().model('User', userSchema);
	}

	this.save = function() {
		this.storeToMongo();
	}

	this.storeToMongo = function() {
		var thisUser = new this.userModel(this.properties);
		thisUser.save(function (err) {
			if(err){

			}
		});
	}

}

module.exports = new User();