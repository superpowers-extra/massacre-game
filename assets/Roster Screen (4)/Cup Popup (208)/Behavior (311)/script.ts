class CupPopupBehavior extends Sup.Behavior {
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
    
    const closeButton = Sup.getActor("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
    };
    
    const goButton = Sup.getActor("Go Button").getBehavior(ButtonBehavior);
    goButton.onClick = () => {
      // TODO: Sup.loadScene("Fight Screen/Scene");
    };
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
  }
}
Sup.registerBehavior(CupPopupBehavior);
