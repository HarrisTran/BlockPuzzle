import { _decorator, Component, Label, Node } from 'cc';
import { PuzzleGameManager } from '../PuzzleGameManager';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {
    @property(Label)
    private timerText : Label = null;

    private _isActived: boolean = false;
    private _timeLeft: number;

    protected update(dt: number): void {
        if(this._isActived){
            this._timeLeft -= dt;
            this.timerText.string = Math.floor(this._timeLeft).toString();
            if(this._timeLeft <= 0){
                this.onTimerReachedZero();
            }
        }
    }

    public init(time: number)
    {
        this.node.active = true;
        this._timeLeft = time;
        this._isActived = true;
    }

    public deactive(){
        this.node.active = false;
    }

    private onTimerReachedZero()
    {
        this._isActived = false;
        this.node.active = false;
        PuzzleGameManager.instance.confirmGameEnd();
    }
}


