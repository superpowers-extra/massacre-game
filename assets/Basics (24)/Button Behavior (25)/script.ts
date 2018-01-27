class ButtonBehavior extends Sup.Behavior {
  private textRndr: Sup.TextRenderer;
  private textColor = new Sup.Color(0x00de6e);
  private hitbox: Sup.Actor;
  
  // Is null be default, will be set to "Normal" if the animation exist on the sprite
  private normalStateAnimation: string;
  
  // Used when a button must not be clickable for gameplay reasons
  disabled = false;
  
  // Used when a button must not be clickable because a model dialog is loaded
  interactive = true;
  
  onClick: Function;
  onHover: Function;
  onUnhover: Function;
  
  awake() {
    if (this.actor.spriteRenderer == null) new Sup.SpriteRenderer(this.actor, "Basics/Medium Button Frame");
    
    if (this.actor.spriteRenderer.getSprite().path.indexOf("Negative") !== -1) {
      this.textColor = new Sup.Color(0xd63232);
    }
    
    if (this.actor.spriteRenderer.getSprite().getAnimationList().indexOf("Normal") !== -1) {
      this.normalStateAnimation = "Normal";
    }
    this.actor.spriteRenderer.setAnimation(this.normalStateAnimation);
    
    const textActor = this.actor.getChild("Text");
    if (textActor != null) {
      this.textRndr = this.actor.getChild("Text").textRenderer;
      this.textRndr.setColor(this.textColor);
    }
    
    // Try to use a custom hitbox if any, use the actor itself directly otherwise
    this.hitbox = this.actor.getChild("Hitbox");
    if (this.hitbox == null) this.hitbox = this.actor;
    else this.hitbox.setVisible(false);
    
    if (this.disabled) this.setDisabled(true);
  }
  
  onDestroy() {
    if (Mouse.hoveredButton === this) {
      Mouse.hoveredButton = null;
    }
  }
  
  update() {
    if (this.disabled || !this.interactive) return;
    
    const isInside = Mouse.ray.intersectActor(this.hitbox).length > 0;
    
    if (Mouse.hoveredButton === this) {
      if (isInside && Sup.Input.wasMouseButtonJustPressed(0)) {
        this.press();
      } else if (Sup.Input.wasMouseButtonJustReleased(0)) {
        if (isInside) this.activate();
        else this.stopHover();
      } else if (!Sup.Input.isMouseButtonDown(0) && !isInside) {
        this.stopHover();
      }
    } else if (Mouse.hoveredButton == null) {
      if (isInside) this.startHover();
    }
  }
  
  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    
    if (disabled) {
      if (Mouse.hoveredButton === this) this.stopHover();
      this.actor.spriteRenderer.setAnimation("Disabled");
      if (this.textRndr != null) this.textRndr.setColor(new Sup.Color(0x808080));
    } else {
      this.actor.spriteRenderer.setAnimation(this.normalStateAnimation);
      this.disabled = false;
      if (this.textRndr != null) this.textRndr.setColor(this.textColor);
    }
  }
    
  setInteractive(interactive: boolean) {
    this.interactive = interactive;
    
    if (!interactive) {
      if (Mouse.hoveredButton === this) this.stopHover();
    }
  }
  
  startHover() {
    Mouse.hoveredButton = this;
    this.actor.spriteRenderer.setAnimation("Hovered");
    if (this.textRndr != null) this.textRndr.setColor(new Sup.Color(0x000000));
    if (this.onHover != null) this.onHover();
  }
  
  stopHover() {
    Mouse.hoveredButton = null;
    this.actor.spriteRenderer.setAnimation(this.normalStateAnimation);
    if (this.textRndr != null) this.textRndr.setColor(this.textColor);
    if (this.onUnhover != null) this.onUnhover();
  }
  
  press() {
    this.actor.spriteRenderer.setAnimation("Pressed");
  }
  
  activate() {
    this.actor.spriteRenderer.setAnimation("Hovered");
    if (this.onClick != null) this.onClick();
    else Sup.log("Button with no click action setup");
  }
}
Sup.registerBehavior(ButtonBehavior);
