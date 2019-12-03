/* Magic Mirror
 * Module: vvsTripsWnS
 */
Module.register("vvsTripsWnS", {

	defaults: {
		originPlace: "Winnenden",
		originName: "Winnenden",
		originString: "Winnenden",
		destinationPlace: "Stuttgart",
		destinationName: "Hauptbf+%28A.-Klett-Pl.%29",
		destinationString: "Hauptbf (A.-Klett-Pl.)",
		maximumEntries: 10,
		reloadInterval: 0.5 * 60 * 1000,
		colorDelay: true,
		colorNoDelay: true,
		number: undefined,
		direction: undefined
	},
	
	requiresVersion: "2.1.0",
	
	getStyles: function() {
		return ["vvsTripsWnS.css"];
	},
	getScripts: function() {
		return ["moment.js"];
	},

	start: function() {
		var self = this;
		Log.log("Starting module: " + self.name);

		self.trip = [];
		self.sendSocketNotification("GET_TRIPS", { "config": self.config });
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;

		if (notification === "NEW_TRIP") {
			self.trip = payload.journeys;
			self.originPlace = self.config.originPlace ? self.config.originPlace : self.originPlace;
			self.originName = self.config.originName ? self.config.originName : self.originName;
			self.destinationPlace = self.config.destinationPlace ? self.config.destinationPlace : self.destinationPlace;
			self.destinationName = self.config.destinationName ? self.config.destinationName : self.destinationName;
			Log.info(payload.journeys);
			self.updateDom();
		}
		if (notification === "URL") {
			Log.info(payload);
		}
		if (notification === "ERROR") {
			Log.info(payload);
		}
		Log.log("Notification Received!");
	},

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");

		var headerWrapper = document.createElement("header");
		headerWrapper.innerHTML = "Fahrten von " + self.config.originString + " nach " + self.config.destinationString;
		wrapper.appendChild(headerWrapper);

		var listWrapper = document.createElement("div");
		listWrapper.className = "trainlist";
		
		var added = 0;
		var steps = self.config.maximumEntries / 2;
		for (var i in self.trip) {
			Log.warn(self.trip[i]);
			
			if (added >= self.config.maximumEntries) {
				wrapper.appendChild(listWrapper);
				return wrapper;
			}

			var currentValue = self.trip[i];
			var rowWrapper = document.createElement("div");
			rowWrapper.className = "rows";

			var transportType = currentValue.legs["0"].transportation.product.id;
			var laneWrapper = document.createElement("div");
			laneWrapper.className = "number";
			laneWrapper.innerHTML = currentValue.legs["0"].transportation.number;
			switch (transportType) {
				case 0: laneWrapper.className += " sbahn";
					break;
				case 1: laneWrapper.className += " rbahn";
					break;
				case 2: laneWrapper.className += " stadtbahn";
					break;
				case 5: laneWrapper.className += " bus";
					break;
				case 16: laneWrapper.className += " ic";
					 break;
				default: laneWrapper.className += " other";
					 break;
			}
			rowWrapper.appendChild(laneWrapper);
			
			var destinationWrapper = document.createElement("div");
			destinationWrapper.className = "destination";
			destinationWrapper.innerHTML = currentValue.legs["0"].destination.name;
			rowWrapper.appendChild(destinationWrapper);

			var originWrapper = document.createElement("div");
			originWrapper.className = "origin";
			originWrapper.innerHTML = currentValue.legs["0"].origin.disassembledName;
			rowWrapper.appendChild(originWrapper);

			var clockWrapper = document.createElement("div");
			clockWrapper.className = "time";
			var date = new Date(currentValue.legs["0"].origin.departureTimePlanned);
			clockWrapper.innerHTML = moment(date.getHours() + ":" + date.getMinutes(), "HH:mm")
				.subtract(currentValue.delay, "m")
				.format("HH:mm");
			rowWrapper.appendChild(clockWrapper);

			var delayWrapper = document.createElement("div");
			var delay = 0;
			//if ("isRealtimeControlled" in currentValue && currentValue.isRealtimeControlled == true) {
				delay = this.calculateDelay(currentValue.legs["0"].origin.departureTimePlanned, (currentValue.legs["0"].origin.departureTimeEstimated == undefined ? currentValue.legs["0"].origin.departureTimePlanned : currentValue.legs["0"].origin.departureTimeEstimated));
			//}

			if (delay.getMinutes() != 0) {
				delayWrapper.className = "delay";
				if (self.config.colorDelay) {
					delayWrapper.className += " color";
					clockWrapper.className += " delay color";
				}
				delayWrapper.innerHTML = "+" + delay.getMinutes();
			} else {
				delayWrapper.className = "nodelay";
				if (self.config.colorNoDelay) {
					delayWrapper.className += " color";
					clockWrapper.className += " nodelay color";
				}
				delayWrapper.innerHTLM = '&nbsp' + '&nbsp'  + '&nbsp' + '&nbsp';
			}
			rowWrapper.appendChild(delayWrapper);

			rowWrapper.className = "small dimmed";
			listWrapper.appendChild(rowWrapper);
			if (added >= steps) {
				var currentStep = added - steps;	
				rowWrapper.style.opacity = 1 - (1 / (steps * currentStep));
			}

			if (currentValue.legs["0"].infos != undefined && currentValue.legs["0"].infos.length != 0) {
				var rowWrapperInfo = document.createElement("div");
				
				var bufferCell = document.createElement("div");
				bufferCell.className = "info small";
				rowWrapperInfo.appendChild(bufferCell);

				var infoWrapper = document.createElement("div");
				infoWrapper.className = "info";
				infoWrapper.innerHTML = currentValue.legs["0"].infos["0"].subtitle;

				if (added >= steps) {
					var currentStep = added - steps;
					rowWrapperInfo.style.opacity = 1 - (1 / (steps * currentStep));
				}

				rowWrapperInfo.appendChild(infoWrapper);

				var bufferCellBig = document.createElement("div");
				bufferCellBig.className = "info big";
				rowWrapperInfo.appendChild(bufferCellBig);
				listWrapper.appendChild(rowWrapperInfo);
			}

			added++;
		}
	
		wrapper.appendChild(listWrapper);
		return wrapper;
	},

	calculateDelay(departureTimePlanned, departureTimeEstimated){
		timePlanned = new Date(departureTimePlanned);
		timeEstimated = new Date(departureTimeEstimated);
		var timeDiff = new Date(timeEstimated.getTime() - timePlanned.getTime());
		return timeDiff
	},

	showNumber : function(number) {
		var self = this;
		return self.isValue(number, self.config.number);
	},

	showDirection : function(direction) {
		var self = this;
		return self.isValue(direction, self.config.direction);
	},

	isValue : function(input, value) {
		if(!value || !input) {
			return true;
		} else if(value instanceof Array) {
			return value.indexOf(input) >= 0;
		} else if (typeof value === "string" || value instanceof String) {
			return value === input;
		} else if(typeof value === "function" || value instanceof Function) {
			return value(input);
		}
		return false;
	}

});