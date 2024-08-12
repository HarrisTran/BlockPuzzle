import { __private, _decorator, Animation, Button, Component, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
import P4PSDK from '../SDK';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {
    @property(Animation) loseAnimation: Animation = null;
    @property(Node) content: Node = null;
    @property(Button) quitButton: Button = null;

    protected onLoad(): void {
        this.content.active = false;
        this.loseAnimation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    }

    async onAnimationFinished() {
        this.content.active = true;
        this.TweenShowScalePopUp(this.content,0.3,1).start();
        let lst = await P4PSDK.getLeaderBoard(0,20);
        console.log(lst);
        
    }

    async onClickQuitButton(){
        this.quitButton.interactable = false;
        await P4PSDK.endGame();
    }

    protected onEnable(): void {
        this.loseAnimation.play();
    }


    public TweenShowScalePopUp(target: Node, time: number, scale: number): Tween<Node>
    {
        return tween(target).to(time, { scale: new Vec3(scale, scale, scale) }, { easing: 'backOut' });
    }

}


