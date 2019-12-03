/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
    address: "localhost", // Address to listen on, can be:
                          // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
                          // - another specific IPv4/6 to listen on a specific interface
                          // - "", "0.0.0.0", "::" to listen on any interface
                          // Default, when address config is left out, is "localhost"
    port: 8080,
    ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
                                                           // or add a specific IPv4 of 192.168.1.5 :
                                                           // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
                                                           // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
                                                           // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

    language: "de",
    timeFormat: 24,
    units: "metric",

    modules: [
        {
            module: "alert",
        },
        {
            module: "updatenotification",
            position: "top_bar"
        },
	{
            module: 'MMM-ProfileSwitcher',
	    config: {
		leaveMessages: false,
		enterMessages: {
		    "everyone": "Willkommen!"
		},
		timers: {	
			"Gast": {
			    time: 5 * 1000
			}
	  	}
	    }
    	},
        {
            module: "clock",
	    classes: "default everyone",
            position: "top_left",
                        config: {
                                showWeek: "true",
                                displayType: "both",
                                analogPlacement: "right",
                                analogFace: "face-004",
                                timezone: "Europe/Berlin",
				secondsColor: "#ff7700",
				analogPlacement: "top"
                        }
        },
        {
            module: "calendar",
                        wrapEvents: "true",
                        tableClass: "medium",
	    classes: "default",
            header: "Feiertage",
            position: "bottom_right",
            config: {
                calendars: [
                    {
                        symbol: "calendar-check",
                                    maximumNumberOfDays: "100",
                        url: "http://i.cal.to/ical/64/baden-wuerttemberg/feiertage/a416b6f1.34239329-5f6205b3.ics"
                    }
                ]
            }
        },
         {
            module: "calendar",
                        colored: "true",
                        wrapEvents: "true",
                        tableClass: "medium",
	    classes: "default",
            header: "Schulferien",
            position: "bottom_right",
            config: {
                calendars: [
                    {
                                                color: "#ffff38",
                        symbol: "umbrella-beach",
                                    maximumNumberOfDays: "180",
                        url: "http://i.cal.to/ical/80/baden-wuerttemberg/ferien/a416b6f1.34239329-b19db45a.ics"
                    }

                ]
            }
        },
/*        {
            module: "compliments",
	    classes: "default",
            position: "lower_third"
        },
*/
        {
            module: "currentweather",
	    classes: "default MariusTanner",
            position: "top_right",
            config: {
                location: "Winnenden",
                locationID: "2807872",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                appid: "57e09f73091625999ffa6920e9447b14",
		degreeLabel: "true"
            }
        },
        {
            module: "weatherforecast",
	    classes: "default MariusTanner",
            position: "top_right",
            config: {
                location: "Winnenden",
                locationID: "2807872",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
                appid: "57e09f73091625999ffa6920e9447b14"
            }
        },
        {
            module: "newsfeed",
	    classes: "default LeonieWeber",
            position: "bottom_bar",
            config: {
                feeds: [
                    //{
                    //    title: "New York Times",
                    //    url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
                    //},
                    {
                        title: "heise online",
                        url: "http://www.heise.de/newsticker/heise.rdf"
                    },
                    {
                        title: "Stuttgarter Zeitung - Topthemen",
                        url: "http://www.stuttgarter-zeitung.de/rss/topthemen.rss.feed"
                    }
                ],
                showSourceTitle: true,	
                showPublishDate: true,
                broadcastNewsFeeds: true,
                broadcastNewsUpdates: true
            }
        },
	{
	    module: "MMM-UserInfo",
	    classes: "everyone",
	    position: "bottom_left",
	    config: {
		nfc: 1234,
		baseurl: "https://192.168.51.172/dev2/request.php?"
	    }
	},
	{
	    module: "vvsTripsWnS",
	    classes: "HansMuller MariusTanner LeonieWeber",
	    position: "bottom_left",
	    config: {
		maximumEntries: 8
		/*originPlace: "Stuttgart",
		originName: "Hauptbf+%28A.-Klett-Pl.%29",
		originString: "Hauptbf (A.-Klett-Pl.)",
		destinationPlace: "Winnenden",
		destinationName: "Winnenden",
		destinationString: "Winnenden"*/
	    }
	},
    ]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
