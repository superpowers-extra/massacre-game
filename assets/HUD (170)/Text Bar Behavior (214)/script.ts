class TextBarBehavior extends Sup.Behavior {
  textRndr: Sup.TextRenderer;
  
  textToDisplay = "";
  textProgress = 0;
  timer = 0;
  
  callback: Function;
  
  awake() {
    this.actor.setVisible(false);
    this.textRndr = this.actor.getChild("Text").textRenderer;
  }

  update() {
    if (!this.isTextFinished()) {
      if (this.playerWantsToSkip()) {
        this.textProgress = this.textToDisplay.length;
        this.timer = 0;
        this.textRndr.setText(this.textToDisplay);
      } else {
        this.timer++;

        if (this.timer === 1) {
          this.textProgress++;
          this.timer = 0;

          this.textRndr.setText(this.textToDisplay.slice(0, this.textProgress));
        }
      }
    } else if (this.actor.getVisible()) {
      if (this.playerWantsToSkip()) {
          this.hide();
      }
    }
  }
  
  show(text: string, iconVisible: boolean, callback: Function) {
    this.timer = 0;
    this.textProgress = 0;
    this.textToDisplay = text;
    this.textRndr.setText("");
    this.callback = callback;

    this.actor.setVisible(true);
    this.actor.getChild("Icon").setVisible(iconVisible);
  }
  
  hide(doCallback = true) {
    this.actor.setVisible(false);
    this.textProgress = 0;
    this.textToDisplay = "";
    
    if (this.callback != null) {
      const callback = this.callback;
      this.callback = null;
      if (doCallback) callback();
    }
    
  }
  
  playerWantsToSkip = () => Sup.Input.wasKeyJustPressed("SPACE") || Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasMouseButtonJustPressed(0);
  
  isTextFinished = () => this.textProgress == this.textToDisplay.length;
}
Sup.registerBehavior(TextBarBehavior);
