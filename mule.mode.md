### AutoMule
```javascript
    /***** orgin *****/
		removeEventListener("copydata", DropStatusEvent);
		D2Bot.stop(muleObj.muleProfile, true);
		delay(1000);

		if (muleObj.stopProfile) {
			D2Bot.start(muleObj.stopProfile);
		}

    /***** moded *****/
		removeEventListener("copydata", DropStatusEvent);

		if (muleObj.stopProfile) {
			D2Bot.stop(muleObj.muleProfile, true);
			delay(1000);
			D2Bot.start(muleObj.stopProfile);
		}
```

### D2BotMule
```javascript

```
