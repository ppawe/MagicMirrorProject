/* Magic Mirror
 * Module: vvsTripsWnS
 */
var NodeHelper = require("node_helper");
var request = require("request");

const BASE_URL = "https://www3.vvs.de/mngvvs/XSLT_TRIP_REQUEST2?";

module.exports = NodeHelper.create({
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === "GET_TRIPS") {
			self.updateTrips(payload.config.originPlace, payload.config.originName, payload.config.destinationPlace, payload.config.destinationName);

			setInterval(function () { self.updateTrips(payload.config.originPlace, payload.config.originName, payload.config.destinationPlace, payload.config.destinationName); }, payload.config.reloadInterval);
		}
	},

	updateTrips: function (originPlace, originName, destinationPlace, destinationName) {
		var self = this;
		/*var dateYear = "" + Date.prototype.getDate() + "." + (Date.prototype.getMonth() + 1) + "." + Date.prototype.getFullYear();
		var dateTime = "" + Date.prototype.getHours() + ":" + Date.prototype.getMinutes();*/
		var url = BASE_URL +
			//`limit=10&` +
			//`language=de&` +	
			//`sessionID=0&` +
			`place_destination=${destinationPlace}&` +
			`name_destination=${destinationName}&` +
			`type_destination=stop&` +
			`place_origin=${originPlace}&` +
			`name_origin=${originName}&` +
			`type_origin=stop&` +
			`outputFormat=rapidJSON&` +
			`searchLimitMinutes=1440&` +
			`useRealtime=1&`;/* +
			`itdTime=` + dateTime;*/
	
	//console.log(url);
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("NEW_TRIP", JSON.parse(body));
				//console.log(url);
			} else {
				self.sendSocketNotification("ERROR", error);
				console.log(error);
			}
		});
	}
});
			