var Scolor = 0 ;
var UseLifewatch = !SimonStopLifeWatch;
function NT_SimonSays() 
{ 
	print("ÿc3Start SimonSays script");
	print("ÿc9Supported commands: Rush Me, Get Wps, Rush 1-5  ")
	print("ÿc9Auto Teleport keys: keypad (/ * -) Previous Lvl, Point of Intrest, Next Level. quick town: 'e'" );
	var cbShowOptions=new CheckBox(650,5,"View Options",false)	 
	cbShowOptions.checked = false;		
	var cbEnableSnaging = new CheckBox(650,30,"Enable Snaging",SimonEnableSnagging)	 
	cbEnableSnaging.visible = cbShowOptions.checked
	var cbAutoReveal = new CheckBox(650,45,"Auto Reveal",SimonAutoReveal)	
	var cbSimonEnableCommands = new CheckBox(650,60,"EnableCommands",SimonEnableCommands)
	var cbSimonStopLifeWatch = new CheckBox(650,75,"LifeWatch/Chicken Enabled",!SimonStopLifeWatch)
	var cbShowLoc = new CheckBox (650,90,"Loction Hook",false)
	cbSimonStopLifeWatch.visible=cbShowOptions.checked
	cbShowLoc.visible=cbShowOptions.checked
	
	var levelInfoHook1 = new Text("",  795, 450, 2, 6, 1);
	var levelInfoHook2 = new Text("",  795, 465, 2, 6, 1);
	var levelInfoHook3 = new Text("",  795, 480, 2, 6, 1);
	var LoctionHook = new Text("",795,420,2,6,1)
	//var commandsHook = new Text("Rush Me, Get Wps, Rush 1-5",  400, 400, 2, 6, 2,testFunc);
	//commandsHook.visible=false;
	cbSimonEnableCommands.visible=cbShowOptions.checked;	
	cbAutoReveal.visible=cbShowOptions.checked
	
	
	load("tools/SimonsHelper.dbj"); 
   addEventListener("chatmsg", SimonMsg);
  // addEventListener("copydata",function(mode,msg, param,param2) {		
  addEventListener("scriptmsg", function(msg, param,param2) {	// think script.send is crashable	
   
		if (msg =="Complete")
			currentAction="";
	});
//	if (NTC_InTown())
//		NTTMGR_TownManager(); 
	var Hook = new Text(currentAction, 400, 550, 2, 6, 2,testFunc);
	
		
//	 var hook = new Box(...); hook.click = function (b, x, y) { /* b is the button, x/y is the location */ };
	var ShowOptions = cbShowOptions.checked
	var currentArea = 0;
	var ui = "";
   while(me.ingame){  ///////////////////Main Loop
		if(cbShowLoc.checked)
			LoctionHook.text ="Area: "+me.area +" X: "+me.x+" Y: "+me.y;
		
		Hook.text = currentAction;
		
		if (cbEnableSnaging.checked){
			FastSnag=true;
			NTSI_FastSnag();
			NTSI_PickItems(); // adding for utility snag
	
		
		
		}
		SimonEnableCommands =cbSimonEnableCommands.checked;
		if (ShowOptions != cbShowOptions.checked){		
			ShowOptions = cbShowOptions.checked			
			cbEnableSnaging.visible = cbShowOptions.checked
			cbAutoReveal.visible = cbShowOptions.checked
			cbSimonEnableCommands.visible=cbShowOptions.checked;
			cbSimonStopLifeWatch.visible=cbShowOptions.checked;
			cbShowLoc.visible =cbShowOptions.checked;
			//commandsHook.visible=(cbSimonEnableCommands.checked && cbSimonEnableCommands.visible)
			
		}
		if (UseLifewatch != cbSimonStopLifeWatch.checked){
			UseLifewatch = cbSimonStopLifeWatch.checked;
			setLifeWatch(UseLifewatch);
		}
		if (me.area != currentArea){
			updatelevelInfoHook(levelInfoHook1,levelInfoHook2,levelInfoHook3);
			if (cbAutoReveal.checked){
				var exits = getArea().exits;
				for (var j = 0 ; j < exits.length ; j++){
					if(exits[j].tileid == 0)
						RevealArea(exits[j].target)				
				}
				RevealArea(me.area)
			}
		currentArea=me.area;
		}
		delay (100);
   }   ////////////////////////////////////////
}
function testFunc(){
print ("test func")
}
function setLifeWatch(runLifewatch){
			if (runLifewatch){ //load lifewatch if it isnt loaded
				var a =getScript();				
				do{				
					if (a.name == "tools\\nttoolsthread.dbj"){
						return;			
					}				
				}while(a.getNext());
				 load("tools/NTToolsThread.dbj"); 
			}else{ 				//stop lifewatch
				var a =getScript();				
				do{
				sendCopyData(null, "OOG", 0,a.name);
					if (a.name == "tools\\nttoolsthread.dbj"){						
						a.stop();
						print("seting chicken");
						me.chickenhp = 0;
						me.chickenmp = 0;
						break;						
					}				
				}while(a.getNext());	
			}			
}
function updatelevelInfoHook(Hook1,hook2,hook3){
	var nextLvl,previousLvl, poi;
	poi = getPOI();
	nextLvl = getNextArea(me.area);		
	previousLvl= NTAR_PreviousAreas[me.area];
	Hook1.text = "Previous: "+NTAR_Areas[previousLvl];
	hook2.text = " POI "+poi;
	hook3.text= " next: "+NTAR_Areas[nextLvl]; 
		
}
function scriptKeyHandler(key){
print(key);
	if (key == SimonNextLevel){ //+		
			currentAction ="Moving to next lvl";
			SetObjective("SimonNextLevel");				
	}
	if (key == SimonPrevousLevel){		
			currentAction ="Moving to Previous lvl";
			SetObjective("SimonPrevousLevel");				
	}
	if (key == SimonEscToTown) { // escape to town
		StopObjective();
		currentAction ="Escaping to town";
		NTTM_CheckAct();
		currentAction ="";
	}
	if (key == SimonPOI){ 
		currentAction ="Going to POI";	
		SetObjective("SimonPOI");			
	}
	if (key == 27){ 		
		currentAction ="";
		StopObjective();
	}
	if (key == 32){
	NTM_OpenAlter()
	}
	if (key == 8){	
		currentAction ="clearing "+ NTAR_Areas[me.area];
		SetObjective("ClearArea");		
		//NTA_ClearRooms(customClearAreaAttack);	
	
	}
	if (key == 187){
		var str = "";
		for (var j = 0 ; j <30 ;j++){
			if (getUIFlag (j)){
				str=str +" "+j;
			}
		}
		print (str);
	}
return true;
}
function followLeader(){
	var who = Leader;  //assinged in simon helper
	if(findLead( who)){
			while (findLead( who)){
				if (findLead(who) && me.area != findLead(who)){
					NTM_TravelTO(findLead(who))
				}
				moveToLead(who);				
				NTA_ClearPosition(30);				
				NTSI_PickItems();	
				if (!findLead(who)){
					currentAction ="";
				}
			}
		}
	return true;
}
function StopObjective(){
var a =getScript();				
	do{				
		if (a.name == "tools\\simonshelper.dbj"){
			a.stop();	
			return true;
		}				
	}while(a.getNext());	
return true;
}
function SetObjective(objective){
			
	StopObjective();
	sendCopyData(null, "OOG", 0,"loading script ");
	load("tools/SimonsHelper.dbj"); 
	sendCopyData(null, "OOG", 0,"loading script return");
	delay(500);
	var a =getScript();	
	do{				
		if (a.name == "tools\\simonshelper.dbj"){
		sendCopyData(null, "OOG", 0,"sending msg");
			a.send(objective);
			sendCopyData(null, "OOG", 0,"sending msg return");
			//sendCopyData(null, me.windowtitle, 0,objective );
		}				
	}while(a.getNext());	
}
function getNextArea(area){
 if (NTAR_NextArea[area])
	return NTAR_NextArea[area];
 for (var i = 0; i < NTAR_PreviousAreas.length; i++){
	if (NTAR_PreviousAreas[i] == area)
		return i;
 }
 return area;
}
function gotoPOI(){

	if (me.area ==4){  //going to tris seqence
			if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 17, 17))
				return false;
			delay(1500)
			if(!NTM_UsePortal("Portal", 38))
				return false;
	}	
	if (me.area ==37)
		return NTM_MoveTo(22545, 9544);		
	if (me.area ==102)
		return NTM_MoveTo(17543, 8068);		
	if (me.area ==108)
		return NTM_MoveTo(7792, 5292);	
	if (me.area ==110)
		return NTM_MoveTo(3906, 5112);
	if (me.area ==132)
		return NTM_MoveTo(15137, 5906);
	var exits = getArea().exits;
	for (var j = 0 ; j < exits.length ; j++){
		if(exits[j].target != getNextArea(me.area) && exits[j].target != NTAR_PreviousAreas[me.area] )
			return NTM_TravelTO(exits[j].target);				
	}
	//unique id's
	var poiID = [ 397,30,108,"act 2->" ,355,397,354,357,356,152,"act 3 >",406,405,407,256,376,"act 5 >",460,"Waypoints->",119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539, 429,580,149];
	var unit = getPresetUnits(me.area);
	
	if(unit){
		for (var p =0 ; p < poiID.length; p++){
			for (var j = 0; j < unit.length; j++){
			//if (unit[j].id in poiID){ // no clue why that dosent work			
				if (unit[j].id == poiID[p]){					
					return NTM_MoveTo(unit[j].roomx*5+unit[j].x,unit[j].roomy*5+unit[j].y);						
				}
			}
		}
	}
	
return false;
}
function getPOI(){
var poi = "Nothing"
	for (var i =0; i<122; i++){
		if(NTM_AreaWPArray[i] == me.area)
			poi = "Waypoint";		
   }
		if (me.area == 4)
			poi = "Trist"; 			
		if (me.area == 14 || me.area ==59 || me.area ==60 || me.area ==64 || me.area ==61 || me.area ==84 || me.area ==93)
			poi = "Chest"; 	
		if (me.area == 5)
			poi = "Inifuss Tree"; 
		if (me.area == 25)
			poi = "Countess Chest"; 
		if (me.area == 28)
			poi = "Malus";
		if (me.area == 37)
			poi = "Andy";
		if (me.area == 49)
			poi = "Scroll Chest";
		if (me.area == 74)
			poi = "Sommoner";
		if (me.area == 69)
			poi = "Orifice";
		if (me.area == 102)
			poi = "Meph";
		if (me.area == 105)
			poi = "Izzy";
		if (me.area == 107)
			poi = "Fordge";
		if (me.area == 108)
			poi = "Star";
		if (me.area == 110)
			poi = "Shenk";
		if (me.area == 114)
			poi = "Anaya";
		if (me.area == 132)
			poi = "Baal";
	var exits = getArea().exits;
	for (var j = 0 ; j < exits.length ; j++){
		if(exits[j].target != getNextArea(me.area) && exits[j].target != NTAR_PreviousAreas[me.area] )
			return NTAR_Areas[exits[j].target];				
	}
return poi;
}
function SimonMsg(who,msg){
  if (SimonEnableCommands){
	print(who +" said "+msg);
	if (msg == "Give Wps"){//si le message entré est Give Wps le bot créé des tp aux wps principaux
		currentAction="Giving Majors Wps";
		SetObjective("GiveWps");
		GiveWps();
	}
	if (msg == "Get Wps"){
		currentAction="Getting Waypoints";
		SetObjective("GetWps");			
		//getwaypoints();	currentAction="";
		
	}
	if(msg =="Rush Me")
	{	
		currentAction="Rushing "+who;
		SetObjective("RushAll");		
	}
	if(msg =="Rush 1"){
		currentAction = "Rush 1 " +who;
		SetObjective("Rush1");
	}
	if(msg =="Rush 2"){
		currentAction = "Rush 2 " +who;
		SetObjective("Rush2");		
	}
	if(msg =="Rush 3"){
		currentAction = "Rush 3 " +who;
		SetObjective("Rush3");		
	}
	if(msg =="Rush 4"){
		currentAction = "Rush 4 " +who;
		SetObjective("Rush4");
	}
	if(msg =="Rush 5"){
		currentAction = "Rush 5 " +who;
		SetObjective("Rush5");
	}
	if (msg == "Clear Area"){
		currentAction ="clearing "+ NTAR_Areas[me.area];
		SetObjective("ClearArea");		
	}
	if (msg == "Follow Me"){
		currentAction = "Following "+who;
		SetObjective("FollowLead:"+who);		
	}
	
  }// if accepting commands
}

function GiveWps(){
	print("Giving Wps");//affiche dans le log
	NTTMGR_TownManager();//refile tp
	say("Go to tp spot and take tp i'll make next");//dit au joueur
	NTM_TravelTO(35);//va a catacombes lvl 2 wp
	waitForSomeone();//fais un tp et attend
	if(me.diff ==0){//si la difficulté est normal
			NTTMGR_TownManager();//refile tp
			NTM_TravelTO(57);//va a halls of the dead lvl2 wp (nimporte quoi)
			waitForSomeone();//fais un tp et attend
			NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		}
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(43);//va a oasis wp (all of dead lvl3)
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(44);//va a lost city wp(viper 2)
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(74);//va au tp arcanes
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(46);//va au wp canion
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(83);//va au wp travi
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(101);//wa au wp durance of hate lvl 2
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(107);//va au wp fire river(wp avant)
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(111);//va au 1er wp act5
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(113);//va au wp pour anya
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(118);//va au wp anciens
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
		NTTMGR_TownManager();//refile tp
		NTM_TravelTO(129);//va au wp pierre monde lvl 2(tundra)
		waitForSomeone();//fais un tp et attend
		NTM_UsePortal("BluePortal", 40, me.charname);//retourne en ville
	}
	


function getwaypoints(){
print("getting Waypoints");
   for (var i =0; i<122; i++){
   print(i);
		if(NTM_AreaWPArray[i] && !NTM_CheckWPInt(NTM_AreaWPArray[i])){
			NTM_TravelTO(i);
			NTM_GotoWaypoint(i,true,10000);
		}		
   }
	for (var i =125; i<132; i++){
		if(NTM_AreaWPArray[i] && !NTM_CheckWPInt(NTM_AreaWPArray[i])){
			NTM_TravelTO(i);
			NTM_GotoWaypoint(i,true,10000);
		}		
   }
}
function waitForSomeone(){
NTM_MakeTP();
	var peeps = 0
	do{
	var _target = NTC_GetUnit(0);
		peeps = 0;
		if(_target)
		{	
			do
			{
				peeps=peeps+1;
			} while(_target.getNext());	
			NTA_ClearPosition(25);	
		}
		NTC_Delay(500);
	}while (peeps < 2)
}
function Rush1(){
	NTTMGR_TownManager();
	say("Please Standby at the Act 1 Portal Area");
	//NTM_TravelTO(5);
	//if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 30, 30, 0, 0))
	//NTA_ClearPosition(40);
	//say("Scroll Up")
	//say("Go talk to Akara once you have the scroll")
	//waitForSomeone();
	//NTM_UsePortal("BluePortal", 1, me.charname);
	//NTM_TravelTO(4);
	//if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 17, 17, 5, 5))
	//NTA_ClearPosition(40);
	//say("Stones Up")
	//say("Once you have the portal to tristram open, take my tp to cold plains so we can continue")
	//waitForSomeone();
	//NTM_UsePortal("BluePortal", 1, me.charname);
	//NTM_TravelTO(3);
	//NTA_ClearPosition(20);
	//waitForSomeone();
	//NTM_UsePortal("BluePortal", 1, me.charname);
	//NTM_TravelTO(38);
	//if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 26, 26, 0, 0))
	//NTA_ClearPosition(40);
	//say("Come in and get Cain")
	//say("Once he is rescued, go back to town")
	//waitForSomeone();
	//NTM_UsePortal("BluePortal", 1, me.charname);	
	NTM_TravelTO(37);
	NTM_MoveTo(22589,9581);	
	NTA_ClearPosition(20);	
	NTM_MoveTo(22589,9581);	
	say("Andariel up, Stay at the TP, Remember if you die STAY DEAD!");
	waitForSomeone();
	NTM_MoveTo(22589,9581);	
	NTM_MoveTo(22563,9559);	
	if(!NTA_KillBoss( getLocaleString(3021)))
	say("Andariel is Dead, Go Speak to Warriv and 'Go East'");
	NTM_MoveTo(22589,9581);	
	NTM_UsePortal("BluePortal", 1, me.charname);
	if (me.classid == NTC_CHAR_CLASS_PALADIN) {
	NTC_PutSkill(115, NTC_HAND_RIGHT);
	}
	return false;
return true;
}
function Rush2(){
	NTTMGR_TownManager();
	say("Please Standby at the Act 2 Portal Area");
	//NTM_TravelTO(49);
	//NTA_ClearPosition(20);
	//say("Sewers level 3 is up, come in and wait here")
	//waitForSomeone();
	//if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 355, 355, 0, 0))
	//if (!NTA_KillBoss(getLocaleString(2879))) //Radament
	//NTA_ClearPosition(40);
	//say("Radament is dead, come get your book")	
	//waitForSomeone();

	if(me.diff ==0){
		NTM_TravelTO(60);
		if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 354, 354, 0, 0))
			return false;
		NTA_ClearPosition(40);
		if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 354, 354, 0, 0))
			return false;
		say("Horadric Cube Up, Please Enter and open the chest and collect your Cube!")
		say("Once collected go back to town.")
	
		if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 354, 354, 0, 0))
			return false;
		NTM_UsePortal("BluePortal", 40, me.charname);
		if (me.classid == NTC_CHAR_CLASS_PALADIN) {
	NTC_PutSkill(115, NTC_HAND_RIGHT);
	}
	}	
	
	
	NTM_TravelTO(64);
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 356, 365, 0, 0))
			return false;
	NTA_ClearPosition(50);
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 356, 365, 0, 0))
			return false;
	say("Staff of Kings Up, Please Enter and open the chest and collect your Staff");
	say("Once collected go back to town.")
	waitForSomeone();
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 356, 365, 0, 0))
	return false;
	NTM_UsePortal("BluePortal", 40, me.charname);
	
	NTM_TravelTO(61);
	NTM_MoveTo(15042,14045);
	NTA_ClearPosition(50);
	if (!NTA_KillBoss(getLocaleString(2881))) //Fangskin
	NTA_ClearPosition(50);
	NTM_MoveTo(15042,14045);
	NTA_ClearPosition(50);
	NTM_MoveTo(15042,14045);
	say("Amulet of the Viper Up, Please Enter and break the Tainted Sun Altar and collect your Amulet.");
	say("Once collected go back to town.")
	waitForSomeone();
	NTM_MoveTo(15042,14045);
	say("Transmute the Staff and Amulet and then Speak to Drognan and Deckard Cain");
	say("When done talking to Drognan and Cain, take my tp to the dry hills and I will continue to Arcane")
	NTM_UsePortal("BluePortal", 40, me.charname);

	NTM_TravelTO(42);
	NTA_ClearPosition(40);
	say("just a reminder, don't come to dry hills until AFTER you have talked to Drog and Cain, or you will bug out Arcane")
	waitForSomeone();
	NTM_UsePortal("BluePortal", 40, me.charname);
	
	NTM_TravelTO(74);	
	var tomb = NTC_GetPresetUnits(NTC_UNIT_OBJECT);
	if(!tomb){		
		return false;		
	}	
	for(var i = 0 ; i < tomb.length ; i++)
	{
		if(tomb[i].id ==357){
			var path=getPath(me.area, me.x, me.y,tomb[i].roomx*5+tomb[i].x, tomb[i].roomy*5+tomb[i].y,true) 			
		}
	}		
	NTM_MoveTo(path[path.length-3][0],path[path.length-3][1]) 
	say("Waiting by Summoner");
	waitForSomeone();	
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 357, 357, 0, 0))
		return false;	
	if(!NTA_KillBoss(getLocaleString(927))) //the summoner
		return false;	
	NTA_ClearPosition();
	
	NTM_TravelTO(46);
	gotoCorrectTomb();
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 152, 152, -8, -8))
		return false;
	waitForSomeone();	
	while(!NTM_TakeStairs(100))
		NTC_Delay(500);
	if(!NTA_KillBoss(getLocaleString(3054)))
		return false;
		
return true;
}
function gotoCorrectTomb(){
var _tombs = getRoom();
	var _correcttomb = _tombs.correcttomb;
	if(!_correcttomb)
		return false;
	var _tileid = _correcttomb - 66 + 38;
	if(!NTM_MoveToObject(NTC_UNIT_TILE, _tileid))
		return false;
	if(!NTM_TakeStairs(_tileid, _tileid))
		return false;
return true;
}
function Rush3(){
	NTTMGR_TownManager();
	say("Please Standby at the Act 3 Portal Area");
	//NTM_TravelTO(94);
	//if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 193, 193, 0, 0))
	//return false;
	//NTA_ClearPosition(40);
	//say("Lam Esen's Tome is up")
	//say("Talk to Cain once you grab it")
	//waitForSomeone();
	//NTM_UsePortal("BluePortal", 75, me.charname);
	NTM_TravelTO(83);
	NTM_GotoLevel(100,false);
	var ox=me.x; var oy=me.y;
	NTM_MoveTo(me.x-7,me.y-40);
	var tpox=me.x; var tpoy=me.y;
	NTA_ClearPosition();
	NTM_MoveTo(tpox,tpoy);
	say("Council Up, Stay at the TP, Remember if you die STAY DEAD!");
	waitForSomeone();
		
		NTM_MoveTo(ox-6,oy+16);
	if (!NTA_KillBoss(getLocaleString(2860))) return false; //Toorc Icefist
	if (!NTA_KillBoss(getLocaleString(2862))) return false; //Geleb Flamefinger
	if (!NTA_KillBoss(getLocaleString(2863))) return false; //Ismail Vilehand
	NTA_ClearPosition(25);
		NTM_MoveTo(ox-18,oy+28);
	NTA_ClearPosition(25);
		NTM_MoveTo(ox-27,oy+16);
	NTA_ClearPosition(25);
		NTM_MoveTo(ox-27,oy-5);
	NTA_ClearPosition(25);
		NTM_MoveTo(ox-17,oy+9);
	NTA_ClearPosition(30);
		NTM_MoveTo(ox-18,oy+28);
	NTA_ClearPosition(45);
		NTM_GotoLevel(100,false);
	NTA_ClearPosition(25);
		NTM_MoveTo(tpox,tpoy);
	say("Speak to Deckard Cain and get ready for Mephisto.");
	NTM_UsePortal("BluePortal", 75, me.charname);
	
	NTM_TravelTO(102);
	NTM_MoveTo(17588,8090);
	say("Mephisto Up, Stay at the TP, Remember if you die STAY DEAD!");
	waitForSomeone();
	NTM_MoveTo(17573, 8071);
	if(!NTA_KillBoss(getLocaleString(3062) ))//mephisto
		return false;
	say("Mephisto Dead, Go through the Red Portal.");
	NTM_MoveTo(17588,8090)
	NTM_UsePortal("BluePortal", 75, me.charname);

	return true;
}
function Rush4() {
	NTTMGR_TownManager();
	say("Please Standby at the Act 4 Portal Area");
    //NTM_TravelTO(105);

    //var poiID = [256];
    //var unit = getPresetUnits(me.area);

//<<<<<<< .mine
    //if (unit) {
		//for (var p = 0; p < poiID.length; p++) {
			//for (var j = 0; j < unit.length; j++) {
				//if (unit[j].id == poiID[p]) {
					//NTM_MoveTo(unit[j].roomx * 5 + unit[j].x, unit[j].roomy * 5 + unit[j].y);
				//}
				//say("Izual is up, if you die STAY DEAD!")
				//waitForSomeone();
			//}
			//if (!NTA_KillBoss(256)) 
				//; // Izual
			//NTSI_PickItems();
			//NTM_UsePortal("BluePortal", 103, me.charname);
		//}
	//}
//=======
	//gotoPOI();
	//waitForSomeone();
	 //NTA_KillBoss(256)
	
			//NTSI_PickItems();
			//NTM_UsePortal("BluePortal", 103, me.charname);
	
//>>>>>>> .r303

	NTM_TravelTO(107);
	 if(!NTM_MoveTo(7797, 5600)) 
      return false; 
   if(!NTM_TeleportTo(7797, 5560)) 
      return false; 
	if(!NTM_MoveTo(7771, 5318)) 
      return false; 
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 395, 395)) 
      return false;     
   OpenSeal(395) 
	if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 396, 396)) 
      return false;      
   OpenSeal(396) 
	if(me.y > 5265 && me.y <= 5275) 
      NTM_MoveTo(7677, 5287); 
	else 
      NTM_MoveTo(7675, 5321); 
      delay(250); 

		for (var n = 0; n < 20; n++) {
		delay(250);
		if (NTC_FindMonster(getLocaleString(2851))) 
		break;
	}

	if (NTA_KillBoss(getLocaleString(2851), 20)) {
		NTSI_PickItems();
	}
       
	 if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 394, 394)) 
      return false; 
      
   OpenSeal(394) 
    
   if(me.x > 7810 && me.x <= 7825) 
      NTM_MoveTo(7777, 5160); 
   else 
      NTM_MoveTo(7777, 5200); 
    
 		for (var n = 0; n < 20; n++) {
		delay(250);
		if (NTC_FindMonster(getLocaleString(2852))) //lord de seis 
		break;
	}

	if (NTA_KillBoss(getLocaleString(2852), 30)) {
		NTSI_PickItems();
	}


   if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 393, 393)) 
      return false; 
	 OpenSeal(393) 
	  if(!NTM_MoveToObject(NTC_UNIT_OBJECT, 392, 392)) 
      return false;
	 OpenSeal(392) 
	
	
		for (var n = 0; n < 20; n++) {
		delay(250);
		if (NTC_FindMonster(getLocaleString(2853))) //lord de seis 
		break;
	}

	if (NTA_KillBoss(getLocaleString(2853), 50)) {
		NTSI_PickItems();
	}

	NTM_MoveTo(7760, 5268);
	say("Diablo Up, if you die STAY DEAD!");
		waitForSomeone();	
	NTM_MoveTo(7760, 5268);

	 
	 if(!NTM_MoveTo(7788, 5288)) 
		return false; 

for (var n = 0; n < 30; n++) {
	if (me.classid == NTC_CHAR_CLASS_PALADIN) {
	NTC_PutSkill(113, NTC_HAND_RIGHT);
	NTC_DoCast(112, 2);
	NTC_DoCast(112, 2);
	NTC_DoCast(112, 2);
	NTC_DoCast(112, 2);
	NTC_DoCast(112, 2);
	NTC_DoCast(112, 2);
	NTC_Delay(250);
		}
		if (NTC_FindMonster(243)) {
			if (NTA_KillBoss(243, 1000)) {
				NTM_MoveTo(7760, 5268);
				NTM_UsePortal("BluePortal", 103, me.charname); 
				return true;
			}
		}

		NTC_Delay(500);
	}
  return true;
	 
}
function customClearAreaAttack(){
	if (currentAction != "clearing "+ NTAR_Areas[me.area])
		return false;
	NTA_ClearPosition(40);
	if (currentAction != "clearing "+ NTAR_Areas[me.area])
		return false;	
	NTSI_PickItems();
	return true;
}
function findLead(leader)
{
var _lead= getUnit(0, leader)
	if(_lead)
	return _lead.area;
// leader not found look in party
var area =0;
 var a = getParty();
if(!a)
	return false;
	
   do { 
      if (a.name==leader){
		area=a.area;	
		}
   } while(a.getNext()); 
	if (area==0) {
		//sendCopyData(null, "OOG", 0,"Quit:Quit()" );
		return false;

	}
return area;
}
function moveToLead(leader){

var _lead= getUnit(0, leader)
	if(_lead){
	//print("moving to:"+_lead.x);
	if (getDistance(_lead.x,_lead.y,me.x,me.y) >5)
	NTM_MoveTo(_lead.x,_lead.y);
	return true;
	}
var area=0;
var leadx =0;
var leady =0;
 var a = getParty(); 
      do { 
      if (a.name==leader){
	area=a.area;
	leadx=a.x
	leady=a.y	
      }
   } 
   	while(a.getNext()); 
	if (area==0) {
		return false;

	}
	if (leadx!=0){
	NTM_MoveTo(leadx,leady);
    
	}


return true;
}

function OpenSeal(sealID){ 
 var _unit = NTC_GetUnit(NTC_UNIT_OBJECT, sealID); 
   _unit.interact(); 
   _unit.interact();   
}

function Rush5(){
	NTTMGR_TownManager();
	say("Please Standby at the Act 5 Portal Area");
	//NTM_TravelTO(111);
	//NTM_MoveTo(3850, 5122);
	//NTA_ClearPosition(10);
	//NTM_MoveTo(3873, 5127);
	//NTA_ClearPosition(10);
	//NTM_MoveTo(3857, 5144);
	//NTA_ClearPosition(10);
	//NTM_MoveTo(3865, 5141);
	//NTA_ClearPosition();
	//NTM_MoveTo(3865, 5141);
	//say("Shenk is up")
	//waitForSomeone();
	//if (!NTA_KillBoss(getLocaleString(22435))) { //Shenk the Overseer
		//NTA_ClearPosition(25);
		//return false;
	//}
	//NTM_MoveTo(3865, 5141);
	//NTM_UsePortal("BluePortal", 109, me.charname);
	NTM_TravelTO(114);
	if (!NTM_MoveToObject(NTC_UNIT_OBJECT, 460, 460, -8, -8)) 
		NTA_ClearPosition();
	say("Anya up")
	say("Talk to anya, then go back to town and talk to malah, get the potion, and come back and free Anya")
	waitForSomeone();
	if (!NTA_KillBoss(getLocaleString(22504))) //Frozenstien
		NTSI_PickItems();
	NTM_UsePortal("BluePortal", 109, me.charname);
	NTM_TravelTO(118);
	NTM_GotoLevel(120,false)
		say("Ancients up, come in and go through the stairs")
	waitForSomeone();
	NTM_TravelTO(120);
	NTP_DoPrecast();
	say("if you die STAY DEAD!")
	
	NTM_OpenAlter()
	
	
	NTM_MoveTo(10062,12620)
	NTM_OpenAlter()
	
	delay(1000)
	NTA_ClearRooms()
	return true;
}
function NTM_OpenAlter(){ // only opens act 4 town door atm
var myDoor = getUnit(2);
				if(myDoor){
					do{					
						if(myDoor.name == "ancientsaltar" ){
							if(getDistance(me,myDoor)>10)
								NTM_MoveTo(myDoor.x,myDoor.y)
							while(myDoor.mode == 0){
								clickMap( 0, 0, myDoor );
								NTC_Delay(rnd(10,20));
								clickMap( 2, 0, myDoor );
								NTC_Delay(200);
								//myDoor.interact();
							}						
						}
					}while(myDoor.getNext());
					me.cancel()
				}
}
