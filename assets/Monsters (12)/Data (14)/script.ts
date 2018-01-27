enum MonsterCategory {
  Flying, Sticky, Crawling
}

type MonsterTrait = "Berserk"|"Toxic";

interface MonsterInfo {
  name: string;
  description: string;
  category: MonsterCategory;
  
  stage: number;   // 1 - 3
  level: number;   // 1 - 10
  
  currentHealth?: number;
  
  stats: {
    health: number;    
    attack: number;
    defense: number;
  }
  mainStat: "health"|"attack"|"defense";

  traits: MonsterTrait[];
  possibleNaturalTraits: MonsterTrait[];
  
  hitFX: string;
}

const monstersInfos: MonsterInfo[] = [
  {
    name: "Craborg",
    description: "Have you ever seen a cyborg crab? Well. Now you have. Don't get too close from its claws, by the way.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 12,
      defense: 8,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Berserk" ],
    
    hitFX: "Hit1"
  },
  
  {
    name: "Panarix",
    description: "This monstermon is the result of a unique science experiment. It is derived from Dr. Frankenstein's monster's thumb...",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    
    stats: {
      health: 10,
      attack: 12,
      defense: 5,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  {
    name: "Psychiderm",
    description: "Behind its innocent aspect, this is a very dangerous specimen of monstermon. When trumpeting, it controls the mind of its enemies, driving them mad.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 9,
      defense: 9,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  {
    name: "Vacuumator",
    description: "This monstermon is the result of a satanic rite that went wrong. Teenagers accidentaly mixed a demon with the vaccuum cleaner stored nearby.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 13,
      defense: 7,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  
   {
    name: "Rampire",
    description: "It might look like a rabbit... but it will suck every drop of blood out of its ennemies.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
     
    stats: {
      health: 10,
      attack: 12,
      defense: 5,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  {
    name: "Salamasaurus",
    description: "It's a lizard! No, it's a plane! No, it's a bird! Well, actually it seems it's everything at the same time!",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 9,
      defense: 9,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  
  {
    name: "Potham",
    description: "This monster has a stange tendency to act like a super-hero and to rescue damsels in distress. This is most likely explained by its famous origins: Potham City.  ",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 9,
      defense: 9,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  {
    name: "Greenspirit",
    description: "This green vaporous monster seems to be neither male, neither female... If winder what could happen if I could reasign my gender on purpose! ",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 9,
      defense: 9,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
  {
    name: "Tapewormer",
    description: "This monster looks just like a tapeworm. Only with more teeth, more eyes and more wings.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 10,
      attack: 9,
      defense: 9,
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  }
];
