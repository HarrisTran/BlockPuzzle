import { _decorator, Component, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { PuzzleGameManager } from './PuzzleGameManager';
const { ccclass, property } = _decorator;

@ccclass('PieceBlock')
export class PieceBlock extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: Sprite })
    public sprite: Sprite;
    // @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: SpriteFrame })
    // public currentSprite: SpriteFrame;

    public holder: Node = null;
    

    public returnToPool(){
        tween(this.node)
        .to(0.3,{
            scale: new Vec3(0)
        })
        .removeSelf()
        .start();
    }

   
}


