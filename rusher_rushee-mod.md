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
```

```javascript
	this.checkParty = function () {
		var player, myPartyId;

		player = getParty();
		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.name === Config.Leader) {
					if (player.partyflag === 2 && (myPartyId === 65535 || player.partyid !== myPartyId)) {
						clickParty(player, 2);
						delay(100);
						break;
					}
					if (Config.Rushee.Quester && myPartyId !== 65535 &&
						player.partyflag !== 4 && player.partyflag !== 2 && player.partyid === 65535) {
						clickParty(player, 2);
						delay(100);
						break;
					}
				}
			}
		}
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
		if (!Misc.inMyParty(Config.Leader)) {
			say("Looking for Leader");
			do {
				this.checkParty();
				delay(1000);
			} while (!Misc.inMyParty(Config.Leader));

			leader = this.getParty(Config.Leader);
			if (leader) {
				say("Leader found.");
			}
		}
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
```

```javascript
				case "a2":
					if (!this.changeAct(2)) {
						break;
					}

					target = getUnit(1, NPC.Jerhyn);

					if (target && getDistance(me, target) < 3) {
						target.openMenu();
					}
```

### RushThread

```javascript
	this.playersInAct = function (act) {
		var area, party,
			areas = [0, 1, 40, 75, 103, 109];

		if (!act) {
			act = me.act;
		}

		area = areas[act];
		party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && party.area < area) {
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
				try {
					this[sequence[current]]();
				} catch (sequenceError) {
					say(sequenceError.message);
					say("2");
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

