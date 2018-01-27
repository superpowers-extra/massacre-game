class FightScreenBehavior extends Sup.Behavior {
  
  static MonsterPadding = 5;
  
  private roster: FightMonsterBehavior[] = [];
  private enemies: FightMonsterBehavior[] = [];
  
  awake() {
    this.selectRoster(1);
    this.selectEnemies(3);
    
    this.setupTargets();
  }
  
  private selectRoster(rosterCount: number) {
    for (let i = 0; i < rosterCount; i++) {
      this.setupMonster(Global.roster[i], "Roster", i, rosterCount, this.roster);
    }
  }
  
  private selectEnemies(enemyCount: number) {
    for (let i = 0; i < enemyCount; i++) {
      const enemyStats = cloneMonsterInfo(Sup.Math.Random.sample(monstersByStage[0]));
      this.setupMonster(enemyStats, "Enemy", i, enemyCount, this.enemies);
    }
  }
  
  private setupMonster(info: MonsterInfo, team: "Roster" | "Enemy", index: number, count: number, monsterList) {
    const rootActor = Sup.getActor(`Team ${team}`);
    const monsterActor = new Sup.Actor("Monster", rootActor);
    
    const x = Sup.Math.Random.float(-2, 2);
    const y = -(index - (count - 1) / 2) * FightScreenBehavior.MonsterPadding;
    monsterActor.setLocalPosition(x, y);
    
    const behavior = monsterActor.addBehavior(FightMonsterBehavior, { info });
    monsterList.push(behavior);
  }
  
  private setupTargets() {
    for (const rosterEntry of this.roster) rosterEntry.targets = this.enemies;
    for (const enemy of this.enemies) enemy.targets = this.roster;
  }

  update() {
    // FIXME: Temporary debug
    if (Sup.Input.wasKeyJustPressed("ESCAPE")) Sup.loadScene("Roster Screen/Scene");
    
    // TODO: Check when the combat is finished, victory/defeat popup
  }
}
Sup.registerBehavior(FightScreenBehavior);
