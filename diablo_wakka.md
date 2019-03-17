### diablo
```javascript
	// Help event handle function
	var helping = false;

	this.coordHelpRequester = function (name) {
		var myPartyId, party = getParty();

		if (party) {
			myPartyId = party.partyid;
			do {
				if (party.name === name && party.partyid === myPartyId &&
						party.partyid !== 65535 && party.area === me.area) {
					return {x: party.x, y: party.y};
				}
			} while (party.getNext());
		}
		return null;
	};
	this.chatEvent = function (nick, msg) {
		if (nick !== me.name && !helping) {
			var coord, prePos = {x: me.x, y: me.y};
			switch (msg) {
			case "help":
			case "helpEntrance":
				coord = this.coordHelpRequester(nick);
				if (coord) {
					helping = true;

					print("Move to help requester");
					if (msg === "helpEntrance") {
						Pather.moveTo(7790, 5544);
					} else {
						Pather.moveTo(coord.x, coord.y);
					}
					Attack.clear(30, 0, false, this.sort);
					delay(100);
					Pather.moveTo(prePos.x, prePos.y);

					helping = false;
				}
				break;
			}
		}
	};

addEventListener("chatmsg", this.chatEvent);
...
		if (Config.PublicMode) {
			me.overhead("Attack.securePosition: r30 5s");
			Attack.securePosition(7790, 5544, 30, 5000);
			Pather.makePortal();
			say(Config.Diablo.EntranceTP);
			Pather.teleport = !Config.Diablo.WalkClear && Pather._teleport;
		}
...
removeEventListener("chatmsg", this.chatEvent);
```

### wakka
```javascript
	this.checkBoss = function (name) {
		var i, boss,
			glow = getUnit(2, 131);

		if (glow || getUnit(1, name)) {
			for (i = 0; i < 10; i += 1) {
				delay(500);

				if (me.getStat(12) >= stopLvl) {
					D2Bot.stop();
				}

				boss = getUnit(1, name);

				if (boss && boss.mode === 12) {
					return true;
				}
			}

			return true;
		}

		return false;
	};
...
...
		if (getDistance(me, monList[0]) < 25 && !checkCollision(me, monList[0], 0x4)) {
			Attack.deploy(monList[0], 25, 4, 20);
			while (monList.length) {
				if (getDistance(me, monList[0]) < 25) {
					danger = true;
					break;
				}
				monList.shift();
			}
		}

...
...
...
					if (danger && getTickCount() - tick > 7000) {
						tick = getTickCount();
						print("help");
					}
```
