```javascript
	gradeGem: function (classid) {
		var i, gems = [561,566,571,576,581,586,601];

		for (i = 0; i < gems.length; i += 1) {
			if (classid < gems[i]) {
				return ["Amethyst","Topaz","Sapphire","Emerald","Ruby","Diamond","Skull"][i];
				//return ["Perfect","Flawless","Normal","Flawed","Chipped"][gems[i] - classid];
			}
		}
		return "None";
	},
	gradeRune: function (classid) {
		var runes = [
				"El","Eld","Tir","Nef","Eth","Ith","Tal","Ral","Ort","Thul","Amn","Sol","Shael","Dol",
				"Hel","Io","Lum","Ko","Fal", "Lem","Pul","Um","Mal",
				"Ist","Gul","Vex","Ohm","Lo","Sur","Ber","Jah","Cham","Zod"
			];

		return runes[classid - 609];// classid: 610 ~ 642

		var grade = ["Low","Middle","High"];
		if (classid <= 623) {
			return grade[0];// Low: El - Dol
		} else if (classid <= 632) {
			return grade[1];// Middle: Hel - Mal
		} else {
			return grade[2];// High: Ist - Zod
		}
	},
	getCubingClass: function (recipe) {
		if (!recipe) {
			return "Transmuting: ";
		}

		var text,
			index = recipe.Index,
			craft = ["Helm","Boots","Gloves","Belt","Shield","Body","Amulet","Ring","Weapon"],
			lift = ["Weapon.ToExceptional","Weapon.ToElite","Armor.ToExceptional","Armor.ToElite"],
			socket = ["Shield","Weapon","Armor","Helm"],
			reroll = ["Magic","Rare","HighRare"];

		if (index === 0) {
			text = "Gem." + this.gradeGem(recipe.Ingredients[0]);
		} else if (index >= 1 && index <= 9) {
			text = "HitPower." + craft[index - 1];
		} else if (index >= 10 && index <= 18) {
			text = "Blood." + craft[index - 10];
		} else if (index >= 19 && index <= 27) {
			text = "Caster." + craft[index - 19];
		} else if (index >= 28 && index <= 36) {
			text = "Safety." + craft[index - 28];
		} else if (index >= 37 && index <= 40) {
			text = "Unique." + lift[index - 37];
		} else if (index >= 41 && index <= 44) {
			text = "Rare." + lift[index - 41];
		} else if (index >= 45 && index <= 48) {
			text = "Socket." + socket[index - 45];
		} else if (index >= 49 && index <= 51) {
			text = "Reroll." + reroll[index - 49];
		} else if (index === 52) {
			text = "Rune." + this.gradeRune(recipe.Ingredients[0]);
		} else if (index === 53) {
			text = "Token";
		} else {
			text = "LowToNorm";
		}

		return text;
	},

	doCubing: function () {
		if (!Config.Cubing) {
			return false;
		}

		if (!me.getItem(549) && !this.getCube()) {
			return false;
		}

		var i, j, items, string, result, tempArray,
			localeSID = {
				"amu": 2212, "rin": 2214, "jew": 20433,// Amulet/Ring/Jewel
				"cm1": 20435, "cm2": 20436, "cm3": 20437,// SmallCharm/LageCharm/GrandCharm
				"vbl": 1969, "zvb": 2062, "uvc": 20380,// Caster belt : LightBelt/SharkskinBelt/VampirefangBelt
				"vgl": 1959, "xvg": 2072, "uvg": 20370,// Boold gloves : HeavyGloves/SharkskinGloves/VampireboneGloves
				"mgl": 1960, "xmg": 2071, "umg": 20371// HitPower gloves : ChainGloves/HeavyBracers/Vambraces
			};

		this.update();
		// Randomize the recipe array to prevent recipe blocking (multiple caster items etc.)
		tempArray = this.recipes.slice().shuffle();

		for (i = 0; i < tempArray.length; i += 1) {
			string = "";// string = "Transmuting: ";
			items = this.checkRecipe(tempArray[i]);

			if (items) {
				// If cube isn't open, attempt to open stash (the function returns true if stash is already open)
				if ((!getUIFlag(0x1a) && !Town.openStash()) || !this.emptyCube()) {
					return false;
				}

				var classCubing, index, pColor, itemArray, overlap;

				classCubing = this.getCubingClass(tempArray[i]);
				index = tempArray[i].Index;
				pColor = (index === 52 ? 8 : (index && index <= 36 ? 6 : 5));

				this.cursorCheck();

				i = -1;

				itemArray = [];
				while (items.length) {
					if (items[0].quality === 4 && localeSID[items[0].code]) {
						itemArray.push(getLocaleString(localeSID[items[0].code]));
					} else {
						itemArray.push(items[0].name.trim());
					}
					Storage.Cube.MoveTo(items[0]);
					items.shift();
				}

				overlap = 1;
				while (itemArray.length) {
					if (itemArray.length > 1 && itemArray[0] === itemArray[1]) {
						overlap += 1;
					} else {
						string += (itemArray[0] + (overlap > 1 ? "(x" +  overlap + ")" : ""));
						string += (itemArray.length > 1) ? " + " : ""; 
						overlap = 1;
					}
					itemArray.shift();
				}
				string = "Cubing<" + classCubing + ">: " + string;
				
				if (!this.openCube()) {
					return false;
				}

				transmute();
				delay(700 + me.ping);
				print("ÿc4Cubing: " + string);
				if (Config.ShowCubingInfo) {
					D2Bot.printToConsole(string, pColor, "Act " + me.act, "Cubing");
				}

				this.update();

				items = me.findItems(-1, -1, 6);

				if (items) {
					for (j = 0; j < items.length; j += 1) {
						result = Pickit.checkItem(items[j]);

						switch (result.result) {
						case 0:
							/*
							if (items[j].quality === 8) {
								Misc.logItem("###", items[j]);
							}
							*/

							Misc.itemLogger("Dropped", items[j], "doCubing");
							items[j].drop();

							break;
```
