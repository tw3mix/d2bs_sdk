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
