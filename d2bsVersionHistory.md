Version History:
===============

```
Version 1.4 -

	.	API changes:
		- Added useStatPoint(statid, count) and useSkillPoint(skillid, count)--no significant error checking
		  is done, so be careful or you may cause a crash (or worse, a ban)!
		- Added loadMpq(string mpqname) (this allows you to switch cd keys on the fly)
		- Added me.revive()--no error checking is done, so you may cause a ban if you're not dead
		- Added takeScreenshot()--this is the same as pressing the print screen key in D2
		- Added me.pid--this returns the process id for the current D2 that D2BS is loaded to
		- Added me.nopickup--returns the current nopickup setting, and allows you to enable/disable nopickup
		- Added me.mapid--returns the current map seed
		- Added me.profile--returns the last profile used for login() OR the profile set as the default
		- Renamed getTextWidthHeight to getTextSize
		- Changed the return from getPath--now it returns an array of objects with x and y properties
		- Added support for setting skills from item charges (me.setSkill(skill, hand [, item object]) where
		item object is the result of getUnit(TYPE_ITEM))

	.	Fixes:
		- say() fixed to properly detect the screen location and correctly encode % characters
		- Multiple problems with screenhook clicking and hovering.
		- Signed/unsigned problems with stat ids 13, 29 and 30
		- Channel chat input parsing
		- unit.getStat(-2) now properly bitshifts life, mana, and stamina
		- clickMap no longer crashes with a null 'unit' argument
		- FileTools functions now correctly use the locking API
		- Unit.getFlags() now correctly works
		- me.cancel no longer affects the automap
		- The D2BSScript object is now initialized properly like all the others
		- The event code now correctly returns a 32-bit integer--this was similar to the old getUnit bug, but
		  more subtle

	.	Added partial support for TCP/IP games in login()

	.	Had to revert the new map code--it wasn't working for all area exits, and existing scripts rely
		on that behavior. :(

	.	Changed the Warden behavior so that you can load D2BS without cGuard, and it will terminate on
		Warden if not loaded with cGuard

	.	Upgraded the SQLite library to version 3.7.5

	.	Downgraded "Game not ready" exception from an error to a warning.

	.	Added the ability to change the default starting script names, as well as the ability to let the
		profile specify both the script path and the default starting script names (see the new values in
		d2bs.ini for more details)

	.	Added the ability to specify the profile to use *before* calling login():
		- The profile is activated by the first time you call login() OR
		- The first WM_COPYDATA message with an ID of 0x31337 (the data is treated as a profile name) OR
		- The first XTYP_POKE sent via DDE (the data is treated as a profile name) OR
		- Setting the profile via the "profile" command on the console.
		- After the first profile is set, you cannot change it. However, specifying a different profile
		  via login() will allow you to login using a different profile (but me.profile will *not* be
		  updated, it will remain as-is, and the script path will remain the same)

	.	The console is now scrollable using page up/down. Only the last 300 lines are saved.

	.	Added new debug code! D2 will now silently crash when it does crash (no more "Window not found"
		errors!), and will output debug information to D2BS.log.

	.	Known issues:
		- Calling say() in game causes a crash. Dunno exactly why yet. Just don't do it.
		- getBaseStat does not correctly detect the end of the the item table. Calling it with a rowid greater
		  than the last rowid will cause a crash.

Version 1.3.3 -

	.	Fixed OOG_GetLocation for Lost Connection

	.	Changed the internal unit finding code to use D2's unit hash tables. (Speeds up Unit finding by a
		couple orders of magnitude.)

Version 1.3.2 -

	.	Changed the internal unit finding code to use an internal list instead of room searching.

	.	Fixed sendDDE (multiple bugs, the least of which was an unused parameter...)

	.	Fixed me.cancel once again to detect scrolling text ("summoner bug")

	.	Fixed a rather large memory leak with Script::GetFilename (d'oh!)

	.	Removed some of the strictness checks for getBaseStat (got sick of trying to debug it).

	.	Fixed an issue where getScript could return a script that had no valid parameters, meaning
		it would just error when you tried to use it.

	.	Added "param2" parameter to the "gameevent" event. You may now detect what kind of party
		message you just got (hostile vs. invite vs. accept, etc.)

Version 1.3.1 -

	.	Fixed me.cancel(1) (was using the wrong function pointer... whoops!)
		(this also fixes the "gamble bug")

Version 1.3 -

	.	Updated to 1.13c

	.	Various leaks and bugs fixed, nothing major

	.	"chatmsg" and "whispermsg" now listen to channel events as well as in-game events.

	.	Lots of little stability fixes and whatnot.

Version 1.2.1 -

	.	Reverted to packet-based shopping, the internal method we were using seems to still be buggy.

	.	Fixed various places where scripts/functions could inadvertantly fail due to internal mishandling
		of game state.

	.	Fixed addProfile--it wasn't correctly adding profiles anyway.

	.	Made all profile settings be in SECONDS. This means you MUST EDIT YOUR D2BS.INI APPROPRIATELY.

	.	Added a new property, me.gameReady. Previously, functions that required the game to be ready
		would simply return undefined if the game wasn't ready, now they will wait on the game to be
		ready. If you wish to do your own processing instead, then you should test me.gameReady to see
		if the core would block while waiting for the game. You don't need to do anything to benefit
		from this change, as the default behavior is now just a little more correct.

Version 1.2 -

	.	Fixes:
		- me was not getting reset between games with the script cache enabled
		- various interactions used to incorrectly cause deadlocks when the client was minimized
		- getUnit now correctly interprets the gid parameter
		- itemdrop has been renamed to itemaction, and passes different parameters:
		  gid, mode, code, globalEvent. gid is still the item's gid, mode is the type of action
		  (I'll make a list later), code is the item code, and globalEvent is whether the action
		  came from a 9c or 9d packet.
		- Added new event: gameaction, triggers on 0x5a packets, params vary based on the action.
		  See the breakdown in the packet list sticky for more info.
		- various crashes with images, including one where the version background image didn't exist
		- Events now use their own independent context, to help prevent crashes.

	.	Made all classes properly exposed to the scripter so they can be properly extended.

	.	Made scripts wait less time while trying to stop, as the old duration was ridiculous.

	.	Added/changed new functions/properties:
		- selectCharacter -- takes the profile name, selects the character specified by that profile.
		- Area.exits -- now returns the exit array instead of the number of exits
		- getExits -- removed in preference of Area.exits.
		- Exit.id -- renamed to Exit.level
		- showConsole -- shows the console
		- hideConsole -- hides the console

	.	Updated sqlite version to 3.6.22.

	.	Turned on compiler optimizations (finally).

	.	Screenhook images are now cached. You only have to load them once, and any further loads
		will return the same image.

	.	Changed screenhook handling so that hidden screenhooks no longer are considered for drawing
		period, meaning they're MUCH faster.

	.	Changed the logo drawing code similarly, so that it draws on its own without being treated
		as a screenhook (which means it always draws centered and draws much faster)

	.	Changed the console drawing code similar to above, so that it handles long lines correctly
		without being broken (this includes input, which drops to a newline on long lines).

	.	Changed the handling for commands, you no longer have to print() the result you want--the
		last value is printed by default now.

	.	Loader changes:
		- Added a new (and very cool) splash screen (thanks to Game_Slave for designing it!)
		- Changed the default delay for child process detection to 1 second (up from .5 second)

Version 1.1.2 -

	.	Changed item.getPrice to item.getItemCost, getPrice is still there but marked as deprecated
		- you can ignore warnings about it, it doesn't harm anything

	.	Added me.fps -- returns the current FPS (obviously)

	.	Added item.getItemCost(mode[, classid[, difficulty ] ])
		mode: 0 = buy, 1 = sell, 2 = repair
		classid: any npc classid (default is the current npc)
		difficulty: 0 = normal, 1 = nightmare, 2 = hell (default is the current difficulty)

	.	Added me.getRepairCost([ classid ]) -- again, the classid is any npc classid with the default
		being the current npc

	.	getUnit() now accepts a mask for the mode parameter.
		To use it, set bit 30 (0x20000000) to on, and then every bit from 1-28 is
		treated as a mode bit--the unit must match at least one of the modes specified
		i.e.:
		getUnit(1, null, null, 0x2000001F); // finds monsters with any mode from 0-4

	.	Corrected item.getStat(-2) output (was adding a bunch of invalid properties)

	.	Made me.runwalk able to be set--now you can toggle run/walk from a script

	.	Loader changes:
		- Made it take a guess where the Diablo II directory is
		- Made it able to find the child process of Diablo II.exe--you no longer have to specify game.exe!

	.	Fixed a race condition where D2BS was racing with the game in various places
		- This means you no longer get corrupted graphics occasionally, and D2BS is much more stable
		- Additionally, switched to the internal method of buying/selling instead of using packet-based
		  as it no longer crashes!

	.	Fixed room.reveal to not be quite as buggy or crash-happy as before (all you maphackers, this
		means game on!)

	.	Fixed a (relatively stupid) crash with scriptBroadcast and more than 1 argument

	.	Fixed SQLite crash when closing the DB when there were open queries (d'oh... stupid iterators...)

	.	Fixed script.send to handle multiple arguments correctly (d'oh!)

	.	Corrected bug with monster enchantments not being correctly detected

	.	Corrected types for integer values from SQLite--was causing a wraparound for values over ~2 billion

	.	Known issues:
		- Certain item stats are still not correctly handled, which means you have to sort out the value
		  on your own (most are just value >> 8)

Version 1.1.1 -

	.	Included in this release is a build for the 1.13 PTR. To use it:
		- open D2BS.exe, click on options (if not greeted with the options dialog)
		- change the D2BS DLL from cGuard.dll to D2BS.dll
		- keep in mind that you MUST change it back if you switch back to 1.12

	.	Fixes for numerous things, including a lot of core stability.
		- Clicking on the window UI elements caused a click event with negative values.
		- Deadlocks all over the place, especially with the script cache.
		- Running a command via .exec or the console would screw the script list up.
		- Calling include could sometimes cause crashes.
		- Made (most, if not all) paths that get displayed to the user/exposed to the scripter
		  relative to the scripts folder.
		- getScript, script.send, and scriptBroadcast now don't crash
		- script iteration (internally) now correctly holds the engine lock long enough
		  to ensure that the list is valid until iteration is complete
		- console/.exec commands no longer invalidate the script list (d'oh!)
		- me.blockMouse would cause the entire window to lock up when the title bar was clicked
		  while it was enabled
		- unit.getMinionCount no longer crashes in release mode
		- getArea now correctly interprets no parameter as me.area (d'oh...)
		- Changed item.shop to packet-based shopping for now--the internal function we were using was
		  causing crashes while minimized
		- Sheppard, with the last minute assist, corrected a bunch of incorrect D2 functions (thanks!)

	.	Split up events a bit further to make them less spammy, and added a few more events to
		assist with this change
		- melife now spawns only for life changes
		- memana spawns only for mana changes
		- itemdrop no longer includes gold drops
		- golddrop now spawns for only gold drop events

	.	Lots of internal buffers were shrunk down to more acceptable levels to combat memory usage

	.	Scripts no longer randomly resume when the GC is called.
		- a side effect of this is that sometimes scripts that were destructed don't always get
		  removed so occasionally it can crash (we haven't experienced it frequently enough to debug
		  it at all)

	.	Lots of loader changes:
		- To sum up:
			. x86/x64 no longer matters for the injector, it uses x86 period.
			. --inject and --kill check that the pid is a valid d2 window.
			. --dll lets you specify what dll to inject, the default if you don't specify one is
			  cGuard.dll.
			. --params sends everything after it to d2.
			. --path lets you specify the path to d2.
			. --exe lets you specify the d2 executable.
			. --save causes it to write a configuration file for future use.
		- Fixed a bug where the loader would assume you had no sane configuration when you really did.
		- The loader now exposes a number of useful internal functions for other .NET assemblies.

	.	A few API details:
		- rnd has been renamed to rand, and now uses the game's internal RNG when you're in-game
		- units now have an islocked property that tells you if a chest is locked
		- runGC is now gone, iniread and iniwrite will soon follow
		- All screenhooks have had a zorder property for a while, but now it's actually used (someone
		  commented out the sort...)
		- getUnit(4) now no longer scans a unit's inventory; this caused a series of infinite loop
		  bugs, so we had to axe it (it still scans ground items)
		- in return, unit.getItem has been changed to use the same parameters as getUnit (without the
		  type) and return the first inventory item that matches from the unit's inventory
		- unit.getNext has different behavior depending on where the unit came from:
			. if the unit came from getUnit, getNext will only scan units in the available rooms
			. if the unit came from unit.getItem, getNext will only scan units in the same
			  original owner's inventory
			. if the owner of the item from unit.getItem changes, getNext will return false
		- item.getStat(-2) returns an associative array (NOT an object with properties matching array
		  indexes) of all the item's stats and substats, and includes runeword properties (and
		  correctly interprets skills for on-funcs and charges)
		- getScript parameter additions: true now returns the current script, and passing the full
		  relative script name returns that script (or undefined if it's not running)
		- added createGame and joinGame functions for oog scripts

	.	Sped up print() by a factor of 30 when dealing with large strings.

	.	Events now use a different means of spawning, so they no longer cause horrific crashes that
		are hard to debug

	.	.start/.stop/.reload (and their console alternatives) now correctly figure out which script
		to start or stop, and .reload benefits from this as well.


Version 1.1 -

	.	Way too many fixes to detail. Here's a small sample:
		- getBaseStat was broken somehow, but that's fixed too.
		- unit.getParent is fixed too (though what was broken about it escapes me)
		- me.cancel is fixed as well (same as above)
		- me.ingame now correctly detects in-game between act changes.
		- graphics apparently are no longer corrupted on minimize

	.	Changed a number of core functions.
		- registerEvent(EVENT_*, function) --> addEventListener(eventName, function);
		- getScreenHook() --> new Line(), new Text(), new Box(), new Image(), new Frame()
		- Entire screenhook API
		- Entire file API
			FileTools object:
			Static Functions:
			remove - string name - remove a file based on name
			rename - string oldName, string newName -  rename a file
			copy - string original, string copy - copy file 'original' to 'copy'
			exists - string path - determines if a file exists or not
			readText - string path - open a file in read mode, read the full contents, return
				it as a string
			writeText - string path, object contents, ... - open a file in write mode, write
				the content parameters into the file, and close it, true if the write
				succeeded, false if not
			appendText - string path, object contents, ... - open a file in append mode, write
				contents into the file, close it, true if the write succeeded, false if not

			File object:
			Static Functions:
			open - string path, mode [, bool binaryMode [, bool autoflush [, bool lockFile]]] -
				open the specified file, return a File object, mode = one of the constants of
				the File object listed below, binaryMode = default setting of
				file.binaryMode, autoflush = default setting of file.autoflush, lockFile =
				if true lock the file on open and unlock it on close, so other
				threads/programs can't open it

			Functions:
			close - close the current file
			reopen - reopen the current file
			read - int num - read num amount of characters or bytes from the file, if in
				non-binary mode this will be null terminated
			readLine - read a single line from the file, assuming the line ends with \n or
				\r\n, throws an exception if the file is in binary mode
			readAllLines - read the full contents of the file and split it up into an array
				of lines, and return the array of lines, throws an exception if the file is
				in binary mode
			readAll - read the full contents of the file and return it as one big string or
				if in binary mode, array
			write - object contents, ... - write the specified byte/strings/objects/
				array-of-bytes to a file, throws an exception if not all of the parameters
				could be written to disk
			seek - int bytes [, bool isLines [, bool fromStart]] - seek the specified number
				of bytes, or optionally lines, in the file, optionally from the start of the
				file, stops at the end of the file
			flush - flushes the remaining buffer to disk
			reset - seek to the beginning of the file
			end - seek to the end of the file

			Properties:
			readable - can read from the file
			writable - can write from the file
			seekable - can seek within the file
			mode - the mode the file was opened in, one of the FILE_MODE constants of the
				file object
			binaryMode - determines if the file is in binary mode for read operations (write
				operations happen based on the parameter specified)
			autoflush - automatically flush the file buffer after each write, defaults to off
			length - the length of the file in bytes
			path - the name and path (relative to the scripts/ folder) of the file
			position - the current position in the file
			eof - determines if the file is at end-of-file or not
			accessed - a timestamp representing the last access time/date for the file
			created - a timestamp representing the creation time/date for the file
			modified - a timestamp representing the last modified time/date for the file
		- Lots of other minor things. Those are the major changes, though.

	.	Added some new global functions. I honestly don't even remember any more.

	.	Added a new Sandbox object that lets you include scripts without tampering
		with the global namespace.

	.	Re-added room.reveal.

	.	New injector to simplify your life and ours.

	.	Added a console to display status messages out of game as well as in game.
		- Pressing the HOME key shows the console, while ALT+HOME allows you to type
		commands into it.
		- The special commands 'start', 'stop', 'reload', 'flushcache', and 'load'
		work as per their chat box counterparts (only without the . prefix), but any
		other command is interpreted as a javascript string and will be executed (as
		per the old .exec).
		- All output is now directed to the new console instead of to the screen.

	.	Added hash algorithms: md5, sha1, sha256, sha384, sha512 and counterparts to work
		on files.

	.	Added configuration file for setting various things before scripts execute.
		See d2bs.ini for the specifics.

	.	Added a new oog function (login) to manage user accounts and character selection.
		See d2bs.ini for the specifics to this as well.

	.	Added a bunch of sample code in the form of test cases. These provide examples
		of how to use certain API functions. You can check the code out at:
		http://code.assembla.com/d2bs/subversion/nodes/scripts/testcases

	.	Complete-ish list of fixes: http://www.assembla.com/spaces/d2bs/tickets?tickets_report_id=5

	.	Known issues:
		- sometimes the core just deadlocks, we're not sure exactly why.
		- anything listed here: http://www.assembla.com/spaces/d2bs/tickets?tickets_report_id=1

Version 1.0 -

	.	Updated D2BS to Patch 1.12a.
	
	.	Added cGuard Anti-Detection.

	.	Added getPlayerFlag(int firstUnitId, int secondUnitId, int flag);

	.	Added EVENT_PLAYERASSIGN event.
		Code:
			registerEvent(EVENT_PLAYERASSIGN, assignPlayer);
			function assignPlayer(unitid)
			{
				var player = getUnit(0, null, null, unitid);
				if(player) print("New player: " + player.name);
			}

	.	Added unit.getEnchant( int enchantid );

	.	Added getBaseStat:

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
				
	.	Removed Message() function.
	
	.	Removed room.reveal() function.

	.	Fixed clickParty(partyobj, 3);
		no longer causes a crash also it will leave the party now!

	.	Fixed say();
		no longer causes the stack to fuck up!

	.	Fixed getUnit(type, [classid, [mode, [unitid]]]);
		mode finally works on items now aswell!
		
	.	Fixed room.getCollision();

Version 0.9.0.4 -

	.	Added a missing LeaveCriticalSection which caused the scripts to stop.

	.	Added Maplayer drawing, just define the screenhook type with one of the automap types.
		
		Automap Line	: 3
		Automap Box	: 4
		Automap Image	: 5		

		Example:

		var sh = getScreenHook();

		sh.x = me.x;
		sh.y = me.y;
		sh.font = 6;
		sh.color = 1;
		sh.type = 4;
		sh.text = "Hello!";

	.	Added room.reveal(); - allows you to reveal rooms! I included a lite maphack in the scripts folder.

	.	Added local storage via SQLite. See http://www.edgeofnowhere.cc/viewtopic.php?t=397403&start=0 for the API.

	.	Fixed playSound(integer soundid); - henceforth it plays all sound ids!

	.	Fixed the D2BS Logo Background, it was screwed when the resolution was set to 640x480.

	.	Fixed a bug in the Screenhooks which caused to draw a line if x2 and y2 is undefined.

	.	Fixed another bug in the Screenhooks which caused a crash.

	.	The goddamn toolsthread stoppage in NTBot is finally fucking fixed. In fact, scripts randomly stopping in general has been fixed. 

	.	unit.fname and item-related-friends return undefined on units that aren't items. Finally. 

	.	All outstanding compiler errors with the latest SVN source are fixed.

	.	print now outputs "undefined" if you call it with an undefined value, instead of printing nothing.

	.	version(1) now returns the version number as a string, instead of attempting to cast it to an int.

	.	Fixed minor misspellings in various warnings, removed some really stupid warnings that don't need to exist.

Version 0.9.0.3 -

	.	Fixed Screenhooks, those caused a crash when your script stopped.

	.	Fixed unit detection

	.	Fixed an issue with sendCopyData

	.	Fixed clickItem(), works now well with items that have a height of 4 rows

	.	Fixed a bug in clickMap, that could cause the bot to stop. Thanks Kimsout!

	.	gold(int amount, [mode]); has been rewritten.

	.	Added item.suffixnum along with item.prefixnum - returns the prefix/suffix number.

Version 0.9.0.2 -

	.	Fixed getArea(), it crashed when you tried to pass a value that is not an integer.

	.	Fixed getUnit(UNIT_TYPE); - Thanks to lord2800 for pointing that out!

	.	Fixed stop(); - Will no longer crash if you call it with the command line.

	.	Fixed print(); - Will no longer crash if you pass a text that is longer than 2048 chars.

	.	Rewrote Screenhooks!

		Example:
			sh = getScreenHook();
			sh.type = 1; // 0 = Line, 1 = Box, 2 = Image
			sh.x = 100;
			sh.y = 100;
			sh.x2 = 200;
			sh.y2 = 200;
			sh.text = "I'm a box hook, eek!";
			sh.color = 4;
			sh.font = 1;

			// Using Image hooks works like this,
			sh = getScreenHook();
			sh.type = 2;
			sh.image = "DATA\\GLOBAL\\UI\\FrontEnd\\textbox2";
			sh.x = 100;
			sh.y = 200;

	.	Added unit.getStat(-1); - It will return a list of all stats that belong to a unit.	
		Example:
			stats = item.getStat(-1);
			for(var i = 0; i < stats.length; i++)
				print("Index: " + stats[i][0] + ", SubIndex: " + stats[i][1] + ", Value: " + stats[i][2]);

	.	Added md5([String/Integer]);

Version 0.9.0.1 -

	.	Screenhooks do now work out of game!

	.	Imagehooks do work now again! Simply pass a mpq path or a file path.
		Example:
		sh = getImageHook();
		sh.x = 100;
		sh.y = 100;
		sh.image = "DATA\\GLOBAL\\ui\\panel\\arrow6";	// loads the out of arrows image

	.	Added D2BS Loader!

	.	Renamed "oog.dbj" to "starter.dbj"!

Version 0.9.0.0 -

	.	Fixed item.shop(); - It will no longer crash when executed minimized!

Version 0.8.9.9 -

	.	Added Tile Exits to the Exit units!
		You can determinate if a Unit is a level exit or a tile exit by using unit.type
		1 = Level, 2 = Tile

	.	Added a new mode to clickItem!
		You can click merc items now by using clickItem(3, BodyLocation) or clickItem(3, itemobject);
		Valid Bodylocations of the merc are
		1 - Helmet
		3 - Armor
		4 - Weapon
		5 - Shield

	.	Updated me.getMerc(mode);
		If you call me.getMerc(1); it will return wether your player has a merc or not.
		me.getMerc(2); returns the locale string index, you can grab the name off it by using getLocaleString();
		me.getMerc(3); returns the revive cost.

	.	Fixed EVENT_COPYDATA - Thanks to McGod (Aka Chipped)

	.	Fixed item.getStat(); - Thanks to lord2800 and Kimsout for pointing that out.

	.	Updated say(); - works now out of game aswell (You have to be in the chat to use this!)

	.	Updated print(); - works now out of game aswell (You have to be in the chat to use this!)

	.	Added a few more CriticalSections

Version 0.8.9.8 -

	.	Added some CriticalSection code! (Makes d2bs more stable)

	.	Added getRecentNPC();

	.	Fixed say();

	.	Fixed item.shop(); it caused a crash when it was executed while Diablo was minimized.

Version 0.8.9.7 -

	.	Added unit.direction; (Useful for Missiledodge!)

	.	Enabled Screenhook clicking!

	.	Fixed room.getCollision(); Finally works without problems!

	.	Added getMercHP(); Returns the % life of your merc!

Version 0.8.9.6 -

	.	Fixed me.gametype (I forgot to add a * ;/)

	.	Added socket.recv(event); !

	.	Rewrote the EVENT_CHATMSG stuff

Version 0.8.9.5 -

	.	Rewrote submitItem(); - Doesn't simulate a click anymore!

	.	Rewrote unit.overhead(text); - Doesn't spoof a packet anymore!

	.	Fixed a memory problem while executing events.

	.	Fixed me.gametype (Should work proper now!!)

	.	Fixed a bug in the spidermonkey ErrorReporter, it will close the errorlog after it wrote to it.

	.	Added ExtraWork Check (Will terminate Diablo as soon as a ExtraWork is loaded by Diablo)

	.	Added CheckRevision Check (Will terminate Diablo if a unknown CheckRevision was loaded)

	.	Added checkCollision(unit1, unit2, bitmask); // returns if units have line of sight to each other
		Bitmask:
			bit 0 : block walk
			bit 1 : block light + block Line Of Sight (the possibility to see monsters)
			bit 2 : block jump (and teleport I believe)
			bit 3 : block Player's walk but not Mercenary's walk (weird)
			bit 4 : ?
			bit 5 : block light only (not LOS)
			bit 6 : ?
			bit 7 : ?
		Return 0 or 1. 0 = Has Line Of Sight, 1 = Does NOT Have Line Of Sight

	.	Added Socket units! D2BS can now connect to the IRC or where ever you would like to!
		Example:
			sock = getSocket();
			sock.ip = "irc.synirc.net";
			sock.port = 6667;
			sock.connect();
			sock.send("NICK aD2BSSocket\n");
			... // What ever you'd like to have here!
			sock.close();

	.	Added item.bodylocation
			0  : Not Equipped
			1  : Head
			2  : Amulet
			3  : Body
			4  : Right Primary Slot
			5  : Left Primary Slot
			6  : Right Ring
			7  : Left Ring
			8  : Belt
			9  : Feet
			10 : Gloves
			11 : Right Secondary Slot
			12 : Left Secondary Slot

	.	Added unit.itemcount

	.	Added unit.owner; returns the id of the owner (eg, single player, 1 for you, -1 for no owner)
		This is meant as an alternative for getParent(); which will be phased out eventually
		When used on a missile, returns the id of the owner of the missile

	.	Added unit.ownertype; returns the owner type of a missile (0 player, 1 npc/monster)

	.	Added item.ilvl; returns the level of the item.

	.	Added me.quitonerror; Defaults to 0, set this to 1 to have a script automatically quit if an error occurs.
		Not recommended to set this until your script is mature, this is just to prevent the odd misc error from stopping infinite runs.

	.	Moved to Spidermonkey 1.7.0! Make sure you use the newst js32.dll!
		Check the changelog of it here http://www.mozilla.org/js/spidermonkey/release-notes/JS_170.html
		New in JavaScript 1.7 -> http://developer.mozilla.org/en/docs/New_in_JavaScript_1.7

Version 0.8.9.4 -

	.	Added unit.getMerc();

	.	Added unit.getMinionCount([ClassId]);

	.	Fixed item.shop(); - Finally item selling works

Version 0.8.9.3 -

	.	Added some more checks into Unit related functions. It will make D2BS more stable (hopefully!)

	.	Fixed a bug in getCursorType(); - Forgot to change JSVAL_TO_INT to INT_TO_JSVAL! (D'oh)

	.	Included a Identifying example into default.dbj

Version 0.8.9.2 -

	.	Added item.description

	.	Added getCursorType([optional 1]);
		Returns the cursor type of your cursor, pass one to see "Shop Mode" cursor types.

		Regular Modes: 1 = regular, 3 and 4 = item on cursor, 6 = id scroll, 7 = shop cursor

		Shop Mode (7): 1 = regular, 2 = repair, 3 = buy, 4 = sell


Version 0.8.9.1 -

	.	Fixed a bug in clickItem! Clicking items right should work now!!

Version 0.8.9 -

	.	Added JS_MaybeGC to the CallBack function to free not used memory (Which makes D2BS much more stable!)

	.	Fixed clickItem! Works now proper for stash

Version 0.8.8 -

	.	Fixed unit.cancel([int type]);

	.	Fixed a bug that could cause a crash in the unit code.

	.	Fixed a bug in unit.getParent()

	.	Fixed a bug that could cause a crash in item properties.

	.	Added sendDDE

	.	Rewrote say( string text ); 
		No longer using Packets for this.

Version 0.8.7 -

	.	Added getRoom stuff. It's similar to the D2JSP functions,

	.	Added getScript stuff. It's similar to the D2JSP functions.

	.	Note: I'm remaking the Script documentation.

Version 0.8.6 -

	.	Rewrote unit.useMenu - Thanks to Darawk for helping me to disable
		the padding in the NPCMenu struct.

Version 0.8.5 -

	.	Added Belt left/shift rightclick to clickItem. I'm sorry about that,
		I forgot to add it last version!

Version 0.8.4 -

	.	Fixed a crash that appeared if you define Text in screeenhooks before
		you define the font!

	.	Rewrote unit.shop(); - It uses now the Diablo II function instead of
		sending a packet.

	.	Rewrote clickItem!
		clickItem(button,[other..]); // button: 0=left, 1=right, 2=shift left click(put to belt) params are as follows:
		either pass: x, y, location (0,0 is top left, always, 1,1 is one left, one down in the grid, etc
			location=: 0=inventory, 2=player trade, 3=cube, 4=stash, 5=belt
		Or, if you'd like to simply click an item already in your inv/stash/cube, etc: clickItem(button,item);
		Also, you can call your body location: clickItem(body_location);


Version 0.8.3 -

	.	Fixed a crash that appeared when the SpiderMonkey ErrorReporter tries to
		submit a very long crash message. It will print Messages that will crash
		Diablo to a file (ErrorReport.log). 
		Thanks to Chipped for reporting it :~)

Version 0.8.2 -

	.	Fixed clickMap! It will no longer crash when you call it with a unit!

	.	Rewrote clickItem!

	.	Changed compiling settings from MultiThreaded to SingleThreaded (This fixed all HeapFree crashes!)

	.	Changed CleanUp function

	.	Added js_strict([bool flag]);

	.	me.getSkill is now similar to the d2jsp one!

version 0.8.1  -

	.	Added me properties (Check the command reference)

	.	Updated the Command Reference at EoN!

	.	Fixed unit.interact(); <- Didn't work proper with wps.

	.	Added core chickening..

	.	Changed clickMap, Unit's will get now namelocked before the actual click gets send.

version 0.8  -

	.	Fixed getExits();

	.	Reworked getCollision(x,y);

	.	Added Control units!

	.	Added OOG Script ability.

	.	Added a EVENT_COPYDATA!
			The first parameter is the mode and the second is a string.
			Example:
				registerEvent(pfunc, EVENT_COPYDATA);
				function pfunc(a,b)
				{
					printf(a + ": " + b);
				}

	.	Fixed another crash that appeared when D2BS was about to build a CollisionMap.

	.	Fixed getWaypoint(int area); - Thanks to Chipped for reporting this!

	.	Added unit.spectype!

version 0.7.3  -

	.	Fixed the crash that happened during building CollisionMap & PresetUnit.

version 0.7.2  -
	.	Added unit.returnNext(); - because Zoxc was slapping me all day for it

	.	Added clickItem(item || x,y,buffer);

version 0.7.1 -
	.	Fixed copyUnit, thanks to Zoxc and LivedKrad for reporting it!

version 0.7 -
	.	Reworked unit.interact();

	.	Added npc.useMenu( int );

	.	Added unit.getItems();
		- Returns a Array of items in the it has in it's inventory.

	.	Added unit.getSkill(Mode|Skillid [, Ext] );
		if unit.getSkill is called like this unit.getSkill(0, 2);
		it will return the current selected right skillname.
		Modes:
		0 - Right Hand Skill Name
		1 - Left Hand Skill Name
		2 - Right Hand Skill Id
		3 - Left Hand Skill Id
		if it's called only with the skillid it will return the skill level.

	.	Added Party Object. Check the Command Reference at EoN for more informations.

	.	Added item.shop(NPC Object, mode);

	.	Added iniread, iniwrite to the core.

version 0.6 -
	.	Fixed a bug that caused a crash when using copyUnit with a invaild Object

	.	Fixed a bug in the Screenhooks that caused a crash when you defined 
		text before a font.

	.	Added me.cancel();

	.	Added me.repair();

	.	Added item.getPrice([NPCObject or NPC ClassId, 0/1 Buy or Sell, Difficult]);

version 0.5 -
	.	Added Screenhooks!
		Take a look at the COmmand Reference
		http://www.edgeofnowhere.cc/viewtopic.php?t=377768&start=0

version 0.4 -
	.	Added unit =  copyUnit( unit );

	.	Fixed a bug in the Core that caused a crash.

version 0.3 -
	.	Added AreaUnit =  getArea ( [int areaid ] );
		Example: print(getArea(me.area).name); // Prints out the current AreaName!

	.	Added ExitArray = getExits ( AreaUnit );
		Note: Take a look at the Command Refernece -> http://www.edgeofnowhere.cc/viewtopic.php?t=377768&start=0

version 0.2 -
	.	Fixed getPath, returns now a fully working Path!

version 0.1 -
	.	Inital Release
```
