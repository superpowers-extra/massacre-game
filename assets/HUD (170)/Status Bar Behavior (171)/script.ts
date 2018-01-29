class StatusBarBehavior extends Sup.Behavior {
  popup: PopupBehavior;
  
  static PopupZ = 8.5;
  
  moneyRndr: Sup.TextRenderer;
  stars: Sup.Actor[];

  awake() {
    this.popup = Sup.getActor("Popup").getBehavior(PopupBehavior);
    
    this.moneyRndr = Sup.getActor("Money").textRenderer;
    this.stars = Sup.getActor("Reputation").getChildren();
    for (const star of this.stars) star.spriteRenderer.setAnimation("Animation").pauseAnimation();
    
    this.refresh();
  }

  refresh() {
    this.moneyRndr.setText(`$ ${Global.money}`);
    
    for (let i = 0; i < this.stars.length; i++) {
      if (Global.reputation > i * 2 + 1) this.stars[i].spriteRenderer.setAnimationFrameTime(2);
      else if (Global.reputation == i * 2 + 1) this.stars[i].spriteRenderer.setAnimationFrameTime(1);
      else this.stars[i].spriteRenderer.setAnimationFrameTime(0);
    }
  }
  
  update() {
    const hits = Mouse.ray.intersectActor(Sup.getActor("Cartridge"));
    this.actor.getChild("Tooltip").setVisible(this.popup.openedPopup == null && hits.length > 0);
  }
}
Sup.registerBehavior(StatusBarBehavior);
