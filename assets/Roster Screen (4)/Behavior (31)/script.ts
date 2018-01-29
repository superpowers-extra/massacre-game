class RosterScreenBehavior extends Sup.Behavior {
  
  popup: PopupBehavior;
  textBar: TextBarBehavior;
  
  mainButtons: ButtonBehavior[] = [];
  rosterSpotButtons: ButtonBehavior[] = [];
  allButtons: ButtonBehavior[];
  
  awake() {
    AudioManager.ensurePlayTrack("Ambient");

    this.popup = Sup.getActor("Popup").getBehavior(PopupBehavior);
    this.textBar = Sup.getActor("Text Bar").getBehavior(TextBarBehavior);
    
    // Setup buttons
    const compendiumButton = Sup.getActor("Compendium Button").getBehavior(ButtonBehavior);
    compendiumButton.onClick = () => { if (this.checkMustBuyCreature()) return; Sup.loadScene("Compendium Screen/Scene"); };
    this.mainButtons.push(compendiumButton);

    const cupButton = Sup.getActor("Cup Button").getBehavior(ButtonBehavior);
    cupButton.onClick = () => { if (this.checkMustBuyCreature()) return; this.popup.open("Roster Screen/Cup Popup/Scene", this.allButtons); };
    this.mainButtons.push(cupButton);
    
    const labButton = Sup.getActor("Lab Button").getBehavior(ButtonBehavior);
    labButton.onClick = () => { if (this.checkMustBuyCreature()) return; Sup.loadScene("Lab Screen/Scene"); };
    this.mainButtons.push(labButton);
    
    const pitButton = Sup.getActor("Pit Button").getBehavior(ButtonBehavior);
    pitButton.onClick = () => {
      if (this.checkMustBuyCreature()) return;
      
      Sup.loadScene("Fight Screen/Scene");
      
      const pitEnemy = generateRandomizedMonsterInfo(1, Sup.Math.Random.integer(1, 8));
      const fightScreenBehavior = Sup.getActor("Background").getBehavior(FightScreenBehavior);
      
      // TODO: Make it proportional to fight difficulty
      const moneyReward = Sup.Math.Random.integer(1, 10) * 100;
      
      fightScreenBehavior.setup([pitEnemy], "win", { money: moneyReward, reputation: 0 });
    };
    this.mainButtons.push(pitButton);
    
    const phoneButton = Sup.getActor("Phone Button").getBehavior(ButtonBehavior);
    phoneButton.onClick = () => {
      this.textBar.hide();
      this.popup.open("Roster Screen/Phone Popup/Scene", this.allButtons);
    };
    this.mainButtons.push(phoneButton);
    
    // Setup roster
    const rosterSpots = Sup.getActor("Roster Spots").getChildren();
    for (const spot of rosterSpots) {
      const spotButton = spot.getBehavior(ButtonBehavior);
      spotButton.setDisabled(true);
      this.rosterSpotButtons.push(spotButton);
    }
    
    this.allButtons = this.mainButtons.slice().concat(this.rosterSpotButtons);
    
    // Setup monsters
    for (let i = 0; i < Global.roster.length; i++) this.spawnMonster(i, false);
    
    // Setup phone call
    this.checkPhoneCall();
  }
  
  checkPhoneCall() {
    const offer = Global.getExhibitionOffer();
    if (offer != null) {
      this.textBar.show("Somebody is calling me with an exhibition offer. I should pick up the phone!", true, null);
      Sup.getActor("Phone Button").spriteRenderer.setAnimation("Ringing");
    }
  }
  
  spawnMonster(index: number, animate: boolean) {
    const monsterInfo = Global.roster[index];
    
    const spotButton = this.rosterSpotButtons[index];
    spotButton.setDisabled(false);
    spotButton.onClick = () => {
      const popupActor = this.popup.open("Roster Screen/Monster Popup/Scene", this.allButtons);
      popupActor.getBehavior(MonsterPopupBehavior).setup(monsterInfo);
    };

    const monsterActor = new Sup.Actor("Monster", spotButton.actor);
    monsterActor.setLocalZ(0.1);
    new Sup.SpriteRenderer(monsterActor, `Monsters/${monsterInfo.name}/Stage${monsterInfo.stage}`);
    monsterActor.spriteRenderer.setHorizontalFlip(Sup.Math.Random.integer(0, 1) === 0);

    monsterActor.addBehavior(IdleMonsterBehavior);
    
    if (animate) {
      // TODO: Pas top?
      new Sup.Tween(monsterActor, { progress: 0 }).to({ progress: 1 }, 500).easing(TWEEN.Easing.Cubic.Out).start()
      .onUpdate((obj) => {
        monsterActor.setLocalY(1 - obj.progress);
        monsterActor.spriteRenderer.setOpacity(obj.progress);
      })
      .onComplete(() => {
        monsterActor.setLocalY(0);
        monsterActor.spriteRenderer.setOpacity(1);
      });
    }
  }

  phoneTween: Sup.Tween;
  
  checkMustBuyCreature() {
    if (Global.roster.length > 0) return false;
    
    if (this.phoneTween == null) {
      const phoneButton = Sup.getActor("Phone Button");
      const position = phoneButton.getLocalPosition();

      this.phoneTween = new Sup.Tween(phoneButton, { wiggle : 0 }).to({ wiggle: 1 }, 300).start().onUpdate((obj) => {
        const angle = Sup.Math.Random.float(0, Math.PI);
        const size = 0.2;

        phoneButton.setLocalPosition(new Sup.Math.Vector3(Math.cos(angle) * size, Math.sin(angle) * size, 0).add(position));
      }).onComplete(() => {
        phoneButton.setLocalPosition(position);
        this.phoneTween = null;
      });
    }
    
    this.textBar.show("Before anything else, I need to pick up the phone and buy a creature!", true, null);
    return true;
  }
  
  update() {
    Mouse.update(Sup.getActor("Camera").camera);
  }
}
Sup.registerBehavior(RosterScreenBehavior);
