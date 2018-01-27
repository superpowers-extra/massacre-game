class IdleMonsterBehavior extends Sup.Behavior {
  
  static IdleLoopDuration = 25;
  static IdleScaleModifierX = 0.025;
  static IdleScaleModifierY = 0.04;
  
  animationTimer: number;
  
  awake() {
    this.animationTimer = Sup.Math.Random.integer(0, IdleMonsterBehavior.IdleLoopDuration);
  }

  update() {
    this.animationTimer += 1;
    
    const scaleModifier = Math.sin(this.animationTimer / IdleMonsterBehavior.IdleLoopDuration * Math.PI);
    const scaleX = 1 - IdleMonsterBehavior.IdleScaleModifierX * scaleModifier;
    const scaleY = 1 + IdleMonsterBehavior.IdleScaleModifierY * scaleModifier;
    this.actor.setLocalScale(scaleX, scaleY, 1);
  }
}
Sup.registerBehavior(IdleMonsterBehavior);
