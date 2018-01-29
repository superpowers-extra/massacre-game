enum FusionState {
  None, TubeStart, Transfer, TubeEnd, Bell
}

class LabScreenBehavior extends Sup.Behavior {
  
  static TubeAnimationDuraton = 40;
  static TransferBubbleSpeed = 0.35;
  
  popup: PopupBehavior;
  textBar: TextBarBehavior;
  
  state = FusionState.None;
  stateTimer: number;
  
  fuseButton: ButtonBehavior;
  bellButton: ButtonBehavior;
  secondaryBubbleButton: ButtonBehavior;
  bellRndr: Sup.SpriteRenderer;
  bellMonsterIndex: number;
  secondaryBubbleMonsterIndex: number;
  
  tubeRndr: Sup.SpriteRenderer;
  transferBubble: Sup.Actor;
  transferBubblePosition: Sup.Math.Vector2;
  transferWaypoints: Sup.Math.Vector2[];
  transferWaypointTargetIndex: number;
  
  allButtons: ButtonBehavior[] = [];
  
  awake() {
    AudioManager.ensurePlayTrack("Ambient");
    
    this.popup = Sup.getActor("Popup").getBehavior(PopupBehavior);
    this.textBar = Sup.getActor("Text Bar").getBehavior(TextBarBehavior);
    
    const rosterButton = Sup.getActor("Roster Button").getBehavior(ButtonBehavior);
    rosterButton.onClick = () => { Sup.loadScene("Roster Screen/Scene"); };
    this.allButtons.push(rosterButton);
    
    this.fuseButton = Sup.getActor("Fuse Button").getBehavior(ButtonBehavior);
    this.fuseButton.setDisabled(true);
    this.fuseButton.onClick = () => {
      const popup = this.popup.open("Lab Screen/Fuse Popup", this.allButtons);
      
      const mainMonsterInfo = Global.roster[this.bellMonsterIndex];
      const mainMonsterInfoPopup = popup.getChild("Main Monster Info");
      displayMonsterInfo(mainMonsterInfoPopup, mainMonsterInfo);
      
      const secondaryMonsterInfo = Global.roster[this.secondaryBubbleMonsterIndex];
      const secondaryMonsterInfoPopup = popup.getChild("Secondary Monster Info");
      displayMonsterInfo(secondaryMonsterInfoPopup, secondaryMonsterInfo);
      
      const dynamicTextRndr = popup.getChild("Dynamic Text").textRenderer;
      dynamicTextRndr.setText(mainMonsterInfo.level === MonsterMaxLevelByStage ?
        `The creature will evolve to the next stage!` :
        `The creature will absorbe 1-${secondaryMonsterInfo.level} levels!`);
      
      const closeButton = popup.getChild("Close Button").getBehavior(ButtonBehavior);
      closeButton.onClick = () => {
        popup.destroy();
        this.popup.close(this.allButtons);
      };
      
      const validateFuseButton = popup.getChild("Validate Fuse Button").getBehavior(ButtonBehavior);
      validateFuseButton.onClick = () => {
        this.initiateFusion();
        
        popup.destroy();
        this.popup.close(this.allButtons);
      };
    };
    this.allButtons.push(this.fuseButton);
    
    this.bellRndr = Sup.getActor("Bell").spriteRenderer;
    this.bellButton = Sup.getActor("Bell").getBehavior(ButtonBehavior);
    this.bellButton.onClick = () => {
      this.openMonsterPopup(null, (monster, rosterIndex) => {
        this.bellMonsterIndex = rosterIndex;
        this.bellRndr.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(monster));
        
        this.secondaryBubbleMonsterIndex = null;
        Sup.getActor("Secondary Bubble Monster").spriteRenderer.setSprite(null);
        this.secondaryBubbleButton.actor.setVisible(true);
        
        this.fuseButton.setDisabled(true);
      });
    };
    this.allButtons.push(this.bellButton);
    
    this.secondaryBubbleButton = Sup.getActor("Secondary Bubble").getBehavior(ButtonBehavior);
    this.secondaryBubbleButton.actor.setVisible(false);
    this.secondaryBubbleButton.onClick = () => {
      this.openMonsterPopup(this.bellMonsterIndex, (monster, rosterIndex) => {
        this.secondaryBubbleMonsterIndex = rosterIndex;
        Sup.getActor("Secondary Bubble Monster").spriteRenderer.setSprite(getMonsterSprite(monster));
        this.secondaryBubbleButton.actor.setVisible(false);
        
        this.fuseButton.setDisabled(false);
      });
    };
    this.allButtons.push(this.secondaryBubbleButton);
    
    this.tubeRndr = Sup.getActor("Tube").spriteRenderer;
    this.transferBubble = Sup.getActor("Transfer Bubble");
    
    this.transferWaypoints = [];
    for (const waypointActor of Sup.getActor("Transfer Bubble Waypoints").getChildren()) {
      this.transferWaypoints.push(waypointActor.getPosition().toVector2());
    }
  }

  update() {
    Mouse.update(Sup.getActor("Camera").camera);
    
    switch (this.state) {
      case FusionState.TubeStart: this.handleTubeStartState(); break;
      case FusionState.Transfer: this.handleTransferState(); break;
      case FusionState.TubeEnd: this.handleTubeEndState(); break;
      case FusionState.Bell: this.handleBellState(); break;
    }
  }
  
  private openMonsterPopup(alreadySelectedMonsterIndex: number, onSelectMonster: (monster: MonsterInfo, rosterIndex: number) => void) {
    const popup = this.popup.open("Lab Screen/Monster Popup", this.allButtons);

    const closeButton = popup.getChild("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      popup.destroy();
      this.popup.close(this.allButtons);
    };

    const monsterInfo = popup.getChild("Monster Info");
    monsterInfo.setVisible(false);

    const slots = popup.getChild("Slots").getChildren();
    for (let i = 0; i < slots.length; i++) {
      const slotButton = slots[i].getBehavior(ButtonBehavior);

      if (Global.roster.length - 1 >= i) {
        const rosterEntry = Global.roster[i];
        slotButton.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(rosterEntry));

        if (i == alreadySelectedMonsterIndex) {
          slotButton.setInteractive(false);
          slotButton.actor.spriteRenderer.setAnimation("Validated");
          continue;
        }
        
        slotButton.onHover = () => {
          monsterInfo.setVisible(true);
          displayMonsterInfo(monsterInfo, rosterEntry);
        }

        slotButton.onUnhover = () => {
          monsterInfo.setVisible(false);
        }

        slotButton.onClick = () => {
          onSelectMonster(rosterEntry, i);

          this.popup.close(this.allButtons);
        }

      } else {
        slotButton.setDisabled(true);
      }
    }
  }
  
  private initiateFusion() {
    this.fuseButton.setDisabled(true);
    this.bellButton.setInteractive(false);
    
    this.setTubeStartState();
  }
  
  private setTubeStartState() {
    this.state = FusionState.TubeStart;
    this.tubeRndr.setAnimation("Start");
    
    this.stateTimer = LabScreenBehavior.TubeAnimationDuraton;
  }
  
  private handleTubeStartState() {
    this.stateTimer -= 1;
    if (this.stateTimer <= 0) {
      this.tubeRndr.setAnimation(null);
      this.setTransferState();
    }
  }
  
  private setTransferState() {
    this.state = FusionState.Transfer;
    this.transferBubblePosition = this.transferWaypoints[0].clone();
    this.transferBubble.setPosition(this.transferBubblePosition);
    this.transferBubble.setVisible(true);
    this.transferWaypointTargetIndex = 1;
    
    Sup.getActor("Secondary Bubble Monster").spriteRenderer.setSprite(null);
    
    const positionFX = Sup.getActor("Monster Disparition FX").getPosition().toVector2();
    spawnFX(positionFX, "Monster Disparition");
  }
  
  private handleTransferState() {
    let moveOffset = this.transferWaypoints[this.transferWaypointTargetIndex].clone().subtract(this.transferBubblePosition);
    
    if (moveOffset.length() < LabScreenBehavior.TransferBubbleSpeed) {
      if (this.transferWaypointTargetIndex == this.transferWaypoints.length - 1) {
        this.transferBubble.setVisible(false);
        this.setTubeEndState();
      } else {
        this.transferWaypointTargetIndex++;
      }
      
    } else {
      moveOffset.normalize().multiplyScalar(LabScreenBehavior.TransferBubbleSpeed);
    }
    
    this.transferBubblePosition.add(moveOffset);
    this.transferBubble.setPosition(this.transferBubblePosition);
  }
  
  private setTubeEndState() {
    this.state = FusionState.TubeEnd;
    this.tubeRndr.setAnimation("End");
    
    this.stateTimer = LabScreenBehavior.TubeAnimationDuraton;
  }
  
  private handleTubeEndState() {
    this.stateTimer -= 1;
    if (this.stateTimer <= 0) {
      this.tubeRndr.setAnimation(null);
      this.setBellState();
    }
  }
  
  private setBellState() {
    this.state = FusionState.Bell;
    this.bellRndr.setAnimation("Animation", false);
  }
  
  private handleBellState() {
    if (!this.bellRndr.isAnimationPlaying()) {
      this.bellRndr.setAnimation("Normal");
      this.finishFusion();
      AudioManager.playSound("Fusion");
    }
  }
  
  private finishFusion() {
    this.state = FusionState.None;
    
    // Increase stats of main monster
    const mainMonsterInfo = Global.roster[this.bellMonsterIndex];
    const secondaryMonsterInfo = Global.roster[this.secondaryBubbleMonsterIndex];
    increaseMonsterStats(mainMonsterInfo, secondaryMonsterInfo);
    
    // Remove secondary monster from the roster
    Global.roster.splice(this.secondaryBubbleMonsterIndex, 1);

    Global.saveGame();
    
    this.bellButton.setInteractive(true);
    this.bellMonsterIndex = Global.roster.indexOf(mainMonsterInfo);
    this.bellRndr.actor.getChild("Monster").spriteRenderer.setSprite(getMonsterSprite(mainMonsterInfo));
    
    this.secondaryBubbleMonsterIndex = null;
    Sup.getActor("Secondary Bubble Monster").spriteRenderer.setSprite(null);
    this.secondaryBubbleButton.actor.setVisible(true);
  }
}
Sup.registerBehavior(LabScreenBehavior);
