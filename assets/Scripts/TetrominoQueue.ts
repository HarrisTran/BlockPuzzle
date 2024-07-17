import { _decorator, Component, Node } from 'cc';
import { PredefinedTetrominoPieces } from './TetrominoDefinedData';
import { TetrominoData, TetrominoPiece } from './TetrominoPiece';
const { ccclass, property } = _decorator;

@ccclass('TetrominoQueue')
export class TetrominoQueue extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: [Node] })
    private pieceNodes: Node[] = [];

    private _pieces: TetrominoPiece[];

    protected onLoad(): void {
        this._pieces = this.pieceNodes.map(v => {
            return v.getComponent(TetrominoPiece);
        });
    }

    public initialize(cellSize: number){
        this._pieces.map(v => v.setSize(cellSize));
    }

    public refreshAllPieces()
    {
        let piecesToSet = [...PredefinedTetrominoPieces.values()]
       
        for (let i = 0; i < this.pieceNodes.length; ++i)
        {
            this.refreshPiece(i, piecesToSet[i]);
        }
    }

    public refreshPiece(i: number, data: TetrominoData)
    {
        let piece = this._pieces[i];
        piece.resetPosition();
        piece.setData(data);
    }
}


