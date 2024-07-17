import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ControlMode {
    DISABLED,
    NORMAL,
}

export interface IPuzzlePlayerInteractable {
    onControlModeChange(mode: ControlMode): void;
}

@ccclass('PuzzlePlayerControl')
export class PuzzlePlayerControl extends Component {
    private _controlMode: ControlMode;
    private _allInteractables: Set<IPuzzlePlayerInteractable> = new Set<IPuzzlePlayerInteractable>();

    public initialize(): void {
        this.setControlMode(ControlMode.DISABLED)
    }

    public addInteractable(i: IPuzzlePlayerInteractable): void {
        this._allInteractables.add(i);
    }

    public removeInteractable(i: IPuzzlePlayerInteractable): void {
        this._allInteractables.delete(i);
    }

    public setControlMode(mode: ControlMode) {
        if(this._controlMode == mode) return;
        
        this._controlMode = mode;
        for(let interaction of this._allInteractables){
            interaction.onControlModeChange(mode);
        }
    }
}


