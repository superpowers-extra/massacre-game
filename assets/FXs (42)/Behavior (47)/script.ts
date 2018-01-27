
function spawnFX(position: Sup.Math.Vector2, spritePath: string) {
  const actor = new Sup.Actor("FX");
  actor.setLocalPosition(position);
  actor.setLocalZ(3);
  
  new Sup.SpriteRenderer(actor, `FXs/${spritePath}`);
  actor.addBehavior(FXBehavior);
}

class FXBehavior extends Sup.Behavior {
  awake() {
    this.actor.spriteRenderer.setAnimation("Animation", false);
  }

  update() {
    if (!this.actor.spriteRenderer.isAnimationPlaying()) this.actor.destroy();
  }
}
Sup.registerBehavior(FXBehavior);
