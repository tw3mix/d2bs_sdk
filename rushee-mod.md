[1]: https://markdown-here.com/livedemo.html
[markdown live demo][1] [마크다운 사용법](https://dooray.com/htmls/guides/markdown_ko_KR.html)

# rushee fatch

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
				if (player.partyflag === 2 &&
					(myPartyId === 65535 || player.partyid !== myPartyId)) {
					clickParty(player, 2);
					delay(100);
					break;
				}
			}
		}
	};
```

```javascript
				case "2": // Go back to town and check quest
					if (!Config.Rushee.Quester) {
						switch (leader.area) {
						// Non-questers can piggyback off quester out messages
						case 61: // amulet
						case 83: // travincal
							target = getUnit(1, NPC.Cain);

							if (target && target.openMenu()) {
								me.cancel();
							}

							break;
```

