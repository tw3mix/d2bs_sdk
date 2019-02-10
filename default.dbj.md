### default.dbj
```javascript
	if (getScript("d2botmap.dbj")) {
		load("tools/mapthread.js");
		load("tools/ToolsThread.js");

/* Start moded */
		Config.init(true);
		Config.LocalChat.Enabled = true;
		Config.LocalChat.Mode = 2;
		Config.LocalChat.Toggle = 110;// decimal point
		LocalChat.init();
/* End moded */

		while (true) {
			delay(1000);
		}
	}
 ```

### D2BotLead.dbj
```javascript
	var serverIP;

	while (true) {
		while (me.ingame) { // returns true before actually in game so we can't only use this check
			if (me.gameReady) { // returns false when switching acts so we can't use while
				isUp = "yes";

				if (!ingame) {
					gameStart = getTickCount();
					serverIP = (me.gameserverip.length > 0 ? me.gameserverip.split(".")[3] : "0");

					print("Updating Status");
					//D2Bot.updateStatus("Game: " + me.gamename);

					lastGameStatus = "ingame";
					ingame = true;

					DataFile.updateStats("runs", gameCount);
					DataFile.updateStats("ingameTick");
				}

				D2Bot.updateStatus("[IP:" + serverIP + "] " + me.gamename + timer(gameStart));
			}

			delay(1000);
		}

		isUp = "no";

		locationAction(getLocation());
		delay(1000);
	}
```

```javascript
		if (lastGameStatus === "pending") {
			isUp = "no";

			if (StarterConfig.FTJRestartDelay > 0) {
				ControlAction.timeoutDelay("Restart delay", StarterConfig.FTJRestartDelay * 1e3);
				DataFile.updateStats("runs", gameCount + 1);
				//setNextGame();
				delay(500);
				D2Bot.restart();
			}
```

```javascript
case 2: // Waiting In Line
	string = "";
	text = ControlAction.getText(4, 427, 234, 300, 100);

	if (text) {
		string = text[3].split("c0")[1].replace(/\s+/g, '');
		var line = parseInt(string);

		if (line) {
			if (line < 2000) {
				D2Bot.updateStatus("Waiting... Line: " + line);
			} else {
				print("Waiting line: " + line);
				ControlAction.click(6, 433, 433, 96, 32); // Cancel creategame
				ControlAction.click(6, 693, 490, 80, 20); // Quit from Lobby
				delay(1000);
				ControlAction.click(6, 33, 572, 128, 35); // Quit from char selection
				ControlAction.timeoutDelay("Waiting Delay", 30 * 60 * 1e3); // Wait 30m delay
			}
		}
	}

	break;
```
