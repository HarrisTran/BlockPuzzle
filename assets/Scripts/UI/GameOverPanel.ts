import { __private, _decorator, Animation, Component, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverPanel')
export class GameOverPanel extends Component {
    @property(Animation) loseAnimation: Animation = null;
    @property(Node) content: Node = null;

    protected onLoad(): void {
        this.content.active = false;
        this.loseAnimation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    }

    onAnimationFinished() {
        this.content.active = true;
        this.TweenShowScalePopUp(this.content,0.3,1).start();
    }

    protected onEnable(): void {
        this.loseAnimation.play();
    }


    public TweenShowScalePopUp(target: Node, time: number, scale: number): Tween<Node>
    {
        return tween(target).to(time, { scale: new Vec3(scale, scale, scale) }, { easing: 'backOut' });
    }

}


