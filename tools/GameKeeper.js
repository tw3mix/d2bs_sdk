/**
*	@filename	GameKeeper.js
*	@author		Guild Privilege @ JSP
*	@desc		An ingame muling assistant. Stays ingame for a preset time, will respond with time left, and will quit on command.
*/

function GameKeeper () {
	var time1 = 0, packet = 0;
	
		this.chatEvent = function (name, msg) {

		if( me.name == name ) 
			return; // dont respond to myself

			switch ( msg ) {
				case "time":										//1000 = 1sec
				var left = (time1*1000);                            //600000 = 10 minutes
				var timer = (600000-left);                          // 
				var time2 = (timer/1000);                           //   
				var time3 = ((time2/60).toFixed(2));
				var decTime = time3 % 1; // cut off anthing before the decimal 
				var intTime = time3 - decTime;  //Math.floor(time3); //return the largest int, chop off the decimal
				decTime = Math.floor(decTime * 60);
					// will be the number of seconds left 
               
				say("You have: " + intTime + " minutes and " + decTime + " seconds remaining."); 
				break;//   
				case "quit":   
				//   
				D2Bot.restart();                                       //   
				break;                                              //   
				case "help":										//
				say("The two commands are time & quit. Powered by Team Privilege."); 
				break;//   
			}
		};
		
		addEventListener("chatmsg", this.chatEvent);
	
	while (true) {	
	//print("time1234: " + time1);

		
		if (time1 >= 600){
			D2Bot.restart();
		}
		if (packet >= 120){
			var packet = 0;
			sendPacket(1, 0x40);
		}
		print(packet);
	
	
		delay(1000);
		time1++;
		packet++;
	
	}
	return true;
}
