// Validate monsters
const monsterInfosByName: { [name: string]: MonsterInfo } = {};

{
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
    
    monsterInfosByName[info.name] = info;
  }
}

Sup.log(monsterInfosByName);

/*const monstersByStage: MonsterInfo[][] = [];

for (let stage = 1; stage <= 3; stage++) {
  monstersByStage[stage - 1] = [];
  for (const monster of monstersInfos) {
    if (monster.stage === stage) {
      monstersByStage[stage - 1].push(monster);
    }
  }
}*/

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
      speed: originalMonsterInfo.stats.speed
    },
    
    mainStat: originalMonsterInfo.mainStat,
    traits: originalMonsterInfo.traits.slice(),
    possibleNaturalTraits: null,
    
    hitFX: originalMonsterInfo.hitFX
  }
}

function getMonsterSprite(monsterInfo: MonsterInfo) { return `Monsters/${monsterInfo.name}/Stage${monsterInfo.stage}`; }

function incrementMonsterLevel(monsterInfo: MonsterInfo) {
  if (monsterInfo.level < MonsterMaxLevelByStage) monsterInfo.level++;
    
  // 2 points to main stat
  monsterInfo.stats[monsterInfo.mainStat] += 2;

  // 3 points randomly assigned to all stats
  for (let j = 0; j < 3; j++) {
    const statName = Sup.Math.Random.sample(Object.keys(monsterInfo.stats));
    monsterInfo.stats[statName]++;
  }
}

function generateRandomizedMonsterInfoFromPrice(price: number): MonsterInfo {
  const referenceLevel = price / 100;
  const minLevel = Math.max(1, referenceLevel - Sup.Math.Random.integer(0, 3));
  const maxLevel = Math.min(9, referenceLevel + Sup.Math.Random.integer(0, 3));
  
  // TODO: Weighted?
  const level = Sup.Math.Random.integer(minLevel, maxLevel);
  
  return generateRandomizedMonsterInfo(1, level);
}

function generateRandomizedMonsterInfo(stage: number, level: number, baseMonsterInfo?: MonsterInfo): MonsterInfo {
  if (baseMonsterInfo == null) baseMonsterInfo = Sup.Math.Random.sample(monstersInfos);
  const monsterInfo = cloneMonsterInfo(baseMonsterInfo);
  
  for (let i = 0; i < level; i++) incrementMonsterLevel(monsterInfo);
  
  monsterInfo.currentHealth = monsterInfo.stats.health;
  
  // Traits
  if (Sup.Math.Random.integer(0, 3) == 0 && baseMonsterInfo.possibleNaturalTraits.length > 0) {
    monsterInfo.traits.push(Sup.Math.Random.sample(baseMonsterInfo.possibleNaturalTraits));
  }
  
  return monsterInfo;
}


function increaseMonsterStats(mainMonsterInfo: MonsterInfo, secondaryMonsterInfo: MonsterInfo) {
  let levelAbsorbed = Sup.Math.Random.integer(1, secondaryMonsterInfo.level);
  if (secondaryMonsterInfo.stage < mainMonsterInfo.stage) levelAbsorbed = Math.ceil(levelAbsorbed / 2);
  
  // Go to the next stage, increment stats a couple times as a bonus
  if (mainMonsterInfo.level === MonsterMaxLevelByStage) {
    mainMonsterInfo.stage++;
    
    for (let i = 0; i < 2; i++) incrementMonsterLevel(mainMonsterInfo);
    mainMonsterInfo.level = 0;
  }
  
  for (let i = 0; i < levelAbsorbed; i++) incrementMonsterLevel(mainMonsterInfo);
  
  for (const secondaryTrait of secondaryMonsterInfo.traits) {
    const hasTraitAlready = mainMonsterInfo.traits.indexOf(secondaryTrait) !== -1;
    const canAbsorbeMoreTrait = mainMonsterInfo.traits.length < MonsterMaxLevelByStage[mainMonsterInfo.stage - 1];
    if (!hasTraitAlready && canAbsorbeMoreTrait && Sup.Math.Random.integer(0, 1) == 0) {
      mainMonsterInfo.traits.push(secondaryTrait);
    }
  }
}
