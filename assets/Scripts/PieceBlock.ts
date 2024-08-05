import { _decorator, Component, Node, Sprite, tween, Vec3, SpriteFrame } from 'cc';
import { DataGameManager } from './DataGameManager';
import { PuzzleGameManager } from './PuzzleGameManager';
const { ccclass, property } = _decorator;
export enum EPieceBlockType {
    NONE = 0,
    NORMAL = 1,
    SPECIAL_0 = 2,
}



@ccclass('PieceBlock')
export class PieceBlock extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: Sprite })
    public sprite: Sprite;
    @property({ group: { name: "Sprite frame Repository", id: "1", displayOrder: 1 }, type: SpriteFrame })
    public pieceBlock0: SpriteFrame;

    public _type: EPieceBlockType = EPieceBlockType.NONE;
    public holder: Node = null;

    public loadImage(type: EPieceBlockType){
        let appearanceMap : Record<EPieceBlockType,SpriteFrame> = {
            [EPieceBlockType.NONE]: null,
            [EPieceBlockType.NORMAL]: null,
            [EPieceBlockType.SPECIAL_0]: this.pieceBlock0,
        }
        return appearanceMap[type];
    }

    public set type(type: EPieceBlockType){
        this._type = type;
        if(type == EPieceBlockType.NORMAL) return;
        this.sprite.spriteFrame = this.loadImage(type);
    }

    public get type(){
        return this._type;
    }

    public returnToPool(){
        let getBonus = PuzzleGameManager.instance.dataSource.updateHeadComboCount(this._type);
        
        PuzzleGameManager.instance.addBonus(getBonus);
        
        tween(this.node)
        .to(0.3,{
            scale: new Vec3(0)
        })
        .removeSelf()
        .start();
    }

   
}


