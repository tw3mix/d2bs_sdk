### diablo
```javascript
	var isHelp = false;

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
		if (nick !== me.name && !isHelp) {
			var coord, prePos = {x: me.x, y: me.y};
			switch (msg) {
			case "help":
				coord = this.coordHelpRequester(nick);
				if (coord) {
					isHelp = true;

					print("Move to help requester");
					Pather.moveTo(coord.x, coord.y);
					Attack.clear(30, 0, false, this.sort);
					delay(100);
					Pather.moveTo(prePos.x, prePos.y);

					isHelp = false;
				}
				break;
			}
		}
	};

addEventListener("chatmsg", this.chatEvent);
removeEventListener("chatmsg", this.chatEvent);
```

### wakka
```javascript
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
