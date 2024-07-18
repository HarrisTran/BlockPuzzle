import { _decorator, CCFloat, CCInteger, Component, Layout, Node, Rect, Size, Vec2, Vec3 } from 'cc';
import { PieceBlock } from './PieceBlock';
import { PuzzleGridCell } from './PuzzleGridCell';
import { Bound, getWorldBound, isBetween, mergeBounds} from './Utilities';
import { TetrominoPiece } from './TetrominoPiece';
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
    private _cellPixelSize: number;

    private _cellCountPerRow: number[];
    private _cellCountPerColumn: number[];
    private _boundLimit: Bound;

    public set cellPixelSize(value: number) {
        this._cellPixelSize = value;
    }

    public get cellPixelSize() : number {
        return this._cellPixelSize;
    }

    public calculateGridToFitScreenSize(screenSize: number) {
        let minimumGridSize = Math.min(this.desiredPixelSize, screenSize - 50 * 2);
        let cellSize = Math.floor(minimumGridSize/this.gridSize);
        this.cellHost.cellSize = new Size(cellSize,cellSize);
        this._cellPixelSize = cellSize;
    }

    public clear(){
        // for (let i = 0; i < this._allBlocks.length; ++i)
        //     {
        //         if (this._allBlocks[i] !== null)
        //         {
        //             this._allBlocks[i].returnToPool();
        //         }
        //     }
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
            this._cellCountPerRow[i] = this._cellCountPerColumn[i] = 0;
        }
        this.doMergeBound();
    }

    private doMergeBound(){
        let firstCell = this._allCells[0];
        let lastCell = this._allCells[this._allCells.length - 1];
        this._boundLimit = mergeBounds(getWorldBound(firstCell.node),getWorldBound(lastCell.node));
    }

    public getCellThatContainsInGrid(worldPosition: Vec3) : PuzzleGridCell {
       
        if (isBetween(worldPosition.x, this._boundLimit.xMin, this._boundLimit.xMax) &&
            isBetween(worldPosition.y, this._boundLimit.yMin, this._boundLimit.yMax))
        {
            let deltaX = worldPosition.x - this._boundLimit.xMin;
            let deltaY = this._boundLimit.yMax - worldPosition.y;

            let px = Math.floor(deltaX / this._cellPixelSize);
            let py = Math.floor(deltaY / this._cellPixelSize);

            return this._allCells[this.convertToIndex(px, py)];
        }

        return null;
    }

    attachBlocksFromPiece(piece: TetrominoPiece, cell: PuzzleGridCell): {attached: boolean,clearedLine: boolean} {
        let index = this.findIndex(cell);
        if (index < 0) return {attached: false, clearedLine : false};
        let {x,y} = this.toCoord(index);

        if (true)
        {
            return {attached: false, clearedLine : false};
        }

        // let setIndexes = [];
        // let count = 0;
        // for (let [key, block] of piece.blockMap)
        // {
        //     let [iX, iY] = piece.toCoord(key);

        //     let pX = oX + iX;
        //     let pY = oY + iY;
        //     this.attachBlock(block, pX, pY);

        //     setIndexes.push(this.toIndex(pX, pY));

        //     ++count;
        // }

        // piece.cleanDataAndBlocks();

        // PuzzleGameManager.instance.onBlockSet(count);
        // let clear = this.examineGridForClear(setIndexes);


        // return [true, clear];
    }

    public checkCanAttachPieceAtCell(piece: TetrominoPiece, cell: PuzzleGridCell) : boolean {
        return this.checkCanAttachPieceAt(piece,this.toCoord(this.findIndex(cell)))
    }

    public checkCanAttachPieceAt(piece : TetrominoPiece, coord: {x: number, y: number}) : boolean {
        console.log(piece);
        
        return true;
    }

    private findIndex(cell: PuzzleGridCell): number
    {
        return this._allCells.findIndex((c) => c === cell);
    }

    public convertToIndex(x: number, y: number)
    {
        return x + this.gridSize * y;
    }

    public toCoord(index: number): {x: number, y: number}
    {
        return {x: index % this.gridSize, y: Math.floor(index / this.gridSize)};
    }

    protected onLoad(): void {

    }
}

