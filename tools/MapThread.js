var gHooksHudVisible = false;

var Hooks = {
	monsters: {
		hooks: [],
		enabled: true,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}

			var i, unit;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (!copyUnit(this.hooks[i].unit).x) {
					this.hooks[i].hook[0].remove();
					this.hooks[i].hook[1].remove();
					this.hooks.splice(i, 1);

					i -= 1;
				}
			}

			unit = getUnit(1);

			if (unit) {
				do {
					if (Attack.checkMonster(unit)) {
						if (!this.getHook(unit)) {
							this.add(unit);
						} else {
							this.updateCoords(unit);
						}
					} else {
						this.remove(unit);
					}
				} while (unit.getNext());
			}
		},

		newHook: function (unit) {
			var arr = [];

			arr.push(new Line(unit.x - 3, unit.y, unit.x + 3, unit.y, (unit.spectype & 0xF) ? 0x68 : 0x62, true));
			arr.push(new Line(unit.x, unit.y - 3, unit.x, unit.y + 3, (unit.spectype & 0xF) ? 0x68 : 0x62, true));

			return arr;
		},

		add: function (unit) {
			this.hooks.push({
				unit: copyUnit(unit),
				hook: this.newHook(unit)
			});
		},

		updateCoords: function (unit) {
			var hook = this.getHook(unit);

			if (!hook) {
				return false;
			}

			hook[0].x = unit.x - 3;
			hook[0].x2 = unit.x + 3;
			hook[0].y = unit.y;
			hook[0].y2 = unit.y;
			hook[1].x = unit.x;
			hook[1].x2 = unit.x;
			hook[1].y = unit.y - 3;
			hook[1].y2 = unit.y + 3;

			return true;
		},

		getHook: function (unit) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].unit.gid === unit.gid) {
					return this.hooks[i].hook;
				}
			}

			return false;
		},

		remove: function (unit) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].unit.gid === unit.gid) {
					this.hooks[i].hook[0].remove();
					this.hooks[i].hook[1].remove();
					this.hooks.splice(i, 1);

					return true;
				}
			}

			return false;
		},

		flush: function () {
			while (this.hooks.length) {
				this.hooks[0].hook[0].remove();
				this.hooks[0].hook[1].remove();
				this.hooks.shift();
			}
		}
	},

	text: {
		hooks: [],
		enabled: true,
		visible: true,
		hudvisible: gHooksHudVisible,
		cleared: true,
		tick: me.gamestarttime,

		check: function () {
			if (!this.enabled) {
				this.flush();

				return;
			}

			if (!this.hooks.length) {
				this.add();
			}

			if (this.cleared) {
				this.cleared = false;
				this.setAttrHooks("visible", this.visible = true);
			}

			if (this.visible !== this.hudvisible) {
				this.visible = this.hudvisible;
				this.getHook("monsterStatus").hook.visible = this.visible;
				this.getHook("vectorStatus").hook.visible = this.visible;
			}

			if (getTickCount() - this.tick >= 1000) {
				this.tick = getTickCount();
				this.getHook("ping").hook.color = (me.ping > 300) ? 8 : 4;
				this.getHook("ping").hook.text = "Ping: " + me.ping;
				this.getHook("time").hook.text = this.timer();
			}
		},

		flush: function () {
			if (getUIFlag(0x09)) {
				while (this.hooks.length) {
					this.hooks.shift().hook.remove();
				}
			}

			if (getUIFlag(0x0D)) {
				return;
			}

			if (!this.cleared) {
				this.cleared = true;
				this.setAttrHooks("visible", this.visible = false);
			}
		},

		add: function () {
			var ip = me.gameserverip.length > 0 ? me.gameserverip.split(".")[3] : "0",
				offset =  Number(!!me.diff) + Number(!!me.gamepassword) + Number(!!me.gametype) + Number(!!me.gamename);

			this.hooks.push({
				name: "monsterStatus",
				hook: new Text(this.switchHudText("monsterStatus", false), 525, 515)
			});

			this.hooks.push({
				name: "vectorStatus",
				hook: new Text(this.switchHudText("vectorStatus", false), 525, 525)
			});

			this.hooks.push({
				name: "ping",
				hook: new Text("Ping: " + me.ping, 785, 56 + 16 * offset, 4, 1, 1)
			});

			this.hooks.push({
				name: "time",
				hook: new Text(this.timer(), 785, 72 + 16 * offset, 4, 1, 1)
			});

			this.hooks.push({
				name: "ip",
				hook: new Text((me.diff > 1) ? "IP: " + ip : "", 785, 88 + 16 * offset, 4, 1, 1)
			});
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].name === name) {
					return this.hooks[i];
				}
			}

			return false;
		},

		timer: function (duration) {
			var min, sec, hour;

			duration = duration || (getTickCount() - me.gamestarttime) / 1000;
			duration = ~~duration;

			hour = ~~(duration / 3600);
			min = ~~(duration / 60 % 60);
			sec = duration % 60;

			hour = (hour > 0) ? hour + ":" : "";
			min = (min < 10) ? "0"+ min : min;
			sec = (sec < 10) ? "0"+ sec : sec;

			return hour + min + ":" + sec;
		},

		switchHudText: function (where, mode) {
			var text = "";

			if (where.toLowerCase() === "monsterstatus") {
				text = Hooks.monsters.enabled ? "Num 7: Disable Monsters" : "Num 7: Enable Monsters";
				if (mode && this.getHook("monsterStatus")) {
					this.getHook("monsterStatus").hook.text = text;
				}
			}

			if (where.toLowerCase() === "vectorstatus") {
				text = Hooks.vector.enabled ? "Num 8: Disable Vectors" : "Num 8: Enable Vectors";
				if (mode && this.getHook("vectorStatus")) {
					this.getHook("vectorStatus").hook.text = text;
				}
			}

			return text;
		},

		setAttrHooks: function (attr, value) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				this.hooks[i].hook[attr] = value;
			}
		},
	},

	vector: {
		hooks: [],
		currArea: 0,
		enabled: true,

		check: function () {
			if (!this.enabled || ~[1,40,75,103,109,37,102,107,108,131].indexOf(me.area)) {
				this.flush();

				return;
			}

			if (me.area !== this.currArea) {
				this.flush();

				var i, exits, wp, poi,
					indexarea = Hooks.tele.prevAreas.indexOf(me.area),
					prevarea = Hooks.tele.prevAreas[me.area],
					nextarea = this.overrideNextArea(me.area); // Specific area override


				this.currArea = me.area;
				exits = getArea().exits;

				if (exits) {
					for (i = 0; i < exits.length; i += 1) {
						if (me.area === 46) {
							this.add(exits[i].x, exits[i].y, exits[i].target === getRoom().correcttomb ? 0x69 : 0x99);
						} else if (~[17,20,56,94,114].indexOf(exits[i].target) && me.area < exits[i].target ) {
							this.add(exits[i].x, exits[i].y, 0x69);
						} else if (exits[i].target === nextarea && nextarea) {
							this.add(exits[i].x, exits[i].y, 0x1F);
						} else if (exits[i].target === indexarea && nextarea) {
							this.add(exits[i].x, exits[i].y, 0x99);
						} else if (exits[i].target === indexarea) {
							this.add(exits[i].x, exits[i].y, 0x1F);
						} else if (exits[i].target === prevarea) {
							this.add(exits[i].x, exits[i].y, 0x0A);
						} else {
							this.add(exits[i].x, exits[i].y, 0x99);
						}
					}
				}

				wp = this.getWP();

				if (wp) {
					this.add(wp.x, wp.y, 0xA8);
				}

				poi = this.getPOI();

				if (poi) {
					this.add(poi.x, poi.y, 0x7D);
				}
			} else {
				this.update();
			}
		},

		add: function (x, y, color) {
			this.hooks.push(new Line(me.x, me.y, x, y, color, true));
		},

		update: function () {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				this.hooks[i].x = me.x;
				this.hooks[i].y = me.y;
			}
		},

		flush: function () {
			while (this.hooks.length) {
				this.hooks.shift().remove();
			}

			this.currArea = 0;
		},

		getWP: function () {
			if (Pather.wpAreas.indexOf(me.area) === -1) {
				return false;
			}

			var i, preset,
				wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

			for (i = 0; i < wpIDs.length; i += 1) {
				preset = getPresetUnit(me.area, 2, wpIDs[i]);

				if (preset) {
					return {
						x: preset.roomx * 5 + preset.x,
						y: preset.roomy * 5 + preset.y
					};
				}
			}

			return false;
		},

		getPOI: function () {
			var unit, name;

			switch (me.area) {
			case 4: // Stony Field
				unit = getPresetUnit(me.area, 1, 737);
				name = "Cairn Stones";
				break;
			case 5: // Dark Wood
				unit = getPresetUnit(me.area, 2, 30);
				name = "Tree";
				break;
			case 49: // Sewers 3
				unit = getPresetUnit(me.area, 2, 355);
				name = "Radament";
				break;
			case 60: // Halls of the Dead 3
				unit = getPresetUnit(me.area, 2, 354);
				name = "Cube";
				break;
			case 74: // Arcane Sanctuary
				unit = getPresetUnit(me.area, 2, 357);
				name = "Summoner";
				break;
			case 64: // Maggot Lair 3
				unit = getPresetUnit(me.area, 1, 749);
				name = "Fat Worm";
				break;
			case 66: // Tal Rasha's Tombs
			case 67:
			case 68:
			case 69:
			case 70:
			case 71:
			case 72:
				unit = getPresetUnit(me.area, 2, 152);
				name = "Orifice";
				break;
			case 78: // Flayer Jungle
				unit = getPresetUnit(me.area, 2, 252);
				name = "Gidbinn";
				break;
			case 102: // Durance of Hate 3
				unit = { x: 17588, y: 8069 };
				name = "Mephisto";
				break;
			case 105: // Plains of Despair
				unit = getPresetUnit(me.area, 1, 256);
				name = "Izual";
				break;
			case 107: // River of Flame
				unit = getPresetUnit(me.area, 2, 376);
				name = "Hephasto";
				break;
			case 108: // Chaos Sanctuary
				unit = getPresetUnit(me.area, 2, 255);
				name = "Star";
				break;
			case 111: // Frigid Highlands
			case 112: // Arreat Plateau
			case 117: // Frozen Tundra
				unit = getPresetUnit(me.area, 2, 60);
				name = "Hell Entrance";
				break;
			case 114: // Frozen River
				unit = getPresetUnit(me.area, 2, 460);
				name = "Frozen Anya";
				break;
			case 124: // Halls of Vaught
				unit = getPresetUnit(me.area, 2, 462);
				name = "Nihlathak";
				break;
			}

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

			if (unit) {
				if (unit instanceof PresetUnit) {
					return {
						x: unit.roomx * 5 + unit.x,
						y: unit.roomy * 5 + unit.y,
						name: name
					};
				}

				return {
					x: unit.x,
					y: unit.y,
					name: name
				};
			}

			return false;
		},

		overrideNextArea: function (area) {
			switch (area) {
			case 7:
				return 26;
			case 46:
				return (me.area === 46) ? getRoom().correcttomb : undefined;
			case 76:
				return 78;
			case 77:
				if (me.area === 77) {
					var exits = getArea(77).exits;

					return (exits && exits.length > 1) ? 78 : undefined;
				}
			case 113:
				return 115;
			case 115:
				return 117;
			case 118:
				return 120;
			}

			return undefined;
		},

		setAttrHooks: function (attr, value) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				this.hooks[i].hook[attr] = value;
			}
		},
	},

	tele: {
		hooks: [],
		action: null,
		currArea: 0,
		enabled: true,
		eventEnabled: true,
		cleared: true,
		visible: true,
		hudvisible: gHooksHudVisible,
		disabledStateHook: null,
		ctrlkey: false,
		prevAreas: [0, 0, 1, 2, 3, 10, 5, 6, 2, 3, 4, 6, 7, 9, 10, 11, 12, 3, 17, 17, 6, 20, 21, 22, 23, 24, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
					36, 4, 1, 1, 40, 41, 42, 43, 44, 74, 40, 47, 48, 40, 50, 51, 52, 53, 41, 42, 56, 45, 55, 57, 58, 43, 62, 63, 44, 46, 46, 46, 46, 46,
					46, 46, 1, 54, 1, 75, 76, 76, 78, 79, 80, 81, 82, 76, 76, 78, 86, 78, 88, 87, 89, 81, 92, 80, 80, 81, 81, 82, 82, 83, 100, 101, 102,
					103, 104, 105, 106, 107, 103, 109, 110, 111, 112, 113, 113, 115, 115, 117, 118, 118, 109, 121, 122, 123, 111, 112, 117, 120, 128, 129,
					130, 131, 109, 109, 109, 109],

		event: function (keycode) {
			Hooks.tele.action = keycode;
		},

		check: function () {
			if (!this.enabled) {
				this.action = null;
			}

			var hook,
				obj = {
					type: false,
					dest: false,
					ctrl: this.ctrlkey
				};

			if (this.action) {
				if (this.inTown()) {
					switch (this.action) {
					case 96:
						obj.type = "npc";
						obj.dest = "Heal";
						break;
					case 97:
						obj.type = "spot";
						obj.dest = "portalspot";
						break;
					case 98:
						obj.type = "spot";
						obj.dest = "waypoint";
						break;
					case 99:
						obj.type = "spot";
						obj.dest = "stash";
						break;
					default:
						obj = null;
					}

					if (obj) {
						scriptBroadcast(JSON.stringify(obj));
					}

					this.action = null;
				} else {
					switch (this.action) {
					case 96: // Numpad 0
						hook = this.getHook("Next Area");
						obj.type = "area";

						if (hook && this.ctrlkey) {
							hook = this.getHook("Side Area");
							obj.type = "area";
						} else if (!hook) {
							hook = this.getHook("POI");
							obj.type = "unit";
						}

						break;
					case 97: // Numpad 1
						hook = this.getHook("Previous Area");
						obj.type = "area";

						break;
					case 98: // Numpad 2
						hook = this.getHook("Waypoint");
						obj.type = "wp";

						break;
					case 99: // Numpad 3
						hook = this.getHook("POI");
						obj.type = "unit";

						break;
					case 100: // Numpad 4
						hook = this.getHook("Side Area");
						obj.type = "area";

						break;
					}

					if (hook) {
						obj.dest = hook.destination;
						scriptBroadcast(JSON.stringify(obj));
					}

					this.action = null;
				}
			}

			if (me.area !== this.currArea) {
				removeEventListener("keyup", this.event);
				this.setAttrHooks("visible", false);
				if (this.hooks instanceof Array) {
					while (this.hooks.length) {
						this.hooks.shift().hook.remove();
					}
				}
				this.cleared = true;

				this.add(me.area);
				this.currArea = me.area;
			}

			if (this.cleared) {
				this.cleared = false;
				this.setAttrHooks("visible", this.visible = (this.enabled && this.hudvisible));
				this.disabledStateHook.text = this.eventEnabled ? "" : "[ TELE: Disabled ]";;
				addEventListener("keyup", this.event);
			}

			// check hud visibility
			if (this.enabled !== this.eventEnabled) {
				this.enabled = this.eventEnabled;
				this.disabledStateHook.text = this.eventEnabled ? "" : "[ TELE: Disabled ]";
			}
			if (this.enabled) {
				if (this.visible !== this.hudvisible) {
					this.setAttrHooks("visible", this.visible = this.hudvisible);
				}
			} else {
				if (this.visible !== this.enabled) {
					this.setAttrHooks("visible", this.visible = false);
				}
			}
		},

		flush: function () {
			if (getUIFlag(0x09)) {
				if (this.hooks instanceof Array) {
					while (this.hooks.length) {
						this.hooks.shift().hook.remove();
					}
				}
				if (this.disabledStateHook) {
					this.disabledStateHook.remove();
					this.disabledStateHook = null;
				}
				this.currArea = 0;
			} else {

				if (!this.cleared) {
					this.cleared = true;
					this.setAttrHooks("visible", this.visible = false);
					if (this.disabledStateHook) {
						this.disabledStateHook.text = "";
					}
					removeEventListener("keyup", this.event);
				}
			}
		},

		add: function (area) {
			var i, exits, wp, poi, sideArea, nextarea;

			if (!this.disabledStateHook) {
				this.disabledStateHook = new Text("", 150, 525, 5);
			}

			if (this.inTown()) {
				var dest = [
					"Num 3: Stash",
					"Num 2: WP",
					"Num 1: Portal Spot",
					"Num 0: Heal NPC" ];

				for (i = 0; i < dest.length; i += 1) {
					this.hooks.push({
						name: "Num" + i,
						hook: new Text(dest[i], 150, 525 - (i * 10))
					});
				}

				return;
			}

/* 			sideArea = {
				2: 8, // Blood Moor - Den of Evil
				3: 17, // Cold Plains - Burial Grounds
				6: 20, // Black March - Forgotten Tower
				7: 12, // Tamoe Highlands - Pit Level 1
				10: 14, // Underground Passage Level 1 - Underground Passage Level 2
				17: 19, // Burial Grounds - Mausoleum
				41: 55, // Rocky Waste - Stony Tomb Level 1
				42: 56, // Dry Hills - Halls of the Dead Level 1
				43: 62, // Far Oasis - Maggot Lair Level 1
				44: 65, // Lost City - Ancient Tunnels
				76: 85, // Spider Forest - Spider Cavern
				78: 88, // Flayer Jungle - Flayer Dungeon Level 1
				80: 94, // Kurast Bazaar - Ruined Temple
				81: 92, // Upper Kurast - Sewers Level 1
				92: 80, // Sewers Level 1 - Kurast Bazaar
				113: 114, // Crystalline Passage - Frozen River
				115: 116, // Glacial Trail - Drifter Cavern
				118: 119, // Ancient's Way - Icy Cellar
			}[area]; */

			switch (area) {
			case 2: // Blood Moor
				sideArea = 8; // Den of Evil
				break;
			case 3: // Cold Plains
				sideArea = 17; // Burial Grounds
				break;
			case 6: // Black Marsh
				sideArea = 20; // Forgotten Tower
				break;
			case 7: // Tamoe Highlands
				sideArea = 12; // Pit Level 1
				break;
			case 10: // Underground Passage Level 1
				sideArea = 14; // Underground Passage Level 2
				break;
			case 17: // Burial Grounds
				sideArea = 19; // Mausoleum
				break;
			case 41: // Rocky Waste
				sideArea = 55; // Stony Tomb Level 1
				break;
			case 42: // Dry Hills
				sideArea = 56; // Halls of the Dead Level 1
				break;
			case 43: // Far Oasis
				sideArea = 62; // Maggot Lair Level 1
				break;
			case 44: // Lost City
				sideArea = 65; // Ancient Tunnels
				break;
			case 76: // Spider Forest
				sideArea = 85; // Spider Cavern
				break;
			case 78: // Flayer Jungle
				sideArea = 88; // Flayer Dungeon Level 1
				break;
			case 80: // Kurast Bazaar
				sideArea = 94; // Ruined Temple
				break;
			case 81: // Upper Kurast
				sideArea = 92; // Sewers Level 1
				break;
			case 92: // Sewers Level 1
				sideArea = 80; // Kurast Bazaar
				break;
			case 113: // Crystalline Passage
				sideArea = 114; // Frozen River
				break;
			case 115: // Glacial Trail
				sideArea = 116; // Drifter Cavern
				break;
			case 118: // Ancient's Way
				sideArea = 119; // Icy Cellar
				break;
			default:
				sideArea = undefined;
			}

			if (sideArea) {
				this.hooks.push({
					name: "Side Area",
					destination: sideArea,
					hook: this.newHook("Num 4: " + Pather.getAreaName(sideArea))
				});
			}

			poi = Hooks.vector.getPOI();

			if (poi) {
				this.hooks.push({
					name: "POI",
					destination: {x: poi.x, y: poi.y},
					hook: this.newHook("Num 3: " + poi.name)
				});
			}

			wp = Hooks.vector.getWP();

			if (wp) {
				this.hooks.push({
					name: "Waypoint",
					destination: {x: wp.x, y: wp.y},
					hook: this.newHook("Num 2: WP")
				});
			}

			// Specific area override
			nextarea = Hooks.vector.overrideNextArea(area);

			exits = getArea(area).exits;

			if (exits) {
				var target;

				target = this.prevAreas[me.area];

				for (i = 0; i < exits.length; i += 1) {
					if (exits[i].target === target) {
						this.hooks.push({
							name: "Previous Area",
							destination: target,
							hook: this.newHook("Num 1: " + Pather.getAreaName(target))
						});

						break;
					}
				}

				// In case the area isn't in nextAreas array, use this.prevAreas array
				if (!nextarea) {
					target = this.prevAreas.indexOf(me.area);

					for (i = 0; i < exits.length; i += 1) {
						if (exits[i].target === target) {
							nextarea = target;

							break;
						}
					}
				}

				if (nextarea) {
					this.hooks.push({
						name: "Next Area",
						destination: nextarea,
						hook: this.newHook("Num 0: " + Pather.getAreaName(nextarea))
					});
				}
			}
		},

		getHook: function (name) {
			var i;

			for (i = 0; i < this.hooks.length; i += 1) {
				if (this.hooks[i].name === name) {
					return this.hooks[i];
				}
			}

			return false;
		},

		newHook: function (text) {
			var hook = new Text("", 150, 525 - (this.hooks.length * 10));

			hook.visible = false;
			hook.text = text;

			return hook;
		},

		inTown: function () {
			return ~[1, 40, 75, 103, 109].indexOf(me.area);
		},

		setAttrHooks: function (attr, value) {
			var i;

			if (this.hooks instanceof Array) {
				for (i = 0; i < this.hooks.length; i += 1) {
					this.hooks[i].hook[attr] = value;
				}
			}
		},
	},

	update: function () {
		while (!me.gameReady) {
			delay(100);
		}

		this.monsters.check();
		this.text.check();
		this.vector.check();
		this.tele.check();
	},

	flush: function () {
		this.monsters.flush();
		this.text.flush();
		this.vector.flush();
		this.tele.flush();

		return true;
	}
};

var ControlButton = {
	hooks: [],
	visible: true,

	add: function () {
		this.hooks.push(new Box (613, 562, 34, 16, 0x0, 2, 2));
		this.hooks.push(new Frame (613, 562, 34, 16, 2));
		this.hooks.push(new Text("HUD", 614, 576, 0, 1, 2, false, this.hudHandler));
		this.hooks[2].color = gHooksHudVisible ? 2 : 5;

		this.hooks.push(new Box (613, 578, 34, 16, 0x0, 2, 2));//613, 613, 614
		this.hooks.push(new Frame (613, 578, 34, 16, 2));
		this.hooks.push(new Text("TELE", 614, 592, 0, 1, 2, false, this.teleHandler));
		this.hooks[5].color = Hooks.tele.eventEnabled ? 2 : 5;
	},

	hudHandler: function () {
		gHooksHudVisible = !gHooksHudVisible;
		Hooks.text.hudvisible = gHooksHudVisible;
		Hooks.tele.hudvisible = gHooksHudVisible;
		ControlButton.hooks[2].color = gHooksHudVisible ? 2 : 5;
		me.automap = true;
	},

	teleHandler: function() {
		Hooks.tele.eventEnabled = !Hooks.tele.eventEnabled;
		ControlButton.hooks[5].color = Hooks.tele.eventEnabled ? 2 : 5;
	},

	setAttrHooks: function (attr, value) {
		var i;

		for (i = 0; i < this.hooks.length; i += 1) {
			this.hooks[i][attr] = value;
		}
	},

	flush: function () {
		while (this.hooks.length) {
			this.hooks.shift().remove();
		}
	},

	checkVisible: function () {
		if (getUIFlag(0x09)) {
			this.flush();
		} else {
			if (!this.hooks.length) {
				this.add();
			} else if (getUIFlag(0x04)) {
				if (this.visible) {
					this.setAttrHooks("visible", this.visible = false);
				}
			} else {
				if (!this.visible) {
					this.setAttrHooks("visible", this.visible = true);
				}
			}
		}
	}
};

function main() {
	include("json2.js");
	include("common/attack.js");
	include("common/pather.js");
	load("tools/maphelper.js");
	print("ÿc9Map Thread Loaded.");
	print("MapThread :: Click on ÿc2[HUD] ÿc0button to view key binding information");

	this.revealedAreas = [];
	this.revealArea = function (area) {
		if (this.revealedAreas.indexOf(area) === -1) {
			delay(500);
			revealLevel(true);
			this.revealedAreas.push(area);
		}
	};

	this.keyDownEvent = function (key) {
		switch (key) {
		case 17: // ctrl
			Hooks.tele.ctrlkey = true;
			break;
		}
	};

	this.keyUpEvent = function (key) {
		switch (key) {
		case  17:
			Hooks.tele.ctrlkey = false;

			break;
		case  53: // number 5
			scriptBroadcast(JSON.stringify({ type: "tp", dest: "town" }));

			break;
		case 103: // Numpad 7
			Hooks.monsters.enabled = !Hooks.monsters.enabled;
			Hooks.text.switchHudText("monsterStatus", true);

			break;
		case 104: // Numpad 8
			Hooks.vector.enabled = !Hooks.vector.enabled;
			Hooks.text.switchHudText("vectorStatus", true);

			break;
		}
	};

	// added 0x04 (skill) // removed 0x0D (alt)
	var i,
		hideFlags = [0x04, 0x09, 0x0C, 0x01, 0x02, 0x0F, 0x18, 0x19, 0x1A, 0x21];

	addEventListener("keyup", this.keyUpEvent);
	addEventListener("keydown", this.keyDownEvent);

	while (true) {
		while (!me.area || !me.gameReady) {
			delay(80);
		}

		this.revealArea(me.area);

		if (getUIFlag(0x0A)) {
			Hooks.update();
		} else {
			Hooks.flush();
		}

		delay(40);

		ControlButton.checkVisible();

		for (i = 0; i < hideFlags.length; i += 1) {
			while (getUIFlag(hideFlags[i])) {
				Hooks.flush();
				delay(100);
			}
		}
	}
}
