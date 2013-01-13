var storage = require('../storage');

var userSchema = storage.getMongoose().Schema({
	uid: "string",
	username: "string",
	provider: "string",
	updated: { type: Date, default: Date.now }  
});

function User () {

	this.setData = function(data) {
		for(var prop in data) {
			this[prop] = data[prop];
		}
		this.userModel =  storage.getMongoose().model('User', userSchema);
	}

	this.save = function() {
		var self = this;
		this.doesNotExist(this.storeToMongo);
	}

	this.doesNotExist = function(callback) {
		this.userModel.findOne({'uid': this.uid}, function(err, user) {
			if(!user) {
				callback();
			}	
		});	
	}

	this.update = function(params) {

	}

	this.storeToMongo = function() {

		var thisUser = new this.userModel({
			uid: this.uid,
			username: this.username,
			provider: this.provider
		});

		thisUser.save(function (err) {
			if(err){
				//console.log("error");
			}
		});

	}

}

module.exports = new User();