enum MonsterCategory {
  Flying, Sticky, Crawling
}

const MonsterMaxLevelByStage = 10;
const MonsterMaxTraitSlotsPerStage = [ 2, 3, 5 ];

type MonsterTrait = "Berserk"|"Vampirism"|"Toxic"|"Anti-poison"|"Furtive"|"Accute"|"Titanium Skin"|"Survivor"|"Spiky"|"Double Attack"|"Regeneration"|"Repetition"|"Amphetamines"|"Neutralize"|"Invisibility"|"Parasitism"|"Metamorph"|"Contagious"|"Smoky"|"Trapped";

const MonsterTraitDescriptions: { [index: string]: string } = {
  "Berserk": "When an adversary loses all its HP, the monster has 50% chances to kill it.",
  "Vampirism": "Each attack will allow your monster to drain 10% HP from its ennemy.",
  "Toxic": "Every attack has a chance to contamine your ennemy, inflicting 10% additional damage.",
  "Anti-poison": "Your monster cannot be poisonned by an ennemy. Works against 'Toxic' and 'Smoky'",
  "Furtive":"Gives 25% chance to escape from an attack.",
  "Accute":"Never misses its ennemy. Very useful against 'Furtive'",
  "Survivor":"If your monster reaches 0 HP, it will not die at the end of the fight.",
  "Titanium Skin":"Gives your monster an extra 20% resistance to damages.",
  "Spiky":"Gives your monster an extra 20% damage bonus.",
  "Double Attack":"Your monster can attack two ennemies at the same time.",
  "Regeneration":"Once per fight, your monster will recover 50% of its HP.",
  "Repetition":"Instead of attacking once, your monster will attack twice.",
  "Amphetamines":"Increases the chances of inflicting a critical attack.",
  "Neutralize":"Stuns an ennemy for two turns.",
  "Invisibility":"Gives your monster the ability to disappear for two turns.",
  "Parasitism": "If the HP of an ennemy is inferior to 50%, it is infected by a parasite that will kill him in 3 turns.",
  "Metamorph": "Adopts a new monster type in front of its ennemy, giving him a damage advantage.",
  "Contagious": "Your monster contaminates an ennemy with a very contagious disease, speading within the opponent team.",
  "Smoky": "Your monster sends a toxic smoke, poisonning all the opponent monsters.",
  "Trapped": "If your monster is about to die, it will attack three more times in a row.",
};

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
    speed: number;
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
      health: 60,
      attack: 10,
      defense: 5,
      speed: 10
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Berserk","Spiky","Toxic" ],
    
    hitFX: "Hit1"
  },
  {
    name: "Dowie",
    description: "Dowie was a normal alien child. Until he grew up. Now he's constantly hanging around with the bad guys: mug and coffee.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 10,
      defense: 6,
      speed: 1
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Neutralize", "Invisibility","Trapped" ],
    
    hitFX: "Hit1"
  },
  
  {
    name: "Panarix",
    description: "This creature is the result of a unique science experiment. You really don't want to know what happened.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    
    stats: {
      health: 60,
      attack: 8,
      defense: 2,
      speed: 5
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Metamorph","Anti-poison" ],
    
    hitFX: "Hit1"
  },
  {
    name: "Psychiderm",
    description: "Behind its innocent aspect, this is a very dangerous specimen. Its trumpeting will drive any ennemy mad.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 75,
      attack: 10,
      defense: 6,
      speed: 5
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Titanium Skin", "Spiky", "Neutralize" ],
    
    hitFX: "Hit1"
  },
  {
    name: "Vacuumator",
    description: "Teenagers accidentaly mixed a demon with the vaccuum cleaner stored nearby during a satanic ritual.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 54,
      attack: 6,
      defense: 4,
      speed: 7
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Vampirism", "Furtive", "Accute" ],
    
    hitFX: "Hit1"
  },
  
   {
    name: "Rampire",
    description: "It might look like a rabbit... but it will suck every drop of blood out of its ennemies.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
     
    stats: {
      health: 60,
      attack: 10,
      defense: 4,
      speed: 7
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [ "Berserk", "Vampirism", "Double Attack" ],
    
    hitFX: "Hit1"
  },
  {
    name: "Salamasaurus",
    description: "It's a lizard! No, it's a plane! No, it's a bird! Well, actually it seems it's everything at the same time!",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 7,
      defense: 3,
      speed: 6
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Smoky", "Parasitism", "Trapped"],
    
    hitFX: "Hit1"
  },
  
  {
    name: "Potham",
    description: "This monster has a stange tendency to act like a super-hero. Our guess is because its from Potham City.  ",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 8,
      defense: 4,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Trapped","Regeneration","Survivor"],
    
    hitFX: "Hit1"
  },
  {
    name: "Leavyrekt",
    description: "Everyone agrees to say frogs have a big mouth. You'll never guess what this frog can use its mouth for.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 6,
      defense: 3,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Toxic", "Anti-poison", "Smoky"],
    
    hitFX: "Hit1"
  },
  {
    name: "Greenspirit",
    description: "This green vaporous monster seems to be neither male, neither female... I wish I could do that! ",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 6,
      defense: 4,
      speed: 5
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
      health: 60,
      attack: 6,
      defense: 3,
      speed: 2
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Furtive","Parasitism"],
    
    hitFX: "Hit1"
  },
   {
    name: "Snootyglooby",
    description: "That's what happens when your video game graphic designer tries to play it like Salvador Dali.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 7,
      defense: 3,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Contagious", "Double Attack"],
    
    hitFX: "Hit1"
  },
  {
    name: "Sneezie",
    description: "Next time you think your child is a monster... just look at her. Obviously, something went wrong.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 7,
      defense: 3,
      speed: 6
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Vampirism", "Toxic", "Repetition"],
    
    hitFX: "Hit1"
  },
  {
    name: "Slime",
    description: "A poor underpaid worker tried to perform a voodoo rite to bother his boss. And this happened.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 6,
      defense: 5,
      speed: 1
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Amphetamines","Survivor", "Invisibility"],
    
    hitFX: "Hit1"
  },
  {
    name: "Leonard",
    description: "It looks like a cute and harmless octopus right? Legend says it has superpowers (a collaborative game-development tool)",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 75,
      attack: 9,
      defense: 3,
      speed: 2
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Berserk", "Survivor", "Trapped"],
    
    hitFX: "Hit1"
  },
  {
    name: "Underdragon",
    description: "This very dangerous underground leviathan has become a nightmare to every space traveller.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 75,
      attack: 9,
      defense: 3,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Repetition", "Accute", "Metamorph"],
    
    hitFX: "Hit1"
  },
   {
    name: "COSMOS",
    description: "COSMOS is an accronym for 'COmplex Mass Of Stuff'. Story says it escaped from a space Mac Donald's kitchen. If you let it grow, its mass will probably generate a black hole and doom the world.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 79,
      attack: 7,
      defense: 4,
      speed: 1
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Neutralize", "Contagious", "Toxic"],
    
    hitFX: "Hit1"
  },
   {
    name: "Chewltan",
    description: "We wanted to name it 'Sultan of chewing', but shortened it by because it didn't fit the name slot in a silly game.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 72,
      attack: 7,
      defense: 5,
      speed: 4
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Double Attack", "Repetition"],
    
    hitFX: "Hit1"
  },
   {
    name: "Chickentuckill",
    description: "Destined to the finest fastfood of the galaxy, this monster chose to escape... and to  live the life, you know.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 75,
      attack: 6,
      defense: 4,
      speed: 2
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Metamorph", "Trapped"],
    
    hitFX: "Hit1"
  },
  {
    name: "Brainax",
    description: "A crawling brain that will litterally blow your mind.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 60,
      attack: 5,
      defense: 3,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Regeneration", "Amphetamines"],
    
    hitFX: "Hit1"
  },
  {
    name: "Cyberpug",
    description: "You can teach a lot of tricks to pugs. Including controlling robotic devices.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 45,
      attack: 9,
      defense: 2,
      speed: 8
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Metamorph", "Survivor", "Titanium Skin"],
    
    hitFX: "Hit1"
  },
    {
    name: "Gladiatoad",
    description: "It was found in the wilderness and raised by a warrior tribe when it was only a toad. Look how big it became.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 57,
      attack: 11,
      defense: 5,
      speed: 6
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: [],
    
    hitFX: "Hit1"
  },
   {
    name: "Leechleaf",
    description: "This vegetarian leech usually only attacks plants. Except when you throw it into a fighting pit.",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 78,
      attack: 6,
      defense: 3,
      speed: 4
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Vampirism", "Regeneration"],
    
    hitFX: "Hit1"
  },
   {
    name: "Mike-o-soft",
    description: "Mike-o-soft has a PhD in computer science. He developped fighting games and accidentaly got trapped in one.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 68,
      attack: 10,
      defense: 3,
      speed: 4
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Invisibility", "Survivor"],
    
    hitFX: "Hit1"
  },
   {
    name: "Bogeyman",
    description: "It has a knife, and won't hesitate to make good use of it. Beware.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 42,
      attack: 15,
      defense: 4,
      speed: 7
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Repetition","Spiky", "Double Attack"],
    
    hitFX: "Hit1"
  },
  {
    name: "Robotator",
    description: "IT'S A ROBOT THAT SHOOTS LASER BEAMS OUT OF ITS EYES. How cool is that?",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 66,
      attack: 9,
      defense: 5,
      speed: 4
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Double Attack","Titanium Skin"],
    
    hitFX: "Hit1"
  },
  {
    name: "Bobom",
    description: "This monster originates from a pedagogic game for kids. After an accident, it was removed from the market.",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 68,
      attack: 11,
      defense: 4,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Spiky", "Metamorph", "Accute"],
    
    hitFX: "Hit1"
  },
  
  {
    name: "Bursula",
    description: "Bursula just wants some attention",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 75,
      attack: 8,
      defense: 6,
      speed: 4
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Vampirism","Toxic", "Smoky"],
    
    hitFX: "Hit1"
  },
  {
    name: "Magnus",
    description: "It's a blue floating head. What else do you want us to say? ",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 72,
      attack: 10,
      defense: 3,
      speed: 5
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Vampirism", "Parasitism"],
    
    hitFX: "Hit1"
  },
    {
    name: "Worm War III",
    description: "Who needs firearms when you have fists and know Krav Maga?",
    category: MonsterCategory.Sticky,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 69,
      attack: 11,
      defense: 5,
      speed: 6
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Spiky","Accute"],
    
    hitFX: "Hit1"
  },
  {
    name: "Spectral Turkey",
    description: "Remember your Thanksgiving turkey that mysteriously disappeared? Well... ",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 45,
      attack: 12,
      defense: 2,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Vampirism","Invisibility"],
    
    hitFX: "Hit1"
  },
  {
    name: "Fred",
    description: "Nothing is more irritable than a just-awakened Smörklusbp teenager!",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 69,
      attack: 12,
      defense: 7,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Double Attack","Smoky"],
    
    hitFX: "Hit1"
  },
  {
    name: "Rocky Boy",
    description: "Stop hitting that stone! Can't you see it's getting angry?",
    category: MonsterCategory.Crawling,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 69,
      attack: 10,
      defense: 6,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Double Attack","Smoky"],
    
    hitFX: "Hit1"
  },
  {
    name: "Repulshell",
    description: "It's commonly admitted that you can ear the ocean within a shell. If listening into this one, you'll only hear your own death.",
    category: MonsterCategory.Flying,
    
    stage: 1,
    level: 1,
    
    stats: {
      health: 69,
      attack: 10,
      defense: 6,
      speed: 3
    },
    
    mainStat: "attack",
    traits: [],
    possibleNaturalTraits: ["Double Attack","Smoky"],
    
    hitFX: "Hit1"
  }
];
