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
		var player, myPartyId, clickAccept;

		leader = null;
		player = getParty();
		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.name === Config.Leader) {
					if (myPartyId !== 65535 && myPartyId === player.partyid) {
						//leader = player;
						leader = getParty(player.name);
					}
					else if (player.partyflag === 2 && (myPartyId === 65535 || player.partyid !== myPartyId)) {
						clickAccept = true;
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
			if (clickAccept) {
				delay(100);
				say("Leader found!");
			}
		}
		return leader;
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
			delay(3000);
			print("leader not found");
			continue;
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
		me.overhead("waiting 20 seconds");
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


