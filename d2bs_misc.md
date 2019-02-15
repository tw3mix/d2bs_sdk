# Quest

cow king quest : `me.getQuest (4, 10)`

andariel - talk to warrive and move to east : `me.getQuest(6, 1)`

```
JSAPI_FUNC(unit_interact) {
    if (!WaitForGameReady())
        THROW_WARNING(cx, vp, "Game not ready");
```


```javascript
var BodyLocation = {
	NotEquipped:0,
	Helm:1,
	Amulet:2,
	Armor:3,
	LeftSlotI:4,
	RightSlotI:5,
	RightRing:7,
	LeftRing:6,
	Belt:8,
	Boots:9,
	Gloves:10,
	LeftSlotII:11,
	RightSlotII:12
};
var ItemLocation = {
	Ground:0,
	Equip:1,
	Belt:2,
	Inventory:3,
	Shop:4,
	Trade:5,
	Cube:6,
	Stash:7
};
var ItemQuality = {
	Inferior: 1,
	Normal: 2,
	Superior: 3,
	Magic: 4,
	Set: 5,
	Rare: 6,
	Unique: 7,
	Crafted: 8
};
var Color = {
	White:0,
	Red:1,
	Green:2,
	Blue:3,
	Gold:4,
	Gray:5,
	Black:6,
	LightGold:7,
	Amber:8,
	Yellow:9,
	DarkGreen:':',
	MossGreen:'<',
	Purple:';',
	SGlow:'!',
	MGlow:'#',
	LGlow:'*'
};
var ColorCode = {
	White:'ÿc0',
	Red:'ÿc1',
	Green:'ÿc2',
	Blue:'ÿc3',
	Gold:'ÿc4',
	Gray:'ÿc5',
	Black:'ÿc6',
	LightGold:'ÿc7',
	Amber:'ÿc8',
	Yellow:'ÿc9',
	DarkGreen:'ÿc:',
	MossGreen:'ÿc<',
	Purple:'ÿc;',
	SGlow:'ÿc!',
	MGlow:'ÿc#',
	LGlow:'ÿc*'
};

```

```javascript
function test(){
   var aaa = 10;
   (function(arg){
      var aaa = 20;
      console.log(aaa); // 20;
      console.log(arg); // 10;
   })(aaa);
}
```

```javascript
// d2bs item.fname
function statidToName(id, value) { 
	return getLocaleString(getBaseStat(7, id, (value >= 0 ? "descstrpos" : "descstrneg"))); 
} 
/*
	for each(var item in me.getItems()) 
	for(var i = 0; i < 358; i++) 
	print(statidToName(i, item.getStat(i)) + ' = ' + item.getStat(i));
*/
```

```javascript
var NTPossibleCubingGems = [
//  amethyst, topaz, sapphire, emerald, ruby, diamond, skull
    557,      562,   567,      572,     577,  582,     597, //chippped
    558,      563,   568,      573,     578,  583,     598, //flawed 
    559,      564,   569,      574,     579,  584,     599, //regular
    560,      565,   570,      575,     580,  585,     600, //flawless
//  561,      566,   571,      576,     581,  586,     601, //perfect
];
var unidSomeLocale = {"amu": 2212, "rin": 2214, "jew": 20433, "cm1": 20435, "cm2": 20436, "cm3": 20437};
```

```
varied = getBaseStat( basestat, classid, statnum );

0 - items
1 - monstats (&npcs)
2 - skilldesc
3 - skills
4 - objects
5 - missiles
6 - monstats2
7 - itemstatcost
8 - levels
9 - leveldefs
10 - lvlmaze
11 - lvlsub
12 - lvlwarp
13 - lvlprest
14 - lvltypes
15 - charstats
16 - setitems
17 - uniqueitems
18 - sets
19 - itemtypes
20 - runes
21 - cubemain
22 - gems 
23 - experience
24 - pettype
25 - SuperUniques

Examples:
// If not killable...
if (getBaseStat(1, monster.classid, 20) == 0) return false;

// Align, on our side?
if (getBaseStat(1, monster.classid, 63)) return false;
```

```javascript
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
```
