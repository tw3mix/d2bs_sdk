/*
*   @filename   DupeRerollRare.js
*   @author      Walla + Kolbot + maulepan
*/
var helper = Config.DupeRerollRare.Helper;
var baseid = Config.DupeRerollRare.Classid;
var i, k, j, items, npc, tick, trader, wp, allitems, string, newitem, result;
var end = false;
var list = [];
var blockStatus = false, dropInventory = false, tradeAccepted = false;


var Dupe = new function() {

   this.PacketReceived = function(bytes) {
      switch(bytes[0]) {
         case 0x78:
            tradeAccepted = true;
         break;
      }
   };

   this.PacketSent = function(bytes) {
      switch (bytes[0]) {
         case 0x30:
            if (blockStatus) {
               print("[Blocked] 0x30");
               return true;
            }
         break;
      }
      
      return false;
   };
   
   addEventListener("gamepacket", this.PacketReceived);
   addEventListener("gamepacketsent", this.PacketSent);
   
   // Check act
   if (me.area !== 40) {
      print("Not in act 2. Changing acts.");
      if (me.area !== 1) {
         Pather.useWaypoint(1);
      }
      Town.move("warriv");
      npc = getUnit(1, "warriv");
      if (!npc || !npc.openMenu()) {
         showConsole();
         throw new Error("Act change failed.");
         return false;
      }
      Misc.useMenu(0x0D36);
      delay(1000 + me.ping * 2);
      while (!me.area) {
         delay(250);
      }
      if (me.area !== 40) {
         showConsole();
         throw new Error("Act change failed.");
         return false;
      }
      print("Act change done.");
   }
   
   // Start blocking 0x30
   blockStatus = true;
   // Wait to begin
   delay(2000);
   Town.move("jerhyn");
   npc = getUnit(1, "jerhyn");
   if (!npc || !npc.openMenu()) {
      showConsole();
      throw new Error("Couldn't access Jerhyn.");
      return false;
   }
   delay(200);
   me.cancel();
   delay(50);
   // Stop blocking 0x30
   blockStatus = false;
   Town.move("waypoint");
   delay(200);
   wp = getUnit(2, "waypoint");
   if (!wp) {
      print("Couldn't reach waypoint.");
   }
   sendPacket(1, 0x49, 4, wp.gid, 1, 0, 1, 0, 1, 0, 1, 0);
   delay(200);
   
   tick = getTickCount();
   do {
      trader = getUnit(0, helper);
      // If Helper can't be found in 15s, leave.
      if (getTickCount() - tick >= 15000) {
         print("Couldn't find Helper.");
      }
      delay(100);
   } while (!trader);
   while (!getUIFlag(0x17)) {
      trader.interact();
      delay(250);
   }
   while (!(getUIFlag(0x17) && tradeAccepted)) {
      delay(100);
   }
   tradeAccepted = false;
   delay(100);
   // Close trade window
   getPacket(1, 0x77, 1, 0x0C);
   delay(100);
   
   // Move out of town.
   Pather.journeyTo(41);
   delay(50);
   // Move back to town.
   Pather.journeyTo(40);
   delay(50);
   
   Town.move("waypoint");
   Pather.useWaypoint(1);
   Town.move("stash");
   delay(200);
   
   // Drop items
	while (!end) {
		allitems = me.findItems(-1, 0); // get all items
		list = []; //empty list	
		
			for (k = 0; k < allitems.length; k += 1) { // search for a rare item
					if (allitems[k].classid === baseid) { // find a rare item 
						list.push(allitems[k]); // push into the item list
						break; // stop searching
					}
				}
			for (k = 0; k < allitems.length; k += 1) { // search for a ring
					if (allitems[k].classid === 522) { // find a ring 
						list.push(allitems[k]); // push into the item list
						break; // stop searching
					}
				}
			for (k = 0; k < allitems.length; k += 1) { // search for a perf skull
					if (allitems[k].classid === 601) { // find a perf skull 
						list.push(allitems[k]); // push into the item list
						break; // stop searching
					}
				}
		if(list.length == 3) {
					// If cube isn't open, attempt to open stash (the function returns true if stash is already open)
				if ((!getUIFlag(0x1a) && !Town.openStash()) || !emptyCube()) {
					print("could not open stash");
				}

				i = -1;

				while (list.length) {
					string += (list[0].name + (list.length > 1 ? " + " : ""));
					Storage.Cube.MoveTo(list[0]);
					list.shift();
				}

				if (!this.openCube()) {
					print("could not open stash");
				}

				transmute();
				delay(700 + me.ping);
				print("ÿc4Cubing: " + string);
				D2Bot.printToConsole(string + ";5");

				newitem = me.findItems(-1, -1, 6);

				if (newitem) {
					for (j = 0; j < newitem.length; j += 1) {
						result = Pickit.checkItem(newitem[j]);

						switch (result.result) {
						case 0:
							Misc.logItem("New kept", newitem[j]);
							break;
						case 1:
							Misc.logItem("Cubing kept", newitem[j], result.line);
							newitem[j].drop();
							break;
						}
					}
				}

				if (!this.emptyCube()) {
					break;
				}
   
		}
		else {
		end = true;
		}
	}

   delay(200);
   say("closetrade");
   
   
   
   
   
   
   // Go back to act 2 for a perm.
   Town.move("waypoint");
   delay(200);
   Pather.useWaypoint(40);
   say("permout");
   delay(200);
   trader = getUnit(0, helper);
   while (!getUIFlag(0x17)) {
      trader.interact();
      delay(250);
   }
   while (!(getUIFlag(0x17) && tradeAccepted)) {
      delay(100);
   }
   tradeAccepted = false;
   me.cancel();
   delay(50);
   quit();
   
   return true;
}
function openCube() {
		var p, tick,
			cube = me.getItem(549);

		if (!cube) {
			return false;
		}

		for (p = 0; p < 3; p += 1) {
			cube.interact();

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				if (getUIFlag(0x1A)) {
					delay(500);

					return true;
				}

				delay(10);
			}
		}

		return false;
	}
function emptyCube() {
		var cube = me.getItem(549),
			citems = me.findItems(-1, -1, 6);

		if (!cube) {
			return false;
		}

		if (!citems) {
			return true;
		}

		while (citems.length) {
			if (Storage.Inventory.CanFit(citems[0])) {
				Storage.Inventory.MoveTo(citems[0]);
			} else {
				return false;
			}

			citems.shift();
		}

		return true;
	}
