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

