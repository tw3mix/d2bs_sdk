[1]: https://markdown-here.com/livedemo.html
[2]: https://github.com/noah-/d2bs/blob/master/doc/globalFuncs.h
[3]: https://github.com/nitrotech7/D2BS_HTML_Log_Viewer
[@markdown live demo][1] <br />
[@How to MarkDown](https://dooray.com/htmls/guides/markdown_ko_KR.html) </ br>
[@d2bs global funcs][2] <br />
[@D2BS_HTML_Log_Viewer][3] <br />

# D2_ColorCodes

`ÿc + [1,2,3,4,5,6,7,8,9,0,  `
ÿ is made with: ALT + 152
![d2_colorCodes](/image/D2_ColorCodes.jpg "d2 color code")

# d2bs hotkeys

Here is just a quick run through of what each current key is, and what it will do for bot

![default key](/image/defaultkey.png "d2bs default key")

### default keys

---
JS column: T (ToolsThread.js) , M (MapThread.js) , H (HeartBeat.js) , U (UserAddon.js) , O (other scripts)

| __KeyCode__ | __Key__ | __JS__ | __Variable__ | __Action__ |
|:---:|:---:|:---|:---:|:---:|
|   |   |   |   |   |
| 17 | `Ctrl` |   |   |   |
| 19 | `Pause/Break`  | H | <pre>togglePause() | <pre>Pause/Resume bot |
| 32 | `Space` | U | <pre>FileTools.copy | <pre>copy the charconfig with name of char included |
| 33 | `PageUp` |   |   |   |
| 34 | `PageDown` |   |   |   |
| 36 | `Home` | T | <pre>show, hideonsole() | <pre>`Alt` + `Home` input console  |
| 45 | `Insert` | O | <pre>c (Test.js) | <pre>print ... |
| 46 | `Delete` |   |   |   |
| 96 | `Num 0` | M | <pre>getHook("Next Area") | move to next area |
| 97 | `Num 1` | M | <pre>getHook("Previous Area") | move to previous area |
| 98 | `Num 2` | M | <pre>getHook("Waypoint") | move to wp |
| 99 | `Num 3` | M | <pre>getHook("POI") | move to Point of Interest |
| 100 | `Num 4` | M | <pre>getHook("Side Area") | move to side area |
| 101 | `Num 5` | T | <pre>scriptBroadcast("mule") | Automuling |
| 102 | `Num 6` | T | <pre>MuleLogger.logChar() |   |
| 103 | `Num 7` | M | <pre>Hooks.monsters.enabled | show/hide monsters |
| 104 | `Num 8` | M | <pre>Hooks.vector.enabled | show/hide vectors |
| 105 | `Num 9` | T | <pre>print(this.getNearestPreset()) |   |
| 106 | `Num *` | T | <pre>Precast.doPrecast(true) | activate the precast/buff |
| 107 | `Num +` | T | <pre>showConsole() ... | print real FCR IAS FBR FHR |
| 109 | `Num -` | T<br/>O | <pre>Misc.spy(me.name) <br/> go (CrushTele.js) | <pre>Log someone's gear <br/> autoteleport in strategic areas |
| 110 | `Num .` | T | <pre>say("/fps") | shows frames/sec |
| 111 | `Num /` |   |   |   |
| 123 | `F12`  | T | <pre>revealLevel(true) | show/hide map |
|   |   |   |   |   |

# d2bs core commands

### chat commands

press and type:

> * .start -
> * .stop - will stop the current scripts. the profile will crash and it will be restarted in few seconds
> * .reload - will stop and reload the scripts. you are able to change config while in game.
> * .flushcache -
> * .load -

### white console(layer)

display status messages out of game as well as in game:

> * < HOME > to show/hide console just for viewing
> * < ALT >+< HOME > to open the console for input, allows you to type commands into it
> * < Page up >/< Page down > scrolls console text when it's open for input.
> * the same chat commands without . prefix:
> * start -
> * stop - will stop the current scripts. the profile will crash and it will be restarted in few seconds
> * reload - will stop and reload the scripts. you are able to change config while in game.
> * flushcache -
> * load
> * include - other scripts can be loaded: include("common/prototypes.js");
> * any other command is interpreted as a javascript string and will be executed (as per the old .exec).
> * all output is directed to the console instead of to the screen.
> * < Up arrow > will show the latest command that you typed in the console. Up/Down arrows will show different commands entered in the console
> * you can type on the console different javascript lines:

    var ip = Number(me.gameserverip.split(".")[3]);
    print("IP of the game: " + ip);

``` and the result will be: ```

    IP of the game: ... (the last part of the IP)

> * one defined variable (like ip) remains defined in that game, even you type reload in the meantime.
> * to find the mouse coordinates type:

    getMouseCoords(1);

``` and you'll get the X, Y coordinates. ```

<style>.table-2 table { text-align: right;  }</style>

<div class="ox-hugo-table table-2">
<div></div>
<div class="table-caption">
  <span class="table-number">Table 2</span>:
  Table with caption, with right-aligned text
</div>

| h1       | h2       | h3       |
|----------|----------|----------|
| abcdefgh | ijklmnop | qrstuvwx |

</div>

