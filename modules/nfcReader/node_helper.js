/* Magic Mirror
 * Module: nfcReader
 */
var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		
		if (notification === "GET_TOKEN") {
			self.updateUser();

			setInterval(function() { self.updateUser() };
		}
	},

	updateUser:function () {
		var self = this;
		var nfcToken = require("nfcToken");
		
		if (nfcToken) {
			self.sendSocketNotification("CURRENT_PROFILE", nfcToken);
			nfcToken = undefined;
		}
	}
});