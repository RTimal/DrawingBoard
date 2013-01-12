var storage = require('../storage');
var userSchema = storage.getMongoose().Schema({
	uid: "string",
	name: "string",
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
		this.userModel.findOne({'fb_id': this.fb_id}, function(err, user) {
			if(!user) {
				callback();
			}	
		});	
	}

	this.update = function(params) {

	}

	this.storeToMongo = function() {

		var thisUser = new User({
			fb_id: this.fb_id,
			first_name: this.first_name,
			last_name: this.last_name
		});

		thisUser.save(function (err) {
			if(err){
				console.log("error");
			}
		});

	}

}

module.exports = new User();