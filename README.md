[1]: https://markdown-here.com/livedemo.html
[2]: https://github.com/noah-/d2bs/blob/master/doc/globalFuncs.h
[3]: https://github.com/nitrotech7/D2BS_HTML_Log_Viewer
[4]: https://github.com/D2etal/
[5]: http://tools.harrogath.com/affixcalc.html

# other page link
 - [markdown live demo][1] <br />
 - [How to MarkDown](https://dooray.com/htmls/guides/markdown_ko_KR.html) <br />
 - [d2bs global funcs][2] <br />
 - [D2BS_HTML_Log_Viewer][3] <br />
 - [D2etal github][4] <br />
 - [Item Affix Calculator (pickit support)]

# d2bs hotkeys

Here is just a quick run through of what each current key is, and what it will do for bot

![default key](/image/defaultkey2.png "d2bs default key")

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
- {+ addition 1 +}
- [+ addition 2 +]
- {- deletion 3 -}
- [- deletion 4 -]

