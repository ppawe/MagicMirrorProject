/* Magic Mirror
 * Module: MMM-UserInfo
 */
var NodeHelper = require("node_helper");
var {PythonShell} = require('python-shell');
var request = require("request");
var fs = require("fs");
var timer;
var currentUser = "0";
var currentUserName = "";
var loggedin = false;
var pythonStarted = false;

var base_url = "";

module.exports = NodeHelper.create({
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === "GET_INFOS") {
			base_url = payload.config.baseurl;
			if (!pythonStarted) {
				pythonStarted = true;
				this.python_start(payload);
			}
			/* setInterval(function () { self.fileExists(payload) }, 500); */
		}
	},

	updateInfos: function (nfcToken) {
		var self = this;
		
	
		var url = base_url +
			`nfc=${nfcToken}`;

		console.log(url);
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				json = JSON.parse(body);
				self.sendSocketNotification("CURRENT_PROFILE", json[0].replace(/\s+/g, '')	);
				self.sendSocketNotification("NEW_INFO", json);
			} else {
				self.sendSocketNotification("ERROR", error);
			}
		});
	},
	
	python_start: function(payload) {
		var self = this;
		console.log("Starting shell...");
		var pyshell = new PythonShell("nfcReader.py"/*, { mode: 'json', args: [JSON.stringify(this.config)]}*/);
		console.log("Shell started...");
		
		pyshell.on('message', function(message) {
			console.log("Logging in with token " + message);
			console.log("Login: " + message);
			currentUser = message;
			self.updateInfos(currentUser);
		})

		pyshell.end(function (err) {
      			if (err) throw err;
      			console.log("[" + self.name + "] " + 'finished running...');
    		});
	}
});
