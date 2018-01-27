class IntroScreenBehavior extends Sup.Behavior {
  awake() {
    Sup.setTimeout(100, () => { Sup.loadScene("Roster Screen/Scene"); });
  }
}
Sup.registerBehavior(IntroScreenBehavior);
