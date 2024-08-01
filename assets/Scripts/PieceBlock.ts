import { _decorator, Component, Node, Sprite, tween, Vec3, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
export enum EPieceBlockType {
    NONE = 0,
    NORMAL = 1,
    SPECIAL_0 = 2,
    SPECIAL_1 = 3,
    SPECIAL_2 = 4,
}



@ccclass('PieceBlock')
export class PieceBlock extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: Sprite })
    public sprite: Sprite;
    @property({ group: { name: "Sprite frame Repository", id: "1", displayOrder: 1 }, type: SpriteFrame })
    public pieceBlock0: SpriteFrame;
    @property({ group: { name: "Sprite frame Repository", id: "1", displayOrder: 1 }, type: SpriteFrame })
    public pieceBlock1: SpriteFrame;
    @property({ group: { name: "Sprite frame Repository", id: "1", displayOrder: 1 }, type: SpriteFrame })
    public pieceBlock2: SpriteFrame;

    public _type: EPieceBlockType = EPieceBlockType.NONE;
    public holder: Node = null;

    public loadImage(type: EPieceBlockType){
        let appearanceMap : Record<EPieceBlockType,SpriteFrame> = {
            [EPieceBlockType.NONE]: null,
            [EPieceBlockType.NORMAL]: null,
            [EPieceBlockType.SPECIAL_0]: this.pieceBlock0,
            [EPieceBlockType.SPECIAL_1]: this.pieceBlock1,
            [EPieceBlockType.SPECIAL_2]: this.pieceBlock2
        }
        return appearanceMap[type];
    }

    public set type(type: EPieceBlockType){
        this._type = type;
        if(type == EPieceBlockType.NORMAL) return;
        this.sprite.spriteFrame = this.loadImage(type);
    }

    public returnToPool(){
        tween(this.node)
        .to(0.3,{
            scale: new Vec3(0)
        })
        .removeSelf()
        .start();
    }

   
}


