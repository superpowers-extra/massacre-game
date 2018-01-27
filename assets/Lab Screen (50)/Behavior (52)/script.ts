enum FusionState {
  None, TubeStart, Transfer, TubeEnd, Bell
}

class LabScreenBehavior extends Sup.Behavior {
  
  static TubeAnimationDuraton = 40;
  static TransferBubbleSpeed = 0.35;
  
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
  
  popupBackdrop: Sup.Actor;
  
  awake() {
    const rosterButton = Sup.getActor("Roster Button").getBehavior(ButtonBehavior);
    rosterButton.onClick = () => { Sup.loadScene("Roster Screen/Scene"); };
    
    this.fuseButton = Sup.getActor("Fuse Button").getBehavior(ButtonBehavior);
    this.fuseButton.setDisabled(true);
    this.fuseButton.onClick = () => { this.initiateFusion(); };
    
    this.bellRndr = Sup.getActor("Bell").spriteRenderer;
    this.bellButton = Sup.getActor("Bell").getBehavior(ButtonBehavior);
    this.bellButton.onClick = () => {
      this.openMonsterPopup(null, (monster, rosterIndex) => {
        this.bellMonsterIndex = rosterIndex;
        this.bellRndr.actor.getChild("Monster").spriteRenderer.setSprite(`Monsters/${monster.name}/Stage${monster.stage}`);
        this.secondaryBubbleButton.actor.setVisible(true);
      });
    };
    
    this.secondaryBubbleButton = Sup.getActor("Secondary Bubble").getBehavior(ButtonBehavior);
    this.secondaryBubbleButton.actor.setVisible(false);
    this.secondaryBubbleButton.onClick = () => {
      this.openMonsterPopup(this.bellMonsterIndex, (monster, rosterIndex) => {
        this.secondaryBubbleMonsterIndex = rosterIndex;
        Sup.getActor("Secondary Bubble Monster").spriteRenderer.setSprite(`Monsters/${monster.name}/Stage${monster.stage}`);
        this.secondaryBubbleButton.actor.setVisible(false);
        this.fuseButton.setDisabled(false);
      });
    };
    
    this.tubeRndr = Sup.getActor("Tube").spriteRenderer;
    this.transferBubble = Sup.getActor("Transfer Bubble");
    
    this.transferWaypoints = [];
    for (const waypointActor of Sup.getActor("Transfer Bubble Waypoints").getChildren()) {
      this.transferWaypoints.push(waypointActor.getPosition().toVector2());
    }
    
    this.popupBackdrop = Sup.getActor("Popup Backdrop");
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
    this.popupBackdrop.setVisible(true);
    const popup = Sup.appendScene("Team Popup/Prefab")[0];
    popup.setLocalZ(StatusBarBehavior.PopupZ);

    const closeButton = popup.getChild("Close Button").getBehavior(ButtonBehavior);
    closeButton.onClick = () => {
      popup.destroy();
      this.popupBackdrop.setVisible(false);
    };

    const monsterInfo = popup.getChild("Monster Info");
    monsterInfo.setVisible(false);

    const slots = popup.getChild("Slots").getChildren();
    for (let i = 0; i < slots.length; i++) {
      const slotButton = slots[i].getBehavior(ButtonBehavior);

      if (Global.roster.length - 1 >= i) {
        const rosterEntry = Global.roster[i];
        slotButton.actor.getChild("Monster").spriteRenderer.setSprite(`Monsters/${rosterEntry.name}/Stage${rosterEntry.stage}`);

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

          popup.destroy();
          this.popupBackdrop.setVisible(false);
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
      this.bellRndr.setAnimation(null);
      this.finishFusion();
    }
  }
  
  private finishFusion() {
    this.state = FusionState.None;
    // TODO: Actually increase stats of the initial monster and add some feedback?
    
    this.secondaryBubbleButton.actor.setVisible(true);
    this.bellButton.setInteractive(true);
  }
}
Sup.registerBehavior(LabScreenBehavior);
