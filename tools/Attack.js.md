# In tnitialize attacks
```javascript
		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			if (getScript("d2botmap.dbj")) {
				print("ÿc1Bad attack config. Don't expect your bot to attack. (hide console)");
			} else {
				showConsole();
				print("ÿc1Bad attack config. Don't expect your bot to attack.");
			}
		}
```
