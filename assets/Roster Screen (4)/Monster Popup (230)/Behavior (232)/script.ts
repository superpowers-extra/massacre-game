class MonsterPopupBehavior extends Sup.Behavior {
  monsterInfo: MonsterInfo;
  
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
        
    const closeButton = Sup.getActor("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
    };
    
    const healButton = Sup.getActor("Heal Button").getBehavior(ButtonBehavior);
    healButton.onClick = () => {
      this.monsterInfo.currentHealth = this.monsterInfo.stats.health;
      displayMonsterInfo(this.actor.getChild("Info"), this.monsterInfo);
    };
    
    const sellButton = Sup.getActor("Sell Button").getBehavior(ButtonBehavior);
    sellButton.onClick = () => {
      // TODO
    };
  }
  
  setup(monsterInfo: MonsterInfo) {
    this.monsterInfo = monsterInfo;
    displayMonsterInfo(this.actor.getChild("Info"), this.monsterInfo);
  }

  update() {
    
  }
}
Sup.registerBehavior(MonsterPopupBehavior);
