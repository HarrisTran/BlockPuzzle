import { _decorator, Component, Node } from 'cc';
import { PlayerInteractable } from './PlayerInteractable';
import { ControlMode, IPuzzlePlayerInteractable } from './PuzzlePlayerControl';
import { PuzzleGameManager } from './PuzzleGameManager';
const { ccclass, property } = _decorator;

@ccclass('TetrominoPlayerInteractable')
export class TetrominoPlayerInteractable extends PlayerInteractable implements IPuzzlePlayerInteractable {
    onControlModeChange(mode: ControlMode): void {
        if (mode === ControlMode.DISABLED) {
            this.deactivate();
        }
        else if (mode === ControlMode.NORMAL) {
            this.registerClick = false;
            this.registerMove = true;
            this.activate();
        }
    }

    protected start(): void {
        PuzzleGameManager.instance.playerControl.addInteractable(this)
    }

}


