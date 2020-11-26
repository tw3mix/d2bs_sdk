> Hello,
> 
> I did a slow job of retrieving all quests states in Diablo, here is the result if some people are interested in it. They are necessary to understand how to use the D2BS API function **me.getQuest(id, state)**.
> 
> **### Preliminary notes**
> 
> * States range from 0 to 15 (they are stored in an uint16). They are not self-exclusive.
> * BEWARE: if by mistake you try to get the state 16 for quest "i", the getter will not crash but instead return the state 0 of quest "i+1" (because all quest states are stored end to end in a Array. Same for 17 that returns state 2, etc...
> 
> ### **Common states**
> (same for all 6 visible quests of all 5 acts)
> 
> * 0: quest completed (both requirements & thanks by NPC & reward used)
> * 1: requirements completed, must go town talk to NPC for congratulations or reward.
> * 2-11 various steps, depends of the Q. Some correspond to talking to a NPC and may be skipped.
> * 12: box in quest menu is greyed (requires opening the quests menu at the good act page). Just requires that at least one member of the party has reached state 0 but not necessarly yourself.
> * 13: quest requirements cleared for/by the party in this game. Reset on quit if no reward from this quest, changed to 15 otherwise.
> * 14: Another party completed the requirements in this game. if not 13, I cannot complete this quest in this game. If 13 (ex: Forgotten tower completed by a teamate), ignore. (Note: it doesn't remain in next game, and thus not true in case of joining a game whose creator already has completed the requirements...)
> * 15: I completed the quest requirements in a previous game & there was a reward & reward had not been used in the same game but later or not yet.
> 
> **### Details quest per quest**
> 
> 0 = Spoke to Warriv
> 
> > 0: I talked to Warriv in this game, no more "!" overhead
> > > > States left at the end: 0
> 
> 1 = Den of Evil
> 
> > 2: Any player talked to Akara, no more "!" overhead. Q text: "Look for the Den..." (can be skipped)
> > 3: Any player left Town after step 2 (can be skipped)
> > 4: Any player entered Den of Evil
> > 1 & 13: A party member killed last monster in Den of Evil. Q text: "Return to Akara for a reward...". Akara has "!" overhead
> > 0: I talked to Akara. States 1, 2, 3, 4 are reset to false
> > 12: Quest box greyed out after opening Q menu (can be skipped)
> > > > States left at the end: 0, 12, 13
> > > > States changed after use of reset stats/skills: 13 is reset to 15 or false (according if you took the reward or not)
> 
> 2 = Sisters' Burial Grounds
> 
> > 2: Any player talked to Kashya after Den of Evil Q. No more "!" overhead. Q text: "Look for Blood Raven..." (can be skipped)
> > 3: Any player left Town after step 2 (can be skipped)
> > 4: Any player entered Burial Ground. Q text: "Kill Blood Raven"
> > 1 & 13: A party member killed Blood Raven. Q text: "Return to Kashya for a reward". Kashya has "!" overhead
> > 0: Quest completed. State 1 is reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, (2), (3), 4, 12
> 
> 4 = The Search for Cain
> 
> > 2: Any player talked to Akara Blood Raven Q. No more "!" overhead.
> > 3: Any player picked the scroll of Inifuss. Q text: "Take the scroll of Inifuss to Akara" as soon as the scroll drops from the tree. Akara has a "!" overhead.
> > 4: A party member turned all stones opened the red portal to tristram Q text: "Find and rescue Deckard Cain"
> > 1 & 13: A party member rescued Deckard Cain. Q text: "Visit Cain and Akara...". Cain and Akara have a "!" overhead.
> > 12: Quest box greyed out after opening Q menu
> > 0: Received reward from Akara. No more "!" overhead. State 1 is reset to false. Talking to Cain is optional (can be skipped).
> > 14: You cannot complete this quest in this game
> > > > States left at the end: 0, 2, 3, 4, 12, 13
> > > > States modified in next game: 13 becomes 15
> > > > ???? Rogues saved Cain
> > > > ???? Entered secret cow level
> 
> 5 = Forgotten Tower
> 
> > 2: Any player have read the Moldy Tome in Stone Field and Q text: "Look for the Tower..." OR entered the "Forgotten Tower"
> > 4: Any player entered tower level 5. Q text: "Dispose of the evil countess"
> > 0 & 13: Any player killed the countess
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 2, 4, 12, 13
> > > > States changed in next game: 13 reset to false
> 
> 3 = Tools of the Trade (if not level 8, cannot be completed but not state 14)
> 
> > 2: Any player talked to Charsi (after cain Q), no more "!" overhead
> > 3: Any player left Town after state 2 or dropped the Malus
> > 6: I picked the Malus. Q text: "Return the Malus to Charsi"
> > 1 & 13: A party member talked to Charsi, no more "!" overhead. Imbue available
> > 0: imbue done. States 1 are reset to false.
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 2, 3, 4, 12, 13
> > > > States changed in next game: 13 becomes 15, false after imbue
> 
> 6 = Sisters to the Slaughter
> 
> > 2: Any player talked to Cain, no more "!" overhead. Q text: "Find Andariel's Lair..."
> > 3: Any player left Town after step 2 or entered Monastery
> > 4: Any player entered Catacombs level 4. Q text: "Kill Andariel"
> > 1 & 13: A party member killed Andariel. Q text: "Return to Wariv to take the Caravane..."
> > 0: I talked to Wariv
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 3, 4, 12, 13
> > > > States changed in next game: 13 rest to false
> 
> 7 = Able to go to Act II
> 
> > 0: I used the Caravan to go act2
> > > > States left at the end: 0
> 
> 8 = Spoke to Jerhyn
> 
> > 0: I talked to Jerhyn in this game, no more "!" overhead
> > > > States left at the end: 0
> 
> 9 = Radament's Lair
> 
> > 2: Any player talked to Atma, no more "!" overhead. Q text: "Find Radament" (can be skipped)
> > 3: Any player left Town" (can be skipped)
> > 4: Any player found Radament in Sewers level 3. Q text: "Kill Radament"
> > 5: There is a book of skill on the floor for me. Reset to false once the book of skill is consummed
> > 1 & 13: A party member killed Radament. Reward available, Q text "Return to Atma for a reward"
> > 0: quest finished. States 1 is reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, (2), (3), 4, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 10 = The Horadric Staff
> 
> > 3: I talked to Cain to show to him the Horadric Scroll from the chest near Radament or Cube
> > 4: I talked to Cain with the Amulet of the Viper or Horadric Staff
> > 5: I talked to Cain with the Staff of Kings or Horadric Staff
> > 6: I talked to Cain with the Horadric Cube or Horadric Staff
> > 11: I assembled the Horadric Staff thanks to the Cube
> > 10: I talked to Cain with the Horadric Staff assembled
> > 0, 13: I put the staff put in the Orifince, way to Duriel opening (same for party member ?)
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 3, 4, 5, 6, 10, 11, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 11 = The Tainted Sun
> 
> > 2: Any player entered Lost City & the sun goes out OR broken the altar if use wp
> > 3: Any player asked to Drognan about the Darkness
> > 1 & 13: A party member destroyed the Tainted Sun Altar in the Viper Temple level 2.
> > 12: Quest box greyed out after opening Q menu
> > 0: I talked to any NPC in Town. 1 is reset to false. This step is necessary to be able to use TPs to Arcane Sanctuary
> > > > States left at the end: 0, 2, (3), 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 12 = The Arcane Sanctuary
> 
> > 2: Any player talked to Drognan after getting the 3 items: cube+staff+amulet
> > 3: Any player talked to Jerhyn to open access to the Palace (guard moves and gets a "!" overhead)
> > 7: I first talked to guard blocking the way "You may not pass" OR any player entered Canyon of the Magi
> > 8: I first talked to guard not blocking anymore "Stay out of troubles" OR any player entered Canyon of the Magi
> > 4: Any player left Town after step 3
> > 5: Any player entered Arcane Sanctuary (causes Jerhyn bug if you did not do step 2)
> > 1, 13: A party member read Horazon's Journal and opened the red TP. States 2, 3, 4 & 5 are reset to false
> > 0: A party member killed the Summoner. State 1 reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 7, 8, 10, 11, 12, 13
> > > > States changed in next game: 10, 11 and 13 reset to false
> 
> 13 = The Summoner
> 
> > 2: Any player found and heard the summoner talk in the Arcane Sanctuary
> > 1 & 13: A party member killed the summoner
> > 12: Quest box greyed out after opening Q menu
> > 0: I talked to any NPC. State 1 reset to false. This step is necessary to be able to use TPs to Canyon of the Magi
> > > > States left at the end: 0, 2, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 14 = The Seven Tombs
> 
> > 2: Any player talked to Jerhyn at palace. Q text: "Find Tal Rasha's Tomb".
> > 5: A party member killed Duriel. Q text: "Explore Tal Rasha's Tomb"
> > 3 & 13: A party member talked to Tyrael. Q text: "Talk to Jerhyn"
> > 6: I got Congratulations by Atma
> > 7: I got Congratulations by Wariv
> > 8: I got Congratulations by Drognan
> > 9: I got Congratulations by Lysander
> > 10: I got Congratulations by Cain
> > 11: I got Congratulations by Fara
> > 4 I talked to Jerhyn after Tyrael. 3 is reset to false
> > 0: I talk to Meshif. 4 is reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 2, 5, 6, 7, 8, 7, 10, 11, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 15 = Able to go to Act III
> 
> > 0 & 13: Sailed to the East
> > > > States left at the end: 0, 13
> > > > States changed in next game: 13 is reset to false
> 
> 16 = Spoke to Hratli
> 
> > 0: I talked to Hratli in this game, no more "!" overhead
> 
> 20 = The Golden Bird
> 
> > 6: I picked the Jade Figurine. Q text: "Ask Cain about the Jade..."
> > 2: A party member talked to Cain with Jade Figurine. Q text: "Show Meshif the figurine". Same state after talking to Meshif.
> > 4: A party member talked to Cain with the Golden Bird
> > 1: A party member talked to Alkor with the Golden Bird. Q text: "Return to Alkor for a reward"
> > 0 & 5 & 13: I got the reward from Alkor. States 1, 2, 4, 6 reset to false. If not in party, cannot complete but not state 14???
> > 5 reset to false when potion is consumed!
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 5, 12, 13
> > > > States changed in next game: 5 & 13 are reset to false (Potion has been consumed automatically ?)
> 
> 19 = Blade of the Old Religion
> 
> > 2: Any player talked to Hratli to start the quest or killed the unique Flayer
> > 3: Any player left town after step 2. Step 2 is reset to false
> > 4: Any player killed the unique Flayer that drops The Gidbinn
> > 5 & 9: I picked "The Gidbinn"
> > 6: A party member talked to Ormus with the Gidbinn. He goes reinforce the protection
> > 8: I talked to Ormus after he reinforced the protection, got a ring as reward
> > 0, 13: I talked to Asheara to complete the Q
> > 7: I can recruit an Iron Wolf
> > > > States left at the end: 0, 2, 4, 5, 6, 7, 8, 9, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 18 = Khalim's Will
> 
> > 2: I talked to Cain after any player left town
> > 3: I talked to Cain with the Khalim's Eye
> > 4: I talked to Cain with the Khalim's Brain
> > 6: I talked to Cain with the Khalim's Heart
> > 5: I talked to Cain with the Khalim's Flail
> > 7: I talked to Cain with the transmuted Khalim's Will
> > 0 & 13: A party member smashed the Orb with Khalim's Will
> > > > States left at the end: 0, 2, 4, 5, 6, 7, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 17 = Lam Esen's Tome
> 
> > 2: Any player talked to Alkor after reaching Kurast
> > 1 & 13: Back to Town with the Lam Esen's Tome
> > 0: Talk to Alkor. State 1 is reset to false.
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 2, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 21 = The Blackened Temple
> 
> > 3: Any player found the council
> > 4 & 13: A party member killed the Council (and I was nearby)
> > 0: I talked to Cain. State 4 is reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 3, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 22 = The Guardian
> 
> > 7: ???
> > 8: Any player entered the Durance of Hate level 1
> > 9: Any player entered the Durance of Hate level 3
> > 0 & 13: A party member killed Mephisto. I can use the red portal
> > 11: PNJs from act 3 will congratulate you. Will be reset to false as soon as you talk to 1 PNJ
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 8, 9, 12, 13
> > > > States changed in next game: 13 is reset to false. 0 reset to false if you didn't get step 11
> 
> 23 = Able to go to Act IV
> 
> > 0 & 13: I used the red Portal in Durance of Hate level 3
> > > > States left at the end: 0, 13
> > > > States changed in next game: 13 is reset to false
> 
> 24 = Spoke to Tyrael
> 
> > 0: I talked to Tyrael in this game
> > > > States left at the end: 0
> 
> 25 = The Fallen Angel
> 
> > 2: Any player talked to Tyrael when arriving in Act 4
> > 3: Any player left Town after step 2
> > 1 & 13: A party member killed Izual. States 2 & 3 are reset to false
> > 12: quest box greyed out after opening Q menu
> > 5: I talked to Izual's Soul (can be skipped)
> > 0: I got the reward from Tyrael. State 1 & 5 reset to false.
> > > > States left at the end: 0, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 27 = Hell's Forge
> 
> > 5: Any player talked to Cain when arriving in Act 4 (and got the soulstone given ?)
> > 3: Any player left Town after step 5
> > 1 & 13: a party member destroyed the Soul Stone. States 3 & 5 reset to false
> > 12: Quest box greyed out after opening Q menu
> > 0: I got congratulated by Cain. State 1 is reset to false (can be skipped)
> > > > States left at the end: 0, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 26 = Terror's End
> 
> > 2: Any player talk to Tyrael after Izual Q
> > 3: Any player left Town after step 2 or Entered Chaos Sanctuary
> > 0 & 13: A party member killed Diablo
> > 8: I got congratulated by Cain
> > 9: I talked to Tyrael (congratulations & if not already, portal to act 5 opened)
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 8, 9, 12, 13
> > > > States changed in next game: 13 is reset to false
> 
> 28 = Able to go to Act V
> 
> > 0: Portal to act 5 is open
> > > > States left at the end: 0
> 
> 35 = Siege on Haggorath
> 
> > 2: Any player talked to Larzuk when he has "!" overhead (after talking to all NPCs ? or Maybe Cain ?)
> > 3: Any player left Town after step 2 or entered Bloody Foothills
> > 1 & 13: A party member killed Shenk
> > 5: I talked to Larzuk. State 2 & 3 is reset to false
> > 0: I used socket quest. State 1 is reset to false
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 5, 12, 13
> > > > States changed in next game: 13 becomes 15
> 
> 36 = Rescue on Mount Arreat
> 
> > 2: Any player talked to Qual-Khek to start the Q
> > 3: Any player left Town after step 2 or entered Arreat Plateau
> > 4: I started freeing soldiers (at the moment they use the blue TP)
> > 1 & 5 & 13: A party member freed the last soldiers
> > 12: Quest box greyed out after opening Q menu
> > 0: Talked to Qual-Khek (obtained the reward or it is on the floor). States 1, 2, 3, 4 & 5 are reset to false
> > > > States left at the end: 0, 12, 13
> > > > States changed in next game: 13 reset to false
> 
> 37 = Prison of Ice
> 
> > 2: Any player talked to Malah after Barbs rescue quest
> > 3: Any player left Town after step 2 or entered Cristalline Passage
> > 1 & 13: A party member freed frozen Anya with the potion from Malah
> > 8: I talked to Malah to get the Scroll of Resistance (in inventory or on the floor)
> > 7: I consumed to Scroll of Resistance
> > 9 & 10: I talked to the released Anya in town & obtained rare item reward & opened red TP to Nilhatak
> > 0: Talked to both Anya & Malah
> > 14: entered the Hall of Pain without Anya Q done
> > 12: Quest box greyed out after opening Q menu
> > > > States left at the end: 0, 2, 3, 7, 8, 9, 10, 12, 13
> > > > States changed in next game: 13 becomes 15
> 
> 38 = Betrayal of Haggorath
> 
> > 2: Any player talked to the released Anya in town (2nd dialog)
> > 3: Any player left Town after step 2
> > 1 & 13: a party member killed Nilhatak
> > 4: I talked to Anya, Personalize reward available
> > 0 : I used Personalize reward
> > 12: Quest box greyed out after opening Q menu
> > Note: if killing Nilhatak without Anya Q done > state 14 cannot complete in this game
> > > > States left at the end: 0, 2, 3, 4, 12, 13
> > > > States changed in next game: 13 reset to false
> 
> 39 = Rite of Passage
> 
> > 2: Any player talked to Qual-Khek after Nilhatak Q
> > 3: Any player left Town after step 2 OR entered the Arreat Summit
> > 0 & 13: A party member killed the 3 ancients + level up and I was nearby
> > 4: The 3 ancients have become gold statues (only single player ?)
> > 12: Quest box greyed out after opening Q menu
> > 8: I got Congratulations from Malah
> > 5: I got Congratulations from Larzuk
> > 6: I got Congratulations from Cain
> > 7: I got Congratulations from Anya
> > 9: I got Congratulations by Qual-Khek
> > > > States left at the end: 0, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13
> > > > States changed in next game: 13 reset to false
> 
> 40 = Eve of Destruction
> 
> > 2: Any player killed the Ancients
> > 3: Any player left Town after step 2
> > 0 & 13: A party member killed Baal
> > 12: Quest box greyed out after opening Q menu
> > 4: Congratulations from Larzuk
> > 5: Congratulations from Cain
> > 6: Congratulations from Malah
> > 8: Congratulations from Qual-Khek
> > 9: Congratulations from Anya
> > 7: Congratulations by Tyrael, red portal to The Destruction's End opened
> > 10 : used the red portal to the End of Destruction
> > > > States left at the end: 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13
> > > > States changed in next game: 13 reset to false
> 
> 41 = Reset Stats/Skills (by Akara)
> 
> > 1 & 13: I talked to Akara to validate Act1 Q1
> > 0: I used reset stats/skills

Quest Messages Dump - Packet 0x31
==================

``` javascript
function BlockPackets()
{
	this.PacketReceived = function(bytes) 
	{
		switch(bytes[0]) 
		{
			case 0x8A:
				var type = bytes[1];
				var gid = ((bytes[2]) | (bytes[3] << 8) | (bytes[4] << 16) | (bytes[5] << 24)) >>> 0;
				
				var npc = getUnit(type, -1, -1, gid);
				
				me.overhead("R: " + npc.name);
				
				break;
			default:
				break;
		}
	};
	   
	this.PacketSent = function(bytes) 
	{
		switch (bytes[0]) 
		{
			case 0x31:
				var gid = ((bytes[1]) | (bytes[2] << 8) | (bytes[3] << 16) | (bytes[4] << 24)) >>> 0;
				var msg = ((bytes[5]) | (bytes[6] << 8) | (bytes[7] << 16) | (bytes[8] << 24)) >>> 0;
				
				var text = getLocaleString(msg);
				
				msg = msg.toString(16);
				
				while(msg.length < 4)
					msg = "0" + msg;
				
				var npc = getUnit(-1, -1, -1, gid);
				
				print("Sent quest message 0x" + msg.toString(16) + " to " + npc.name + " in area: " + me.area + "\n");
				
				FileTools.appendText("questMessages.txt", "/* Sent quest message 0x" + msg.toString(16) + " to " + npc.name + " in area: " + me.area + "\n");
				FileTools.appendText("questMessages.txt", text + "*/\n\n");
		}
	};
	
	addEventListener("gamepacket", this.PacketReceived);
	addEventListener("gamepacketsent", this.PacketSent);
}

BlockPackets();

// Sent quest message 0x0000 to Warriv in area: 1 - introduce warriv
// Sent quest message 0x000c to Akara in area: 1 - den q done
// Sent quest message 0x004c to Akara in area: 1 - den q done
// Sent quest message 0x0018 to Kashya in area: 1 - take bloodraven quest
// Sent quest message 0x0051 to Kashya in area: 1 - take bloodraven quest
// Sent quest message 0x003d to Flavie in area: 2
// Sent quest message 0x003e to Flavie in area: 2
// Sent quest message 0x005c to Kashya in area: 1 - killed bloodraven, get merc
// Sent quest message 0x0061 to Akara in area: 1 - scrool
// Sent quest message 0x0070 to Akara in area: 1 - scrool
// Sent quest message 0x007c to Deckard Cain in area: 38 - after cain resque
// Sent quest message 0x007b to Deckard Cain in area: 1 - after cain resque
// Sent quest message 0x007e to Deckard Cain in area: 1 - after cain resque
// Sent quest message 0x0076 to Akara in area: 1 - after cain resque
// Sent quest message 0x0024 to Charsi in area: 1 - take hammer quest
// Sent quest message 0x0092 to Charsi in area: 1 - take hammer quest
// Sent quest message 0x007f to asdfasdfasdfsdf in area: 4 - to moldy tome to activate countess quest
// Sent quest message 0x002d to Gheed in area: 1 - introduce gheed
// Sent quest message 0x0091 to Deckard Cain in area: 1 - to any npc after killing countess
// Sent quest message 0x00a3 to Charsi in area: 1 - give back mallus
// Sent quest message 0x00b8 to Deckard Cain in area: 1 - after killing andariel
// Sent quest message 0x00b5 to Kashya in area: 1 - after killing andariel
// Sent quest message 0x00b3 to Akara in area: 1 - after killing andariel
// Sent quest message 0x00b7 to Warriv in area: 1 - after killing andariel


// Sent quest message 0x00fd to Jerhyn in area: 40 - introduce jerhyn
// Sent quest message 0x00ba to Kaelan in area: 40 - introduce (cannot enter palace)
// Sent quest message 0x00d7 to Warriv in area: 40 - introduce in a2
// Sent quest message 0x0107 to Fara in area: 40 - introduce
// Sent quest message 0x0112 to Lysander in area: 40 - introduce
// Sent quest message 0x0130 to Atma in area: 40 - get radament quest
// Sent quest message 0x011e to Drognan in area: 40 - introduce
// Sent quest message 0x00cb to Elzix in area: 40 - introduce
// Sent quest message 0x00f1 to Meshif in area: 40 - introduce
// Sent quest message 0x00e6 to Geglash in area: 40 - introduce
// Sent quest message 0x00be to Greiz in area: 40 - introduce
// Sent quest message 0x014e to Atma in area: 40 - killed radament
// Sent quest message 0x014f to Deckard Cain in area: 40 - show scrool to cain
// Sent quest message 0x0152 to Deckard Cain in area: 40 - show cube to cain
// Sent quest message 0x0151 to Deckard Cain in area: 40 - show staff to cain
// Sent quest message 0x015c to Drognan in area: 40 - ask about tainted sun
// Sent quest message 0x0173 to Drognan in area: 40 - show amu allow arcane (nn have amu)
// Sent quest message 0x0175 to Drognan in area: 40 - show amu allow palace (nn have amu)
// Sent quest message 0x0150 to Deckard Cain in area: 40 - show amu
// Sent quest message 0x0153 to Deckard Cain in area: 40 - show transmuted staff
// Sent quest message 0x00bb to Kaelan in area: 40 - "welcome to the palace"
// Sent quest message 0x00bd to Kaelan in area: 40 - "stay out of trouble"
// Sent quest message 0x00bc to Kaelan in area: 40 - "you may enter palace"
// Sent quest message 0x018c to asdfasdfasdfsdf in area: 74 - open red portal to duriel (horizons journal)
// Sent quest message 0x0192 to Meshif in area: 40 - after kill summoner 
// Sent quest message 0x01a9 to Meshif in area: 40 - after kill summoner
// Sent quest message 0x012e to Tyrael in area: 73 - after killing duriel
// Sent quest message 0x01c4 to Deckard Cain in area: 40 - after killing duriel
// Sent quest message 0x01bf to Fara in area: 40 - after killing duriel
// Sent quest message 0x01bd to Atma in area: 40 - after killing duriel
// Sent quest message 0x01c1 to Drognan in area: 40 - after killing duriel
// Sent quest message 0x01ba to Jerhyn in area: 40 - after killing duriel (allow talk with meshif)
// Sent quest message 0x01c2 to Meshif in area: 40 - allow act travel.
/* Sent quest message 0x01d2 to Hratli in area: 75
33
Welcome to Kurast, young Sorceress. 
Few come willingly to this ancient city 
anymore. I hope you brought your wits 
with you, for sanity is in short supply 
here.
 
My name is Hratli. I am a sorcerer 
skilled in metal work. It'd be a pleasure 
to help you... I don't have many 
customers these days.
 
Though my own magic is only useful for 
making enchanted weapons, I'll bet 
yours will put an end to this terrible 
evil once and for all. May the spirits of 
Skatsim watch over and protect you.
 
As you can see, the populace has been 
brutally decimated by the forces of 
Mephisto. The canals run red with 
blood and demons roam the land.
 
The wretched jungle-hell has already 
reclaimed much of Kurast. The only 
safety you'll find is here at the 
dockside, where a magical warding 
holds the jungle evils at bay... but I 
don't know how long it will last.
 
To make matters worse, the Children of 
Zakarum are in league with the forces 
of Mephisto. The Zakarum have 
concentrated their power in the Temple 
City of Travincal, located within Kurast 
deep in the jungle wilderness.
 
It's true... Their zeal is unmatched. But I 
say the so-called 'Warriors of Light' are 
nothing more than the twisted puppets 
of a hidden hand.
*/

/* Sent quest message 0x01de to Meshif in area: 75
51
Well, I gave you my word, and brought 
you here as promised.
 
But by all that's still holy, I wish I'd 
never returned to this accursed place. 
This fetid jungle can't be the fair 
Kurast I left behind.
 
I don't know what all this evil is, my 
friend, but it's obvious that you must 
stop it. I only pray that you can before 
the jungle consumes the last vestiges 
of my beloved homeland.
*/

/* Sent quest message 0x0202 to Ormus in area: 75
38
You now speak to Ormus.
 
He was once a great mage, but now 
lives like a rat in a sinking vessel. You 
have questions for Ormus and doubt in 
yourself. Ormus sees a strange 
dichotomy in you... as he does in all 
would-be heroes.
 
Speak to him and he may grant you 
wisdom in turn. Or turn from him and 
seek wisdom in thyself.
*/

/* Sent quest message 0x01ca to Deckard Cain in area: 75
45
I've not set foot in glorious Kurast for 
many years. But I never would have 
imagined it could be so corrupted.
 
Certainly, this must be Mephisto's work! 
You'd best get going, my friend. Diablo 
and Baal are still out there and you 
must find them.
*/

/* Sent quest message 0x01f5 to Alkor in area: 75
61
Damn it, I wish you people would just 
leave me alone! I...
 
Oh, you're new here, aren't you?
 
I am Alkor, the Alchemist. I dabble in 
potions and salves, and I can sell you 
some if you really need them.
 
But don't make a habit of coming here. I 
don't like to be disturbed while I'm 
studying!
*/

/* Sent quest message 0x01ea to Asheara in area: 75
54
Hello, there. You must be a great 
adventurer to risk coming here.
 
My name's Asheara, and I lead the 
mercenary band of mages known as 
the Iron Wolves. We've been hunting 
down demons in the jungle for months, 
but no matter how many of them we 
kill, they just keep comin'. Seems this 
whole place has been overrun by evil.
 
Rumor has it that you've come here to 
help. If that's true, then I'll let you hire 
some of my mercenaries.
 
But be careful... If you piss them off, 
they can be worse than those monsters 
out in the jungle.
*/

/* Sent quest message 0x0221 to Deckard Cain in area: 75
52
Ahh... Khalim's Eye! Only it can reveal 
the true path to Mephisto.
 
Place the Eye in the Horadric Cube 
along with Khalim's other relics - the 
Heart, the Brain, and the Flail.
*/

/* Sent quest message 0x020f to Deckard Cain in area: 75
53
Back in Lut Gholein Meshif told me he 
had a fondness for jade figurines. On 
his trading voyages he collected an odd 
assortment of such small statues.
 
I would show him your figurine. 
*/

/* Sent quest message 0x0211 to Meshif in area: 75
73
Praise you! That jade figurine will 
complete the set I was collecting.
 
Here! I've had this statuette of a golden 
bird for years, but I consider it a fair 
exchange.
*/

/* Sent quest message 0x0213 to Deckard Cain in area: 75
47
I've read legends about a sage named 
Ku Y'leh, who studied the mysteries of 
life beyond death.
 
If I remember correctly, his ashes were 
ensconced within a golden statuette. It 
was a very strange tale.
*/

/* Sent quest message 0x0216 to Alkor in area: 75
73
Ah, the Golden Bird of Ku Y'leh.  Thank 
you, my friend. 
 
Busy yourself while I experiment with 
the ashes within it. Then, return and 
see what I have made for you.
*/

/* Sent quest message 0x021a to Alkor in area: 75
120
From the ashes of Ku Y'leh I have mixed 
for you a potion.
*/

/* Sent quest message 0x021f to Deckard Cain in area: 75
33
Never forget that your ultimate purpose 
here in Kurast is to destroy Mephisto. 
The ancient Horadrim imprisoned the 
Lord of Hatred inside the Guardian 
Tower that is located within the Temple 
City of Travincal.
 
Know this, friend. The only way to gain 
entry to Mephisto's prison is to destroy 
the artifact known as the Compelling 
Orb.
 
Mephisto used this device to control the 
Zakarum Priests and their followers. 
The Orb can only be destroyed with an 
ancient flail imbued with the spirit of 
the one incorruptible priest.
 
Soon after his imprisonment, Mephisto 
worked his evil corruption on the 
Zakarum priesthood. All were turned to 
his dark ways, save one - Khalim, the 
Que-Hegan of the High Council.
 
Mephisto directed the other Council 
priests to slay and dismember Khalim 
and then scatter his remains across 
the Kingdom. The Priest Sankekur 
succeeded Khalim as Que-Hegan, 
eventually becoming the embodiment of 
Mephisto here on the mortal plane.
 
The corrupted High Council fashioned 
an Orb to control the rest of the 
Zakarum faithful and used their powers 
to hide the lair of their master from 
mortals.
 
Your task is to collect the scattered 
relics of Khalim - his Heart, his Brain, 
and his Eye. Then, using the Horadric 
Cube, transmute Khalim's Flail with his 
relics.
 
Once this is accomplished, you must 
destroy the Compelling Orb with 
Khalim's Will to open the way into the 
corrupt sanctum of Mephisto.
*/

/* Sent quest message 0x0222 to Deckard Cain in area: 75
58
This is most fortunate! Khalim's Brain 
knows Mephisto's weakness.
 
Place it in the Horadric Cube along with 
Khalim's other relics - the Eye, the 
Heart, and the Flail.
*/

/* Sent quest message 0x0220 to Deckard Cain in area: 75
61
You have found Khalim's Heart, and it 
still bears the courage to face 
Mephisto!
 
Place it in the Horadric Cube along with 
Khalim's other relics - the Eye, the 
Brain, and the Flail.
*/

/* Sent quest message 0x0225 to Alkor in area: 75
56
It pains me to waste time with you, so 
I'll get right to the point.
 
There is a very special book which you 
must find for me. It was written long 
ago by a sage known as Lam Esen, who 
studied Skatsimi magic and the effects 
of the Prime Evils on the mortal world. 
The Black Book was lost when the 
Children of Zakarum took over this 
land.
 
Now, you must reclaim it without delay! 
Its knowledge may aid us in this dark 
time ahead.
*/

/* Sent quest message 0x0234 to Alkor in area: 75
83
You have found the Book! It should give 
all of us here some insight into the 
nature of the Prime Evils...
 
Ah, but as for you...
*/

/* Sent quest message 0x01c5 to Natalya in area: 75
48
Greetings, hero. I've heard of your 
exploits and... I'm quite impressed. 
Very few mortals are capable of 
dealing with the Three and their 
minions as you have.
 
My name is Natalya. I am a hunter of 
Evil, part of an ancient Order sworn to 
hunt down corrupted sorcerers.
 
If I could, I would gladly join your quest 
to stop the Three. But I must wait here 
for further news. I can't predict what 
will happen, but the danger is greater 
than we can know.
 
Until I receive my orders, I'll assist you 
with the information I have.
*/

/* Sent quest message 0x023b to Hratli in area: 75
45
As I told you before, I placed an 
enchantment upon the dockside in 
order to keep the demons at bay. But 
lately, the enchantment seems to be 
weakening.
 
If memory serves me correctly, there is 
a holy Skatsimi blade that could 
revitalize the enchantment. The blade 
is called the Gidbinn.
 
Find it, and our sanctuary here will 
remain safe.
*/

/* Sent quest message 0x024b to Ormus in area: 75
41
You have done well, noble hero. Ormus 
congratulates you. The old spirits of 
Skatsim will watch over you for 
returning their sacred blade.
 
Now, after all these years, Ormus will 
once again use his powers to protect 
the innocent from the shadow. The 
spell that protects the dockside shall 
now be reinforced.
*/

/* Sent quest message 0x0251 to Ormus in area: 75
101
This magic ring does me no good.
 
Here... Wear it proudly!
*/

/* Sent quest message 0x024d to Asheara in area: 75
99
Now that fewer of the Iron Wolves are 
needed to guard the dockside, some of 
them have volunteered to accompany 
you free of charge.
*/

/* Sent quest message 0x0223 to Deckard Cain in area: 75
46
Once properly imbued, Khalim's Flail can 
destroy the Compelling Orb and reveal 
the way to Mephisto.
 
Place it into the Horadric Cube along 
with Khalim's relics - his Heart, his 
Brain, and his Eye. Then, transmute 
them to carry out Khalim's Will.
*/

/* Sent quest message 0x0272 to Deckard Cain in area: 75
48
Ridding Kurast of the Council of 
Zakarum was essential. Still, there is 
more you must do. The Compelling Orb, 
too, must be destroyed.
 
Diablo and Baal must be close to finding 
their brother, Mephisto, by now. You've 
no time to waste.
*/

/* Sent quest message 0x0224 to Deckard Cain in area: 75
54
Masterfully done, hero! You have 
crafted Khalim's Will. Employ it to 
destroy the Compelling Orb and open 
the way to Mephisto. 
 
May the true Light guide your way.
*/

/* Sent quest message 0x0274 to Ormus in area: 75
53
Diablo and Baal have surely found the 
Temple City by now. They seek to free 
their Brother, Mephisto, who was 
imprisoned by the Horadrim in the 
Temple's Guardian Tower.
 
You must reach him before his Brothers 
do and prevent them from releasing 
Hatred upon the world.
*/

/* Sent quest message 0x0296 to Deckard Cain in area: 75
42
Our faith in you was well deserved. But 
Diablo has made his way to Hell; and it 
is likely that Baal followed him there.
 
Enter the Infernal Gate and kill the Lord 
of Terror before all is lost. Only then 
will our world be saved!
*/








/* Sent quest message 0x02a7 to Deckard Cain in area: 103
50
The time has come to destroy 
Mephisto's Soulstone! 
 
Although I picked it up before entering 
the Infernal Gate, I believe you should 
carry out this crucial mission.
 
Take the Stone to the Hellforge.  Place 
it upon the forge and strike it soundly 
with the Hammer.
 
Only by doing this can you prevent 
Mephisto from manifesting in this 
world ever again.
*/

/* Sent quest message 0x0298 to Tyrael in area: 103
43
It is good to see you again, hero.
 
Mephisto's defeat is a great victory for 
the Light. I knew that you would 
eventually find your way here. The 
Pandemonium Fortress is the last 
bastion of Heaven's power before the 
Gates of the Burning Hells.
 
This place has been hallowed by the 
blood of thousands of champions of 
the Light, many of whom were mortal, 
like yourself. Now the final battle 
against the Prime Evils draws near... 
and you must face it alone. 
 
I have been forbidden to aid you 
directly, save for a few bits of wisdom. 
For this is the hour of mortal Man's 
triumph...your triumph.
 
May the Light protect you and the 
powers of Heaven shine upon your 
path...
*/

/* Sent quest message 0x029e to Tyrael in area: 103
42
There is a dark, tortured soul who was 
trapped within this forsaken realm long 
ago. He was called Izual by mortal 
men, and in ages past he was my most 
trusted Lieutenant.
 
Yet, against my wishes he led an 
ill-fated assault upon the fiery 
Hellforge, itself.
 
Despite his valor and strength, Izual 
was captured by the Prime Evils and 
twisted by their perverse power. They 
forced him to betray his own kind and 
give up Heaven's most guarded 
secrets.
 
He became a corrupt shadow of his 
former self - a fallen angel trusted 
neither by Heaven nor Hell.
 
For his transgressions, Izual's spirit 
was bound within the form of a terrible 
creature which was summoned from 
the Abyss. His maddened spirit has 
resided within that tortured husk for 
many ages now.
 
It seems to me that he has suffered 
long enough. I implore you, hero, find 
Izual and release him from his cruel 
imprisonment.
 
Put an end to his guilt and suffering.
*/

/* Sent quest message 0x02a3 to Izual in area: 105
47
Tyrael was a fool to have trusted me!
 
You see, it was I who told Diablo and his 
Brothers about the Soulstones and how 
to corrupt them. It was I who helped 
the Prime Evils mastermind their own 
exile to your world.
 
The plan we set in motion so long ago 
cannot be stopped by any mortal 
agency.  Hell, itself, is poised to spill 
forth into your world like a tidal wave 
of blood and nightmares.
 
You and all your kind... are doomed.
*/

/* Sent quest message 0x02a4 to Tyrael in area: 103
53
Thank you, hero, for putting Izual's 
tortured spirit to rest. May the Light 
protect you and the powers of Heaven 
shine upon your path.
 
But, if what you tell me is true, then I 
fear that we have been played for fools 
all along.
 
Izual helped Diablo and his Brothers 
trick me into using the Soulstones 
against them... Now the Stones' powers 
are corrupted.
 
With the combined powers of the 
Soulstones under their control, the 
Prime Evils will be able to turn the 
mortal world into a permanent outpost 
of Hell!
*/

/* Sent quest message 0x029d to Hadriel in area: 107
66
Proceed, hero, into Terror's lair.
 
Know that Diablo's innermost sanctum 
is hidden by five seals.
 
Only by opening each of these seals can 
you clear your way to the final battle.
*/

/* Sent quest message 0x029d to Hadriel in area: 107
66
Proceed, hero, into Terror's lair.
 
Know that Diablo's innermost sanctum 
is hidden by five seals.
 
Only by opening each of these seals can 
you clear your way to the final battle.
*/

/* Sent quest message 0x02a8 to Deckard Cain in area: 103
70
Congratulations, hero!
 
Surely, even Diablo, himself, sensed the 
fury unleashed when you smashed his 
Brother's Soulstone.
*/

/* Sent quest message 0x4e21 to Deckard Cain in area: 103
40
I knew there was great potential in you, 
my friend. You've done a fantastic job.
 
Though my ancestors often struggled 
against the Three Evils and their 
minions, I've always lived a shut-in, 
scholarly life. I'm glad that my wisdom 
aided you.
 
Now, I wish to leave this place. Though 
Heaven's Gates are a marvel to behold, 
I hope I won't have to see them again 
for many, many years.
 
Please talk to Tyrael about leaving this 
place now!
*/

/* Sent quest message 0x4e20 to Tyrael in area: 103
40
Praise be to the Light! You have 
accomplished the impossible!
 
Diablo and Mephisto have been 
banished back into the Black Abyss 
that spawned them, and the corrupted 
Soulstones are no more.
 
However, while you were fighting here, 
Baal remained behind in the mortal 
realm, building an army of hellish 
minions. Now, Baal's army is searching 
for the Worldstone, the ancient source 
of all the Soulstones and their power, 
while leaving behind a wake of 
destruction. They have forged deeply 
into the Barbarian homelands, heading 
directly for the summit of Mount 
Arreat!
 
Baal knows, mortal hero! That is the 
very site of the blessed Worldstone!
 
Now, enter the portal I have opened for 
you. It will take you to the Barbarian 
city of Harrogath, the last bastion of 
Order on the slopes of Arreat.
*/








/* Sent quest message 0x4e46 to Malah in area: 109
36
A Sorceress...Here in Harrogath?
 
There was a time, child, when I thought 
I was destined to follow your kind's 
path. However, my powers never 
developed beyond the simplest of 
spells. Although I can heal almost any 
wound with time and energy, there is 
little I can do to help against Baal.
 
But enough of that...I spend too much 
time in reflection and have forgotten 
my manners.
 
I, Malah, welcome you to Harrogath, 
the last stronghold of Order on Mount 
Arreat. You have come to the right 
place, if you intend to defeat Baal the 
Lord of Destruction.
 
Baal has laid waste to our mountain 
and its denizens. His minions continue 
to attack our town, while Qual-Kehk 
and his men have proven helpless to 
stop them. Baal is still out on the 
mountain looking for something -- but I 
know not what. 
 
All of the Elders, save Nihlathak, 
sacrificed themselves to place a 
protective ward around Harrogath.
 
Some of us here, certainly Nihlathak, do 
not appreciate your presence. We are a 
proud people, and it is not easy for us 
to accept aid. I, however, am glad you 
are here.
 
If you need healing or a potion, please 
come to me. See Larzuk for weapons, 
armor, and repairs. Nihlathak, despite 
his disposition, may be of some 
assistance with other wares. Finally, 
Qual-Kehk, our Man-At-Arms, leads 
Harrogath's remaining forces against 
Baal.
*/

/* Sent quest message 0x4e61 to Qual-Kehk in area: 109
45
I am Qual-Kehk, the Senior Man-At-Arms 
of Harrogath.
 
You have the look of a warrior...An 
extra soldier will be useful. But don't 
expect anyone to mourn if you get 
yourself killed. 
 
Baal is true to his namesake. He has 
ravaged through our lands like a 
merciless plague.
 
The protective ward laid down by our 
lost Elders helps hold the evil at bay, 
but Baal's siege has taken its toll all 
the same.
 
Most of my men are now dead. Others 
are trapped in the mountain passes.
 
But I swear we are not beaten yet! We 
will fight to the end to protect this 
mountain!
*/

/* Sent quest message 0x4e23 to Deckard Cain in area: 109
39
I am amazed to find this place so 
untouched. Everything else in the path 
of Baal the Lord of Destruction lies in 
ruin. 
 
These Barbarians must indeed be the 
legendary guardians of Mount Arreat. 
They are a proud, hardy people. Don't 
expect to be greeted warmly -- 
strangers here rarely are.
 
Perhaps I can gain their trust. I'll spend 
some time with the townsfolk and try 
to understand them better. I'll let you 
know what I discover.
*/

/* Sent quest message 0x4e55 to Nihlathak in area: 109
43
Well, well. The siege has everything in 
short supply...except fools. 
 
Why would you seek this place, 
stranger? Are you a vulture come to 
loot the bodies of our fallen warriors? 
 
Regardless, this is no place to make a 
name for yourself. The mountain is 
ours to protect. It is only a matter of 
time before Hell's legions are routed.
*/

/* Sent quest message 0x4e6d to Larzuk in area: 109
45
If you're here to defeat Baal, you must 
prove it!
 
As we speak, Harrogath is under siege 
by Baal's demons. Catapults rain death 
just outside the town walls.
 
Baal himself travels up the sacred 
mountain, having left in charge here 
one of his most vicious generals, Shenk 
the Overseer. A ruthless taskmaster, 
he lashes his own minions into suicidal 
frenzies on the battlefield.
 
If you wish to prove yourself to us, 
destroy the monster, Shenk, that 
commands those infernal catapults 
outside Harrogath.  If you manage to 
do this, return to me.
*/

/* Sent quest message 0x4e7a to Larzuk in area: 109
63
You're an even greater warrior than I 
expected...Sorry for underestimating 
you.
 
As a token of my appreciation, I will 
craft sockets into an item of your 
choosing, and from now on, you'll get 
the best price for all my wares.
*/

/* Sent quest message 0x4e80 to Qual-Kehk in area: 109
58
My concerns have turned to my men 
taken prisoner on the battlefield by 
Baal's demons. I hate to think what's 
happened to them.
 
As you journey up the mountain, keep 
your eyes open for my soldiers and 
bring them back to me if you can.
*/

/* Sent quest message 0x4e8e to Qual-Kehk in area: 109
51
Thank you for rescuing my men. They 
have spoken well of your bravery in 
battle. Perhaps there is hope for us 
after all. 
 
If you wish, you may hire some of my 
mercenaries that you saved. And 
please...take this set of runes. I had 
been saving them for a socketed shield, 
but I think you'll make better use of 
them.
 
Be sure to set them in the right order 
for their fullest effect.
*/

/* Sent quest message 0x4ea3 to asdfasdfasdfsdf in area: 114
50
Hero. Nihlathak did this to me!
 
If you've come to help me, my only hope 
lies with Malah.
 
Please...Tell her you've found me...
*/

/* Sent quest message 0x4ea3 to asdfasdfasdfsdf in area: 114
50
Hero. Nihlathak did this to me!
 
If you've come to help me, my only hope 
lies with Malah.
 
Please...Tell her you've found me...
*/

/* Sent quest message 0x4ea3 to asdfasdfasdfsdf in area: 114
50
Hero. Nihlathak did this to me!
 
If you've come to help me, my only hope 
lies with Malah.
 
Please...Tell her you've found me...
*/

/* Sent quest message 0x4e9f to Malah in area: 109
56
So! That snake Nihlathak was behind 
Anya's disappearance...and he trapped 
her with a freezing curse.
 
Here. Take this potion to Anya and give 
it to her. That should release her.
*/

/* Sent quest message 0x4e2e to Anya in area: 109
54
You have proven yourself a true hero to 
me and my people.
 
These are dark times, warrior. I hope 
you can bring an end to Baal's reign of 
destruction. 
 
Our Council of Elders is gone -- my 
father, Aust, among them. The one 
thing that keeps us from total despair 
is the promise of vengeance against 
Baal.
*/

/* Sent quest message 0x4ea8 to Anya in area: 109
80
Thank you, hero, for rescuing me.
 
To show my personal gratitude, I give 
you this. I had it custom-made for you 
by Larzuk.
*/

/* Sent quest message 0x4ea9 to Anya in area: 109
43
Nihlathak told me he struck a deal with 
Baal to protect Harrogath. In exchange 
for the demon's mercy, the misguided 
fool plans to give Baal the Relic of the 
Ancients, our most holy totem!
 
Doing so will allow Baal to enter Mount 
Arreat unchallenged by the Ancients. I 
tried to stop Nihlathak, but he 
imprisoned me in that icy tomb.
 
Nihlathak must be stopped before he 
dooms the whole world. As much as I 
would love to strangle the life out of 
him, I'm afraid I haven't the strength.
 
You must go to his lair through this 
portal I've opened, kill him, and then 
bring back the Relic of the Ancients.
 
Stop Nihlathak from destroying what we 
have striven for eons to protect.
*/

/* Sent quest message 0x4ea4 to Malah in area: 109
48
Thank you so much for bringing Anya 
back to us. I have devised this spell to 
increase your resistances as a token of 
my thanks. I know it isn't much, but I 
hope you find it helpful.
 
Please go talk to Anya. She has urgent 
news concerning Nihlathak.
*/

/* Sent quest message 0x4e22 to asdfasdfasdfsdf in area: 120
35
We are the spirits of the Nephalem, the 
Ancient Ones. We have been chosen to 
guard sacred Mount Arreat, wherein 
the Worldstone rests. Few are worthy 
to stand in its presence; fewer still can 
comprehend its true purpose.
 
Before you enter, you must defeat us.
*/

/* Sent quest message 0x4ec9 to asdfasdfasdfsdf in area: 120
31
You are a worthy hero! We augment 
your skill and grant you entry to the 
interior of Mount Arreat, wherein lies 
the Worldstone.
 
Beware. You will not be alone. Baal the 
Lord of Destruction is already inside. 
 
The Archangel Tyrael has always been 
our benefactor, but even he cannot 
help us now. For Baal blocks Tyrael's 
spiritual presence from entering the 
chamber of the Worldstone. Only you, 
mortal, have the power to defeat Baal 
now.
 
Baal threatens the Worldstone -- and 
through it, the mortal realm, itself. You 
must stop him before he gains full 
control of the sacred stone. With it 
under his control, Baal could shatter 
the boundaries between this world and 
the Burning Hells, thus allowing the 
hordes of the Prime Evils to pour forth 
into the mortal realm like an 
unstoppable tide!
 
If you are weak, the world as you know 
it could be lost forever. You must NOT 
fail!
*/

/* Sent quest message 0x4ecf to Tyrael in area: 132
40
I am impressed, mortal. You have 
overcome the greatest challenge this 
world has ever faced and defeated the 
last of the Prime Evils. However, we are 
too late to save the Worldstone. Baal's 
destructive touch has corrupted it 
completely.
 
Given enough time, the Worldstone's 
energies will drain away and the 
barriers between the worlds will 
shatter -- the powers of Hell will flood 
into this...Sanctuary...and eradicate 
your people and everything you've 
labored to build.
 
Therefore, I must destroy the corrupted 
Worldstone before the powers of Hell 
take root. This act will change your 
world forever -- with consequences 
even I cannot foresee. However, it is 
the only way to ensure mankind's 
survival.
 
Go now, mortal. I have opened a portal 
that will lead you to safety.
 
May the Eternal Light shine upon you 
and your descendants for what you've 
done this day. The continued survival 
of mankind is your legacy! Above all 
else, you have earned a rest from this 
endless battle.
*/

/* Sent quest message 0x4ec8 to Malah in area: 109
60
I knew the Ancients would find you 
worthy of Mount Arreat's secrets. Now, 
stop Baal before he destroys all that is 
sacred.
*/

/* Sent quest message 0x4ed3 to Malah in area: 109
48
If Tyrael says the Worldstone must be 
destroyed, then it must. We cannot let 
Baal's corruption prevail!
 
The world will change, true -- but who is 
to say it isn't for the better?
*/

/* Sent quest message 0x4ec5 to Deckard Cain in area: 109
67
You have proven yourself to these 
people. They look to you as their 
warrior, their champion.
*/

/* Sent quest message 0x4ed1 to Deckard Cain in area: 109
40
I knew in time you would defeat Baal. 
You have done everything you set out 
to do, my friend.
 
Ever since you rescued me from 
Tristram, I have believed in you. It has 
been a supreme honor to aid you along 
the way. 
 
So...The Worldstone was corrupted by 
Baal. And now Tyrael must destroy it. 
Worry not. Through whatever lies 
ahead I have faith that the Light will 
guide us both.
 
Go, now, back to the Worldstone 
chamber, and enter the portal Tyrael 
has opened for you.
*/

/* Sent quest message 0x4ec4 to Qual-Kehk in area: 109
75
Besting the Ancients in battle is a 
mighty feat indeed. I hope this means 
you're ready to battle Baal.
*/

/* Sent quest message 0x4ed4 to Qual-Kehk in area: 109
60
The destruction of the Worldstone does 
not bode well for our world. But I'll try 
not to worry...
 
After all, we have warriors like you 
fighting for us and for the Light.
 
Farewell!
*/

/* Sent quest message 0x4ec6 to Anya in area: 109
82
You stand before me a worthy hero -- 
and on you rests the last hope of our 
people.
 
Bear it well, warrior.
*/

/* Sent quest message 0x4ed0 to Anya in area: 109
53
You have done the impossible, hero. 
Your defeat of the last of the three 
Prime Evils is a great victory for the 
Light. 
 
Strange that you say that the 
Worldstone must be destroyed. The 
prophecies said nothing about that.
 
Perhaps all we have fought for will be 
lost...or perhaps we'll never need fight 
again!
*/

/* Sent quest message 0x4ec7 to Larzuk in area: 109
82
The Ancients have honored you, and in 
turn, so do we. I have no remaining 
doubts about you, now.
*/

/* Sent quest message 0x4ed2 to Larzuk in area: 109
74
The Ancients themselves will envy our 
songs about you.
 
Please, don't forget about us! Farewell, 
my friend.
*/
```
