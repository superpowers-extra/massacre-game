class RosterScreenBehavior extends Sup.Behavior {
  popup: Sup.Actor;
  mainButtons: ButtonBehavior[] = [];
  
  awake() {
    // HUD
    
    // Setup buttons
    const compendiumButton = Sup.getActor("Compendium Button").getBehavior(ButtonBehavior);
    compendiumButton.onClick = () => { Sup.loadScene("Compendium Screen/Scene"); };
    this.mainButtons.push(compendiumButton);

    const championshipButton = Sup.getActor("Championship Button").getBehavior(ButtonBehavior);
    championshipButton.onClick = () => { /* ... */ };
    this.mainButtons.push(championshipButton);
    
    const labButton = Sup.getActor("Lab Button").getBehavior(ButtonBehavior);
    labButton.onClick = () => { Sup.loadScene("Lab Screen/Scene"); };
    this.mainButtons.push(labButton);
    
    const pitButton = Sup.getActor("Pit Button").getBehavior(ButtonBehavior);
    pitButton.onClick = () => { Sup.loadScene("Fight Screen/Scene"); };
    this.mainButtons.push(pitButton);
    
    const phoneButton = Sup.getActor("Phone Button").getBehavior(ButtonBehavior);
    phoneButton.onClick = () => { this.openPopup("Roster Screen/Phone Popup/Scene"); };
    this.mainButtons.push(phoneButton);
    
    /*const marketButton = Sup.getActor("Market Button").getBehavior(ButtonBehavior);
    marketButton.onClick = () => {
      this.openPopup("Roster Screen/Market Popup/Scene");
    };
    this.mainButtons.push(marketButton);*/

    // Setup roster
    // (Crunchy!)
    const rosterSpots = Sup.getActor("Roster Spots").getChildren();
    for (let i = 0; i < Global.roster.length; i++) {
      const monster = Global.roster[i];
      
      const spotIndex = Sup.Math.Random.integer(0, rosterSpots.length - 1);
      const spot = rosterSpots[spotIndex];
      rosterSpots.splice(spotIndex, 1);
      
      new Sup.SpriteRenderer(spot, `Monsters/${monster.name}/Stage${monster.stage}`);
      spot.spriteRenderer.setHorizontalFlip(Sup.Math.Random.integer(0, 1) === 0);
      
      spot.addBehavior(IdleMonsterBehavior);
    }
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
    
    const hits = Mouse.ray.intersectActor(Sup.getActor("Cartridge"));
    Sup.getActor("Tooltip").setVisible(this.popup == null && hits.length > 0);
  }
    
  openPopup(name: string) {
    Sup.getActor("Popup Backdrop").setVisible(true);
    for (const button of this.mainButtons) button.setInteractive(false);

    this.popup = new Sup.Actor("Popup");
    this.popup.setLocalZ(StatusBarBehavior.PopupZ);
    Sup.appendScene(name, this.popup);
  }
  
  closePopup() {
    Sup.getActor("Popup Backdrop").setVisible(false);
    for (const button of this.mainButtons) button.setInteractive(true);
    
    this.popup.destroy();
    this.popup = null;
  }
}
Sup.registerBehavior(RosterScreenBehavior);
