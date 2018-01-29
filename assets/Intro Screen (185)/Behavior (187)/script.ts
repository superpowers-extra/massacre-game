class IntroScreenBehavior extends Sup.Behavior {
  phase1Actor: Sup.Actor;
  phase2Actor: Sup.Actor;
  
  guyActor: Sup.Actor;
    
  asteroidsActor: Sup.Actor;
    
  trash1Actor: Sup.Actor;
  trash2Actor: Sup.Actor;

  timer = 0;
  
  awake() {
    AudioManager.ensurePlayTrack("Menu");
    
    this.phase1Actor = Sup.getActor("Phase 1");
    this.phase2Actor = Sup.getActor("Phase 2");
    
    this.guyActor = Sup.getActor("Guy");

    this.asteroidsActor = Sup.getActor("Asteroids");

    this.trash1Actor = Sup.getActor("Trash 1");
    this.trash2Actor = Sup.getActor("Trash 2");
    
    const textBar = Sup.getActor("Text Bar").getBehavior(TextBarBehavior);
    
    Sup.setTimeout(2000, () => {
      if (this.actor.isDestroyed()) return;
      
      textBar.show(`"Become a creature trafficker today and win a trip to the Bahamars!"`, false, () => {
        textBar.show("Wow, the Bahamars?! Heavenly islands of chocolate and crunchiness!", false, () => {
          this.phase1Actor.setVisible(false);
          this.phase2Actor.setVisible(true);
          this.phase2Actor.setLocalX(0);

          Sup.setTimeout(200, () => {
            if (this.actor.isDestroyed()) return;
            
            textBar.show(`"The winner of the championship will earn the trip, all expenses paid!"`, false, () => {
              textBar.show(`"Call 555-123-CREATURES to buy your first creature NOW! ENTIRELY LEGAL."`, false, () => {
                this.phase1Actor.setVisible(true);
                this.phase2Actor.setVisible(false);
                textBar.show(`It's settled. I wanna be the very best. Like no one ever was.`, false, () => {
                  textBar.show(`Bahamars, HERE I COME!!`, false, () => {
                    Sup.loadScene("Roster Screen/Scene");
                  });
                });
              });
            });
          });
        }); 
      })
    });
  }
  
  update() {
    if (Sup.Input.wasKeyJustPressed("ESCAPE")) {
      Sup.loadScene("Roster Screen/Scene");
      return;
    }
    
    this.timer++;
    const progress = this.timer / 60;

    this.asteroidsActor.setLocalX(progress);
    this.asteroidsActor.setLocalY(progress / 20);

    this.trash1Actor.setLocalX(27 - progress * 0.7);
    this.trash1Actor.setLocalEulerZ(-20 - progress / 30);

    this.trash2Actor.setLocalX(3 - progress * 0.8);
    this.trash2Actor.setLocalEulerZ(30 + progress / 40);

    this.guyActor.setLocalX((-1 + Math.sin(progress * 3 + 0.4)) * 0.1);
    this.guyActor.setLocalY((-1 + Math.sin(progress * 3)) * 0.2);
  }
}
Sup.registerBehavior(IntroScreenBehavior);
