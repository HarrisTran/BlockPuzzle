import { _decorator, Component, Node } from 'cc';
import { PieceBlock } from './PieceBlock';
const { ccclass, property } = _decorator;

@ccclass('PuzzleGridCell')
export class PuzzleGridCell extends Component {
    public gridIndex: number;
    public attachedBlock: PieceBlock;
}


