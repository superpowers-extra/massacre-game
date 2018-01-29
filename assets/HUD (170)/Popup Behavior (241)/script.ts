class PopupBehavior extends Sup.Behavior {
  
  openedPopup: Sup.Actor;
  
  awake() {
    
  }

  update() {
    
  }
  
  open(name: string, buttonsToDisable: ButtonBehavior[]): Sup.Actor {
    this.actor.setVisible(true);
    for (const button of buttonsToDisable) button.setInteractive(false);

    this.openedPopup = new Sup.Actor("Popup");
    this.openedPopup.setLocalZ(StatusBarBehavior.PopupZ);
    return Sup.appendScene(name, this.openedPopup)[0];
  }
  
  close(buttonsToEnable: ButtonBehavior[]) {
    this.actor.setVisible(false);
    for (const button of buttonsToEnable) button.setInteractive(true);
    
    this.openedPopup.destroy();
    this.openedPopup = null;
  }
}
Sup.registerBehavior(PopupBehavior);
