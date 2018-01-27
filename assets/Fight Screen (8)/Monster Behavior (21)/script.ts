enum MonsterStates {
  Idle, Move, PrepareAttack, Attack, Dead, Victory
 }

class FightMonsterBehavior extends Sup.Behavior {
  
  static Height = 8;
  
  static NextAttackDelayMin = 60;
  static NextAttackDelayMax = 180;
  
  static PrepareAttackDuration = 30;
  static PrepareAttackLoopDuration = 3;
  
  static AttackDuration = 15;
  static AttackMovementOffset = 5;
  static AttackRange = 7;
  
  static DeadMovementDuration = 10;
  static DeadMovementSpeedMax = 0.5;
  static DeadAngularSpeedMax = 0.4;
  
  info: MonsterInfo;
  targets: FightMonsterBehavior[];
  
  position: Sup.Math.Vector2;
  private angle = 0;
  
  private currentTarget: FightMonsterBehavior;
  
  private state : MonsterStates;
  private stateTimer: number;
  private stateAngle: number;
  
  private nextAttackTimer: number;
  private hasAttackHit: boolean;
  
  private deadMovementDistance: number;
  
  awake() {
    new Sup.SpriteRenderer(this.actor, `Monsters/${this.info.name}/Stage${this.info.stage}`);
    
    this.position = this.actor.getPosition().toVector2();
  }
  
  start() {
    this.setIdleState();
  }

  update() {
    switch (this.state) {
      case MonsterStates.Idle: this.handleIdleState(); break;
      case MonsterStates.PrepareAttack: this.handlePrepareAttackState(); break;
      case MonsterStates.Attack: this.handleAttackState(); break;
      case MonsterStates.Dead: this.handleDeadState(); break;
      case MonsterStates.Victory: this.handleVictoryState(); break;
    }
  }
  
  hit(attacker: FightMonsterBehavior): boolean {
    const damage = Math.max(0, attacker.info.stats.attack - this.info.stats.defense);
    if (damage <= 0 || this.state === MonsterStates.Dead) return false;
    
    this.info.currentHealth -= damage;
    const angleFromKiller = attacker.position.angleTo(this.position);
    
    if (this.info.currentHealth <= 0) this.setDeadState(angleFromKiller)
    
    return true;
  }
  
  private updateTarget() {
    // Keep current target if still valid
    if (this.currentTarget != null && this.state !== MonsterStates.Dead) return;
    
    const aliveTargets: FightMonsterBehavior[] = [];
    for (const target of this.targets) {
      if (this.state !== MonsterStates.Dead) aliveTargets.push(target);
    }
    
    this.currentTarget = this.targets.length > 0 ? Sup.Math.Random.sample(aliveTargets) : null;
  }
  
  private idleAnimation() {
    this.stateTimer += 1;
    
    const scaleModifier = Math.sin(this.stateTimer / IdleMonsterBehavior.IdleLoopDuration * Math.PI);
    const scaleX = 1 - IdleMonsterBehavior.IdleScaleModifierX * scaleModifier;
    const scaleY = 1 + IdleMonsterBehavior.IdleScaleModifierY * scaleModifier;
    this.actor.setLocalScale(scaleX, scaleY, 1);
  }
  
  // States handling
  private setIdleState() {
    this.stateTimer = Sup.Math.Random.integer(0, IdleMonsterBehavior.IdleLoopDuration);
    this.actor.spriteRenderer.setAnimation("Idle");
    
    this.updateTarget();
    
    // No more target available, combat is finished
    if (this.currentTarget == null) {
      this.setVictoryState();
    } else {
      this.state = MonsterStates.Idle;
      this.nextAttackTimer = Sup.Math.Random.integer(FightMonsterBehavior.NextAttackDelayMin, FightMonsterBehavior.NextAttackDelayMax);
    }
  }
  
  private handleIdleState() {
    this.actor.spriteRenderer.setHorizontalFlip(this.position.x > this.currentTarget.position.x);
    
    this.idleAnimation();
    
    this.nextAttackTimer -= 1;
    if (this.nextAttackTimer < 0) {
      this.actor.setLocalScale(1);
      this.setPrepareAttackState();
    }
  }
  
  private setPrepareAttackState() {
    this.state = MonsterStates.PrepareAttack;
    this.actor.spriteRenderer.setAnimation("Idle");
    
    this.stateTimer = FightMonsterBehavior.PrepareAttackDuration;
  }
  
  private handlePrepareAttackState() {
    this.actor.spriteRenderer.setHorizontalFlip(this.position.x > this.currentTarget.position.x);
    
    const animationOffsetX = 0.2 * Math.sin(this.stateTimer / FightMonsterBehavior.PrepareAttackLoopDuration * Math.PI);
    this.actor.setX(this.position.x + animationOffsetX);
    
    this.stateTimer -= 1;
    if (this.stateTimer <= 0) this.setAttackState();
  }
  
  private setAttackState() {
    this.state = MonsterStates.Attack;
    this.actor.spriteRenderer.setAnimation("Attack");
    
    this.stateTimer = FightMonsterBehavior.AttackDuration;
    this.stateAngle = this.position.angleTo(this.currentTarget.position);
    this.hasAttackHit = false;
  }
  
  private handleAttackState() {
    this.stateTimer -= 1;
    const offsetModifier = 1 - Math.pow(this.stateTimer / FightMonsterBehavior.AttackDuration * 2 - 1, 2);
    const animationOffsetX = offsetModifier * FightMonsterBehavior.AttackMovementOffset * Math.cos(this.stateAngle);
    const animationOffsetY = offsetModifier * FightMonsterBehavior.AttackMovementOffset * Math.sin(this.stateAngle);
    this.actor.setPosition(this.position.x + animationOffsetX, this.position.y + animationOffsetY);
    
    if (!this.hasAttackHit && this.stateTimer > FightMonsterBehavior.AttackDuration * 0.4 && this.stateTimer < FightMonsterBehavior.AttackDuration * 0.6) {
      if (this.position.distanceTo(this.currentTarget.position) < FightMonsterBehavior.AttackRange) {
        this.hasAttackHit = true;
        
        const attackSuccesfull = this.currentTarget.hit(this);
        
        if (attackSuccesfull) {
          const fxPosition = this.currentTarget.position.clone().add(0, FightMonsterBehavior.Height / 2);
          spawnFX(fxPosition, this.info.hitFX);
        }
      }
    }
    
    if (this.stateTimer <= 0) this.setIdleState();
  }
  
  private setDeadState(angleFromKiller: number){
    this.state = MonsterStates.Dead;
    this.actor.spriteRenderer.setAnimation("Idle");
    this.actor.spriteRenderer.setColor(new Sup.Color(0x888888));
    
    this.stateTimer = FightMonsterBehavior.DeadMovementDuration;
    this.stateAngle = angleFromKiller + Sup.Math.Random.float(-Math.PI / 10, Math.PI / 10);
  }
  
  private handleDeadState() {
    if (this.stateTimer <= 0) return;
    
    this.stateTimer -= 1;
    const deadProgress = this.stateTimer / FightMonsterBehavior.DeadMovementDuration;
    
    const deadMovementSpeed = deadProgress * FightMonsterBehavior.DeadMovementSpeedMax;
    this.position.x += deadMovementSpeed * Math.cos(this.stateAngle);
    this.position.y += deadMovementSpeed * Math.sin(this.stateAngle);
    this.actor.setPosition(this.position.x, this.position.y);
    
    const deadAngularSpeedSign = this.stateAngle > Math.PI / 2 || this.stateAngle < -Math.PI / 2 ? 1 : -1;
    const deadAngularSpeed = deadProgress * FightMonsterBehavior.DeadAngularSpeedMax * deadAngularSpeedSign;
    this.angle += deadAngularSpeed;
    this.actor.setLocalEulerZ(this.angle);
  }
  
  private setVictoryState() {
    this.state = MonsterStates.Victory;
    this.actor.spriteRenderer.setAnimation("Idle");
  }
  
  private handleVictoryState() {
    this.idleAnimation();
  }
}
Sup.registerBehavior(FightMonsterBehavior);
