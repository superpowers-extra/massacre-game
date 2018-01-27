namespace Global {
  export let hasSavedGame = false;
  export let money = 0;
  export let reputation = 4; // out of 10
  export let roster: MonsterInfo[] = [];
  
  export function startNewGame() {
    money = 500;
    
    roster.length = 0;
    
    // TODO: Remove!
    roster.push(cloneMonsterInfo(Sup.Math.Random.sample(monstersByStage[0])));
  }
  
  export function loadGame() {
    if (Sup.Storage.getJSON("version") === 0) {
      hasSavedGame = true;
      
      money = Sup.Storage.getJSON("money");
      reputation = Sup.Storage.getJSON("reputation");
      roster = Sup.Storage.getJSON("roster");
    }
  }
  
  export function saveGame() {
    Sup.Storage.setJSON("version", 0);
    
    Sup.Storage.setJSON("money", money);
    Sup.Storage.setJSON("reputation", reputation);
    Sup.Storage.setJSON("roster", roster);
  }
  
  export function refreshStatusBar() {
    Sup.getActor("Status Bar").getBehavior(StatusBarBehavior).refresh();
  }
}

/* TODO!!!!!

Sup.onExit(() => {
  Global.saveGame();
});
*/