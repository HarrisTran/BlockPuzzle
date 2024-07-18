import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import { PuzzleGameManager } from './PuzzleGameManager';
const { ccclass, property } = _decorator;

@ccclass('PieceBlock')
export class PieceBlock extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: Sprite })
    private sprite: Sprite;
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: SpriteFrame })
    public spriteFrame: SpriteFrame;

    public holder: Node = null;
    

    public returnToPool(){
        this.node.destroy();
        //PuzzleGameManager.instance.pieceNodePool.put(this.node);
    }

   
}


