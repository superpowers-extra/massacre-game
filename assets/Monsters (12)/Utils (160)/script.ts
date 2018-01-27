// Validate monsters
let i = 0;
while (i < monstersInfos.length) {
  const info = monstersInfos[i];
  if (Sup.get(`Monsters/${info.name}/Stage1`, { ignoreMissing: true }) == null) {
    Sup.log(`Monster "${info.name}" is invalid (missing sprite) and got removed from the game.`)
    monstersInfos.splice(i, 1);
  } else if (info.level !== 1) {
    Sup.log(`Monster "${info.name}" is invalid (level must be 1) and got removed from the game.`)
    monstersInfos.splice(i, 1);
  } else {
    i++;
  }
}

const monstersByStage: MonsterInfo[][] = [];

for (let stage = 1; stage <= 3; stage++) {
  monstersByStage[stage - 1] = [];
  for (const monster of monstersInfos) {
    if (monster.stage === stage) {
      monstersByStage[stage - 1].push(monster);
    }
  }
}

function cloneMonsterInfo(originalMonsterInfo: MonsterInfo): MonsterInfo {
  return {
    name: originalMonsterInfo.name,
    description: originalMonsterInfo.description,
    category: originalMonsterInfo.category,
    
    stage: originalMonsterInfo.stage,
    level: originalMonsterInfo.level,
    
    currentHealth: originalMonsterInfo.stats.health,

    
    stats: {
      health: originalMonsterInfo.stats.health,
      attack: originalMonsterInfo.stats.attack,
      defense: originalMonsterInfo.stats.defense,
    },
    
    mainStat: originalMonsterInfo.mainStat,
    traits: originalMonsterInfo.traits.slice(),
    possibleNaturalTraits: null,
    
    hitFX: originalMonsterInfo.hitFX
  }
}

function generateRandomizedMonsterInfo(price: number): MonsterInfo {
  const referenceLevel = price / 100;
  const minLevel = Math.max(1, referenceLevel - Sup.Math.Random.integer(0, 3));
  const maxLevel = Math.min(9, referenceLevel + Sup.Math.Random.integer(0, 3));
  
  const baseMonsterInfo = Sup.Math.Random.sample(monstersByStage[0]);
  const monsterInfo = cloneMonsterInfo(baseMonsterInfo);
    
  // TODO: Weighted?
  const level = Sup.Math.Random.integer(minLevel, maxLevel);
  
  for (let i = 0; i < level; i++) {
    monsterInfo.level++;
    
    // 2 points to main stat
    monsterInfo.stats[monsterInfo.mainStat] += 2;
    
    // 3 points randomly assigned to all stats
    for (let j = 0; j < 3; j++) {
      const statName = Sup.Math.Random.sample(Object.keys(monsterInfo.stats));
      monsterInfo.stats[statName]++;
    }
  }
  
  monsterInfo.currentHealth = monsterInfo.stats.health;
  
  // Traits
  if (Sup.Math.Random.integer(0, 3) == 0 && baseMonsterInfo.possibleNaturalTraits.length > 0) {
    Sup.Math.Random.sample(baseMonsterInfo.possibleNaturalTraits);
  }
  
  return monsterInfo;
}