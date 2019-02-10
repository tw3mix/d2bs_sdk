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
