/**
*	@filename	Enchant.js
*	@author		kolton , a gtoilet mod
*	@desc		Enchant WPS/TPS
*
*
* 	Config.Enchant.Triggers = ["chant","cows","wps","time","give gold","take gold","ng vote","andy","rada","cube","staff","amy","summoner","dury","book","trav","meph","izy","diablo"]; 
*
*
*
*/

function Enchant() {


   var command, hostile, nick, spot, tick, s, m,
      startTime = getTickCount(),
      shitList = [],
      playerLevels = {},
      chantList = [],
        countYes = 1,
        countNo = 0,   
      voted = false,
      greet = [],
	  	a1Areas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
		a2Areas = [40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74],
		a3Areas = [75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102],
		a4Areas = [103,104,105,106,107,108],
		a5Areas = [109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,135],
		i;

	this.givegold = function (nick) {
      var YesFiled = "logs/GaveGold.txt"
      var File1d = Misc.fileAction(YesFiled,0)
      var resa = File1d.match(nick, "g")
      if (resa) {
         say("!!" + nick + " I already gave you some gold...");
      }
      else
      {
         Misc.fileAction("logs/GaveGold.txt",2,""+nick+"")
         Town.move("stash");
         if (me.getStat(15) + me.getStat(12) >= 2000000) {
            say("!!Giving " + nick + " some gold");
            gold(Config.Enchant.GoldDrop)
         }
         else
         {
            say("!!Sorry " + nick + " im low on gold please bring me some");
         }
      }
   };
   
   this.Vote = function (nick,vote) {
      var YesFiled = "logs/Voted.txt"
      var File1d = Misc.fileAction(YesFiled,0)
      var resa = File1d.match(nick, "g")
      if (resa) {
         say("!!" + nick + " You have already voted...");
      }
      else
      {
            say("!!" + nick + " voted yes");
            Misc.fileAction("logs/Voted.txt",2,""+nick+"")
            if (vote === "yes") {
               countYes++;
            }
            if (vote === "no") {
               countYes++;
            }            
      }
   };
   
   this.takegold = function (nick) {
   var gold, stash1, gid1;
      gold = getUnit(4, 523);
      stash1 = getUnit(2, 267);   
        if (gold) {
           if (getDistance(me, gold) <= 30) {
            gid1 = gold.gid;
                say("!!Thanks for the gold.");
                Pickit.pickItem(gold);
                return me.getItem(-1, -1, gid1);      
                Town.move("stash");                  
            }
            else
            {
            say("!Put the gold closer to the me.");      
            }
         
         }
         else
         {
         say("!You need to drop some gold first " + nick + "");
         }
         return true;
   };

   
  this.andy = function (nick) {
		say("!starting andariel");
		Town.doChores();
		Pather.useWaypoint(35, true);
		Precast.doPrecast(true);

		if (!Pather.moveToExit([36, 37], true) || !Pather.moveTo(22582, 9612)) {
		throw new Error("andy failed");
		}
		Pather.makePortal();
		say("!theres andy");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		};
		
 this.rada = function (nick) {		
				say("!starting radament");

		var i, radaCoords, rada, radaPreset, returnSpot,
			moveIntoPos = function (unit, range) {
				var i, coordx, coordy,
					coords = [],
					angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
					angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];

				for (i = 0; i < angles.length; i += 1) {
					coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
					coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);

					try {
						if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
							coords.push({
								x: coordx,
								y: coordy
							});
						}
					} catch (e) {

					}
				}

				if (coords.length > 0) {
					coords.sort(Sort.units);

					return Pather.moveToUnit(coords[0]);
				}

				return false;
			};

		Pather.useWaypoint(48, true);
		Precast.doPrecast(false);
		Pather.moveToExit(49, true);

		radaPreset = getPresetUnit(49, 2, 355);
		radaCoords = {
			area: 49,
			x: radaPreset.roomx * 5 + radaPreset.x,
			y: radaPreset.roomy * 5 + radaPreset.y
		};

		moveIntoPos(radaCoords, 50);

		for (i = 0; i < 3; i += 1) {
			rada = getUnit(1, 229);

			if (rada) {
				break;
			}

			delay(500);
		}

		if (rada) {
			moveIntoPos(rada, 60);
		} else {
			print("radament unit not found");
		}

		Pather.makePortal();
		say("!theres rada");
		Pather.usePortal(null, null);

		return true;
	};
		
		
 this.cube = function (nick) {		
		if (me.diff === 0) {
		say("!starting cube");
		Pather.useWaypoint(57, true);
		Precast.doPrecast(true);

		if (!Pather.moveToExit(60, true) || !Pather.moveToPreset(me.area, 2, 354)) {
		throw new Error("cube failed");
		}
		say("!didnt clear portal");
		Pather.makePortal();
		delay(100);
		say("!is hot tp");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		}
		};

 this.amy = function (nick) {
		say("!starting amy");
		Town.doChores();
		Pather.useWaypoint(44, true);
		Precast.doPrecast(true);

		if (!Pather.moveToExit([45, 58, 61], true) || !Pather.moveTo(15044, 14045)) {
		throw new Error("amulet failed");
		}
		Pather.makePortal();
		if (me.diff < 2) {
		Attack.securePosition(me.x, me.y, 0, 0);
		} else {
		Attack.securePosition(me.x, me.y, 0, 0, true, true);
		}
		say("!could be hot tp");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		};

  this.staff = function (nick) {
   		say("!starting staff");
		Town.doChores();
		Pather.useWaypoint(43, true);
		Precast.doPrecast(true);

		if (!Pather.moveToExit([62, 63, 64], true) || !Pather.moveToPreset(me.area, 2, 356)) {
		throw new Error("staff failed");
		}
		say("!is hot tp");
		Pather.makePortal();		
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
   		Pather.useWaypoint(1, true);
		delay(1100);
		};
  
 this.summoner = function (nick) {
	// right up 25449 5081 (25431, 5011)
	// left up 25081 5446 (25011, 5446)
	// right down 25830 5447 (25866, 5431)
	// left down 25447 5822 (25431, 5861)
		say("!starting summoner");
		Town.doChores();
		Pather.useWaypoint(74, true);
		Precast.doPrecast(true);
		var i, journal,
		preset = getPresetUnit(me.area, 2, 357),
		spot = {};
		switch (preset.roomx * 5 + preset.x) {
		case 25011:
		spot = {x: 25081, y: 5446};
		break;
		case 25866:
		spot = {x: 25830, y: 5447};
		break;
		case 25431:
		switch (preset.roomy * 5 + preset.y) {
		case 5011:
		spot = {x: 25449, y: 5081};
		break;
		case 5861:
		spot = {x: 25447, y: 5822};
		break;}
		break;}
		if (!Pather.moveToUnit(spot)) {
		throw new Error("summoner failed");}
		Pather.makePortal();
		say("!theres summoner");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		};

 this.dury = function (nick) {
		say("!starting duriel");
		if (me.inTown) {
		Town.doChores();
		Pather.useWaypoint(46, true);}
		Precast.doPrecast(true);
		if (!Pather.moveToExit(getRoom().correcttomb, true) || !Pather.moveToPreset(me.area, 2, 152)) {
		throw new Error("duriel failed");}
		Pather.makePortal();
		say("!theres dury");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		};

 this.book = function (nick) {
		if (!Town.goToTown() || !Pather.useWaypoint(80, true)) {
			throw new Error("Lam Essen quest failed");
		}

		Precast.doPrecast(false);

		if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
			throw new Error("Lam Essen quest failed");
		}

		Pather.makePortal();
		say("!theres the book");
		Pather.usePortal(null, null);

		return true;
	};
 
    this.trav = function (nick) {
		Town.doChores();
		Pather.useWaypoint(83, true);
		Precast.doPrecast(true);

		var coords = [me.x, me.y];

		Pather.moveTo(coords[0] + 60, coords[1] - 130);
		Pather.makePortal();
		say("!theres trav");
		Pather.usePortal(null, me.name);

		return true;
	};
 
 this.meph = function (nick) {
		say("!starting meph");
		Town.doChores();
		Pather.useWaypoint(101, true);
		Precast.doPrecast(true);
		Pather.moveToExit(102, true);
		Pather.moveTo(17581, 8091);
		Pather.makePortal();
		delay(4000);
		say("!theres meph");				
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
 		};

 this.izy = function (nick) {
		say("!starting izy");
		Town.doChores();
		var i, izualCoords, izual, izualPreset, returnSpot,
		moveIntoPos = function (unit, range) {
		var i, coordx, coordy,
		coords = [],
		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
		angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 180];
		for (i = 0; i < angles.length; i += 1) {
		coordx = Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * range + unit.x);
		coordy = Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * range + unit.y);
		try {

		if (!(getCollision(unit.area, coordx, coordy) & 0x1)) {
		coords.push({
		x: coordx,
		y: coordy
		});
		}
		} catch (e) {
		}
		}

		if (coords.length > 0) {
		coords.sort(Sort.units);
		return Pather.moveToUnit(coords[0]);
		}
		return false;
		};
		Pather.useWaypoint(106, true);
		Precast.doPrecast(false);
		Pather.moveToExit(105, true);
		izualPreset = getPresetUnit(105, 1, 256);
		izualCoords = {
		area: 105,
		x: izualPreset.roomx * 5 + izualPreset.x,
		y: izualPreset.roomy * 5 + izualPreset.y
		};
		moveIntoPos(izualCoords, 50);
		for (i = 0; i < 3; i += 1) {
		izual = getUnit(1, 256);

		if (izual) {
		break;
		}
		delay(500);
		}

		if (izual) {
		moveIntoPos(izual, 60);
		} else {
		print("izual unit not found");
		}
		returnSpot = {
		x: me.x,
		y: me.y
		};
		Pather.makePortal();
		say("!could be hot tp");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
 		};
		
this.diablo = function (nick) {	
		say("!starting diablo");
		Town.doChores();
		Pather.useWaypoint(107, true);
		Precast.doPrecast(true);
		Pather.moveTo(7790, 5544);		
		Pather.makePortal();
		say("!theres star could be hot");
		Pather.usePortal(null, me.name);
        Town.move("waypoint");
		Pather.useWaypoint(1, true);
		};
this.ngvt = function () {
		say("!vote yes or no");
		Misc.fileAction("logs/Voted.txt",1,"")
		voted = true;
		countYes = 1;  
		countNo = 0;       
		delay(15000);
		this.ChkVote();
		voted = false;
		};
this.chatEvent = function (nick, msg) {
		if (nick) {
		switch (msg) {
		case "yes":
		if (voted === true) {
		this.Vote(nick,"yes");
		}
		break;
		case "no":
		if (voted === true) {
		this.Vote(nick,"no");
		}
		break;         
		}
		}
		};   

this.ChkVote = function () {
       if (countYes <= countNo) {
          say("!no won so were staying here");
        }
        else
        {
           say("!yes won going to next game in 15 seconds");
           delay(900);
			say("!hosted by gtoilet@jsp , i only join normal games");
		delay(900);
			say("!i will try to join the next game if you make it");
           delay(15000);
          Misc.fileAction("logs/Voted.txt",1,"")
           quit();
        }
   countYes = 1;  
   countNo = 0;  
    Misc.fileAction("logs/Voted.txt",1,"")
   };
   this.timeleft = function () {
         tick = Config.Enchant.GameLength * 6e4 - getTickCount() + startTime;
         m = Math.floor(tick / 60000);
         s = Math.floor((tick / 1000) % 60);
			say("!!Time left: " + (m ? m + " minute" + (m > 1 ? "s" : "") + ", " : "") + s + " second" + (s > 1 ? "s." : "."));
		delay(2200);
			say("! !vote me out before ending game or you will get shitlisted!");
		 };   this.enchant = function (nick,id) {
		if (!Misc.inMyParty(nick)) {
			say("!Accept party invite, noob.");

			return false;
		}

		var partyUnit,
			unit = getUnit(0, nick);

		if (getDistance(me, unit) > 0) {
           say("!You need to be at a WP or any other TP.");

			return false;
		}

		if (!unit) {
			partyUnit = getParty(nick);

			// wait until party area is readable?

if ([3,4,5,6,27,29,32,35,48,42,57,43,44,52,74,46,76,77,78,79,80,81,83,101,106,107,111,112,113,115,123,117,118,129].indexOf(partyUnit.area) > -1) { // Only meet someone at a Waypoint
   say("!Stay Near Waypoint.");

   Pather.useWaypoint(partyUnit.area); // Go to the Waypoint in their area.

				unit = getUnit(0, nick);
			} else {
if ([2,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,30,31,33,34,36,37,38,39,40,41,42,43,45,47,48,49,50,51,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,75,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,102,104,105,108110,116,119,120,121,122,123,124,125,126,127,128,130,131,132,133,134,135,].indexOf(partyUnit.area) > -1) { // Only meet someone at a tp if they are in one of these areas.
   say("!Stay Near portal.");
				if (a1Areas.indexOf(id) > -1 && a1Areas.indexOf(me.area) == -1) Town.goToTown(1);
				if (a2Areas.indexOf(id) > -1 && a2Areas.indexOf(me.area) == -1) Town.goToTown(2);
				if (a3Areas.indexOf(id) > -1 && a3Areas.indexOf(me.area) == -1) Town.goToTown(3);
				if (a4Areas.indexOf(id) > -1 && a4Areas.indexOf(me.area) == -1) Town.goToTown(4);
				if (a5Areas.indexOf(id) > -1 && a5Areas.indexOf(me.area) == -1) Town.goToTown(5);
				if (me.area != 1 && me.area != 40 && me.area != 75 && me.area != 103 && me.area != 109) Town.goToTown();
				Town.move("portalspot");
				if (Pather.getPortal(id,nick)) Pather.usePortal(id,nick);
				else say("!Do you have a tp up?");
				unit = getUnit(0, nick);
				}
		}	
		}

		if (unit) {
			do {
				if (!unit.dead) { // player is alive
					if (getDistance(me, unit) >= 44) {
						say("!You went too far away.");

						return false;
					}

					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		} else {
			say("!Couldn't find you, champ.");
		}

		unit = getUnit(1);

		if (unit) {
			do {
				if (unit.getParent() && unit.getParent().name === nick) { // merc or any other owned unit
					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}
Pather.usePortal(null, null);
delay(50);
Pather.useWaypoint(1, true);
	return true;
	};

	this.autoChant = function () {
		var unit,
			chanted = [];

		// Player
		unit = getUnit(0);

		if (unit) {
			do {
				if (unit.name !== me.name && !unit.dead && shitList.indexOf(unit.name) === -1 && Misc.inMyParty(unit.name) && !unit.getState(16) && getDistance(me, unit) <= 40) {
					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
					chanted.push(unit.name);
				}
			} while (unit.getNext());
		}

		// Minion
		unit = getUnit(1);

		if (unit) {
			do {
				if (unit.getParent() && chanted.indexOf(unit.getParent().name) > -1 && !unit.getState(16) && getDistance(me, unit) <= 40) {
					Skill.setSkill(52, 0);
					sendPacket(1, 0x11, 4, unit.type, 4, unit.gid);
					delay(500);
				}
			} while (unit.getNext());
		}

		return true;
	};

	this.getLeg = function () {
		var i, portal, wirt, leg, gid, wrongLeg;

		if (me.getItem(88)) {
			return me.getItem(88);
		}

		if (!Config.Enchant.GetLeg) {
			leg = getUnit(4, 88);

			if (leg) {
				do {
					if (leg.name.indexOf("�c1") > -1) {
						wrongLeg = true;
					} else if (getDistance(me, leg) <= 22) {
						gid = leg.gid;

						Pickit.pickItem(leg);

						return me.getItem(-1, -1, gid);
					}
				} while (leg.getNext());
			}

			say("!Bring the leg " + (wrongLeg ? "from this difficulty" : "") + " close to me.");

			return false;
		}

		Pather.useWaypoint(4);
		Precast.doPrecast(true);
		Pather.moveToPreset(me.area, 1, 737, 8, 8);

		for (i = 0; i < 6; i += 1) {
			portal = Pather.getPortal(38);

			if (portal) {
				Pather.usePortal(null, null, portal);

				break;
			}

			delay(500);
		}

		if (!portal) {
			say("!Failed to enter Tristram :(");
			Town.goToTown();

			return false;
		}

		Pather.moveTo(25048, 5177);

		wirt = getUnit(2, 268);

		for (i = 0; i < 8; i += 1) {
			wirt.interact();
			delay(500);

			leg = getUnit(4, 88);

			if (leg) {
				gid = leg.gid;

				Pickit.pickItem(leg);
				Town.goToTown();

				return me.getItem(-1, -1, gid);
			}
		}

		Town.goToTown();
		say("!Failed to get the leg :(");

		return false;
	};

	this.getTome = function () {
		var tome, akara, myTome;

		myTome = me.findItem("tbk", 0, 3);
		tome = me.getItem("tbk");

		// In case of 2 tomes or tome stuck in cube
		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}

		Town.move("akara");

		akara = getUnit(1, NPC.Akara);

		if (!akara || akara.area !== me.area || getDistance(me, akara) > 30) {
			say("!Akara not found.");

			return false;
		}

		myTome = me.findItem("tbk", 0, 3);
		tome = me.getItem("tbk");

		if (tome) {
			do {
				if (!myTome || tome.gid !== myTome.gid) {
					return copyUnit(tome);
				}
			} while (tome.getNext());
		}

		akara = Town.initNPC("Shop");

		if (!akara) {
			say("!Failed to buy tome :(");

			return false;
		}

		tome = akara.getItem("tbk");

		if (tome.buy()) {
			tome = me.getItem("tbk");

			if (tome) {
				do {
					if (!myTome || tome.gid !== myTome.gid) {
						return copyUnit(tome);
					}
				} while (tome.getNext());
			}
		}

		return false;
	};

	this.openPortal = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("!Accept party invite, noob.");

			return true;
		}

		if (Pather.getPortal(39)) {
			say("!Cow portal already open.");

			return true;
		}

		if (me.getQuest(4, 10)) { // king dead or cain not saved
			say("!Can't open the portal because I killed Cow King.");

			return false;
		}

		if (Config.Enchant.GetLeg && !me.getQuest(4, 0)) {
			say("!Can't get leg because I don't have Cain quest.");

			return false;
		}

		switch (me.gametype) {
		case 0: // classic
			if (!me.getQuest(26, 0)) { // diablo not completed
				say("!I don't have Diablo quest.");

				return false;
			}

			break;
		case 1: // expansion
			if (!me.getQuest(40, 0)) { // baal not completed
				say("!I don't have Baal quest.");

				return false;
			}

			break;
		}

		var i, leg, tome;

		leg = this.getLeg();

		if (!leg) {
			return false;
		}

		tome = this.getTome();

		if (!tome) {
			return false;
		}

		if (!Town.move("waypoint") || !Cubing.emptyCube() || !Storage.Cube.MoveTo(leg) || !Storage.Cube.MoveTo(tome) || !Cubing.openCube()) {
			return false;
		}

		transmute();
		delay(500);

		for (i = 0; i < 10; i += 1) {
			if (Pather.getPortal(39)) {
				return true;
			}

			delay(200);
		}

		say("!Failed to open cow portal.");

		return false;
	};

	this.getWpNick = function (nick) {
		if (!this.wpNicks) {
			this.wpNicks = {};
		}

		if (this.wpNicks.hasOwnProperty(nick)) {
			if (this.wpNicks[nick].requests > 4) {
				return "maxrequests";
			}

			if (getTickCount() - this.wpNicks[nick].timer < 60000) {
				return "mintime";
			}

			return true;
		}

		return false;
	};

	this.addWpNick = function (nick) {
		this.wpNicks[nick] = {timer: getTickCount(), requests: 0};
	};

	this.giveWps = function (nick) {
		if (!Misc.inMyParty(nick)) {
			say("!Accept party invite, noob.");

			return false;
		}

		var i, act, timeout, wpList;

		switch (this.getWpNick(nick)) {
		case "maxrequests":
			say(nick + ", you have spent all your waypoint requests for this game.");

			return false;
		case "mintime":
			say(nick + ", you may request waypoints every 60 seconds.");

			return false;
		case false:
			this.addWpNick(nick);

			break;
		}

		act = this.getPlayerAct(nick);

		switch (act) {
		case 1:
			wpList = [4,5,35];

			break;
		case 2:
			wpList = [48,57,43,44,74,46];

			break;
		case 3:
			wpList = [83,101];

			break;
		case 4:
			wpList = [107];

			break;
		case 5:
			wpList = [111,112,113,115,123,117,118,129];

			break;			
		}

MainLoop:
		for (i = 0; i < wpList.length; i += 1) {
			if (this.checkHostiles()) {
				break;
			}

			try {
				Pather.useWaypoint(wpList[i], true);
				Pather.makePortal();
				say(getArea().name + " ");

				for (timeout = 0; timeout < 20; timeout += 1) {
					if (getUnit(0, nick)) {
						break;
					}

					delay(1000);
				}

				if (timeout >= 20) {
					say("!Aborting wp giving.");
Pather.useWaypoint(1, true);

					break MainLoop;
				}

				delay(5000);
			} catch (error) {

			}
		}
Pather.useWaypoint(1, true);

		Town.doChores();
		Town.goToTown(1);
		Town.move("waypoint");
Pather.useWaypoint(1, true);
 				delay(1100);
Pather.useWaypoint(35, true);
Pather.makePortal();
Pather.useWaypoint(1, true);		
this.wpNicks[nick].requests += 1;
		this.wpNicks[nick].timer = getTickCount();

		return true;
	};

	this.getPlayerAct = function (name) {
		var unit = getParty();

		if (unit) {
			do {
				if (unit.name === name) {
					if (unit.area <= 39) {
						return 1;
					}

					if (unit.area >= 40 && unit.area <= 74) {
						return 2;
					}

					if (unit.area >= 75 && unit.area <= 102) {
						return 3;
					}

					if (unit.area >= 103 && unit.area <= 108) {
						return 4;
					}
					if (unit.area >= 109 && unit.area <= 136) {
						return 5;
					}
					return 6;
				}
			} while (unit.getNext());
		}

		return false;
	};

	this.checkHostiles = function () {
		var rval = false,
			party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && getPlayerFlag(me.gid, party.gid, 8)) {
					rval = true;

					if (Config.ShitList && shitList.indexOf(party.name) === -1) {
						shitList.push(party.name);
					}
				}
			} while (party.getNext());
		}

		return rval;
	};

	this.floodCheck = function (command) {
		var cmd = command[0],
			nick = command[1];

		if ([	"help", "timeleft",
				Config.Enchant.Triggers[0].toLowerCase(),
				Config.Enchant.Triggers[1].toLowerCase(),
				Config.Enchant.Triggers[2].toLowerCase()
				].indexOf(cmd.toLowerCase()) === -1) {
			return false;
		}

		if (!this.cmdNicks) {
			this.cmdNicks = {};
		}

		if (!this.cmdNicks.hasOwnProperty(nick)) {
			this.cmdNicks[nick] = {
				firstCmd: getTickCount(),
				commands: 0,
				ignored: false
			};
		}

		if (this.cmdNicks[nick].ignored) {
			if (getTickCount() - this.cmdNicks[nick].ignored < 60000) {
				return true; // ignore flooder
			}

			// unignore flooder
			this.cmdNicks[nick].ignored = false;
			this.cmdNicks[nick].commands = 0;
		}

		this.cmdNicks[nick].commands += 1;

		if (getTickCount() - this.cmdNicks[nick].firstCmd < 10000) {
			if (this.cmdNicks[nick].commands > 5) {
				this.cmdNicks[nick].ignored = getTickCount();

				say(nick + ", you are being ignored for 60 seconds because of flooding.");
			}
		} else {
			this.cmdNicks[nick].firstCmd = getTickCount();
			this.cmdNicks[nick].commands = 0;
		}

		return false;
	};

	function ChatEvent(nick, msg) {
		command = [msg, nick];
	}

	function GreetEvent(mode, param1, param2, name1, name2) {
		switch (mode) {
		case 0x02:
			if (me.inTown && me.mode === 5) { // idle in town
				greet.push(name1);
			}

			break;
		}
	}

	// START
	if (Config.ShitList) {
		shitList = ShitList.read();
	}

	addEventListener("chatmsg", ChatEvent);
	addEventListener("gameevent", GreetEvent);
	Town.doChores();
	Town.goToTown(1);
	Town.move("waypoint");
    Pather.useWaypoint(35);
	Pather.makePortal();
    Pather.useWaypoint(1);
	
	spot = {
		x: me.x,
		y: me.y
	};

	while (true) {
		while (greet.length > 0) {
			nick  = greet.shift();

			if (shitList.indexOf(nick) === -1) {
				//say("!Welcome! For a list of commands say 'help' ");
			}
		}

		if (spot && getDistance(me, spot) > 10) {
			Pather.moveTo(spot.x, spot.y);
		}

		if (command && !this.floodCheck(command)) {
			switch (command[0].toLowerCase()) {
			case "help":
				this.checkHostiles();

				if (shitList.indexOf(command[1]) > -1) {
					say("!No " + command[0] + " for the shitlisted.");

					break;
				}

				say("" +
                  (Config.Enchant.Triggers[0] ? " | chant: " + Config.Enchant.Triggers[0] : "") +
                  (Config.Enchant.Triggers[1] ? " | cows: " + Config.Enchant.Triggers[1] : "") +
                  (Config.Enchant.Triggers[2] ? " | wps: " + Config.Enchant.Triggers[2] : "") +
                  (Config.Enchant.Triggers[3] ? " | time left: " + Config.Enchant.Triggers[3] : "") +
                  (Config.Enchant.Triggers[4] ? " | GiveGold: " + Config.Enchant.Triggers[4] : ""));
     				delay(333);
				say(" " + 
				  (Config.Enchant.Triggers[5] ? " | TakeGold: " + Config.Enchant.Triggers[5] : "") +
                  (Config.Enchant.Triggers[6] ? " | ngvote: " + Config.Enchant.Triggers[6] : "")  +
                  (Config.Enchant.Triggers[7] ? " | andy: " + Config.Enchant.Triggers[7] : "")  +
                  (Config.Enchant.Triggers[8] ? " | rada: " + Config.Enchant.Triggers[8] : "")  +
                  (Config.Enchant.Triggers[9] ? " | cube: " + Config.Enchant.Triggers[9] : ""));
 				delay(3333);
				say(" " +  
                  (Config.Enchant.Triggers[10] ? " | staff: " + Config.Enchant.Triggers[10] : "")  +
                  (Config.Enchant.Triggers[11] ? " | amy: " + Config.Enchant.Triggers[11] : "")  +
                  (Config.Enchant.Triggers[12] ? " | summoner: " + Config.Enchant.Triggers[12] : "")  +
                  (Config.Enchant.Triggers[13] ? " | dury: " + Config.Enchant.Triggers[13] : "")  +
                  (Config.Enchant.Triggers[14] ? " | book: " + Config.Enchant.Triggers[14] : ""));
  				delay(3333);
                say(" " + 
    			  (Config.Enchant.Triggers[15] ? " | trav: " + Config.Enchant.Triggers[15] : "")  +
                  (Config.Enchant.Triggers[16] ? " | meph: " + Config.Enchant.Triggers[16] : "")  +
                  (Config.Enchant.Triggers[17] ? " | izy: " + Config.Enchant.Triggers[17] : "")  +
                  (Config.Enchant.Triggers[18] ? " | diablo: " + Config.Enchant.Triggers[18] : ""));

            if (Config.Enchant.AutoChant) {
               say("!Auto enchant is ON");
            }

            break;
         case Config.Enchant.Triggers[0].toLowerCase(): // chant
            this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!No chant for the shitlisted.");

               break;
            }

            this.enchant(command[1]);

            break;
         case Config.Enchant.Triggers[1].toLowerCase(): // cows
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!No cows for the shitlisted.");

               break;
            }

            this.openPortal(command[1]);
            me.cancel();

            break;
         case Config.Enchant.Triggers[2].toLowerCase(): // wps
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!No waypoints for the shitlisted.");

               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.giveWps(command[1]);

            break;
         case Config.Enchant.Triggers[3].toLowerCase(): // timeleft
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!Fk to time.");

               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.timeleft(command[1]);

            break;            
         case Config.Enchant.Triggers[4].toLowerCase(): // givegold
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!much appreciated.");
               this.givegold(command[1]);
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.givegold(command[1]);

            break;            
           
         case Config.Enchant.Triggers[5].toLowerCase(): // takegold
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!much appreciated.");
               this.takegold(command[1]);
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.takegold(command[1]);

            break;            
         case Config.Enchant.Triggers[6].toLowerCase(): // ngvote
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!You wish...");

               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }
            if (getTickCount() - me.gamestarttime >= Config.Enchant.NGVLength * 6e4) {
               this.ngvt(command[1]);
               break;   
            }
            else
            {
               say("!Wait a little more!");
               break;
            }

            break;      
 

 case Config.Enchant.Triggers[7].toLowerCase(): // andy
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.andy(command[1]);

            break; 


 case Config.Enchant.Triggers[8].toLowerCase(): // rada
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.rada(command[1]);

            break; 

			
 case Config.Enchant.Triggers[9].toLowerCase(): // cube
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.cube(command[1]);

            break; 			
  case Config.Enchant.Triggers[10].toLowerCase(): // staff
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.staff(command[1]);

            break; 
 case Config.Enchant.Triggers[11].toLowerCase(): // amy
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.amy(command[1]);

            break; 
 case Config.Enchant.Triggers[12].toLowerCase(): // summoner
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.summoner(command[1]);

            break; 
 case Config.Enchant.Triggers[13].toLowerCase(): // dury
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.dury(command[1]);

            break; 
 case Config.Enchant.Triggers[14].toLowerCase(): // book
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.book(command[1]);

            break; 			
 case Config.Enchant.Triggers[15].toLowerCase(): // trav
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.trav(command[1]);

            break; 
 case Config.Enchant.Triggers[16].toLowerCase(): // meph
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.meph(command[1]);

            break; 
 case Config.Enchant.Triggers[17].toLowerCase(): // izy
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.izy(command[1]);

            break; 
 case Config.Enchant.Triggers[18].toLowerCase(): // diablo
            hostile = this.checkHostiles();

            if (shitList.indexOf(command[1]) > -1) {
               say("!zzz...");
               break;
            }

            if (hostile) {
               say("!Command disabled because of hostiles.");

               break;
            }

            this.diablo(command[1]);

            break; 			
			
			
 
   }
      }

      command = "";

		if (me.act > 1) {
			Town.goToTown(1);
		}

		if (Config.Enchant.AutoChant) {
			this.autoChant();
		}

		if (getTickCount() - startTime >= Config.Enchant.GameLength * 6e4) {
			say("!hosted by gtoilet@jsp , i only join normal games");
		delay(200);
			say("!i will try to join the next game if you make it");

		delay(20000);

			break;
		}

		delay(200);
	}

	return true;
}
