import { _decorator, CCFloat,Component, Layout, Size,Vec3 } from 'cc';
import { PieceBlock } from './PieceBlock';
import { PuzzleGridCell } from './PuzzleGridCell';
import { Bound, getWorldBound, isBetween, mergeBounds } from './Utilities';
import { TetrominoPiece } from './TetrominoPiece';
import { PuzzleGameManager } from './PuzzleGameManager';
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
    private _gridPixelSize: number;

    private _cellCountPerRow: number[];
    private _cellCountPerColumn: number[];
    private _boundLimit: Bound;

    public set cellPixelSize(value: number) {
        this._cellPixelSize = value;
    }

    public get cellPixelSize(): number {
        return this._cellPixelSize;
    }

    public set gridPixelSize(value: number){
        this._gridPixelSize = value;
    }

    public get gridPixelSize(){
        return this._gridPixelSize;
    }

    public calculateGridToFitScreenSize(screenSize: number) {
        let minimumGridSize = Math.min(this.desiredPixelSize, screenSize - 50 * 2);
        let cellSize = Math.floor(minimumGridSize / this.gridSize);
        this.cellHost.cellSize = new Size(cellSize, cellSize);
        this._cellPixelSize = cellSize;
        this._gridPixelSize = minimumGridSize;
    }


    public activate() {
        this._allCells = new Array<PuzzleGridCell>(this.gridSize ** 2);
        this.cellHost.node.children.forEach((child, i) => {
            let cell = child.getComponent(PuzzleGridCell);
            this._allCells[i] = cell;
            this._allCells[i].gridIndex = i
        });

        this._allBlocks = new Array<PieceBlock>(this.gridSize ** 2);
        this._cellCountPerRow = new Array<number>(this.gridSize);
        this._cellCountPerColumn = new Array<number>(this.gridSize);
        for (let i = 0; i < this.gridSize; ++i) {
            this._cellCountPerRow[i] = this._cellCountPerColumn[i] = 0;
        }
        this.doMergeBound();
    }

    private doMergeBound() {
        let firstCell = this._allCells[0];
        let lastCell = this._allCells[this._allCells.length - 1];
        this._boundLimit = mergeBounds(getWorldBound(firstCell.node), getWorldBound(lastCell.node));
    }

    public getCellThatContainsInGrid(worldPosition: Vec3): PuzzleGridCell {
        if (isBetween(worldPosition.x, this._boundLimit.xMin, this._boundLimit.xMax) &&
            isBetween(worldPosition.y, this._boundLimit.yMin, this._boundLimit.yMax)) {
            let deltaX = worldPosition.x - this._boundLimit.xMin;
            let deltaY = this._boundLimit.yMax - worldPosition.y;

            return this._allCells[this.convertToIndex(Math.floor(deltaX / this._cellPixelSize), Math.floor(deltaY / this._cellPixelSize))];
        }

        return null;
    }

    attachBlocksFromPiece(piece: TetrominoPiece, cell: PuzzleGridCell): { attached: boolean, clearedLine: boolean } {
        let index = this.findIndex(cell);
        if (index < 0) return { attached: false, clearedLine: false };
        let { x, y } = this.toCoord(index);
        if (!this.checkCanAttachPieceAtCell(piece, cell)) {
            return { attached: false, clearedLine: false };
        }
        for (let [key, block] of piece.blockMap) {
            let coord = piece.convertToCoordinate(key);
            let pX = x + coord.x;
            let pY = y + coord.y;
            this.attachBlock(block, pX, pY);
        }

        piece.cleanDataAndBlocks();

        //PuzzleGameManager.instance.onBlockSet(count);
        let clear = this.examineGridForClear();

        return { attached: true, clearedLine: clear };
    }

    examineGridForClear(): boolean {
        let blockBroke = new Set<number>();
        // let columnBroke : number[] = [];
        // let rowBroke : number[] = [];

        for(let i = 0; i < this.gridSize; ++i){
            if(this._cellCountPerRow[i] == this.gridSize){
                for(let j = 0; j < this.gridSize; ++j){
                    let index = this.convertToIndex(0,i) + j;
                    blockBroke.add(index);
                }
            }
            if(this._cellCountPerColumn[i] == this.gridSize){
                for(let j = 0; j < this.gridSize; ++j){
                    let index = this.convertToIndex(i, 0) + j * this.gridSize;
                    blockBroke.add(index);
                }
            }
        }

        if(blockBroke.size == 0) return false;

        PuzzleGameManager.instance.addScore(blockBroke.size);

        for (let i of blockBroke){
            let pos = this.toCoord(i);
            this.removeBlock(pos.x, pos.y);
        }

        return false;
    }

    private removeBlock(x: number, y: number){
        let index = this.convertToIndex(x,y);
        let block = this._allBlocks[index];

        block.holder = null;
        block.returnToPool();
        this._allBlocks[index] = null;
        this._allCells[index].attachedBlock = null;
        this._cellCountPerColumn[x]--;
        this._cellCountPerRow[y]--;
    }
    
    private checkCanAttachPieceAt(piece: TetrominoPiece, pos: { x: number, y: number }): boolean {
        for (let [key, block] of piece.blockMap) {
            let coord = piece.convertToCoordinate(key);
            let index = this.convertToIndex(pos.x + coord.x, pos.y + coord.y);
            if (pos.x + coord.x >= this.gridSize || pos.y + coord.y >= this.gridSize || this._allBlocks[index] != null) {
                return false;
            }
        }
        return true;
    }

    private attachBlock(block: PieceBlock, x: number, y: number) {
        let index = this.convertToIndex(x, y);
        let cell = this._allCells[index];
        block.holder = this.node;
        block.node.setParent(cell.node);
        block.node.setPosition(Vec3.ZERO);
        this._allBlocks[index] = block;
        this._allCells[index].attachedBlock = block;

        this._cellCountPerRow[y]++;
        this._cellCountPerColumn[x]++;
    }

    public checkCanAttachPieceAtCell(piece: TetrominoPiece, cell: PuzzleGridCell): boolean {
        return this.checkCanAttachPieceAt(piece, this.toCoord(this.findIndex(cell)))
    }

    public checkCanAttachPieceInGrid(piece: TetrominoPiece): boolean {
        return this._allCells.some(cell => this.checkCanAttachPieceAtCell(piece, cell))
    }

    private findIndex(cell: PuzzleGridCell): number {
        return this._allCells.findIndex((c) => c === cell);
    }

    public convertToIndex(x: number, y: number) {
        return x + this.gridSize * y;
    }

    public toCoord(index: number): { x: number, y: number } {
        return { x: index % this.gridSize, y: Math.floor(index / this.gridSize) };
    }

    public checkValidCoord(x: number, y: number): boolean {
        return (0 <= x && x < this.gridSize) && (0 <= y && y < this.gridSize);
    }
}

