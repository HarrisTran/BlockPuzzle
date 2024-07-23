import { _decorator, CCFloat, Component, Node, Size, SpriteFrame, UITransform } from 'cc';
import { PredefinedTetrominoPieces } from './TetrominoDefinedData';
import randomItem from 'random-item';
import { TetrominoData, TetrominoPiece } from './TetrominoPiece';
const { ccclass, property } = _decorator;

const FAKE_DATA = [
    ["2,20,15|22,21,3|29,30,6"],["20,36,26|24,35,4|10,34,17"],["35,9,29|24,10,15|17,31,21"],["12,1,42|2,16,13|39,21,37"],
    ["30,41,9|34,33,28|38,22,16"],["34,17,28|32,16,3|38,7,23"],["5,22,3|24,37,12|27,23,19"],["5,4,39|35,14,10|1,31,41"],
    ["28,10,26|7,8,24|14,4,21"],["36,38,14|16,31,20|5,4,37"],["20,26,40|12,10,14|25,30,17"],["8,2,16|27,3,23|40,20,12"],
    ["41,14,34|30,20,3|4,13,19"],["12,16,17|32,11,41|6,36,10"],["2,12,29|42,39,30|28,33,6"],["17,33,11|24,22,26|4,1,13"],
    ["6,15,36|42,8,35|20,11,16"],["26,6,39|25,15,14|41,19,42"],["8,30,28|31,29,39|12,15,32"],["9,39,36|41,37,42|12,22,24"],
    ["30,40,20|8,12,22|18,39,23"],["34,33,11|12,7,40|23,16,10"],["7,21,37|9,27,18|17,40,25"],["6,24,13|14,7,1|31,2,17"],
    ["33,41,29|32,18,5|13,42,38"],["4,24,14|6,42,40|7,5,15"],["28,4,34|37,11,40|8,41,1"],["21,13,24|29,36,1|27,4,32"],
    ["12,24,9|25,20,18|3,26,38"],["23,11,5|18,31,32|27,19,21"],["11,37,19|15,33,36|4,18,6"],["30,29,8|25,40,19|1,31,14"],
    ["20,7,9|37,29,5|42,4,19"],["4,14,30|7,34,9|15,8,41"],["1,27,5|41,14,23|15,3,2"],["10,16,18|6,20,29|13,4,28"],
    ["34,23,21|26,8,5|16,13,4"],["21,12,9|8,22,20|33,2,1"],["13,2,1|42,17,8|3,39,37"],["40,28,2|34,42,32|19,18,26"]
];

@ccclass('TetrominoQueue')
export class TetrominoQueue extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: [TetrominoPiece] })
    public piece: TetrominoPiece[] = [];
    @property({group: { name: "Components", id: "1", displayOrder: 1 }, type:[SpriteFrame]})
    private spriteFrameList: SpriteFrame[] = [];
    @property({ group: { name: "Params", id: "1", displayOrder: 2 }, type: CCFloat })
    private desiredBoxWidth: number;
    @property({ group: { name: "Params", id: "1", displayOrder: 2 }, type: CCFloat })
    private desiredBoxHeight: number;

    public shouldBeRefreshed(){
        return this.piece.every(pie => pie.node.active == false);
    }

    public getActivePieces(){
        return this.piece.filter(pie => pie.node.active == true);
    }

    public initialize(cellSize: number){
        let ratio = this.desiredBoxHeight / this.desiredBoxWidth;
        let boxWidth = 1080;
        this.node.getComponent(UITransform).contentSize = new Size(boxWidth, ratio * boxWidth);
        this.piece.map(v => v.setSize(cellSize));
    }

    
    public refreshAllPieces()
    {
        
        let piecesToSet = [...PredefinedTetrominoPieces]
        for (let i = 0; i < this.piece.length; ++i)
        {
            this.refreshPiece(i, randomItem(piecesToSet));
        }
    }

    public refreshPiece(i: number, data: TetrominoData)
    {
        let piece = this.piece[i];
        piece.resetPosition();
        piece.randomizeSprite(randomItem(this.spriteFrameList));
        piece.setData(data);
        piece.node.active = true;
    }
}


