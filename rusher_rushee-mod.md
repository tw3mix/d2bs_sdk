[1]: https://markdown-here.com/livedemo.html
[markdown live demo][1] [마크다운 사용법](https://dooray.com/htmls/guides/markdown_ko_KR.html)

# mod rush

### rusher fatch

```javascript
	this.inviteParty = function () {
		var player, myPartyId;

		print("invte party");
		player = getParty();
		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.partyflag !== 4 && player.partyflag !== 2 && player.partyid === 65535) {
					clickParty(player, 2);
					delay(100);
				}
			}
		}
	};

	addEventListener("chatmsg", this.chatEvent);
	
	if (Config.PublicMode !== 1 || Config.PublicMode !== 3) {
		this.inviteParty();
	}
```


### rushee fatch

```javascript
	this.changeAct = function (act) {
		...
		...
		if (!me.inTown && me.act !== 3) {
			Pather.usePortal(null, leader.name);
		}

		if (me.act === act) {
			return true;
		}

		try {
			switch (act) {
			case 2:
				if (me.act >= 2) {
					break;
				}

				Town.move(NPC.Warriv);

				npc = getUnit(1, NPC.Warriv);

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D36);

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}

				if(!me.getQuest(15, 0)) {
					Pather.usePortal(50, Config.Leader);
					Pather.moveToExit(40, true);

					npc = getUnit(1, NPC.Jerhyn);

					if (!npc || !npc.openMenu()) {
							Pather.moveTo(5166, 5206);

							return false;
					}

					me.cancel();
					Pather.moveToExit(50, true);
					Pather.usePortal(40, Config.Leader);
				}

				Town.move(NPC.Meshif);
```

```javascript
	this.leaderFounded = undefined;
	this.checkParty = function () {
		var player, myPartyId, leaderPlayer;

		player = getParty();
		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.name === Config.Leader) {
					if (myPartyId !== 65535 && myPartyId === player.partyid) {
						leaderPlayer = getParty(player.name);
					}
					else if (player.partyflag === 2 && (myPartyId === 65535 || player.partyid !== myPartyId)) {
						clickParty(player, 2);
						delay(100);
						break;
					}
				}
				if (Config.Rushee.Quester && myPartyId !== 65535 &&
					player.partyflag !== 4 && player.partyflag !== 2 && player.partyid === 65535) {
					clickParty(player, 2);
					delay(100);
				}
			}
		}
		return leaderPlayer;
	};

	addEventListener("chatmsg",
		function (who, msg) {
			if (msg === "rusher") {
				Config.Leader = who;
			}
			if (who === Config.Leader) {
				actions.push(msg);
			}
		});

	// START
	if (me.inTown) {
		Town.move("portalspot");
	}

	while (true) {
		leader = this.checkParty();
		if (!leader) {
			delay(1500);
			this.leaderFounded = undefined;
			continue;
		}

		if (this.leaderFounded === undefined) {
			this.leaderFounded = true;
			say("Leader found!");
		}

		try {
```

```javascript
				case "1":
					while (!leader.area) {
						delay(500);
					}

					//print(leader.area);

					if (!Config.Rushee.Quester) {
						//print("not a quester");
						switch (leader.area) {
						case 74: // ARCANE_SANCTUARY
						//case 83: // travincal
							target = getUnit(1, NPC.Cain);

							if (target && target.openMenu()) {
								me.cancel();
							}

							break;
						}
						actions.shift();

						break;
					}
					
					...
					...

					switch (leader.area) {
					...
					case 108: // Chaos Sanctuary
						Pather.usePortal(108, Config.Leader);
						Pather.moveTo(7762, 5268);
						Packet.flash(me.gid);
						delay(500);
						Pather.walkTo(7763, 5267, 2);

						//while (!getUnit(1, 243)) {
							//delay(500);
						//}
```

```javascript
				case "2":
				//...
				//...
					case 83: // Travincal
						this.revive();

						if (!me.inTown && !Pather.usePortal(75, Config.Leader)) {
							break;
						}

						Town.move(NPC.Cain);

						target = getUnit(1, NPC.Cain);

						if (target && target.openMenu()) {
							me.cancel();
						} else {
							break;
						}

						if (!this.checkQuest(21, 0)) {
							D2Bot.printToConsole("Travincal quest failed", 9);
							quit();
						}

						Town.move("portalspot");
						actions.shift();
```

```javascript
				case "a2":
				case "a3":
				case "a4":
				case "a5":
					if (!this.changeAct(parseInt(actions[0][1], 10))) {
						break;
					}
					
					if (me.area === 40) {
						target = getUnit(1, NPC.Jerhyn);
						if (target && getDistance(me, target) < 3) {
							target.openMenu();
						}
						me.cancel();
					}

					Town.move("portalspot");
					actions.shift();

					break;
```

### RushThread

```javascript
	this.playersInAct = function (act) {
		var area, party, myPartyId,
			areas = [0, 1, 40, 75, 103, 109];

		if (!act) {
			act = me.act;
		}

		area = areas[act];
		party = getParty();

		if (party) {
			myPartyId = party.partyid;
			do {
				if (party.name !== me.name && party.area < area && party.partyid === myPartyId) {
					return false;
				}
			} while (party.getNext());
		}

		return true;
	};
```

```javascript
		if (!this.bumperCheck()) {
			say("No eligible bumpers detected. Rush complete~");
			delay(500);
			this.letRushComplete = true;
			//quit();

			return false;
		}
```

```javascript
// this.diablo = function () {
// ...
		var tick = getTickCount();
		me.overhead("Waiting for 20 seconds");
		while (!getUnit(1, 243)) {
			delay(500);
			if (getTickCount() - tick > 20000) {
				break;
			}
		}

		try {
			Attack.kill(243);
		} catch (errorDiablo) {
			say("diablo not found");
			delay(3000);
		}
		say("2");
		delay(1000);
```

```javascript
				try {
					delay(1000);
					this[sequence[current]]();
				} catch (sequenceError) {
					if (sequenceError.message.indexOf("Attack.kill") > -1) {
						say("2");
						delay(3000);
						if ([37, 73, 102, 108].indexOf(me.area) > -1) {
							say("a" + (me.act + 1));
						} else {
							say(sequenceError.message);
						}
					}

					Town.goToTown();
				}

				current += 1;

				command = "go";
				
				if (this.letRushComplete) {
					delay(2000);
					say("main loop: Rush complete~");
					command = false;
				}
```


