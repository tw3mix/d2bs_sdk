# gamble
```javascript
	function gamble (classid) {
		var i, npc, item,
			goldReserve = 1e5;

		classid = classid || 522; // ring(522) amulet(520)
		npc = Town.initNPC("Gamble", "gamble 8 times at least");

		if (!npc) {
			return;
		}

	GambleMainLoop:
		for (i = 0; i < 8; i +=1) {
			if (!getInteractedNPC()) {
				npc.startTrade("Gamble");
			}

			item = npc.getItem();
			if (item) {
				do {
					if (!Storage.Inventory.CanFit(item) || (me.getStat(14) + me.getStat(15)) < goldReserve) {
						me.cancel();
						break GambleMainLoop;
					}

					if (item.classid === classid) {
						item.buy(false, true);
					}
				} while(item.getNext());
			}

			me.cancel();
		}
	}
```
### arcane area coord
```javascript
			if (me.area === 74) {
				switch (unit.roomx * 5 + unit.x) {
				case 25011:
					unit = {x: 25061, y: 5446}; //25081, 5446
					break;
				case 25866:
					unit = {x: 25830, y: 5447}; // 25840, 5447
					break;
				case 25431:
					switch (unit.roomy * 5 + unit.y) {
					case 5011:
						unit = {x: 25448, y: 5061}; // 25449, 5081
						break;
					case 5861:
						unit = {x: 25447, y: 5832}; // 25447, 5822
						break;
					}
					break;
				}
			}
```
