class ExhibitionPopupBehavior extends Sup.Behavior {
  awake() {
    const rosterScreen = Sup.getActor("Background").getBehavior(RosterScreenBehavior);
  }

  update() {
    Mouse.update(this.actor.camera);
  }
}
Sup.registerBehavior(ExhibitionPopupBehavior);
