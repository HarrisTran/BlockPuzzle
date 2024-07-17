import { _decorator, CCFloat, CCInteger, Component, Layout, Node, Size } from 'cc';
import { PieceBlock } from './PieceBlock';
import { PuzzleGridCell } from './PuzzleGridCell';
const { ccclass, property } = _decorator;

@ccclass('PuzzleGrid')
export class PuzzleGrid extends Component {
    @property({ group: { name: "Components", id: "1", displayOrder: 1 }, type: Layout })
    private cellHost: Layout = null;

    @property({ group: { name: "Params" }, type: CCFloat })
    private gridSize: number;
    @property({ group: { name: "Params" }, type: CCFloat })
    private desiredPixelSize: number;

    private _allBlocks: PieceBlock[];
    private _allCells: PuzzleGridCell[];

    private _cellCountPerRow: number[];
    private _cellCountPerColumn: number[];

    public calculateGridToFitScreenSize(screenSize: number) {
        let minimumGridSize = Math.min(this.desiredPixelSize, screenSize - 50 * 2);
        let cellSize = Math.floor(minimumGridSize/this.gridSize);
        this.cellHost.cellSize = new Size(cellSize,cellSize);
    }

    public clear(){
        for (let i = 0; i < this._allBlocks.length; ++i)
            {
                if (this._allBlocks[i] !== null)
                {
                    this._allBlocks[i].returnToPool();
                }
            }
    }

    public activate()
    {
        this._allCells = new Array<PuzzleGridCell>(this.gridSize**2);
        this.cellHost.node.children.forEach((child, i) =>
        {
            let cell = child.getComponent(PuzzleGridCell);
            this._allCells[i] = cell;
            this._allCells[i].gridIndex = i
        });

        this._allBlocks = new Array<PieceBlock>(this.gridSize**2);
        this._cellCountPerRow = new Array<number>(this.gridSize);
        this._cellCountPerColumn = new Array<number>(this.gridSize);
        for (let i = 0; i < this.gridSize; ++i)
        {
            this._cellCountPerRow[i] = this._cellCountPerColumn[i] = 0;  // Just to be safe
        }
    }

    protected onLoad(): void {

    }
}


