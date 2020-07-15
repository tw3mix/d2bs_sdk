# Quest

monster : `getUnit(1, -1, -1, gid);`

start time : `me.gamestarttime`

cow king quest : `me.getQuest (4, 10)`

andariel - talk to warrive and move to east : `me.getQuest(6, 1)`

```
JSAPI_FUNC(unit_interact) {
    if (!WaitForGameReady())
        THROW_WARNING(cx, vp, "Game not ready");
```


```javascript
var DataModeId = {
	D2BOT_JOIN: 1,
	D2BOT_GAMEINFO: 2,
	D2BOT_REQUESTGAME: 3,
};
var GameLocation = {
	Lobby:1,InLine:2,Chat:3,Create:4,Join:5,Ladder:6,Channel:7,MainMenu:8,Login:9,
	LoginError:10,UnableToConnect:11,CharSelect:12,RealmDown:13,Disconnected:14,NewChar:15,
	CharSelectPleaseWait:16,LostConnection:17,D2Splash:18,CdKeyInUse:19,Difficulty:20,
	MainMenuConnecting:21,InvalidCdKey:22,/*Connecting:23,*/ServerDown:24,PleaseWait:25,GameExist:26,Gateway:27,
	GameDoesNotExist:28,CharCreate:29,CharCreateAlreadyExists:30,AgreeToTerms:31,NewAccount:32,
	PleaseRead:33,RegisterEmail:34,Credits:35,Cinematics:36,GameIsFull:38,OtherMultiplayer:39,
	TcpIp:40,EnterIpAddress:41,CharSelectNoChars:42,CharSelectChangeRealm:43};

var Class = {
	Amazon: 0,
	Sorceress: 1,
	Necromancer: 2,
	Paladin: 3,
	Barbarian: 4,
	Druid: 5,
	Assassin: 6
};

var Type = {
	Player: 0,
	Monster: 1,
	Npc: 1,
	Object: 2,
	Missile: 3,
	Item: 4,
	Tile: 5
};
var Party = {None:65535};
var PartyFlag = {
	invite: 0, // none
	inparty: 1,
	accept: 2,
	cancel: 4,
};

var UIFlags = {
	Inventory: 0x01,
	Character: 0x02,
	QuickSkill: 0x03,
	Skill: 0x04,
	ChatBox: 0x05,
	NPCMenu: 0x08,
	EscMenu: 0x09,
	Automap: 0x0A,
	ConfigControls: 0x0B,
	NPCShop: 0x0C,
	ShowItems: 0x0D,
	Cash: 0x0E,
	Quest: 0x0F,
	QuestLogButton: 0x11,
	StatusArea: 0x12,
	Waypoint: 0x14,
	MiniPanel: 0x15,
	Party: 0x16,
	TradePrompt: 0x17,
	MessageLog: 0x18,
	Stash: 0x19,
	Cube: 0x1A,
	ShowBelt: 0x1F,
	Help: 0x21,
	MercScreen: 0x24,
	ScrollOfInfuiss: 0x25
};

var Shop = {
	Sell:1,
	Buy:2,
	ShiftBuy:6
};

var CursorType = {
	Norm1:1,
	Norm2:2,
	Norm3:3,
	Norm4:4,
	Unk1:5,
	Identify:6
};
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
var ItemColor = {
	inferior: 5,
	normal: 0,
	superior: 3,
	magic: 3,
	set: 2,
	rare: 9,
	unique: 4,
	crafted: 8
};
var ItemColor = [0,5,0,3,3,2,9,4,8];

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

```
