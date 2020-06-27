/**
*       @filename       ActFiveTravel.js
*       @author         dzik
*/
 
function ActFiveTravel() {
        var i, activeAction, item, items, wpgid,
                hooks = [];
		addEventListener("chatmsg",		
			function onMsg(nick, msg) {
				if (msg)
					wpgid = msg.split("A5WP ")[1];
			}
		);
		 
        function hookHandler(click, x, y) {
                // Get the hook closest to the clicked location
                function sortHooks(h1, h2) {
                        return Math.abs(h1.y - y) - Math.abs(h2.y - y);
                }
 
                if (click === 0) { // Left click
                        // Sort hooks
                        hooks.sort(sortHooks);
 
                        switch (hooks[0].text) {
                        case "Act Five Travel:":
                                return true; // Do nothing
                        default:
                                // Don't start new action until the current one finishes
                                if (activeAction && activeAction !== hooks[0].text) {
                                        return true;
                                }
 
                                // Toggle current action on/off
                                activeAction = activeAction ? false : hooks[0].text;
 
                                break;
                        }
 
                        hooks[0].color = hooks[0].color === 2 ? 1 : 2;
 
                        return true; // Block click
                }
 
                return false;
        }
 
        function sortPickList(a, b) { // Sort items by size to pick biggest first
                if (b.sizex === a.sizex && b.sizey === a.sizey) { // Same size -  sort by distance
                        return getDistance(me, a) - getDistance(me, b);
                }
 
                return b.sizex * b.sizey - a.sizex * a.sizey;
        }
		
		var	infoBG 		= new Box	(10, 380, 170, 100, 0, 0.2),
			infoFrame	= new Frame	(10, 380, 170, 100);
 
        hooks.push(new Text("Act Five Travel:", 25, 405, 8, 1, 0, false, hookHandler));
        hooks.push(new Text("Share A5 WP", 25, 410 + hooks.length * 17, 2, 1, 0, false, hookHandler));
        hooks.push(new Text("Get A5 WP", 25, 410 + hooks.length * 17, 2, 1, 0, false, hookHandler));
        hooks.push(new Text("Travel to A5", 25, 410 + hooks.length * 17, 2, 1, 0, false, hookHandler));
 
        while (true) {
                switch (activeAction) {
                case "Share A5 WP":
                        Town.move("Waypoint");
						Pather.useWaypoint(109);
						
						while (!me.area) delay(100);
						
						if (me.act === 5) {
							say("A5WP " + getUnit(2, "Waypoint").gid);
						}						
						
                        activeAction = false;
						
						break;
						
                case "Get A5 WP":
						if (!wpgid) {
							print("we dont have wp GID. Can't access A5");
							activeAction = false;
							break;
						}
						
						Town.goToTown(2);
						Town.move("stash");
						Pather.moveTo(5116,5067,5); 
						
						while (!getUIFlag(0x14)) {
							sendPacket(1, 0x13, 4, 0x2, 4, parseInt(wpgid));
							delay(1000);
						}		
						
						while (getUIFlag(0x14)) {
							me.cancel();
						}
						
						Pather.useWaypoint(109);
						
						if (me.area == 109)	
							say("Welcome in A5");
						
                        activeAction = false;
 
                        break;
						
                case "Travel to A5":
                        Town.goToTown();
						Pather.useWaypoint(109);
						
                        activeAction = false;
 
                        break;
                default:
                        for (i = 0; i < hooks.length; i += 1) {
                                if (hooks[i].color === 1) {
                                        hooks[i].color = 2;
                                }
                        }
 
                        break;
                }
 
                delay(100);
        }
}
