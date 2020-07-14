```javascript
/************************
	maphelper
************************/
					case "rush":
						if (obj.dest === 7) {
							if (!isIncluded("bots/Rushee.js")) {
								if (include("bots/Rushee.js")) {
									print("Start rushee with < quester >");
									Config.PublicMode = 2;
									Config.Rushee.Quester = true;
									scriptBroadcast("chickenOff");
									Rushee._caller_ = "D2BotMap";
									Rushee();
								}
							}
						}
						else if (obj.dest === 8) {
							if (!isIncluded("bots/Rushee.js")) {
								if (include("bots/Rushee.js")) {
									print("Start rushee with < passenger >");
									Config.PublicMode = 2;
									scriptBroadcast("chickenOff");
									Rushee();
								}
							}
						}
						else if (obj.dest === 9) {
							if (!isIncluded("bots/Rusher.js")) {
								if (include("bots/Rusher.js")) {
									print("Including bots/rusher.js");
									say("rusher");
									delay(500);
									Config.Rusher.WaitPlayerCount = Rusher().getPlayerCount();
									Rusher();
								}
							}
						}

						break;
/**************************
	mapthread
**************************/
var rushThread;

	this.keyEvent = function (key) {
		switch (key) {
		case 103: // Numpad 7
			if (Hooks.monsters.enabled) {
				Hooks.monsters.enabled = false;
				Hooks.text.getHook("monsterStatus").hook.text = "Num 7: Enable Monsters";
			} else {
				Hooks.monsters.enabled = true;
				Hooks.text.getHook("monsterStatus").hook.text = "Num 7: Disable Monsters";
			}

			break;
		case 104: // Numpad 8
			if (Hooks.vector.enabled) {
				Hooks.vector.enabled = false;
				Hooks.text.getHook("vectorStatus").hook.text = "Num 8: Enable Vectors";
			} else {
				Hooks.vector.enabled = true;
				Hooks.text.getHook("vectorStatus").hook.text = "Num 8: Disable Vectors";
			}

			break;
		case 55: // 7
			if (!rushThread) {
				rushThread = 7;
				me.overhead("Quester: waiting leader");
				scriptBroadcast(JSON.stringify({type: "rush",dest: 7}));
			} else if (rushThread === 7) {
				rushThread = getScript("tools/maphelper.js");
				if (rushThread) {
					rushThread.stop();
				}
				rushThread = undefined;
				me.overhead("quester ended");
			}

			break;
		case 56: // 8
			if (!rushThread) {
				rushThread = 8;
				me.overhead("Passenger: waiting leader");
				scriptBroadcast(JSON.stringify({type: "rush",dest: 8}));
			} else if (rushThread === 8) {
				rushThread = getScript("tools/maphelper.js");
				if (rushThread) {
					rushThread.stop();
				}
				rushThread = undefined;
				me.overhead("passenger ended");
			}

			break;
		case 57: // 9
			if (!rushThread) {
				rushThread = 9;
				me.overhead("Rusher: Waiting for players to join");
				scriptBroadcast(JSON.stringify({type: "rush",dest: 9}));
			} else if (rushThread === 9) {
				rushThread = getScript("tools/rushthread.js");
				if (rushThread) {
					rushThread.stop();
				}
				rushThread = getScript("tools/maphelper.js");
				if (rushThread) {
					rushThread.stop();
				}
				rushThread = undefined;
				me.overhead("rusher ended");
			}

			break;
		}
	};

	var i,
		hideFlags = [0x09, 0x0C, 0x0D, 0x01, 0x02, 0x0F, 0x18, 0x19, 0x21];

	addEventListener("keyup", this.keyEvent);

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(100);
		}

		this.revealArea(me.area);

		if (getUIFlag(0x0A)) {
			Hooks.update();
		} else {
			Hooks.flush();
		}

		delay(20);
		
		if (rushThread) {
			Hooks.flush();
			while (rushThread) {
				delay(200);
			}
			delay(200);
			load("tools/maphelper.js");
		}

		for (i = 0; i < hideFlags.length; i += 1) {
			while (getUIFlag(hideFlags[i])) {
				Hooks.flush();
				delay(100);
			}
		}
	}
}
```
