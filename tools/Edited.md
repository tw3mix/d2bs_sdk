# Attack.js
```javascript
		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			if (getScript("d2botmap.dbj")) {
				print("ÿc1Bad attack config. Don't expect your bot to attack. (hide console)");
			} else {
				showConsole();
				print("ÿc1Bad attack config. Don't expect your bot to attack.");
			}
		}
```
# ToolsThread.js [537]
```javascript
	var PartyCount = 0,
		PartyTick = getTickCount();

	if (!Config.PublicMode && !FileTools.exists("libs/config/" + me.charname + ".json")) {
		PartyCount = 1;
	}

	this.publicParty = function () {
		if (getTickCount() - PartyTick < 1500 || !PartyCount) {
			return;
		}

		var player, myPartyId, flagPlayer;

		PartyTick = getTickCount();
		player = getParty();
		i = 0;

		if (player) {
			myPartyId = player.partyid;

			if (myPartyId !== 65535) {
				PartyCount -= 1;
				return;
			}

			while (player.getNext()) {
				i += 1;
				if (player.partyflag === 2) {
					flagPlayer = player;
					if (player.partyid !== 65535 && player.partyid !== myPartyId) {
						clickParty(player, 2);
						flagPlayer = null;
						delay(100);
						break;
					}
				}
			}

			if (flagPlayer && i === 1) {
				clickParty(flagPlayer, 2);
				delay(100);
			}
		}
	};

	if (!me.playertype && me.charlvl < 80) {
		Config.LifeChicken = 0;
		print("ÿc3ToolsThread ÿc1:: Chicken offed to lvl 80"); 
	}
```
