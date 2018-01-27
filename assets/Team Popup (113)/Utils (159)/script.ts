function displayMonsterInfo(actor: Sup.Actor, info: MonsterInfo) {
  actor.getChild("Icon").spriteRenderer.setSprite(`Monsters/${info.name}/Stage${info.stage}`);
  actor.getChild("Name").textRenderer.setText(info.name.toUpperCase());
  
  actor.getChild("Level").textRenderer.setText(`Stage ${info.stage} — Level ${info.level}`);
  actor.getChild("Category").textRenderer.setText(MonsterCategory[info.category]);

  actor.getChild("Stats/Health/Value").textRenderer.setText(`${info.currentHealth} / ${info.stats.health}`);
  actor.getChild("Stats/Attack/Value").textRenderer.setText(info.stats.attack);
  actor.getChild("Stats/Defense/Value").textRenderer.setText(info.stats.defense);
  // TODO: actor.getChild("Stats/Speed/Value").textRenderer.setText(info.stats.speed);
  
  // TODO: Traits
  const traitsActor = actor.getChild("Traits");
  
  for (let i = 0; i < info.traits.length; i++) {
    const trait = info.traits[i];
    const traitActor = new Sup.Actor("Trait", traitsActor);
    traitActor.setLocalX(i);
    
    new Sup.SpriteRenderer(traitActor, `Traits/${trait}`);
  }
}