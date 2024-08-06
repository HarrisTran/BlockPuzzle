import { _decorator, Component, Node, ParticleSystem, Tween, tween, TweenAction, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StarEffect')
export class StarEffect extends Component {
    speed: number = 0
    dir: number = 0

    init() {
        this.node.setPosition(new Vec3(0));
        this.speed = Math.random() * 8
        this.dir = Math.random()
        this.node.getScale(new Vec3(0.3 + Math.random() * 0.6));
        let xx = 10 + Math.random() * 50
        if (Math.random() > 0.5) xx *= -1
        let yy = 10 + Math.random() * 50
        if (Math.random() > 0.5) yy *= -1
        const f_time = 0.3 + Math.random() * 0.4
        tween(this.node).sequence(
            tween(this.node).delay(Math.random() * 0.05),
            tween(this.node).by(f_time, { position: new Vec3(xx, yy, 0) }, { easing: "cubicOut" }),
            tween(this.node).by(f_time, { position: new Vec3(-xx, -yy, 0)}, { easing: "cubicIn" }),
            tween(this.node).removeSelf()
        )
        .start()
    }

    // update(dt: number) {
    //     if (this.dir > 0.5) {
    //         //向右移动
    //         this.node.translate(new Vec3(this.speed, 0, 0))
    //     } else {
    //         //向左移动
    //         this.node.translate(new Vec3(-this.speed, 0, 0))
    //     }
    // }
}


