class FightScreenBehavior extends Sup.Behavior {
  
  static MonsterPadding = 5;
  
  popup: PopupBehavior;
  textBar: TextBarBehavior;
  
  private hasCombatStarted = false;
  private isCombatFinished = false;
  private self: FightMonsterBehavior[] = [];
  private enemies: FightMonsterBehavior[] = [];
  
  private fullfilment: FightFullfilment;
  private reward: FightReward;
  
  awake() {
    AudioManager.ensurePlayTrack(`Fights/${Sup.Math.Random.sample(Sup.get("Audio/Tracks/Fights", Sup.Folder).children)}`);
    
    this.popup = Sup.getActor("Popup").getBehavior(PopupBehavior);
    this.textBar = Sup.getActor("Text Bar").getBehavior(TextBarBehavior);
  }
  
  setup(enemies: MonsterInfo[], fullfilment: FightFullfilment, reward: FightReward) {
    const popup = this.popup.open("Fight Screen/Team Popup/Scene", []);
    
    this.fullfilment = fullfilment;
    this.reward = reward;
    
    const selectedTeam: MonsterInfo[] = [null, null, null];
    
    const fightButton = popup.getChild("Fight Button").getBehavior(ButtonBehavior);
    fightButton.setDisabled(true);
    fightButton.onClick = () => {
      for (let i = 0; i < selectedTeam.length; i++) {
        const monster = selectedTeam[i];
        if (monster != null) this.setupMonster(monster, "Self", i, selectedTeam.length, this.self);
      }
      
      for (let i = 0; i < enemies.length; i++) {
        this.setupMonster(enemies[i], "Enemy", i, enemies.length, this.enemies);
      }
      
      this.setupMonsterTargets();
      this.hasCombatStarted = true;
      
      this.popup.close([]);
    };
    
    const monsterInfo = popup.getChild("Monster Info");
    monsterInfo.setVisible(false);

    const rosterSlots = popup.getChild("Roster").getChildren();
    let selectedRosterSlotIndex: number;
    
    for (let i = 0; i < rosterSlots.length; i++) {
      const rosterSlotButton = rosterSlots[i].getBehavior(ButtonBehavior);

      if (Global.roster.length - 1 >= i) {
        const rosterEntry = Global.roster[i];
        rosterSlotButton.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(rosterEntry));
        
        rosterSlotButton.onHover = () => {
          monsterInfo.setVisible(true);
          displayMonsterInfo(monsterInfo, rosterEntry);
        }

        rosterSlotButton.onUnhover = () => {
          if (selectedRosterSlotIndex != null) displayMonsterInfo(monsterInfo, Global.roster[selectedRosterSlotIndex]);
          else monsterInfo.setVisible(false);
        }

        rosterSlotButton.onClick = () => {
          if (selectedRosterSlotIndex != null) {
            rosterSlots[selectedRosterSlotIndex].getBehavior(ButtonBehavior).setInteractive(true);
          }
          
          selectedRosterSlotIndex = i;
          
          rosterSlotButton.setInteractive(false);
          rosterSlotButton.actor.spriteRenderer.setAnimation("Validated");
          
          displayMonsterInfo(monsterInfo, rosterEntry);
          
          for (let i = 0; i < selfSlots.length; i++) {
            const selfSlotButton = selfSlots[i].getBehavior(ButtonBehavior);
            selfSlotButton.setDisabled(false);
          }
        }

      } else {
        rosterSlotButton.setDisabled(true);
      }
    }
    
    const selfSlots = popup.getChild("Team Self").getChildren();
    const enemySlots = popup.getChild("Team Enemy").getChildren();

    for (let i = 0; i < enemySlots.length; i++) {
      const enemyInfos = enemies[i];
      
      const selfSlotButton = selfSlots[i].getBehavior(ButtonBehavior);
      const enemySlotButton = enemySlots[i].getBehavior(ButtonBehavior);
      
      if (enemyInfos == null) {
        selfSlotButton.actor.setVisible(false);
        enemySlotButton.actor.setVisible(false);
      } else {
        selfSlotButton.setDisabled(true);
        
        selfSlotButton.onHover = () => {
          if (selectedTeam[i] != null) {
            monsterInfo.setVisible(true);
            displayMonsterInfo(monsterInfo, selectedTeam[i]);
          }
        }

        selfSlotButton.onUnhover = () => {
          if (selectedRosterSlotIndex != null) displayMonsterInfo(monsterInfo, Global.roster[selectedRosterSlotIndex]);
          else monsterInfo.setVisible(false);
        }
        
        selfSlotButton.onClick = () => {
          if (selectedRosterSlotIndex != null) {
            selectedTeam[i] = Global.roster[selectedRosterSlotIndex];
            selfSlotButton.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(selectedTeam[i]));
            
            rosterSlots[selectedRosterSlotIndex].getBehavior(ButtonBehavior).setInteractive(true);
            rosterSlots[selectedRosterSlotIndex].spriteRenderer.setAnimation(null);
            selectedRosterSlotIndex = null;
            
            fightButton.setDisabled(false);
          } else {
            selectedTeam[i] = null;
            selfSlotButton.actor.getChild("Monster").spriteRenderer.setSprite(null);
            selfSlotButton.setDisabled(true);
            
            let hasOneTeamMonster = false;
            for (const teamMonster of selectedTeam) {
              if (teamMonster != null) {
                hasOneTeamMonster = true;
                break;
              }
            }
            
            fightButton.setDisabled(!hasOneTeamMonster);
          }
        }
        
        enemySlotButton.actor.setVisible(true);
        enemySlotButton.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(enemyInfos));
        
        enemySlotButton.onHover = () => {
          monsterInfo.setVisible(true);
          displayMonsterInfo(monsterInfo, enemyInfos);
        }

        enemySlotButton.onUnhover = () => {
          if (selectedRosterSlotIndex != null) displayMonsterInfo(monsterInfo, Global.roster[selectedRosterSlotIndex]);
          else monsterInfo.setVisible(false);
        }
      }
    }
  }
  
  private setupMonster(info: MonsterInfo, team: "Self" | "Enemy", index: number, count: number, monsterList) {
    const rootActor = Sup.getActor(`Team ${team}`);
    const monsterActor = new Sup.Actor("Monster", rootActor);
    
    const x = Sup.Math.Random.float(-2, 2);
    const y = -(index - (count - 1) / 2) * FightScreenBehavior.MonsterPadding;
    monsterActor.setLocalPosition(x, y);
    
    const behavior = monsterActor.addBehavior(FightMonsterBehavior, { info });
    monsterList.push(behavior);
  }
  
  private setupMonsterTargets() {
    for (const selfEntry of this.self) selfEntry.targets = this.enemies;
    for (const enemy of this.enemies) enemy.targets = this.self;
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
    
    if (!this.hasCombatStarted || this.isCombatFinished) return;
    
    // Check win
    let win = true;
    for (const enemy of this.enemies) {
      if (!enemy.isDead()) {
        win = false;
        break;
      }
    }
    
    // Check loss
    let loss = true;
    for (const selfEntry of this.self) {
      if (!selfEntry.isDead()) {
        loss = false;
        break;
      }
    }
    
    if (win || loss) {
      this.isCombatFinished = true;

      AudioManager.ensurePlayTrack("Ambient");
      
      let completedObjective = false;
      if (this.fullfilment === "participate") completedObjective = true;
      else if (this.fullfilment === "win") completedObjective = win;
      else if (this.fullfilment === "lose") completedObjective = loss;
      
      if (completedObjective) AudioManager.playSound("Jingles/Victory", 0.5);
      else AudioManager.playSound("Jingles/Defeat", 0.5);
      
      const popup = this.popup.open("Fight Screen/Fight Over Popup/Scene", []);
      
      let rewardText = "";

      const rewards = [];
      if (this.reward.reputation > 0) rewards.push(`${this.reward.reputation} ⋆`);
      if (this.reward.money > 0) rewards.push(`$ ${this.reward.money}`);

      if (completedObjective) {
        if (this.fullfilment === "lose") rewardText = "You successfully lost the fight!"
        else if (this.fullfilment === "win") rewardText = "You won the fight!";
        else rewardText = "All you had to do was participate anyway.";

        Global.reputation = Math.min(10, Global.reputation + this.reward.reputation);
        Global.money += this.reward.money;
        
        rewardText += `\n\nYou earned ${rewards.join(", ")}!`;
      } else {
        if (this.fullfilment === "lose") rewardText = "Your goal was to lose!"
        else if (this.fullfilment === "win") rewardText = "Your goal was to win!";
        else rewardText = "THIS CAN'T HAPPEN LOL.";
        
        Global.reputation = Math.max(0, Global.reputation - 1);
        
        rewardText += `\n\nYou missed out on ${rewards.join(", ")}\nand lost half a star!`;
      }

      Global.combatCounter++;
      
      Global.saveGame();
      Global.refreshStatusBar();

      popup.getChild("Flavor Text").textRenderer.setText(win ? "YOUR CREATURES\nPREVAILED!" : "YOUR CREATURES\nWERE WIPED OUT!");
      popup.getChild("Reward Details").textRenderer.setText(rewardText);
      
      const closeButton = popup.getChild("Close Button").getBehavior(ButtonBehavior);
      closeButton.onClick = () => { Sup.loadScene("Roster Screen/Scene"); }
      
      return;
    }
  }
}
Sup.registerBehavior(FightScreenBehavior);
