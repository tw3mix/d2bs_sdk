[1]: https://markdown-here.com/livedemo.html
[markdown live demo][1] [마크다운 사용법](https://dooray.com/htmls/guides/markdown_ko_KR.html)

# rushee fatch

```javascript
				case "2": // Go back to town and check quest
					if (!Config.Rushee.Quester) {
						switch (leader.area) {
						// Non-questers can piggyback off quester out messages
						case 61: // amulet
						case 83: // travincal
							target = getUnit(1, NPC.Cain);

							if (target && target.openMenu()) {
								me.cancel();
							}

							break;
```

