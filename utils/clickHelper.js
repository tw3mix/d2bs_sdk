/**
*	@filename	clickHelper.js
*	@author		dzik, edited by laz
*	@encoding	ANSI
*	@version	2017 new year!!
**/

function clickHelper () {	
	var hooks = [], decor = [], activeAction, end, block, wp, resolution = me.screensize, resfix, fire;
	
	addEventListener("gamepacketsent", function (pBytes) { if (pBytes[0] == 0x30) { return block; } else { return false; }});
	addEventListener("gamepacket", function (pBytes) {
		if (pBytes[0] == 0x51 || pBytes[0] == 0x0e) {
			return true;
		
		} else { 
			return false; 
			
		}
	});
	
	Town.move("larzuk");
	var larz = getUnit(1, "larzuk");
	
	// Sort items by size to pick biggest first
	function sortPickList(a, b) {
		// Same size -  sort by distance
		if (b.sizex === a.sizex && b.sizey === a.sizey) { 
			return getDistance(me, a) - getDistance(me, b);
			
		}
		
		return b.sizex * b.sizey - a.sizex * a.sizey;
		
	}
	
	// Sort items by size to move biggest first
	function sortMoveList(a, b) {		
		return b.sizex * b.sizey - a.sizex * a.sizey;
		
	}
	
	function hookHandler (click, x, y) {
		// Get the hook closest to the clicked location
		function sortHooks(h1, h2) {
			return Math.abs(h1.y - y) - Math.abs(h2.y - y);
			
		}
		
		// Left click
		if (click === 0) {
			// Sort hooks
			hooks.sort(sortHooks);
			
			// Don't start new action until the current one finishes
			if (activeAction && activeAction !== hooks[0].text) {
				return true;
				
			}
			
			// Toggle current action on/off
			activeAction = activeAction ? false : hooks[0].text;
			
			hooks[0].color = hooks[0].color === 2 ? 1 : 2;
			
			// Block click
			return true;
			
		}
		
		return false;
		
	}
	
	var hide = false;
	var list = false;
	
	function showHooks () {		
		/* me.screensize return
			0 for 640x480
			1 for 800x600
		*/
		
		resfix = me.screensize ? 0 : -120;
		
		// if we have hooks already check for resolution change
		if (hooks.length) {
			if (resolution != me.screensize || hide) {
				resolution = me.screensize;
				
				while (hooks.length) {
					var kill = hooks.shift();
					kill.remove();
					
				}
				
				while (decor.length) {
					var kill = decor.shift();
					kill.remove();
					
				}
				
				list = !list;
				
			} else {
				return false;
				
			}
			
		}
		
		if (list) {
			var commands = [
				//"end",
				"show",
			];
			
		}
		
		else {
			var commands = [
				"exit game",
				"drop from inventory", "drop from stash", "drop gold",
				"pick to inventory",
				"terminate larzuk chat",
				"move inv to trade", "move inv to stash",
				"block 0x30 (off)", "send 0x44 to larzuk", "close trade screen", "sell from trade",
				//"end",
				"hide",
			];
		}
		
		for (var i = commands.length; i; i--) {
			addHook (commands[i-1]);
			
		}
		
		hide = false;
		
		return true;
		
	}
	
	function addHook (text) {
		decor.push (new Frame (6, 466 - hooks.length * 19 + resfix, 160, 16));
		decor.push (new Box (6, 466 - hooks.length * 19 + resfix, 160, 16));
		hooks.push (new Text (text.toUpperCase(), 13, 480 - hooks.length * 19 + resfix, 2, 0, 0, false, hookHandler));
		
	}
	
	while (true) {
		
		if (end) {
			break;			
		}
		
		switch (activeAction) {	

			case "EXIT GAME":
				quit();
				
				activeAction = false;
				break;
			
			case "TERMINATE LARZUK CHAT":
				Town.move("larzuk");
				sendPacket(1, 0x30, 4, 1, 4, larz.gid);
				me.overhead("Larzuk chat terminated");
			
				activeAction = false;
				break;
				
			case "DROP FROM INVENTORY":
                                if (!me.inTown || !Town.openStash()) {
                                        me.overhear("Failed to open stash");
 
                                        activeAction = false;
 
                                        break;
                                }

				var items = me.findItems(-1, 0, 3);

				if (items) {
					while (activeAction && items.length > 0) {
						Packet.dropItem(items.shift());
							
					}
						
				}
				
				me.cancel();

				activeAction = false;
				break;

			case "DROP FROM STASH":
			case "DROP FROM CUBE":
				if (!me.inTown || !Town.openStash()) {
					me.overhear("Failed to open stash");

					activeAction = false;

					break;
				}

				items = me.findItems(-1, 0, activeAction === "DROP FROM STASH" ? 7 : 6);

				if (items) {
					while (activeAction && items.length > 0) {
						item = items.shift();

						if (item.classid !== 549) { // Don't drop the cube
								Packet.dropItem(item);
								
						}
						
					}
					
				}

				me.cancel();
			
				activeAction = false;
				break;
				
			case "DROP GOLD":
				if (!me.inTown || !Town.openStash()) {
					me.overhear("Failed to open stash");

					activeAction = false;
					break;
					
				}

				while (me.gold && activeAction) {
					if (me.getStat (15) > 0 && me.getStat (14) < me.getStat (12) * 10000) {
						var stashg = me.getStat (15) == 0 ? 0 : me.getStat (15);
						var invg = me.getStat (14) == 0 ? 0 : me.getStat (14);
						var missing = me.getStat (12) * 10000 - me.getStat(14);
						
						var difference = Math.min(stashg, missing);
						
						gold (difference, 4);
						
						while (invg === me.getStat(14)) {
							delay (100)
							
						}
						
					}
					
					var invg = me.getStat (14);
					
					gold (invg);
					
					while (invg === me.getStat(14)) {
						delay (100)
						
					}
					
				}

				me.cancel();
			
				activeAction = false;
				break;
				
			case "PICK TO INVENTORY":
				item = getUnit(4, -1, 3);
				items = [];
				var cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x19, 0x1a];
				
				for (var i = 0; i < cancelFlags.length; i++) {
					if (getUIFlag (cancelFlags[i])) {
						me.cancel();
						
					}
					
				}

				if (item) {
					do {
						items.push (copyUnit (item));
						
					} while (item.getNext ());
					
				}

				while (activeAction && items.length > 0) {
					items.sort (sortPickList);

					item = items.shift ();

					if (Town.ignoredItemTypes.indexOf (item.itemType) === -1 && Storage.Inventory.CanFit (item)) {
						Pickit.pickItem (item);
						
					}
					
				}				
			
				activeAction = false;
				break;
				
			case "MOVE INV TO TRADE":
				var inv = me.findItems (-1, 0, 3);
				inv.sort(sortMoveList);
								
				while (activeAction && inv.length) {
					var that = inv.shift();
					
					if (getUIFlag(0x17) && Storage.TradeScreen.CanFit(that)) {
						Storage.TradeScreen.MoveTo(that);
						
					}

				}				
			
				activeAction = false;
				break;
				
			case "MOVE INV TO STASH":
				var inv = me.findItems (-1, 0, 3);
				inv.sort(sortMoveList);
				
				while (activeAction && inv.length) {
					var that = inv.shift();
					
					if (Storage.Stash.CanFit(that)) {
						Storage.Stash.MoveTo(that);
						
					}

				}				
			
				activeAction = false;
				break;
				
			case "BLOCK 0X30 (ON)":
			case "BLOCK 0X30 (OFF)":
				block = !block;
				
				if (block)
					hooks[0].text = "BLOCK 0X30 (ON)";
				
				else
					hooks[0].text = "BLOCK 0X30 (OFF)";
			
				activeAction = false;
				break;
				
			case "SEND 0X44 TO LARZUK":				
				var beltitem;
				
				if (!larz) {
					me.overhead("Larzuk not found");
					activeAction = false;
					break;
					
				}
				
				var item = me.getItem();

				if (item) {
					do {
						if (item.location === 2) {
							beltitem = item;
							
							break;
						}
						
					} while (item.getNext());
					
				}
				
				while (!getUnit (100)) {					
					if (!beltitem) {
						break;
						
					}
					
					clickItem(0, beltitem);
					
					delay (me.ping * 2 + 100);
					
				}
				
				while (getUnit (100)) {
					sendPacket (1, 0x44, 4, 0, 4, larz.gid, 4, getUnit(100).gid, 2, 3, 2, 0);
					
					delay (me.ping * 2 + 100);
					
				}
				
				me.overhead("Sent 0x44 to Larzuk");
				
				activeAction = false;
				break;
				
			case "CLOSE TRADE SCREEN":
				getPacket(1, 0x77, 1, 0x0C);
			
				activeAction = false;
				break;
				
			case "SELL FROM TRADE":
				var unit = me.getItem();
				var npc = getInteractedNPC();
				
				if (npc) {
					if (unit) {
						do {
							if (unit.location == 4) {
								print(unit.name+" sold");
								sendPacket (1, 0x33, 4, npc.gid, 4, unit.gid, 4, unit.mode, 4, 0);
								delay (me.ping * 2 + 100);
								
							}
							
						} while (unit.getNext ());
						
					}
					
				}
			
				activeAction = false;
				break;
				
			case "END":
				end = true;
				
				activeAction = false;
				break;
				
			case "HIDE":
			case "SHOW":				
				hide = true;
				
				activeAction = false;
				break;
			
			default:
				showHooks ();
				
				for (var i = 0; i < hooks.length; i++) {
					if (hooks[i].color === 1) {
						hooks[i].color = 2;
						
					}
				}
				
				break;
		}
		
		delay (10);
		
	}
	
	return true;
	
}

// Storage override
Storage.Stash.MoveTo = function (item) {
	var i, spot, tick;

	if (Packet.itemToCursor(item)) {
		for (i = 0; i < 15; i += 1) {
			spot = Storage.Stash.FindSpot(item); // Returns inverted coords...

			if (spot) {
				// 18 [DWORD id] [DWORD xpos] [DWORD ypos] [DWORD buffer]
				sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x4);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}
	}

	return false;
};

Storage.Cube.MoveTo = function (item) {
	var i, spot, tick;

	if (Packet.itemToCursor(item)) {
		for (i = 0; i < 15; i += 1) {
			spot = Storage.Cube.FindSpot(item); // Returns inverted coords...

			if (spot) {
				// 18 [DWORD id] [DWORD xpos] [DWORD ypos] [DWORD buffer]
				sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x3);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}
	}

	return false;
};

Storage.TradeScreen.MoveTo = function (item) {
	var i, spot, tick;

	if (Packet.itemToCursor(item)) {
		for (i = 0; i < 15; i += 1) {
			spot = Storage.TradeScreen.FindSpot(item); // Returns inverted coords...

			if (spot) {
				// 18 [DWORD id] [DWORD xpos] [DWORD ypos] [DWORD buffer]
				sendPacket(1, 0x18, 4, item.gid, 4, spot.y, 4, spot.x, 4, 0x2);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(1000, me.ping * 2 + 200)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}
	}

	return false;
};
