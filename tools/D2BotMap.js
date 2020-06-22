function main () {
	include("json2.js");
	include("OOG.js");
	include("common/misc.js");

	var handle,
		ingame,
		lastGame = "/",
		isUp = "no";

	function locationAction(location) {
		if (me.ingame) {
			return;
		}
		
		switch (location) {
			case 4:
				ControlAction.setText(1, 432, 162, 158, 20, lastGame[0]);
				ControlAction.setText(1, 432, 217, 158, 20, lastGame[1]);
				break;

			case 5:
				ControlAction.setText(1, 432, 148, 155, 20, lastGame[0]);
				ControlAction.setText(1, 606, 148, 155, 20, lastGame[1]);
				break;
		}

		if (location === 4 || location === 5) {
			while (getLocation() === location) {
				delay(500);
			}
		}
	}

	function copyDataEvent (mode, msg) {
		switch (msg) {
		case "Handle":
			handle = mode;

			break;
		}

		switch (mode) {
		case 3: // request game
			var obj = JSON.parse(msg);

			if (me.gameReady) {
				D2Bot.joinMe(obj.profile, me.gamename.toLowerCase(), "", me.gamepassword.toLowerCase(), isUp);
			}

			break;
		case 4:
			// Heartbeat ping
			if (msg === "pingreq") {
				sendCopyData(null, me.windowtitle, 4, "pingrep");
			}

			break;
		}
	}

	addEventListener('copydata', copyDataEvent);

	while (!handle) {
		delay(100);
	}

	DataFile.updateStats("handle", handle);
	delay(500);
	D2Bot.init();
	load("tools/heartbeat.js");

	//lastGame = DataFile.getObj().lastGame || "/";
	lastGame = lastGame.split("/");

	while (true) {
		while (me.ingame) {
			if (me.gameReady) {
				isUp = "yes";

				if (!ingame) {
					ingame = true;
					if (lastGame[0] !== me.gamename.toLowerCase()) {
						lastGame[0] = me.gamename.toLowerCase();
						lastGame[1] = me.gamepassword.toLowerCase();
						//DataFile.updateStats("lastGame", lastGame[0] + "/" + lastGame[1]);
					}
				}
			}

			delay(1000);
		}

		isUp = "no";
		ingame = false;

		locationAction(getLocation());
		delay(1000);
	}
}
