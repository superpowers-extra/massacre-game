class MarketPopupBehavior extends Sup.Behavior {
  rosterScreen: RosterScreenBehavior;

  decreasePriceButton: ButtonBehavior;
  increasePriceButton: ButtonBehavior;
  priceTextRndr: Sup.TextRenderer;
  
  rollButton: ButtonBehavior;
  
  frames: Sup.Actor[];
  questionMarks: Sup.SpriteRenderer[] = [];
  isRolling = false;
  
  monsterInfos: MonsterInfo[] = [];
  
  price = 100;
  
  awake() {
    this.rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
    
    const closeButton = Sup.getActor("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      this.rosterScreen.closePopup();
    };
    
    this.priceTextRndr = Sup.getActor("Amount").textRenderer;
    
    this.frames = Sup.getActor("Frames").getChildren();
    
    this.decreasePriceButton = Sup.getActor("Decrease Price Button").getBehavior(ButtonBehavior);
    this.decreasePriceButton.onClick = () => { this.price -= MarketPopupBehavior.priceStep; this.updatePrice(); };

    this.increasePriceButton = Sup.getActor("Increase Price Button").getBehavior(ButtonBehavior);
    this.increasePriceButton.onClick = () => { this.price += MarketPopupBehavior.priceStep; this.updatePrice(); };
    
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i].getBehavior(ButtonBehavior).onClick = () => {
        Global.roster.push(this.monsterInfos[i]);
        Global.saveGame();
        
        this.rosterScreen.closePopup();
        
        // TODO: Spawn that monster
      };
    }
    
    this.rollButton = Sup.getActor("Roll Button").getBehavior(ButtonBehavior);
    this.rollButton.onClick = () => {
      this.rollButton.setDisabled(true);
      this.increasePriceButton.setDisabled(true);
      this.decreasePriceButton.setDisabled(true);
      this.isRolling = true;
      
      Global.money -= this.price;
      Global.refreshStatusBar();
      Global.saveGame();
      
      closeButton.setDisabled(true);
      closeButton.actor.setVisible(false);
      
      this.questionMarks = [];
      
      for (const frame of this.frames) {
        const actor = new Sup.Actor("Question Mark", frame);
        this.questionMarks.push(new Sup.SpriteRenderer(actor, "Roster Screen/Market Popup/Question Mark"));
        actor.spriteRenderer.setAnimation("Animation");
      }
      
      Sup.setTimeout(2000, this.slowDownNextQuestionMark);
    };
    
    this.updatePrice();
  }
  
  questionMarkCount = 0;
  
  slowDownNextQuestionMark = () => {
    this.questionMarks[this.questionMarkCount++]["speed"] = 10;
    if (this.questionMarkCount < 3) Sup.setTimeout(1000, this.slowDownNextQuestionMark);
  };
  
  updatePrice() {
    this.decreasePriceButton.setDisabled(this.price <= MarketPopupBehavior.minPrice);
    this.increasePriceButton.setDisabled(this.price >= MarketPopupBehavior.maxPrice);
    
    this.rollButton.setDisabled(this.isRolling || this.price > Global.money);
    
    this.priceTextRndr.setText(`$ ${this.price}`);
  }
  
  update() {
    for (let i = 0; i < this.questionMarks.length; i++) {
      const questionMark = this.questionMarks[i];

      if (questionMark["speed"] === 0) continue;
      
      if (questionMark["speed"] != null) {
        questionMark["speed"]--;
        
        if (questionMark["speed"] === 0) {
          questionMark.destroy();
          this.revealMonster();
          continue;
        } else {
          questionMark.setPlaybackSpeed(1 + questionMark["speed"] / 10);
        }
      }
      else {
        questionMark.setPlaybackSpeed(2);
      }
    }
  }
  
  revealMonster() {
    const monsterInfo = generateRandomizedMonsterInfo(this.price);
    const frame = this.frames[this.monsterInfos.length];
    this.monsterInfos.push(monsterInfo);
    
    const infoActor = frame.getChild("Info");
    infoActor.setVisible(true);
    displayMonsterInfo(infoActor, monsterInfo);
    
    if (this.monsterInfos.length === 3) {
      for (const frame of this.frames) frame.getBehavior(ButtonBehavior).setDisabled(false);
    }
  }
}
Sup.registerBehavior(MarketPopupBehavior);

namespace MarketPopupBehavior {
  export const minPrice = 100;
  export const maxPrice = 1000;
  export const priceStep = 100;
}