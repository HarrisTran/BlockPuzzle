import { _decorator, Color, Component, Node, Sprite } from 'cc';
import { PieceBlock } from './PieceBlock';
const { ccclass, property } = _decorator;

@ccclass('PuzzleGridCell')
export class PuzzleGridCell extends Component {
    public gridIndex: number;
    public attachedBlock: PieceBlock;

    public debugColorize()
    {
        this.getComponentInChildren(Sprite).color = Color.RED;
    }
}


