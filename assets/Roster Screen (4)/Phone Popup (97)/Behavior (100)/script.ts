class PhonePopupBehavior extends Sup.Behavior {
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
    
    const closeButton = Sup.getActor("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
    };
    
    const buyButton = Sup.getActor("Buy Button").getBehavior(ButtonBehavior);
    buyButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
      rosterScreen.popup.open("Roster Screen/Market Popup/Scene", rosterScreen.allButtons);
    };
    
    const answerButton = Sup.getActor("Answer Button").getBehavior(ButtonBehavior);
    answerButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
      rosterScreen.popup.open("Roster Screen/Exhibition Popup/Scene", rosterScreen.allButtons);
    };
    
    const offer = Global.getExhibitionOffer();
    if (offer != null) {
      Sup.getActor("Call Portrait").spriteRenderer.setSprite(`Exhibitions/Portraits/${offer.caller}`);
      Sup.getActor("Call Portrait").spriteRenderer.setAnimation("Animation");
      Sup.getActor("Call Text").textRenderer.setText(`${offer.caller} is calling!`);
      answerButton.setDisabled(false);
    }
  }

  update() {
    
  }
}
Sup.registerBehavior(PhonePopupBehavior);
