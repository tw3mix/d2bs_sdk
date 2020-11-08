### default keys

---
JS column: T (ToolsThread.js) , M (MapThread.js) , H (HeartBeat.js) , U (UserAddon.js) , O (other scripts)

| __KeyCode__ | __Key__ | __JS__ | __Variable__ | __Action__ |
|:---:|:---:|:---|:---:|:---:|
|   |   |   |   |   |
| 17 | `Ctrl` |   |   |   |
| 19 | `Pause/Break`  | H | togglePause() | Pause/Resume bot |
| 32 | `Space` | U | FileTools.copy | copy the charconfig with name of char included |
| 33 | `PageUp` |   |   |   |
| 34 | `PageDown` |   |   |   |
| 36 | `Home` | T | show, hideonsole() | `Alt` + `Home` input console  |
| 45 | `Insert` | O | c (Test.js) | print ... |
| 46 | `Delete` |   |   |   |
| 96 | `Num 0` | M | getHook("Next Area") | move to next area |
| 97 | `Num 1` | M | getHook("Previous Area") | move to previous area |
| 98 | `Num 2` | M | getHook("Waypoint") | move to wp |
| 99 | `Num 3` | M | getHook("POI") | move to Point of Interest |
| 100 | `Num 4` | M | getHook("Side Area") | move to side area |
| 101 | `Num 5` | T | scriptBroadcast("mule") | Automuling |
| 102 | `Num 6` | T | MuleLogger.logChar() |   |
| 103 | `Num 7` | M | Hooks.monsters.enabled | show/hide monsters |
| 104 | `Num 8` | M | Hooks.vector.enabled | show/hide vectors |
| 105 | `Num 9` | T | print(this.getNearestPreset()) |   |
| 106 | `Num *` | T | Precast.doPrecast(true) | activate the precast/buff |
| 107 | `Num +` | T | showConsole() ... | print real FCR IAS FBR FHR |
| 109 | `Num -` | T<br/>O | Misc.spy(me.name) <br/> go (CrushTele.js) | Log someone's gear <br/> autoteleport in strategic areas |
| 110 | `Num .` | T | say("/fps") | shows frames/sec |
| 111 | `Num /` |   |   |   |
| 123 | `F12`  | T | revealLevel(true) | show/hide map |
|   |   |   |   |   |
