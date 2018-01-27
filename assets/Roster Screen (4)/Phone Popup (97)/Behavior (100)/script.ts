class PhonePopupBehavior extends Sup.Behavior {
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
    
    const closeButton = Sup.getActor("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      rosterScreen.closePopup();
    };
    
    const buyButton = Sup.getActor("Buy Button").getBehavior(ButtonBehavior);
    buyButton.onClick = () => {
      rosterScreen.closePopup();
      rosterScreen.openPopup("Roster Screen/Market Popup/Scene");
    };
    
    const answerButton = Sup.getActor("Answer Button").getBehavior(ButtonBehavior);
    answerButton.onClick = () => {
      rosterScreen.closePopup();
      rosterScreen.openPopup("Roster Screen/Exhibition Popup/Scene");
    };
  }

  update() {
    
  }
}
Sup.registerBehavior(PhonePopupBehavior);
