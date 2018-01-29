function wrapText(font: Sup.Font, text: string, maxWidth: number): string {
  let wrappedText = "";
  
  let lineStart = 0;
  let lineEnd = 0;
  let nextLineEnd = 0;
  
  let line = "";
  
  while(lineEnd < text.length) {
    nextLineEnd = text.indexOf(" ", lineEnd);
    if (nextLineEnd === -1) nextLineEnd = text.length;
    
    const nextLine = text.slice(lineStart, nextLineEnd);
    
    const width = font.getTextWidth(nextLine);
    
    if (width > maxWidth) {
      wrappedText += line + "\n";
      lineStart = lineEnd;
      lineEnd++;
      line = "";
    } else {
      const naturalLineEnd = text.indexOf("\n", lineEnd);
      if (naturalLineEnd !== -1 && naturalLineEnd < nextLineEnd) {
        wrappedText += text.slice(lineStart, naturalLineEnd + 1);
        lineStart = lineEnd = naturalLineEnd + 1;
        line = "";
      } else {
        lineEnd = nextLineEnd + 1;
        line = nextLine;
      }
    }
  }
  
  wrappedText += line;
  
  return wrappedText;
}

function displayMonsterInfo(actor: Sup.Actor, info: MonsterInfo) {
  actor.getChild("Icon").spriteRenderer.setSprite(getMonsterSprite(info));
  actor.getChild("Name").textRenderer.setText(info.name.toUpperCase());
  
  actor.getChild("Level").textRenderer.setText(`Stage ${info.stage} — Level ${info.level}`);
  actor.getChild("Category").textRenderer.setText(MonsterCategory[info.category]);

  actor.getChild("Stats/Health/Value").textRenderer.setText(`${info.currentHealth} / ${info.stats.health}`);
  actor.getChild("Stats/Attack/Value").textRenderer.setText(info.stats.attack);
  actor.getChild("Stats/Defense/Value").textRenderer.setText(info.stats.defense);
  // TODO: actor.getChild("Stats/Speed/Value").textRenderer.setText(info.stats.speed);
  
  // Description
  const descTextRndr = actor.getChild("Description").textRenderer;
  const wrappedDescText = wrapText(descTextRndr.getFont(), info.description, 35);
  descTextRndr.setText(wrappedDescText);
  
  // Traits
  const traitsActors = actor.getChild("Traits").getChildren();
  
  for (let i = 0; i < traitsActors.length; i++) {
    const traitButton = traitsActors[i].getBehavior(ButtonBehavior);
    
    traitButton.actor.setVisible(i < MonsterMaxTraitSlotsPerStage[info.stage - 1]);
    
    const trait = info.traits[i];
    if (trait != null) {
      traitButton.actor.getChild("Trait").spriteRenderer.setSprite(`Traits/${trait}`);
      const wrappedTraitDescText = `${trait.toUpperCase()}:\n${wrapText(descTextRndr.getFont(), MonsterTraitDescriptions[trait], 35)}`;
      
      traitButton.onHover = () => { descTextRndr.setText(wrappedTraitDescText); }
      traitButton.onUnhover = () => { descTextRndr.setText(wrappedDescText); }
      
      traitButton.onClick = () => {};
    } else {
      traitButton.actor.getChild("Trait").spriteRenderer.setSprite(null);
      traitButton.onHover = traitButton.onUnhover = traitButton.onClick = () => {};
    } 
  }
}
