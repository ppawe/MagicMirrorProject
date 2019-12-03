/* Magic Mirror
 * Module: MMM-UserInfo
 */
Module.register("MMM-UserInfo", {
	defaults: {
		nfc: undefined,
		updateInterval: 0.5 * 60 * 1000,
		baseurl: "https://192.168.51.128/dev2/request.php?"
	},
	requiresVersion: "2.8.0",
	
	getStyles: function() {
		return ["MMM-UserInfo.css"];
	},

	getScripts: function() {
		return [];
	},

	start: function() {
		var self = this;
		Log.log("Starting module: " + self.name);

		self.infos = [];
		self.sendSocketNotification("GET_INFOS", { "config": self.config });
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		if (notification === "NEW_INFO") {
			self.infos = payload;
			Log.info(payload);
			self.updateDom();
		}
		else if (notification === "ERROR") {
			Log.warn(payload);
		}
		else if (notification === "CURRENT_PROFILE") {
			self.sendNotification("CURRENT_PROFILE", payload);
		}

	},

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");
	
		var headerWrappper = document.createElement("header");
		headerWrappper.innerHTML = "Infos";
		wrapper.appendChild(headerWrappper);

		Log.info(self.infos.length);

		if (self.infos.length > 1) {	
			var messageWrapper = document.createElement("div");
			messageWrapper.className = "messages";
	
			for (var i in self.infos) {
				if (self.infos[i]["text"] != undefined) {
					var currentValue = self.infos[i];
					var rowWrapper = document.createElement("div");
					rowWrapper.className = "inforow";
					rowWrapper.innerHTML = self.infos[i]["text"];
					messageWrapper.appendChild(rowWrapper);
				}
			}
			wrapper.appendChild(messageWrapper);
		} else {
			var messageWrapper = document.createElement("div");
			messageWrapper.className = "messages";
			messageWrapper.innerHTML = "Keine Infos verfügbar.";
			wrapper.appendChild(messageWrapper);
		}

		return wrapper;
	}
});
