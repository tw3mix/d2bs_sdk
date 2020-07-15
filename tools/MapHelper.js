include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("AutoMule.js");
include("Gambling.js");
include("TorchSystem.js");
include("MuleLogger.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/CollMap.js");
include("common/Config.js");
include("common/Loader.js");
include("common/Misc.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");

function main() {
	include("json2.js");

	var obj, action,
		mapThread = getScript("tools/mapthread.js");

	Config.init();
	Pickit.init();
	Storage.Init();
	addEventListener("scriptmsg", function (msg) {
		action = msg;
	});

	while (true) {
		if (getUIFlag(0x09)) {
			delay(100);

			if (mapThread.running) {
				print("pause mapthread");
				mapThread.pause();
			}
		} else {
			if (!mapThread.running) {
				print("resume mapthread");
				mapThread.resume();
			}
		}

		if (action) {
			try {
				obj = JSON.parse(action);

				if (obj && me.area) {
					switch (obj.type) {
					case "area":
						Pather.moveToExit(obj.dest, true);

						break;
					case "unit":
						Pather.moveToUnit(obj.dest, true);

						break;
					case "wp":
						me.inTown ? Town.move("waypoint") : Pather.getWP(me.area);

						break;
					case "spot":
						Town.move(obj.dest);

						break;
					case "npc":
						Town.initNPC(obj.dest, obj.dest);

						break;
					case "tp":
						me.overhead("Going to town");
						Town.goToTown(me.act);

						break;
					}
				}
			} catch (e) {

			}

			action = false;
		}

		delay(20);
	}
}
