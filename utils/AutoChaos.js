/**
*        @filename        AutoChaos.js
*        @author          noah-@github.com
*        @desc            AutoChaos is an anonymous Team CS script without any explicit in-game communication.
*                         This script is designed for running Classic Taxi CS.
*        @link            https://gist.github.com/noah-/2685fbeccc72fd595bbe89116aea272e
*/

/*
1.Naviagte to ..\kolbot\libs\Bots\
	Place AutoChaos.js in this folder

2.Naviagte to ..\kolbot\libs\Common\
	Open the file Config.js
	Near the end but before the last brace add the following lines:

    AutoChaos: {
        Leader: "",
        Diablo: 0,
        Taxi: false,
        FindShrine: false,
        UseShrine: false,
        Glitcher: false,
        BO: false,
        Leech: false,
        Ranged: false,
        RequireClass: [false, false, false, false, false, false, false],
        SealPrecast: false,
        PreAttack: [0, 0, 0],
        SealOrder: [1, 2, 3],
        SealDelay: 0
    }

3.For each of your char configs:
	For char config that will run AutoChaos.js
	Add the following lines:

	// AutoChaos script by noah-@github.com, an anonymous Team CS script without explicit in-game communication
	// Requires at least 1 Sorceress, 1 Barbarian, and 1 Paladin (intended for Classic CS)
	Scripts.AutoChaos = false;
	   Config.AutoChaos.RequireClass = [false, false, false, true, true, false, false]; // set true to require ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"]
	   Config.AutoChaos.Taxi = false;
	   Config.AutoChaos.FindShrine = false; // set true to search for shrine only
	   Config.AutoChaos.Glitcher = false; // set true for low level EXP glitcher (unimplemented)
	   Config.AutoChaos.SealOrder = [1, 2, 3]; // order in which the taxi will go through cs, 1: vizier, 2: seis, 3: infector
	   Config.AutoChaos.PreAttack = [0, 0, 0]; // preattack count at each seal, useful for clearing tp's for safer entry, enter values in the following order: [/vizier/, /seis/, /infector/] 
	   Config.AutoChaos.Diablo = 0; // -1 = go to town during diablo, 0 = kill to death, x > 0 = kill to x%
	   Config.AutoChaos.UseShrine = false; // true = get shrine from act 1 (requires another character running FindShrine)
	   Config.AutoChaos.Leech = false; // true = hide during diablo, false = stay at star
	   Config.AutoChaos.Ranged = false; // true = ranged character, false = melee character 
	   Config.AutoChaos.BO = false; // true = don't enter seals after boing at river, false = normal character that fights
	   Config.AutoChaos.SealPrecast = false; // true = does precast sequence at every seal, false = does not precast at seal
	   Config.AutoChaos.SealDelay = 0; // number of seconds to wait before entering hot tp

*/

function AutoChaos() {
	this.taxi = "";
	this.tpID = 0;
	this.lastCall = 0;
	this.lastUpdate = 0;

	this.setTaxi = function () {
		if (Config.AutoChaos.Leader !== "" && getParty(Config.AutoChaos.Leader)) {
			this.taxi = Config.AutoChaos.Leader;
		} else if (this.taxi === "" || !getParty(this.taxi)) {
			this.taxi = this.detectTaxi();
		}
	};

	this.detectTaxi = function () {
		var player = getParty(),
			current = this.taxi,
			lvl = 0, tick;

		if (!player) {
			return current;
		}

		do {
			if (player.name !== me.name && player.classid === 1 && lvl < player.level) {
				tick = getTickCount();

				while (player.area === 0 && getTickCount() - tick < 5000) {
					delay(100);
				}

				if (player.area !== 0 && player.area < 103) {
					continue;
				}

				current = player.name;
				lvl = player.level;

				if (Pather.getPortal(108, current) && !Pather.getPortal(108, player.name)) {
					break;
				}
			}
		} while (player.getNext());

		return current;
	};

	this.doNext = function () {
		var portal, gid, tick;

		if (this.taxi === "" || (this.lastCall >= 3 && Config.AutoChaos.Diablo === -1)) {
			Town.doChores();
			return true;
		}

		if (this.lastCall >= 3 && Config.AutoChaos.UseShrine) {
			Town.goToTown(1);
			Town.move("portalspot");

			if ((portal = Pather.getPortal(4, null)) ||
				(portal = Pather.getPortal(3, null)) ||
				(portal = Pather.getPortal(2, null))) {
				Pather.usePortal(null, null, portal);
				this.getShrine(15, 8, 10);

				if (!Pather.usePortal(1, null)) {
					Town.goToTown();
				}
			}

			Pather.useWaypoint(103, true);
			Town.move("portalspot");
			Config.AutoChaos.UseShrine = false;
		}

		portal = Pather.getPortal(null, this.taxi);

		if (!portal || portal.gid === this.tpID) {
			tick = getTickCount();

			if (this.lastCall < 3 && (tick - this.lastUpdate) > 10000) {
				this.taxi = "";
				this.lastUpdate = tick;
			}

			return true;
		}

		gid = portal.gid;

		if (Config.AutoChaos.BO && portal.objtype !== 107) {
			return true;
		}

		if (Config.AutoChaos.SealDelay) {
			delay(Config.AutoChaos.SealDelay * 1000);
		}

		if (!Pather.usePortal(null, null, portal)) {
			return true;
		}

		this.tpID = gid;
		this.lastUpdate = getTickCount();

		if (me.area === 107) {
			this.precast();
		} else if (me.area === 108) {
			if (Config.AutoChaos.SealPrecast) {
				Precast.doPrecast(true);
			}

			if (Layout.sealDistance(396) < 60) {
				this.vizier();
			} else if (Layout.sealDistance(392) < 60) {
				this.infector();
			} else if (Layout.sealDistance(394) < 80) {
				this.seis();
			} else if (getDistance(me, 7795, 5293) < 30) {
				this.diablo();
				return false;
			} else {
				notify("", "I should not be here...");
			}
		}

		Town.goToTown();
		return true;
	};

	this.waitForParty = function (area = 0) {
		var party,
			time = getTickCount(),
			classes = Config.AutoChaos.RequireClass.slice();

		while (classes.indexOf(true) >= 0 && (getTickCount() - time < 25000)) {
			party = getParty();

			if (party) {
				do {
					if (classes[party.classid] && party.level >= 30) {
						if (area > 0 && party.area !== me.area) {
							time = getTickCount();
							continue;
						}

						classes[party.classid] = false;
					}
				} while (party.getNext());
			}

			delay(250);
		}

		if (classes.indexOf(true) >= 0) {
			throw new Error(notify("Not enough players."));
		}
	};

	this.precast = function () {
		var sorc = getParty(this.taxi);

		while (sorc && sorc.area !== 108 && (!me.getState(32) || getUnit(0, this.taxi))) {
			Precast.doPrecast(true);
			delay(500);
		}

		if (!Pather.usePortal(null, this.taxi)) {
			Pather.useWaypoint(103, true);
		}

		if (Town.needHealing() || (Town.checkScrolls("tbk") < 10)) {
			Town.doChores();
		}

		Town.move("portalspot");
	};

	this.getShrine = function (type, distance, retry) {
		var shrine = getUnit(2);

		if (!shrine) {
			return;
		}

		do {
			if (getDistance(me.x, me.y, shrine.x, shrine.y) < distance && shrine.objtype == type) {
				while (retry-- > 0) {
					if (Misc.getShrine(shrine)) {
						break;
					}
				}

				return;
			}
		} while (shrine.getNext());
	};

	this.sealDelay = function () {
		if (!Config.AutoChaos.SealDelay) {
			return;
		}

		var time = Config.AutoChaos.SealDelay * 1000 + getTickCount();
		var loc = { x: me.x, y: me.y };

		while (getTickCount() < time) {
			if (me.inTown) {
				delay(Config.AutoChaos.SealDelay * 1000);
			} else {
				this.doPreattack(loc);
			}
		}
	};

	this.clearOut = function () {
		Pickit.pickItems();
		Town.goToTown();
		this.lastCall += 1;
		Town.move("portalspot");
	};

	this.vizier = function () {
		this.slayBoss(2851, Config.AutoChaos.PreAttack[0], 20);
		this.clearOut();
	};

	this.seis = function () {
		this.slayBoss(2852, Config.AutoChaos.PreAttack[1], 30);
		this.clearOut();
	};

	this.infector = function () {
		this.slayBoss(2853, Config.AutoChaos.PreAttack[2], 20);
		this.clearOut();
	};

	this.taxiInit = function (amount = 0) {
		if (amount > 0) {
			delay(amount);
		}

		var pos = { x: me.x, y: me.y },
			time = getTickCount(),
			count = time;

		Precast.doPrecast();

		while (!me.getState(32)) {
			if (getTickCount() - count > 5000) {
				count = getTickCount();
				Pather.moveTo(pos.x + rand(-4, 4), pos.y + rand(-4, 4));
			}

			if (getTickCount() - time > 50000) {
				print("Game timed out.");
				return false;
			}

			delay(100);
		}

		return true;
	};

	this.taxiVizier = function (last) {
		var viz = (Layout.vizier() === 1) ? { x: 7683, y: 5302 } : { x: 7687, y: 5315 };

		Pather.moveTo(viz.x, viz.y);
		Pather.makePortal(false);
		Layout.openSeal(396);

		if (!last) {
			Layout.openSeal(395);
		}

		Pather.moveTo(viz.x, viz.y);
		this.sealDelay();
		this.slayBoss(2851, Config.AutoChaos.PreAttack[0], 25, 0);

		if (last) {
			Layout.openSeal(395);
			Pather.moveTo(viz.x, viz.y);
		}

		Pickit.pickItems();
	};

	this.taxiSeis = function (last) {
		var seis = (Layout.seis() === 1) ? { x: 7782, y: 5224 } : { x: 7775, y: 5193 };

		Pather.moveTo(seis.x, seis.y, 10);
		Pather.makePortal(false);
		Layout.openSeal(394);
		this.sealDelay();
		Pather.moveTo(seis.x, seis.y, 10);
		Pather.teleDistance = 45;
		this.slayBoss(2852, Config.AutoChaos.PreAttack[1], 30, 0);
		Pickit.pickItems();
	};

	this.taxiInfector = function (last) {
		var inf = (Layout.infector() === 1) ? { x: 7926, y: 5300 } : { x: 7924, y: 5282 };

		Pather.moveTo(inf.x, inf.y);
		Pather.makePortal(false);
		Layout.openSeal(392);

		if (!last) {
			Layout.openSeal(393);
		}

		Pather.moveTo(inf.x, inf.y);
		this.slayBoss(2853, Config.AutoChaos.PreAttack[2], 25, 0);

		if (last) {
			Layout.openSeal(393);
			Pather.moveTo(inf.x, inf.y);
		}

		Pickit.pickItems();
	};

	this.diablo = function () {
		var i, pick, maxTime = 0,
			preCount = 1,
			postCount = 1,
			party = getParty();

		if (party) {
			do {
				if (party.level >= 30) {
					preCount += 1;
				}
			} while (party.getNext());
		}

		if (Config.AutoChaos.Leech) {
			Pather.moveTo(7767, 5263);
		} else {
			if (Config.AutoChaos.Diablo >= 0) {
				Pather.moveTo(7798, 5293);
				this.slayBoss(3060, 0, 30, Config.AutoChaos.Diablo);

				if (Config.AutoChaos.Diablo === 0) {
					pick = getTickCount();

					while (getTickCount() - pick < 1500) {
						Pickit.pickItems();
						delay(me.ping + 100);
					}

					return;
				}
			}

			if (!Pather.usePortal(103, null)) {
				Town.goToTown();
			}

			Town.doChores();
		}

		while (maxTime < 180000) {
			party = getParty();

			if (party) {
				postCount = 1;
				do {
					if (party.level >= 30) {
						postCount += 1;
					}
				} while (party.getNext());

				if (postCount < preCount || (!Config.AutoChaos.Taxi && !getParty(this.taxi))) {
					break;
				}
			}

			maxTime += 3000;
			delay(3000);
		}
	};

	this.doPreattack = function (loc) {
		var check, player;

		switch (me.classid) {
			case 0:
			case 1:
			case 2:
				if (me.getState(121)) {
					player = getUnit(0);
					Skill.cast(Config.AttackSkill[2], 0, player.x, player.y);
				} else {
					Skill.cast(Config.AttackSkill[1], 0, me.x, me.y);
				}

				if (Config.Dodge && me.hp * 100 / me.hpmax <= Config.DodgeHP) {
					Attack.deploy(loc, Config.DodgeRange, 5, 15);
				}

				return true;
			case 3: // Paladin
				if (Config.AttackSkill[3] !== 112) {
					return false;
				}

				if (Config.AttackSkill[4] > 0) {
					Skill.setSkill(Config.AttackSkill[4], 0);
				}

				for (var i = 0; i < 3; i++) {
					Skill.cast(Config.AttackSkill[3], 1);
				}
				return true;
			case 4: // Barbarian
				Skill.cast(Config.AttackSkill[3], Skill.getHand(Config.AttackSkill[3]));
				return true;
			case 5: // Druid
				if (Config.AttackSkill[3] === 245) {
					Skill.cast(Config.AttackSkill[3], 0, me.x, me.y);
					return true;
				}

				break;
			case 6: // Assassin
				if (Config.UseTraps) {
					check = ClassAttack.checkTraps({ x: me.x, y: me.y });

					if (check) {
						ClassAttack.placeTraps({ x: me.x, y: me.y }, 5);
						return true;
					}
				}

				break;
			default:
				delay(2000);
				break;
		}

		return false;
	};

	this.slayBoss = function (classid, preattack, retry, stop = 0) {
		var boss = false,
			bosshp = 0,
			reposition = 0,
			checkPosition = 0,
			tick = 0,
			time = getTickCount() + (retry * 1000),
			name = getLocaleString(classid),
			loc = { x: me.x, y: me.y };

		while (getTickCount() < time) {
			if (!boss) {
				boss = getUnit(1, name);
			} else if (Attack.checkMonster(boss) && preattack > 0) {
				preattack -= 1;
			} else {
				break;
			}

			if (me.classid == 3 || classid !== 3060) {
				this.doPreattack(loc);
			}

			delay(me.ping + 10);
		}

		if (!boss) {
			print("Unable to find: " + name);
			return;
		}

		if (!Config.AutoChaos.Ranged) {
			for (var i = 0; i < 10; i++) {
				if (Pather.moveTo(boss.x + rand(-3, 3), boss.y + rand(0, 3), 0)) {
					break;
				} else {
					this.doPreattack(loc);
				}
			}
		}

		time = getTickCount() + (retry * 1000);

		do {
			if (!Attack.checkMonster(boss)) {
				return;
			}

			bosshp = parseInt((boss.hp * 100) / 128, 10);

			if (bosshp < stop) {
				return;
			}

			if (tick - checkPosition >= 3000) {
				if (Pather.useTeleport || bosshp >= reposition) {
					if (Config.AutoChaos.Ranged) {
						Attack.deploy(boss, 15, 5, 9);
					} else {
						if (Pather.useTeleport) {
							Attack.deploy(boss, 3, 5, 9);
						} else {
							if (time - tick < 10000) {
								notify("", name + " loc:" + boss.x + "," + boss.y + " me loc:" + me.x + "," + me.y);
								loc = { x: boss.x + rand(-5, 5), y: boss.y + rand(0, 5) };
							} else {
								loc = { x: boss.x + rand(-3, 3), y: boss.y + rand(0, 3) };
							}

							Pather.moveTo(loc.x, loc.y, 0);
							Misc.click(0, 0, loc.x, loc.y);
						}
					}
				}

				checkPosition = tick;
				reposition = bosshp;
			}

			try {
				if (!ClassAttack.doAttack(boss, false)) {
					Skill.cast(Config.AttackSkill[3], Skill.getHand(Config.AttackSkill[3]), boss);
				}
			} catch (e) { }

			tick = getTickCount();
		} while (tick < time);

		throw new Error(notify("Failed to kill: " + name + " in " + retry + " sec", "Failed to kill:" + name + " loc:" + boss.x + "," + boss.y + " me loc:" + me.x + "," + me.y));
	};

	addEventListener("gamepacket", function (packet) {
		if (packet[0] === 0x89 && packet[1] === 0x0c) {
			this.lastCall = 3;
		}

		return false;
	});

	var i, time;

	if (me.area !== 103) {
		Pather.useWaypoint(103, true);
	}

	Pather.walkTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
	Town.doChores();

	if (Config.AutoChaos.Taxi) {
		this.waitForParty();

		Pather.useWaypoint(107, true);
		Pather.makePortal(false);
		Pather.moveTo(me.x, me.y - 5);

		this.waitForParty(107);

		if (!this.taxiInit()) {
			return false;
		}

		Pather.moveTo(7797, 5606);
		Pather.moveTo(7797, 5590);

		for (i = 0; i < 3; i += 1) {
			if (Config.AutoChaos.SealOrder[i] === 1) {
				this.taxiVizier(i === 2);
			} else if (Config.AutoChaos.SealOrder[i] === 2) {
				this.taxiSeis(i === 2);
			} else if (Config.AutoChaos.SealOrder[i] === 3) {
				this.taxiInfector(i === 2);
			} else {
				throw new Error(notify("Invalid Config.AutoChaos.SealOrder setting."));
			}
		}

		Pather.moveTo(7786, 5285);
		Pather.makePortal(false);
		this.diablo();
	} else if (Config.AutoChaos.FindShrine) {
		Pather.useWaypoint(4, true);

		if (Misc.getShrinesInArea(4, 15, false) // Stoney Field
		 || Misc.getShrinesInArea(3, 15, false) // Cold Plains
		 || Misc.getShrinesInArea(2, 15, false) // Blood Moor
		) {
			print("Exp shrine found.");
			Town.goToTown();
		} else {
			Pather.journeyTo(1);
		}

		Pather.useWaypoint(103, true);
		Town.doChores();
		time = getTickCount();

		while (me.ingame) {
			if (getTickCount() - time > 5000) {
				time = getTickCount();
				Pickit.pickItems(); // find stray gold on ground
				this.setTaxi();

				if (this.taxi === "" || !getParty(this.taxi)) {
					break;
				}
			}

			delay(100);
		}
	} else if (Config.AutoChaos.Glitcher) {
	} else {
		Town.move("portalspot");
		time = getTickCount();

		while (me.ingame) {
			delay(100);
			this.setTaxi();

			if (getTickCount() - time > 25000) {
				if (this.taxi === "" || !getParty(this.taxi)) {
					break;
				}

				time = getTickCount();
			}

			if (!this.doNext()) {
				break;
			}
		}
	}

	return true;
};

var Layout = new function () {
	this.sealDistance = function (seal) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!sealPreset) {
			throw new Error(notify("Seal preset not found. Can't continue."));
		}

		return (getDistance(me, sealPreset.roomx * 5 + sealPreset.x, sealPreset.roomy * 5 + sealPreset.y));
	};

	this.openSeal = function (classid) {
		var i, seal, tick;

		for (i = 0; i < 5; i += 1) {
			Pather.moveToPreset(108, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);

			seal = getUnit(2, classid);

			if (!seal) {
				delay(100);
				continue;
			}

			if (seal.mode) {
				return true;
			}

			if (classid === 394) {
				if (i%2 == 1) {
					Pather.moveTo(seal.x - 3, seal.y - 3);
				}

				Misc.click(0, 0, seal);
			} else {
				seal.interact();
			}

			tick = getTickCount();

			while (getTickCount() - tick < (classid === 394 ? 1000 : 500)) {
				if (seal.mode) {
					return true;
				}

				delay(10);
			}

			if (!seal.mode) {
				if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) {
					// de seis optimization
					Pather.moveTo(seal.x + 15, seal.y);
				} else {
					Pather.moveTo(seal.x - 5, seal.y - 5);
				}

				delay(300);
			} else {
				return true;
			}
		}

		throw new Error(notify("Failed to open seal: " + classid, "Seal: " + classid + " loc:" + seal.x + "," + seal.y + " me loc:" + me.x + "," + me.y));
		return false;
	};

	this.get = function (seal, value) {
		var sealPreset = getPresetUnit(108, 2, seal);

		if (!seal) {
			throw new Error(notify("Seal preset not found. Can't continue."));
		}

		if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
			return 1;
		}

		return 2;
	};

	this.vizier = function () {
		return this.get(396, 5275);
	};

	this.seis = function () {
		return this.get(394, 7773);
	};

	this.infector = function () {
		return this.get(392, 7893);
	};
};

function notify (message, overhead) {
	if (overhead) {
		me.overhead(overhead);
	}

	takeScreenshot();
	return message;
}
