# Quest

cow king quest : `me.getQuest (4, 10)`

andariel - talk to warrive and move to east : `me.getQuest(6, 1)`

```
JSAPI_FUNC(unit_interact) {
    if (!WaitForGameReady())
        THROW_WARNING(cx, vp, "Game not ready");
```


```javascript
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
/*
skull, amethyst, sapphire, emerald, ruby, diamond, topaz */
597,   557,      567,      572,     577,  582,     562, //chippped
598,   558,      568,      573,     578,  583,     563, //flawed 
599,   559,      569,      574,     579,  584,     564, //regular
600,   560,      570,      575,     580,  585,     565, //flawless
];
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
	getRecipeFormulae: function (recipe) {
		if (!recipe) {
			return "Transmuting: ";
		}

		var text = "",
			index = recipe.Index,
			craftItem = ["Helm","Boots","Gloves","Belt","Shield","Body","Amulet","Ring","Weapon"],
			classGrade = ["Weapon.ToExceptional","Weapon.ToElite","Armor.ToExceptional","Armor.ToElite"],
			socketItem = ["Shield","Weapon","Armor","Helm"],
			rerollItem = ["Magic","Rare","HighRare"];

		if (index === 0) {
			text = "Cubing Gem";
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
			text = "Cubing Rune";
		} else if (index === 53) {
			text = "Cubing Token";
		} else {
			text = "Transmuting";
		}

		return text + ": ";
	},
```
