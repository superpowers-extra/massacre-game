class ExhibitionPopupBehavior extends Sup.Behavior {
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
    
    const offer = Global.getExhibitionOffer();

    
    const declineButton = Sup.getActor("Decline Button").getBehavior(ButtonBehavior);
    declineButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);

      Global.exhibitionIndex++;
      Global.combatCounter = 0;

      Global.reputation = Math.max(0, Global.reputation - 1);
      Global.refreshStatusBar();
      Global.saveGame();
    };
    
    const acceptButton = Sup.getActor("Accept Button").getBehavior(ButtonBehavior);
    acceptButton.onClick = () => {
      rosterScreen.popup.close(rosterScreen.allButtons);
      
      Global.exhibitionIndex++;
      Global.combatCounter = 0;
      Global.saveGame();
      
      Sup.loadScene("Fight Screen/Scene");
      const fightScreenBehavior = Sup.getActor("Background").getBehavior(FightScreenBehavior);
      
      const monsterInfos = [];
      
      for (const desc of offer.enemies) {
        const info = generateRandomizedMonsterInfo(desc.stage, desc.level, monsterInfosByName[desc.name]);
        monsterInfos.push(info);
      }
      
      fightScreenBehavior.setup(monsterInfos, offer.fullfilment, offer.reward);
    };
    
    Sup.getActor("Portrait").spriteRenderer.setSprite(`Exhibitions/Portraits/${offer.caller}`);
    Sup.getActor("Portrait").spriteRenderer.setAnimation("Animation");
    Sup.getActor("Title").textRenderer.setText(`Exhibition offer from ${offer.caller}`);

    const textRndr = Sup.getActor("Offer Text").textRenderer;
    textRndr.setText(wrapText(textRndr.getFont(), offer.callText, 55));
    
    let condition = "participating";
    if (offer.fullfilment === "win") condition = "winning";
    else if (offer.fullfilment === "lose") condition ="losing";
    Sup.getActor("Reward Label").textRenderer.setText(`Reward for ${condition}:`);
    
    const rewards = [];
    if (offer.reward.reputation > 0) rewards.push(`${offer.reward.reputation} ⋆`);
    if (offer.reward.money > 0) rewards.push(`$ ${offer.reward.money}`);
    Sup.getActor("Reward").textRenderer.setText(`${rewards.join(", ")}`);
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
  }
}
Sup.registerBehavior(ExhibitionPopupBehavior);
