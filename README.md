DrawingBoard
============
Simple real time drawing with others + chat using socket.io and node.js

Steps
1. Install node.js and download all 3 repos (chat, drawing, main) Do NPM install on all three directories.

2. Navigate to each directory (chat server, drawing server, and mainserver) after downloading the code from all three repos.

3. run node server.js

4. run node chatserver.js

5. run mainserver.js

5. go to http://localhost:80 in 2 browsers if on localhost

6. Draw and watch it appear simulatenously in both browsers




demo can be seen at 
http://www.rtimaldraw.jit.su

Many people can be on the site to draw and chat simulateously.

?room=room query string creates a new room

Please be sure to add your own redis, s2, and mongoose info in Models/config.js while running this code.

modules/config.js format should be like this, repr ownlacing keys with your own info

var config = {
	mongouri: "",
	s3key: "",
	s3secret: "",
	s3bucket: "",
}

config.s3BucketURL = "https://s3.amazonaws.com/" + config.s3bucket + "/";

module.exports = config;