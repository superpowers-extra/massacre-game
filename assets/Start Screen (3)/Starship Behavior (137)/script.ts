class StarshipBehavior extends Sup.Behavior {
  timer = 0;
  y = 0;
  
  awake() {
    this.y = this.actor.getLocalY();
  }

  update() {
    this.timer++;
    
    this.actor.setLocalY(this.y + Math.sin(this.timer / 10) * 0.3);
  }
}
Sup.registerBehavior(StarshipBehavior);
