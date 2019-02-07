```javascript
	if (getScript("d2botmap.dbj")) {
		load("tools/mapthread.js");
		load("tools/ToolsThread.js");

/* Editted 2018-12-08 */
		Config.init(true);
		Config.LocalChat.Enabled = true;
		Config.LocalChat.Mode = 2;
		Config.LocalChat.Toggle = 110;// decimal point
		LocalChat.init();
/**/

		while (true) {
			delay(1000);
		}
	}
 ```
