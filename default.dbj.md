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
