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
	this.gameEvent = function (mode, param1, param2, name1, name2) {
		//print("mode: " + mode + ", param1: " + param1 + ", param2: " + param2 + ", name1: " + name1 + ", name2: " + name2);
		switch (mode) {
		case 0x07:
			if (param2 === 0x08) {
				if (!leader) {
					leader = name1;
					print("ÿc4Wakka: ÿc0Eventdetected leader: " + leader);
				}
				inviteList.push(name1);
			}
			break;
		}
	};

	this.checkMonsters = function (range, dodge) {
		var monList = [],
			monster = getUnit(1);

		if (monster) {
			do {
				if (monster.y < 5565 && Attack.checkMonster(monster) && getDistance(me, monster) <= range) {
					if (!dodge && !checkCollision(me, monster, 0x4)) {
						return true;
					}

					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		if (!monList.length) {
			return false;
		}

		monList.sort(Sort.units);

		if (getDistance(me, monList[0]) < 25 && !checkCollision(me, monList[0], 0x4)) {
			Attack.deploy(monList[0], 25, 4, 20);
			while (monList.length) {
				if (getDistance(me, monList[0]) < 25 && monster.classid !== 306) {
					danger = true;
					break;
				}
				monList.shift();
			}
		}

		return true;
	};

	this.checkBoss = function (name, timeout) {
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
					break;
				}
			}
			delay(timeout || 2000);

			return true;
		}

		return false;
	};
...
...
	addEventListener("gameevent", this.gameEvent);

	// start
	Town.goToTown(4);

	if (Config.Leader) {
		leader = Config.Leader;

		for (i = 0; i < 30; i += 1) {
			if (Misc.inMyParty(leader)) {
				break;
			}

			delay(1000);
		}

		if (i === 30) {
			throw new Error("Wakka: Leader not partied");
		}
	}

	autoLeaderDetect(108);
	Town.doChores();
	Town.move("portalspot");

	if (leader) {
		while (Misc.inMyParty(leader)) {
			if (me.getStat(12) >= stopLvl) {
				D2Bot.stop();
			}

			switch (me.area) {
			case 103:
				//portal = Pather.getPortal(108, leader);
				portal = Pather.getPortal(108, null);

				if (portal) {
					if (!safeTP) {
						delay(5000);
					}

					//Pather.usePortal(108, leader);
					Pather.usePortal(108, null);
				}

				break;
			case 108:
				if (!safeTP) {
					if (this.checkMonsters(25, false)) {
						//me.overhead("hot tp");
						say("hottp");
						//Pather.usePortal(103, leader);
						Pather.usePortal(103, null);
						this.getCorpse();

						break;
					} else {
						this.getCoords();

						safeTP = true;
					}
				}

				if (!vizClear) {
					if (!this.followPath(this.vizCoords)) {
						break;
					}

					if (this.checkBoss(getLocaleString(2851))) {
						vizClear = true;
						me.overhead("vizier dead");
					}

					break;
				}

				if (!seisClear) {
					if (!this.followPath(this.seisCoords)) {
						break;
					}

					if (this.checkBoss(getLocaleString(2852))) {
						seisClear = true;
						me.overhead("seis dead");
					}

					break;
				}

				if (!infClear) {
					if (!this.followPath(this.infCoords)) {
						break;
					}

					if (this.checkBoss(getLocaleString(2853))) {
						infClear = true;
						me.overhead("infector dead");
					}

					break;
				}

				Pather.moveTo(7767, 5263);

				diablo = getUnit(1, 243);

				if (diablo && (diablo.mode === 0 || diablo.mode === 12)) {
					return true;
				}

				break;
			}

			if (me.mode === 17) {
				leaderPartyUnit = getParty(leader);
				if (leaderPartyUnit && leaderPartyUnit.area === 108) {
					me.revive();
				}
			}

			delay(500);
		}
	} else {
		throw new Error("Empty game.");
	}

	return true;
```
