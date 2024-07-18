import { _decorator, Component, Node } from 'cc';
import { PredefinedTetrominoPieces } from './TetrominoDefinedData';
import { TetrominoData, TetrominoPiece } from './TetrominoPiece';
const { ccclass, property } = _decorator;

@ccclass('TetrominoQueue')
export class TetrominoQueue extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: [TetrominoPiece] })
    private piece: TetrominoPiece[] = [];


    protected onLoad(): void {
    }


    public initialize(cellSize: number){
        this.piece.map(v => v.setSize(cellSize));
    }

    public refreshAllPieces()
    {
        let piecesToSet = [...PredefinedTetrominoPieces.values()]
       
        for (let i = 0; i < this.piece.length; ++i)
        {
            this.refreshPiece(i, piecesToSet[i+6]);
        }
    }

    public refreshPiece(i: number, data: TetrominoData)
    {
        let piece = this.piece[i];
        piece.resetPosition();
        piece.setData(data);
        piece.node.active = true;
    }
}


