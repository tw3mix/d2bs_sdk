# d2bs hotkeys

Here is just a quick run through of what each current key is, and what it will do for bot

### default keys

---
\# T (ToolsThread.js) , M (MapThread.js) , U (UserAddon.js) , O (other scripts)

| __Javacode - Key__ | # | __variable__ | __action__ |
|---|---|---|---|
|   |   |   |   |
| 17 - Ctrl |   |   |   |
| 19 - Pause/Break  | T | togglePause() | Pause/Resume bot |
| 32 - Space | U | FileTools.copy | copy the charconfig with name of char included |
| 33 - Page Up |   |   |   |
| 34 - Page Down |   |   |   |
| 36 - Home |   |   |   |
| 45 - Insert | O | c (Test.js) | print ... |
| 46 - Delete |   |   |   |
| 96 - Num 0 | M | getHook("Next Area") | move to next area |
| 97 - Num 1 | M | getHook("Previous Area") | move to previous area |
| 98 - Num 2 | M | getHook("Waypoint") | move to wp |
| 99 - Num 3 | M | getHook("POI") | move to Point of Interest |
| 100 - Num 4 | M | getHook("Side Area") | move to side area |
| 101 - Num 5 | T | scriptBroadcast("mule") | Automuling |
| 102 - Num 6 | T | MuleLogger.logChar() |   |
| 103 - Num 7 | M | Hooks.monsters.enabled | show/hide monsters |
| 104 - Num 8 | M | Hooks.vector.enabled | show/hide vectors |
| 105 - Num 9 | T | print(this.getNearestPreset()) |   |
| 106 - Num * | T | Precast.doPrecast(true) | activate the precast/buff |
| 107 - Num + | T | showConsole() ... | print real FCR IAS FBR FHR |
| 109 - Num - | T <br/> O | Misc.spy(me.name) <br/> go (CrushTele.js) | Log someone's gear <br/> autoteleport in strategic areas |
| 110 - Num . | T | say("/fps") | shows frames/sec |
| 111 - Num / |   |   |   |
| 123 - F12  | T | revealLevel(true) | show/hide map |
|   |   |   |   |

# d2bs core commands

#### chat commands
press and type:

> .start -
> .stop - will stop the current scripts. the profile will crash and it will be restarted in few seconds
> .reload - will stop and reload the scripts. you are able to change config while in game.
> .flushcache -
> .load -
