type FightFullfilment = "win"|"lose"|"participate";

interface FightReward {
  money: number;
  reputation: number;
}

interface ExhibitionOffer {
  caller: string;
  callText: string;
  
  fullfilment: FightFullfilment;
  reward: FightReward;

  combatCounter: number;

  enemies: { name: string, stage: number; level: number; }[],
}


const ExhibitionOffers: ExhibitionOffer[] = [
  { 
    caller: "Sliman",
    callText: `Hello, I am at my daughter's wedding, and I completely forgot to call a DJ or a warm up guy...

Could you please come with your creatures to show their tricks and stuff? Pls this is urgent the ceremony ends in 10 minutes.

Send help.
thx`,
    
    fullfilment: "participate",
    combatCounter: 1,
    
    enemies: [
      { name: "Repulshell", stage: 1, level: 3 },
      { name: "Leavyrekt", stage: 1, level: 6 },
      
    ],
    
    reward: {
      money: 500,
      reputation: 2
    }
  },
  
    { 
    caller: "Fabrice",
    callText: `Hello, I represent the storekeeper association from Poupouloupoupou 4. We are organizing a little tournament, and we are seeking a new champion to win in our name.

Violence is good for business.`,
    
    fullfilment: "win",
    combatCounter: 2,
      
    enemies: [
      { name: "Spectral Turkey", stage: 2, level: 8 },
    ],
    
      
    reward: {
      money: 2000,
      reputation: 2
    }
  },
  
      { 
    caller: "Gromlak",
    callText: `Hello, I have a champion and I want to show how strong he is. Unfortunately, he is terribly bad. Could you send weak creatures, so he could defeat them?

Thank you.`,
    
    fullfilment: "lose",
    combatCounter: 3,
        
    enemies: [
      { name: "Bobom", stage: 1, level: 10 },
    ],
    
        
    reward: {
      money: 1500,
      reputation: 2
    }
  },
  
    { 
    caller: "Sliman",
    callText: `Hello, I invited some friends tonight, and we wanted to watch something relaxing.
Like some creatures fighting to death in a pit, could you do me this favor?

thank you`,
    
    fullfilment: "participate",
    combatCounter: 2,
    
    enemies: [
      { name: "Brainax", stage: 2, level: 3 },
      { name: "Salamasaurus", stage: 2, level: 1 },
    ],
    
      
    reward: {
      money: 1500,
      reputation: 2
    }
  },
  
      { 
    caller: "Fabrice",
    callText: `Hi, me again! The 10th international "creatures fight until death in the middle of random shops" is happening tomorrow,

wanna join?`,
    
    fullfilment: "participate",
    combatCounter: 1,
      
    enemies: [
      { name: "Fred", stage: 2, level: 1 },
    ],
    
        
    reward: {
      money: 500,
      reputation: 2
    }
  },
  
    { 
    caller: "Sliman",
    callText: `The 2 things I like the most: money and ultraviolence. So naturally, I wanna bet with a friend of mine, but I need to be sure to win, so you will have to lose.`,
    
    fullfilment: "lose",
    combatCounter: 3,
    
    enemies: [
      { name: "Magnus", stage: 1, level: 8 },
      { name: "Repulshell", stage: 2, level: 2 },
      { name: "Craborg", stage: 2, level: 1 },
    ],
    
      
    reward: {
      money: 1000,
      reputation: 2
    }
  },
  
        { 
    caller: "Gromlak",
    callText: `My former champion ended his career yesterday when he died. I need a second string, if possible a better one.`,
    
    fullfilment: "win",
    combatCounter: 3,
        
    enemies: [
      { name: "Vacuumator", stage: 2, level: 8 },
    ],
    
          
    reward: {
      money: 1500,
      reputation: 2
    }
  },
  
        { 
    caller: "Fabrice",
    callText: `General call to everyone who owns a pet: 
Bring them and let them fight in front of rich people.`,
    
    fullfilment: "participate",
    combatCounter: 3,
      
    enemies: [
      { name: "Slime", stage: 2, level: 8 },
      { name: "Snootyglooby", stage: 2, level: 5 },
    ],
    
          
    reward: {
      money: 2000,
      reputation: 2
    }
  },
  
          { 
    caller: "Gromlak",
    callText: `We're not barbarians, when we argue, we put our pets in a pit and see wich one wins. But i don't have a pet, can i have one of yours?`,
    
    fullfilment: "win",
    combatCounter: 3,
        
    enemies: [
      { name: "Cyberpug", stage: 3, level: 8 },
    ],
    
          
    reward: {
      money: 1500,
      reputation: 2
    }
  },
  
  { 
    caller: "Sliman",
    callText: `To all trainers, I'm throwing a tournament for the divorce of my daughter. 
The winner gains 3000 dollars and her hand.`,
    
    fullfilment: "win",
    combatCounter: 2,
    
    enemies: [
      { name: "Bogeyman", stage: 3, level: 10 },
      { name: "Robotator", stage: 3, level: 8 },
      { name: "Leonard", stage: 3, level: 4 },
    ],
    
    
    reward: {
      money: 3000,
      reputation: 2
    }
  },
];