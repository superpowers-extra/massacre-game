class CompendiumScreenBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
    
    if (Sup.Input.wasKeyJustPressed("ESCAPE")) Sup.loadScene("Roster Screen/Scene");
  }
}
Sup.registerBehavior(CompendiumScreenBehavior);
