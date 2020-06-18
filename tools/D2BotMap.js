function main () {
	include("json2.js");
	include("OOG.js");
	include("common/misc.js");

	var handle,
		ingame,
		lastGameName,
		isUp = "no";

	function locationAction(location) {
		if (me.ingame) {
			return;
		}

		var i, control, string, text;
		
		switch (location) {
			case 4:
				if (!ControlAction.getText(1, 432, 162, 158, 20) && lastGameName[0]) {
					ControlAction.setText(1, 432, 162, 158, 20, lastGameName[0]);
					ControlAction.setText(1, 432, 217, 158, 20, lastGameName[1]);
				}
				break;
			case 5:
				if (!ControlAction.getText(1, 432, 148, 155, 20) && lastGameName[0]) {
					ControlAction.setText(1, 432, 148, 155, 20, lastGameName[0]);
					ControlAction.setText(1, 606, 148, 155, 20, lastGameName[1]);
				}
				break;
		}

		while (getLocation() === location) {
			delay(500);
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

	lastGameName = DataFile.getObj().lastGameName || "/";
	lastGameName = lastGameName.split("/");

	while (true) {
		while (me.ingame) {
			if (me.gameReady) {
				isUp = "yes";

				if (!ingame) {
					ingame = true;
					lastGameName[0] = me.gamename;
					lastGameName[1] = me.gamepassword;
					DataFile.updateStats("lastGameName", me.gamename + "/" + me.gamepassword);
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

