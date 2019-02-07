```javascript
	if (getScript("d2botmap.dbj")) {
		load("tools/mapthread.js");
		load("tools/ToolsThread.js");

/* Start moded */
		Config.init(true);
		Config.LocalChat.Enabled = true;
		Config.LocalChat.Mode = 2;
		Config.LocalChat.Toggle = 110;// decimal point
		LocalChat.init();
/* End moded */

		while (true) {
			delay(1000);
		}
	}
 ```
