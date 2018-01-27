class StartBehavior extends Sup.Behavior {
  start() {
    Global.loadGame();
    
    const newGameButton = Sup.getActor("New Game Button").getBehavior(ButtonBehavior);
    newGameButton.onClick = () => {
      Global.startNewGame();
      Sup.loadScene("Intro Screen/Scene");
    };
    
    const continueButton = Sup.getActor("Continue Button").getBehavior(ButtonBehavior);
    continueButton.onClick = () => {
      Sup.loadScene("Roster Screen/Scene");
    };
    
    continueButton.setDisabled(!Global.hasSavedGame);
  }

  update() {
    Mouse.update(this.actor.camera);
  }
}
Sup.registerBehavior(StartBehavior);
