var storage = require('../storage');
var userSchema = storage.mongoose.Schema({
	id: "string",
	first_name: "string",
	last_name: "string"
});


function User () {
	this.setData = function(data) {
		this.fb_id = data.fb_id;
		this.first_name = data.first_name;
		this.last_name = data.last_name;
	}

	this.save = function(){
		this.store();
	}

	this.store = function() {
		this.storeToMongo();
	}

	this.storeToMongo = function() {
		var User = storage.mongoose.model('User', userSchema);
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