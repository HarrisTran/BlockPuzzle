import { _decorator, CCFloat, Component, Node, Size, SpriteFrame, UITransform } from 'cc';
import randomItem from 'random-item';
import { TetrominoData, TetrominoPiece } from './TetrominoPiece';
import { PuzzleGameManager, PuzzleGameState } from './PuzzleGameManager';
import { delay } from './Utilities';
const { ccclass, property } = _decorator;


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

    
    public async refreshAllPieces()
    {
        let piecesToSet = PuzzleGameManager.instance.dataSource.getNextEndlessData()
        console.log(piecesToSet);
        
        for (let i = 0; i < this.piece.length; ++i)
        {
            this.refreshPiece(i, PuzzleGameManager.instance.dataSource.PredefinedTetrominoPieces[piecesToSet[i]]);
        }
        if (!PuzzleGameManager.instance.checkGridCanStillPlay()) {
            await delay(2);
            PuzzleGameManager.instance.setState(PuzzleGameState.GAME_OVER)
        };
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


