/* Magic Mirror
 * Module: nfcReader
 */
Module.register("nfcReader", {
	defaults: {
		token: undefined;
	},
	requiresVersion: "2.8.0",
	
	getSyles: function() {
		return [];
	},

	getScripts: function() {
		return [];
	},

	start: function() {
		var self = this;
		Log.log("Starting module: " + self.name);
		
		self.sendSocketNotification("GET_TOKEN", { "config": self.config });
	}
});
