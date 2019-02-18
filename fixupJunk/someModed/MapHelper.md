```javascript
					case "rush":
						if (obj.dest === 7) {
							if (!isIncluded("bots/Rushee.js")) {
								if (include("bots/Rushee.js")) {
									print("Start rushee with < quester >");
									Config.PublicMode = 2;
									Config.Rushee.Quester = true;
									scriptBroadcast("chickenOff");
									Rushee._caller_ = "D2BotMap";
									Rushee();
								}
							}
						}
						else if (obj.dest === 8) {
							if (!isIncluded("bots/Rushee.js")) {
								if (include("bots/Rushee.js")) {
									print("Start rushee with < passenger >");
									Config.PublicMode = 2;
									scriptBroadcast("chickenOff");
									Rushee();
								}
							}
						}
						else if (obj.dest === 9) {
							if (!isIncluded("bots/Rusher.js")) {
								if (include("bots/Rusher.js")) {
									print("Including bots/rusher.js");
									say("rusher");
									delay(500);
									Config.Rusher.WaitPlayerCount = Rusher().getPlayerCount();
									Rusher();
								}
							}
						}

						break;
```
