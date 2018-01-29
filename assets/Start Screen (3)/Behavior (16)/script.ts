class StartBehavior extends Sup.Behavior {
  start() {
    AudioManager.ensurePlayTrack("Menu");
    
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
    
    // FIXME: Temporary debug
    if (Sup.Input.wasKeyJustPressed("SPACE")) {
      Global.startNewGame();
      
      for (let i = 0; i < 3; i++) {
        const monster = generateRandomizedMonsterInfo(1, Sup.Math.Random.integer(1, 5));
        monster.traits.push(Sup.Math.Random.sample(Object.keys(MonsterTraitDescriptions)) as MonsterTrait);
        Global.roster.push(monster);
      }
      
      Sup.loadScene("Roster Screen/Scene");
    }
  }
}
Sup.registerBehavior(StartBehavior);
