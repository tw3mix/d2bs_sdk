### AutoMule
```javascript
		removeEventListener("copydata", DropStatusEvent);

		if (muleObj.stopProfile) {
			D2Bot.stop(muleObj.muleProfile, true);
			delay(1000);
			D2Bot.start(muleObj.stopProfile);
		}
```

### D2BotMule
```javascript
function timer(tick) {
	if (!tick) {
		return "";
	}

	var min, sec;

	min = Math.floor((getTickCount() - tick) / 60000).toString();
	if (min <= 9) {
		min = "0" + min;
	}

	sec = (Math.floor((getTickCount() - tick) / 1000) % 60).toString();
	if (sec <= 9) {
		sec = "0" + sec;
	}

	return " (" + min + ":" + sec + ")";
}
//...
//...
var startTick;
//...
//...
				case "done":
					MuleLogger.logChar();

					obj = MuleData.read();

					if (checkAnniTorch() && obj.torchChars.indexOf(me.name) === -1) {
						obj.torchChars.push(me.name);
					}

					MuleData.write(obj);
					D2Bot.printToConsole("Done muling.", 7);
					sendCopyData(null, master, 10, JSON.stringify({status: "quit"}));
					//delay(500);

					if (!muleObj.stopProfile) {
						master = "";
						status = "end";
						while (!master) {
							delay(1000);
							if (getTickCount() - tick > 15 * 60e3) {
								sendPacket(1, 0x40);
								tick = getTickCount() + rand(0, 20e3);
							}
							D2Bot.updateStatus("Stalling for expiration date" + timer(startTick));
						}
						continue;
					}
					
					//D2Bot.stop(me.profile, true);

					//return;
					break;

```
