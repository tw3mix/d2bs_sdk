```javascript
	gradeGem: function (classid) {
		var i, gemList = [561,566,571,576,581,586,601];

		for (i = 0; i < gemList.length; i += 1) {
			if (classid < gemList[i]) {
				return gemList[i] - classid;
			}
		}
		return -1;
	},
	gradeRune: function (classid) {
		if (classid <= 623) {// El - Dol
			return 0;
		} else if (classid <= 632) {// Hel - Mal
			return 1;
		} else {// Ist - Zod
			return 2;
		}
	},
	getRecipeFormulae: function (recipe) {
		if (!recipe) {
			return "Transmuting: ";
		}

		var i, text,
			index = recipe.Index,
			craftItem = ["Helm","Boots","Gloves","Belt","Shield","Body","Amulet","Ring","Weapon"],
			classGrade = ["Weapon.ToExceptional","Weapon.ToElite","Armor.ToExceptional","Armor.ToElite"],
			socketItem = ["Shield","Weapon","Armor","Helm"],
			rerollItem = ["Magic","Rare","HighRare"],
			listGemGrade = ["Perfect","Flawless","Normal","Flawed","Chipped"],
			listRuneGrade = ["Low","Middle","High"];

		if (index === 0) {
			text = "Gem." + listGemGrade[this.gradeGem(recipe.Ingredients[0])];
		} else if (index >= 1 && index <= 9) {
			text = "HitPower." + craftItem[index - 1];
		} else if (index >= 10 && index <= 18) {
			text = "Blood." + craftItem[index - 10];
		} else if (index >= 19 && index <= 27) {
			text = "Caster." + craftItem[index - 19];
		} else if (index >= 28 && index <= 36) {
			text = "Safety." + craftItem[index - 28];
		} else if (index >= 37 && index <= 40) {
			text = "Unique." + classGrade[index - 37];
		} else if (index >= 41 && index <= 44) {
			text = "Rare." + classGrade[index - 41];
		} else if (index >= 45 && index <= 48) {
			text = "Socket." + socketItem[index - 45];
		} else if (index >= 49 && index <= 51) {
			text = "Reroll." + rerollItem[index - 49];
		} else if (index === 52) {
			text = "Rune." + listRuneGrade[this.gradeRune(recipe.Ingredients[0])];
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

		var i, j, items, string, result, tempArray, descCubing, recipeIndex,
			localeSID = {"amu": 2212, "rin": 2214, "jew": 20433, "cm1": 20435, "cm2": 20436, "cm3": 20437};

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

				descCubing = this.getRecipeFormulae(tempArray[i]);
				recipeIndex = tempArray[i].Index;

				this.cursorCheck();

				i = -1;

				while (items.length) {
					if (items[0].quality === 4 && localeSID[items[0].code]) {
						string += getLocaleString(localeSID[items[0].code]);
					} else {
						string += items[0].name.trim();
					}
					string += (items.length > 1) ? " + " : "";
					Storage.Cube.MoveTo(items[0]);
					items.shift();
				}

				if (!this.openCube()) {
					return false;
				}

				transmute();
				delay(700 + me.ping);
				print("ÿc4Cubing: " + string);
				if (Config.ShowCubingInfo) {
					if (recipeIndex === 0) {
						string = string.split(" + ")[0] + " x 3";
					}
					string = "Cubing<" + descCubing + ">: " + string;
					D2Bot.printToConsole(string, (recipeIndex >= 1 && recipeIndex <= 36) ? 6 : 5, descCubing, "Cubing");
				}

				this.update();
```
