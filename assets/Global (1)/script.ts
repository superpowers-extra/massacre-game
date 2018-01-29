Sup.Input.goFullscreen();

namespace Global {
  export let hasSavedGame = false;
  export let money = 0;
  export let reputation = 4; // out of 10
  export let roster: MonsterInfo[] = [];
  
  export let exhibitionIndex = 0;
  export let combatCounter = 0;
  
  export function startNewGame() {
    money = 500;
    roster.length = 0;
    
    exhibitionIndex = 0;
    combatCounter = 0;
  }
  
  export function loadGame() {
    if (Sup.Storage.getJSON("version") === 1) {
      hasSavedGame = true;
      
      money = Sup.Storage.getJSON("money");
      reputation = Sup.Storage.getJSON("reputation");
      roster = Sup.Storage.getJSON("roster");

      exhibitionIndex = Sup.Storage.getJSON("exhibitionIndex");
      combatCounter = Sup.Storage.getJSON("combatCounter");
    }
  }
  
  export function saveGame() {
    Sup.Storage.setJSON("version", 1);
    
    Sup.Storage.setJSON("money", money);
    Sup.Storage.setJSON("reputation", reputation);
    Sup.Storage.setJSON("roster", roster);
    
    Sup.Storage.setJSON("exhibitionIndex", exhibitionIndex);
    Sup.Storage.setJSON("combatCounter", combatCounter);
  }
  
  export function refreshStatusBar() {
    Sup.getActor("Status Bar").getBehavior(StatusBarBehavior).refresh();
  }
  
  export function getExhibitionOffer() {
    if (exhibitionIndex >= ExhibitionOffers.length) return null;
    const offer = ExhibitionOffers[exhibitionIndex];
    
    if (combatCounter < offer.combatCounter) return null;
    return offer;
  }
}
