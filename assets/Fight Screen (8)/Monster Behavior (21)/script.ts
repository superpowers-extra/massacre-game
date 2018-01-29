enum MonsterStates {
  Idle, Move, Flee, PrepareAttack, Attack, Dead, Victory
 }

class FightMonsterBehavior extends Sup.Behavior {
  
  static Height = 8;
  
  static ArenaLimits = {
    left: -24, right: 24, top: -5, bottom: -15
  };
  
  static IdleDurationDelayMin = 60;
  static IdleDurationDelayMax = 120;
  
  static BaseMoveSpeed = 0.3;
  static FleeMoveSpeed = 0.4;
  static MoveLoopDuration = 30;
  static MoveDelayMax = 120;
  
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
  depth: number;
  private angle = 0;
  
  private currentTarget: FightMonsterBehavior;
  
  private state : MonsterStates;
  private stateTimer: number;
  private stateAngle: number;
  private nextActionTimer: number;
  
  private fleeTargetPosition = new Sup.Math.Vector2();
  private hasAttackHit: boolean;
  private deadMovementDistance: number;
  
  private healthFill: Sup.Actor;
  static HealthScale = 3.5;
  
  awake() {
    new Sup.SpriteRenderer(this.actor, `Monsters/${this.info.name}/Stage${this.info.stage}`);
    
    const position = this.actor.getPosition(); 
    this.position = position.toVector2();
    this.depth = position.z;
    
    const shadow = new Sup.Actor("Shadow", this.actor);
    shadow.setLocalZ(-0.5);
    new Sup.SpriteRenderer(shadow, "Monsters/Shadow");
    
    const healthBar = new Sup.Actor("Health Bar", this.actor);
    healthBar.setLocalY(8);
    new Sup.SpriteRenderer(healthBar, "Fight Screen/Health Bar");
    
    this.healthFill = new Sup.Actor("Health Fill", healthBar);
    new Sup.SpriteRenderer(this.healthFill, "Fight Screen/Health Fill");
    this.healthFill.setLocalX(-1.75);
    this.healthFill.setLocalZ(0.1);
    this.refreshHealth();
  }
  
  start() {
    this.setIdleState();
  }
  
  refreshHealth() {
    if (this.info.currentHealth <= 0) {
      this.actor.getChild("Health Bar").setVisible(false);
    } else {
      this.healthFill.setLocalScale(this.info.currentHealth * FightMonsterBehavior.HealthScale / this.info.stats.health, 0.6, 1);
    }
  }

  update() {
    // Z-order the monster
    this.actor.setZ(this.depth - this.position.y * 0.001);
    
    if (this.isDead()) {
      this.handleDeadState();
      return;
    }
    
    // No more target available, combat is finished but let last attack attack continue
    this.updateTarget();
    if (this.currentTarget == null && this.state !== MonsterStates.Attack) {
      this.setVictoryState();
    }
    
    switch (this.state) {
      case MonsterStates.Idle: this.handleIdleState(); break;
      case MonsterStates.Move: this.handleMoveState(); break;
      case MonsterStates.Flee: this.handleFleeState(); break;
      case MonsterStates.PrepareAttack: this.handlePrepareAttackState(); break;
      case MonsterStates.Attack: this.handleAttackState(); break;
      case MonsterStates.Victory: this.handleVictoryState(); break;
    }
  }
  
  hit(attacker: FightMonsterBehavior): boolean {
    const damage = Math.max(0, attacker.info.stats.attack - this.info.stats.defense);
    if (damage <= 0 || this.isDead()) return false;
    
    this.info.currentHealth = Math.max(this.info.currentHealth - damage, 0);
    this.refreshHealth();

    const angleFromKiller = attacker.position.angleTo(this.position);
    
    if (this.info.currentHealth <= 0) this.setDeadState(angleFromKiller)
    
    return true;
  }
  
  isDead() { return this.state === MonsterStates.Dead; }
  
  private updateTarget() {
    // Keep current target if still valid
    if (this.currentTarget != null && this.currentTarget.state !== MonsterStates.Dead) return;
    
    // TODO: Try to find a smart target, closest/less health
    const aliveTargets: FightMonsterBehavior[] = [];
    for (const target of this.targets) {
      if (target.state !== MonsterStates.Dead) aliveTargets.push(target);
    }
    
    this.currentTarget = aliveTargets.length > 0 ? Sup.Math.Random.sample(aliveTargets) : null;
  }
  
  private chooseNextAction() {
    this.updateTarget();
    if (this.currentTarget == null) {
      this.setIdleState();
      return;
    }
    
    // If close enough, 2/3 chance to attack
    if (this.position.distanceTo(this.currentTarget.position) < FightMonsterBehavior.AttackRange * 0.7) {
      if (Sup.Math.Random.integer(0, 2) !== 0) {
        this.setPrepareAttackState();
        return;
      }
    }
    
    // Choose between Idle, Move and Flee
    const roll = Sup.Math.Random.integer(0, 10);
    if (roll < 2) this.setIdleState();
    else if (roll < 8) this.setMoveState();
    else this.setFleeState();
  }
  
  private lookAtTarget() {
    this.actor.spriteRenderer.setHorizontalFlip(this.position.x > this.currentTarget.position.x);
  }
  
  private idleAnimation() {
    this.stateTimer += 1;
    
    const scaleModifier = Math.sin(this.stateTimer / IdleMonsterBehavior.IdleLoopDuration * Math.PI);
    const scaleX = 1 - IdleMonsterBehavior.IdleScaleModifierX * scaleModifier;
    const scaleY = 1 + IdleMonsterBehavior.IdleScaleModifierY * scaleModifier;
    this.actor.setLocalScale(scaleX, scaleY, 1);
  }
  
  private moveAnimation() {
    this.stateTimer += 1;
    
    // TODO: Animation move state
    /*const scaleModifier = Math.sin(this.stateTimer / IdleMonsterBehavior.IdleLoopDuration * Math.PI);
    const scaleX = 1 - IdleMonsterBehavior.IdleScaleModifierX * scaleModifier;
    const scaleY = 1 + IdleMonsterBehavior.IdleScaleModifierY * scaleModifier;
    this.actor.setLocalScale(scaleX, scaleY, 1);*/
  }
  
  private move(moveOffset: Sup.Math.Vector2) {
    this.position.x = Sup.Math.clamp(this.position.x + moveOffset.x, FightMonsterBehavior.ArenaLimits.left, FightMonsterBehavior.ArenaLimits.right);
    this.position.y = Sup.Math.clamp(this.position.y + moveOffset.y, FightMonsterBehavior.ArenaLimits.bottom, FightMonsterBehavior.ArenaLimits.top);
    this.actor.setPosition(this.position);
  }
  
  // States handling
  private setIdleState() {
    this.state = MonsterStates.Idle;
    this.actor.spriteRenderer.setAnimation("Idle");
    this.stateTimer = Sup.Math.Random.integer(0, IdleMonsterBehavior.IdleLoopDuration);
      
    this.nextActionTimer = Sup.Math.Random.integer(FightMonsterBehavior.IdleDurationDelayMin, FightMonsterBehavior.IdleDurationDelayMax);
  }
  
  private handleIdleState() {
    this.idleAnimation();
    this.lookAtTarget();
    
    this.nextActionTimer -= 1;
    if (this.nextActionTimer < 0) {
      this.actor.setLocalScale(1);
      this.chooseNextAction();
    }
  }
  
  private setMoveState() {
    this.state = MonsterStates.Move;
    this.actor.spriteRenderer.setAnimation("Idle");
    
    this.stateAngle = this.currentTarget.position.angleTo(this.position) + Sup.Math.Random.float(-Math.PI, Math.PI);
    this.nextActionTimer = FightMonsterBehavior.MoveDelayMax;
  }
  
  private handleMoveState() {
    // Try to attack if close enough
    if (this.position.distanceTo(this.currentTarget.position) < FightMonsterBehavior.AttackRange * 0.7 && this.nextActionTimer < FightMonsterBehavior.MoveDelayMax / 3) {
      this.setPrepareAttackState();
      return;
    }
    
    // If you walk for too long, try another action
    this.nextActionTimer -= 1;
    if (this.nextActionTimer < 0) {
      this.chooseNextAction();
      return;
    }
    
    this.moveAnimation();
    
    const targetPosition = this.currentTarget.position.clone();
    targetPosition.x += Math.cos(this.stateAngle) * FightMonsterBehavior.AttackRange * 0.7;
    targetPosition.y += Math.sin(this.stateAngle) * FightMonsterBehavior.AttackRange * 0.7;
    
    const moveSpeed = FightMonsterBehavior.BaseMoveSpeed;
    const moveOffset = targetPosition.subtract(this.position);

    if (moveOffset.length() < moveSpeed) this.chooseNextAction();
    else moveOffset.normalize().multiplyScalar(moveSpeed);
    
    this.move(moveOffset);
    
    this.lookAtTarget();
  }
  
  private setFleeState() {
    this.state = MonsterStates.Flee;
    this.actor.spriteRenderer.setAnimation("Idle");
    
    this.fleeTargetPosition.x = Sup.Math.Random.float(FightMonsterBehavior.ArenaLimits.left, FightMonsterBehavior.ArenaLimits.right);
    this.fleeTargetPosition.y = Sup.Math.Random.float(FightMonsterBehavior.ArenaLimits.bottom, FightMonsterBehavior.ArenaLimits.top);
  }
  
  private handleFleeState() {
    this.moveAnimation();
    
    const moveSpeed = FightMonsterBehavior.FleeMoveSpeed;
    const moveOffset = this.fleeTargetPosition.clone().subtract(this.position);

    if (moveOffset.length() < moveSpeed) this.chooseNextAction();
    else moveOffset.normalize().multiplyScalar(moveSpeed);
    this.move(moveOffset);
    
    this.lookAtTarget();
  }
  
  private setPrepareAttackState() {
    this.state = MonsterStates.PrepareAttack;
    this.actor.spriteRenderer.setAnimation("Idle");
    
    this.stateTimer = FightMonsterBehavior.PrepareAttackDuration;
  }
  
  private handlePrepareAttackState() {
    const animationOffsetX = 0.2 * Math.sin(this.stateTimer / FightMonsterBehavior.PrepareAttackLoopDuration * Math.PI);
    this.actor.setX(this.position.x + animationOffsetX);
    
    this.lookAtTarget();
    
    this.stateTimer -= 1;
    if (this.stateTimer <= 0) this.setAttackState();
  }
  
  private setAttackState() {
    this.updateTarget();
    if (this.currentTarget == null) {
      this.setIdleState();
      return;
    }
    
    this.state = MonsterStates.Attack;
    this.actor.spriteRenderer.setAnimation("Attack");
    AudioManager.playSound("Punch");
    
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
    
    if (this.stateTimer <= 0) this.chooseNextAction();
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
    this.move(new Sup.Math.Vector2(deadMovementSpeed * Math.cos(this.stateAngle), deadMovementSpeed * Math.sin(this.stateAngle)));
    
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
