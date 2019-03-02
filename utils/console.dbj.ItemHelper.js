include("common/Attack.js");
include("common/CollMap.js");
include("common/Config.js");
include("common/Cubing.js");
include("common/Misc.js");
include("common/Pather.js");
include("common/Pickit.js");
include("common/Prototypes.js");
include("common/Storage.js");
include("common/Town.js");

function main () {
	print('ÿc2D2BSÿc0 :: Started Console Script');

	/* 템도우미 1.0
		기본 아이템 기능
		 *쉬프트 + 우클릭: 창고<->인벤토리<->큐브간 아이템 이동
		 *컨트롤 + 우클릭: 아이템 버리기
		 *포션/스크롤 등등 클릭시 사용되는 아이템은 현재 이동 불가

		템도우미 기능 (아래 단축키 참고)
		 *인벤토리 및 창고 아이템 모두 버리기
		 *창고<->인벤토리 모든 아이템 이동
		 *아이템 줍기
		 *작업 도중 마우스 클릭시 진행중인 작업 즉시 중단
	*/

	// 키코드 번호 링크 https://docs.microsoft.com/en-us/windows/desktop/inputdev/virtual-key-codes
	// 순서대로 단축키 설정 [템도우미 기능 ON/OFF, 인벤+창고 아이템 버리기, 창고 아이템 버리기, 인벤 아이템 버리기, 인벤->창고 이동, 창고->인벤 이동]
	var	hotkeys = [
			0x6F, // 넘패드 "/" 템도우미 기능 ON/OFF
			0x60, // 넘패드 "0" 인벤+창고 아이템 버리기
			0x61, // 넘패드 "1" 창고 아이템 버리기
			0x62, // 넘패드 "2" 인벤 아이템 버리기
			0x67, // 넘패드 "7" 인벤->창고 이동
			0x68, // 넘패드 "8" 창고->인벤 이동
			0x2D, // INSERT (인서트) 아이템 줍기. 반복 입력시 대기시간 동안 (기본5초) [인벤만][모든템] 모드 변경 가능
		],

		// 아이템 줍기 모드 변경 대기시간 (ms)
		pickTimeout = 5000,

		// 옮기지 않을 템 고유번호(classid) 목록
		ignoredMoveList = [518, 519, 549], // 포탈책, 확인책, 큐브

		// 버리지 않을 템 고유번호(classid) 목록
		ignoredDropList = [518, 519, 549], // 포탈책, 확인책, 큐브

		// 줍지 않을 템 고유번호(classid) 목록
		ignoredPickList = [],

		// 줍지 않을 템 종류(itemType) 목록
		ignoredPickType = [5, 6, 18, 22, 38, 41, 76, 77, 78, 79, 80, 81]; // 화살, 책, 스크롤, 열쇠, 각종 포션 등등





	// 아래부터 모르면 수정금지

	var ReverseClick = false,
		enable = false,
		block = false,
		abort = false,
		identify = false,
		move = false,
		task = false,
		dropInv = false,
		dropStash = false,
		dropAll = false,
		moveToInv = false,
		moveToStash = false,
		pickGround = false,
		pickMode = 0,
		pickTick = 0,
		ctrl = false,
		shift = false;

	var mouseClick = function (RightClick, pX, pY, isUp) {
		if (!inGame || isUp || (!shift && !ctrl) || (shift && ctrl)) {
			if (task) {
				abort = true;
				ResetVariables();
			}

			// if (!isUp && shift && ctrl && RightClick === 0) { // Mouse block not supported yet
				// identify = true;
			// }

			return false;
		}

		// if (ReverseClick) { // Mouse block not supported yet
			// RightClick ^= 1;
		// }

		switch (RightClick) {
		case 1:
			move = true;
			// if (shift || ctrl) { // Mouse block not supported yet
				// return true;
			// }
		}

		return false;
	}

	var keyDown = function (key) {
		if (!inGame) {
			return;
		}

		switch (key) {
		case 16: // shift
			shift = true;
			block = true;
			break;
		case 17: // ctrl
			ctrl = true;
			block = true;
			break;
		}
	}

	var keyUp = function (key) {
		if (!inGame) {
			return;
		}

		if (key === 16) {
			shift = false;
			block = false;
		} else if (key === 17) {
			ctrl = false;
			block = false;
		} else if (key === hotkeys[0]) { // Numpad "/"
			if (enable) {
				print("[템도우미] ÿc1OFF");
				me.overhead("[템도우미] OFF");
				enable = false;
			} else {
				print("[템도우미] ÿc2ON");
				me.overhead("[템도우미] ON");
				enable = true;
				ResetVariables();
			}
		}

		if (!enable) {
			return;
		}

		if (key === hotkeys[6]) { // 템 줍기
			pickMode ^= 1;

			if (!pickGround) {
				task = true;
				pickGround = true;
				pickTick = getTickCount();
			}
		}

		if (!task) {
			if (key === hotkeys[1]) { // 창고+인벤 비우기
				task = true;
				dropAll = true;
			} else if (key === hotkeys[2]) { // 창고 비우기
				task = true;
				dropStash = true;
			} else if (key === hotkeys[3]) { // 인벤 비우기
				task = true;
				dropInv = true;
			} else if (key === hotkeys[4]) { // 창고로 옮기기
				task = true;
				moveToStash = true;
			} else if (key === hotkeys[5]) { // 인벤으로 옮기기
				task = true;
				moveToInv = true;
			}
		}
	}

	var packetSent = function (packet) {
		if (inGame) {
			return false;
		}

		if (block) {
			if (packet[0] === 0x20) { // block pickup and use packet
				return true;
			}
		}

		return false;
	}

	function CheckInGame () {
		if (me.gameReady && me.ingame) {
			return true;
		} else {
			if (inGame) {
				if (!getScript("default.dbj")) {
					inGame = false;
				}
			}

			return false;
		}
	}

	function ResetVariables () {
		task = false;
		dropInv = false;
		dropStash = false;
		dropAll = false;
		moveToInv = false;
		moveToStash = false;
		pickGround = false;
		pickMode = 0;
		pickTick = 0;
		elapsed = 0;
		sec = 0;
	}

	function ItemToCursor (item) {
		var i, tick;

		if (me.itemoncursor) { // Something already on cursor
			if (getUnit(100).gid === item.gid) { // Return true if the item is already on cursor
				return true;
			}

			return false;
		}

		if (item.location === 7 && !Town.openStash()) { // stash
			return false;
		}

		for (i = 0; i < 15; i += 1) {
			if (CheckInGame() && !move && !task) {
				return false;
			}

			if (item.mode === 1) { // equipped
				sendPacket(1, 0x1c, 2, item.bodylocation);
			} else {
				sendPacket(1, 0x19, 4, item.gid);
			}

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(700, me.ping * 2 + 300)) {
				if (me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	}

	function DropItem (item) {
		var i, tick, timeout;

		if (!ItemToCursor(item)) {
			return false;
		}

		tick = getTickCount();
		timeout = Math.max(1000, me.ping * 6);

		while (getUIFlag(0x19) || getUIFlag(0x1A) || !me.gameReady) {
			if (getTickCount() - tick > timeout) {
				return false;
			}

			if (getUIFlag(0x19) || getUIFlag(0x1A)) {
				me.cancel(0);
			}

			delay(me.ping * 2 + 100);
		}

		for (i = 0; i < 15; i += 1) {
			if (CheckInGame() && !move && !task) {
				return false;
			}

			sendPacket(1, 0x17, 4, item.gid);

			tick = getTickCount();

			while (getTickCount() - tick < Math.max(700, me.ping * 2 + 300)) {
				if (!me.itemoncursor) {
					return true;
				}

				delay(10);
			}
		}

		return false;
	}

	function DropItems (loc = false, standAlone = false) {
		var i, items = [],
			item = me.getItem(-1, 0);

		if (!item) {
			if (task && !standAlone) {
				task = false;
			}

			return false;
		}

		do {
			if (loc) {
				if (item.location === loc && (ignoredDropList.indexOf(item.classid) === -1)) {
					items.push(copyUnit(item));
				}
			}
		} while (item.getNext());

		for (i = 0; i < items.length; i++) {
			if (CheckInGame() && !move && !task) {
				return false;
			}

			DropItem(items[i]);
			delay(30);
		}

		if (task && !standAlone) {
			task = false;
		}

		return true;
	}

	function SortItemSize (itemA, itemB) {
		return (itemB.sizex * itemB.sizey - itemA.sizex * itemA.sizey);
	}

	function MoveItems (loc = false, standAlone = false) {
		var i, items = [],
			item = me.getItem(-1, 0);

		if (!item) {
			if (task && !standAlone) {
				task = false;
			}

			return false;
		}

		do {
			if (loc) {
				if (item.location === loc && (ignoredMoveList.indexOf(item.classid) === -1)) {
					items.push(copyUnit(item));
				}
			}
		} while (item.getNext());

		// sort items by size in descending order
		items.sort(SortItemSize);

		for (i = 0; i < items.length; i++) {
			if (CheckInGame() && !move && !task) {
				return false;
			}

			if (loc === 3) {
				Storage.Stash.MoveTo(items[i]);
			} else if (loc === 7) {
				Storage.Inventory.MoveTo(items[i]);
			}

			delay(30);
		}

		if (task && !standAlone) {
			task = false;
		}

		return true;
	}

	function HaveUniqueCharm (item, id) {
		if (item) {
			if (item.classid === id && item.quality === 7) {
				var charm = me.getItem(id, -1);

				if (charm) {
					do {
						if (charm.quality === 7) {
							return true;
						}
					} while (charm.getNext());
				}
			}
		}

		return false;
	}

	function PickItem (unit) {
		function ItemStats(unit) {
			this.classid = unit.classid;
			this.gold = unit.getStat(14);
		}

		var i, item, tick, timeout, gid, stats,
			itemCount = me.itemcount;

		if (unit.gid) {
			gid = unit.gid;
			item = getUnit(4, -1, -1, gid);
		}

		if (!item) {
			return false;
		}

		tick = getTickCount();
		timeout = Math.max(1000, me.ping * 6);

		while (getUIFlag(0x19) || getUIFlag(0x1A) || !me.gameReady) {
			if (getTickCount() - tick > timeout) {
				return false;
			}

			if (getUIFlag(0x19) || getUIFlag(0x1A)) {
				me.cancel(0);
			}

			delay(me.ping * 2 + 100);
		}

		stats = new ItemStats(item);

	MainLoop:
		for (i = 0; i < 3; i += 1) {
			if (!getUnit(4, -1, -1, gid)) {
				break MainLoop;
			}

			if (me.dead) {
				return false;
			}

			while (!me.idle) {
				delay(40);
			}

			if (item.mode !== 3 && item.mode !== 5) {
				break MainLoop;
			}

			if (getDistance(me, item) > 4|| checkCollision(me, item, 0x1)) {
				if (!Pather.moveTo(item.x, item.y, 0)) {
					continue MainLoop;
				}
			}

			sendPacket(1, 0x16, 4, 0x4, 4, item.gid, 4, 0);

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				item = copyUnit(item);

				if (stats.classid === 523) {
					if (!item.getStat(14) || item.getStat(14) < stats.gold) {
						return true;
					}
				}

				if (item.mode !== 3 && item.mode !== 5) {
					break MainLoop;
				}

				delay(20);
			}
		}

		return true;
	}

	function SortItemPick (itemA, itemB) {
		return ((itemB.sizex * itemB.sizey - itemA.sizex * itemA.sizey) || (getDistance(me, itemB) - getDistance(me, itemA)));
	}

	function PickItems (invOnly = 1) {
		var canFit, cube,
			pickList = [],
			item = getUnit(4);

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && getDistance(me, item) <= 30 &&
					ignoredPickList.indexOf(item.classid) === -1 && ignoredPickType.indexOf(item.itemType) === -1) {
						pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		cube = !!me.getItem(549);

		// sort item by size and distance
		pickList.sort(SortItemPick);

		while (pickList.length > 0) {
			if (CheckInGame() && !move && !task) {
				return false;
			}

			item = pickList.shift();

			if (item.classid === 549 && cube) { // have cube
				continue;
			}

			if (HaveUniqueCharm(item, 603) || HaveUniqueCharm(item, 604) || HaveUniqueCharm(item, 605)) { // have charm
				continue;
			}

			canFit = Storage.Inventory.CanFit(item);

			if (!invOnly) {
				if (!canFit) {
					MoveItems(3, true);

					canFit = Storage.Inventory.CanFit(item);
				}
			}

			if (canFit) {
				PickItem(item);
			}
		}

		if (task) {
			task = false;
		}

		return true;
	}

	function AntiIdle (min = 15) {
		if (getTickCount() - idleTick > min * 60e3) {
			sendPacket(1, 0x40);
			idleTick = getTickCount() + rand(0, 20e3);
		}
	}

	Town.openStash = function () {
		var i, tick, stash;

		if (getUIFlag(0x1a) && !Cubing.closeCube()) {
			return false;
		}

		if (getUIFlag(0x19)) {
			return true;
		}

		for (i = 0; i < 5; i += 1) {
			me.cancel();

			if (this.move("stash")) {
				stash = getUnit(2, 267);

				if (stash) {
					Misc.click(0, 0, stash);
					//stash.interact();

					tick = getTickCount();

					while (getTickCount() - tick < 5000) {
						if (CheckInGame() && !move && !task) {
							return false;
						}

						if (getUIFlag(0x19)) {
							delay(100 + me.ping * 2); // allow UI to initialize

							return true;
						}

						delay(100);
					}
				}
			}

			Packet.flash(me.gid);
			delay(500 + me.ping);
		}

		return false;
	};

	var sec = 0,
		elapsed = 0,
		idleTick = 0,
		inGame = false;

	addEventListener("mouseclick", mouseClick);
	addEventListener("keydown", keyDown);
	addEventListener("keyup", keyUp);
	// addEventListener("gamepacketsent", packetSent); // bug in master branch

	while (true) {
		try {
			if (CheckInGame()) {
				if (!inGame) {
					inGame = true;
					idleTick = getTickCount();
					ResetVariables();
					Storage.Init(true);

					Storage.Inventory.MoveTo = function (item) {
						var nPos, n, nDelay, pLoc;

						try {
							//Can we even fit it in here?
							nPos = this.FindSpot(item);

							if (!nPos) {
								return false;
							}

							switch (item.location) {
							case 6: // cube
								pLoc = 0; // to inv
								break;
							case 7: // stash
								pLoc = 0; // to inv
								break;
							};

							//Cube -> Stash, must place item in inventory first
							if (item.location === 6 && this.location === 7 && !Storage.Inventory.MoveTo(item)) {
								return false;
							}

							//Can't deal with items on ground!
							if (item.mode === 3) {
								return false;
							}

							//Item already on the cursor.
							if (me.itemoncursor && item.mode !== 4) {
								return false;
							}

							//Make sure stash is open
							if (this.location === 7 && !Town.openStash()) {
								return false;
							}

							//Pick to cursor if not already.
							if (!ItemToCursor(item)) {
								return false;
							}

							//Loop three times to try and place it.
							for (n = 0; n < 5; n += 1) {
								sendPacket(1, 0x18, 4, item.gid, 4, nPos.y, 4, nPos.x, 4, pLoc);
								//clickItem(0, nPos.y, nPos.x, this.location);

								nDelay = getTickCount();

								while ((getTickCount() - nDelay) < Math.max(1000, me.ping * 3 + 500)) {
									if (!me.itemoncursor) {
										return true;
									}

									delay(30);
								}
							}

							return true;
						} catch (e) {
							return false;
						}
					};

					Storage.Cube.MoveTo = function (item) {
						var nPos, n, nDelay, cItem, cube, pLoc;

						try {
							//Can we even fit it in here?
							nPos = this.FindSpot(item);

							if (!nPos) {
								return false;
							}

							switch (item.location) {
							case 3: // inv
								pLoc = 3; // to cube
								break;
							};

							//Cube -> Stash, must place item in inventory first
							if (item.location === 6 && this.location === 7 && !Storage.Inventory.MoveTo(item)) {
								return false;
							}

							//Can't deal with items on ground!
							if (item.mode === 3) {
								return false;
							}

							//Item already on the cursor.
							if (me.itemoncursor && item.mode !== 4) {
								return false;
							}

							//Make sure stash is open
							if (this.location === 7 && !Town.openStash()) {
								return false;
							}

							//Pick to cursor if not already.
							if (!ItemToCursor(item)) {
								return false;
							}

							//Loop three times to try and place it.
							for (n = 0; n < 5; n += 1) {
								if (getUIFlag(0x1A)) {
									sendPacket(1, 0x18, 4, item.gid, 4, nPos.y, 4, nPos.x, 4, pLoc);
									// clickItem(0, nPos.y, nPos.x, this.location);
								} else {
									cItem = getUnit(100);
									cube = me.getItem(549);

									if (cItem !== null && cube !== null) {
										sendPacket(1, 0x2a, 4, cItem.gid, 4, cube.gid);
									}
								}

								nDelay = getTickCount();

								while ((getTickCount() - nDelay) < Math.max(1000, me.ping * 3 + 500)) {
									if (!me.itemoncursor) {
										return true;
									}

									delay(30);
								}
							}

							return true;
						} catch (e) {
							return false;
						}
					};

					Storage.Stash.MoveTo = function (item) {
						var nPos, n, nDelay, pLoc;

						try {
							//Can we even fit it in here?
							nPos = this.FindSpot(item);

							if (!nPos) {
								return false;
							}

							switch (item.location) {
							case 3: // inv
								pLoc = 4; // to stash
								break;
							};

							//Cube -> Stash, must place item in inventory first
							if (item.location === 6 && this.location === 7 && !Storage.Inventory.MoveTo(item)) {
								return false;
							}

							//Can't deal with items on ground!
							if (item.mode === 3) {
								return false;
							}

							//Item already on the cursor.
							if (me.itemoncursor && item.mode !== 4) {
								return false;
							}

							//Make sure stash is open
							if (this.location === 7 && !Town.openStash()) {
								return false;
							}

							//Pick to cursor if not already.
							if (!ItemToCursor(item)) {
								return false;
							}

							//Loop three times to try and place it.
							for (n = 0; n < 5; n += 1) {
								sendPacket(1, 0x18, 4, item.gid, 4, nPos.y, 4, nPos.x, 4, pLoc);
								//clickItem(0, nPos.y, nPos.x, this.location);

								nDelay = getTickCount();

								while ((getTickCount() - nDelay) < Math.max(1000, me.ping * 3 + 500)) {
									if (!me.itemoncursor) {
										return true;
									}

									delay(30);
								}
							}

							return true;
						} catch (e) {
							return false;
						}
					};
				}

				AntiIdle();

				// if (identify) {
					// if (shift && ctrl) {
						// var item = getUnit(101),
							// idTome = me.getItem(519);

						// if (item && item.type === 4 && !item.getFlag(0x10)) {
							// if (shift && ctrl) {
								// if (idTome && idTome.location === 3 && idTome.getStat(70) > 0) {
									// Packet.identifyItem(item, idTome);
								// }
							// }
						// }
					// }

					// identify = false;
				// }

				if (move) {
					var item = getUnit(101);

					if (item && item.type === 4 && item.mode === 0 && item.classid !== 549) { // non equipped items, exclude cube
						if (getUIFlag(0x19)) { // Stash
							if (shift) {
								if (item.location === 3) { // inv to stash
									Storage.Stash.MoveTo(item);
								} else if (item.location === 7) { // stash to inv
									Storage.Inventory.MoveTo(item);
								}
							} else if (ctrl) {
								DropItem(item);
							}
						} else if (getUIFlag(0x1A)) { // Cube
							if (shift) {
								if (item.location === 3) { // inv to cube
									Storage.Cube.MoveTo(item);
								} else if (item.location === 6) { // cube to inv
									Storage.Inventory.MoveTo(item);
								}
							} else if (ctrl) {
								DropItem(item);
							}
						} else {
							if (ctrl) {
								DropItem(item);
							}
						}
					}

					move = false;
				} else if (enable) {
					if (task) {
						if (!me.inTown) {
							me.overhead("[템도우미] 마을에서만 작동합니다");
							ResetVariables();
						}

						if (dropInv) {
							me.overhead("[템도우미] 인벤 비우기");
							dropInv = false;
							DropItems(3);
						} else if (dropStash) {
							me.overhead("[템도우미] 창고 비우기");
							dropStash = false;
							DropItems(7);
						} else if (dropAll) {
							me.overhead("[템도우미] 인벤+창고 비우기");
							DropItems(3, true);

							var stashItems = me.findItems(-1, 0, 7);

							if (stashItems.length > 1 || (stashItems.length > 0 && stashItems[0].classid !== 549)) {
								MoveItems(7, true);
							} else {
								dropAll = false;
								task = false;
							}
						}

						if (moveToInv) {
							me.overhead("[템도우미] 인벤으로 옮기기");
							moveToInv = false;
							MoveItems(7);
						} else if (moveToStash) {
							me.overhead("[템도우미] 창고로 옮기기");
							moveToStash = false
							MoveItems(3);
						} else if (pickGround) {
							elapsed = getTickCount() - pickTick;

							if (elapsed > pickTimeout) {
								pickGround = false;

								if (pickMode) {
									me.overhead("[템도우미] 아이템 줍기 [인벤만] [실행]");
								} else {
									me.overhead("[템도우미] 아이템 줍기 [모든템] [실행]");
								}

								PickItems(pickMode);
								pickMode = 0;
							} else {
								var left = (pickTimeout - elapsed);

								if (!sec || sec < left || sec - left > 300) {
									sec = left;

									var time = Math.floor(sec / 1000 % 60);

									if (pickMode) {
										me.overhead("[템도우미] 아이템 줍기 [인벤만]" + "[" + time + "초]");
									} else {
										me.overhead("[템도우미] 아이템 줍기 [모든템]" + "[" + time + "초]");
									}
								}
							}
						}

						if (!task) {
							if (abort) {
								abort = false;
								ResetVariables();
								print("[템도우미] ÿc1작업 중단");
								me.overhead("[템도우미] 작업 중단");
							} else {
								print("[템도우미] ÿc2작업 완료");
								me.overhead("[템도우미] 작업 완료");
							}
						}
					} else {
						if (abort) {
							abort = false;
							ResetVariables();
							print("[템도우미] ÿc1작업 중단");
							me.overhead("[템도우미] 작업 중단");
						}
					}
				}
			}
		} catch (e) {
			print("Error: " + e);
			enable = false;
			ResetVariables();
		}

		delay(100);
	}
}
