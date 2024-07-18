import { _decorator, Component, EventTouch, Node, Size, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { PuzzleGameManager } from './PuzzleGameManager';
import { PieceBlock } from './PieceBlock';
import { TetrominoPlayerInteractable } from './TetrominoPlayerInteractable';
const { ccclass, property } = _decorator;

export class TetrominoData {
    id: string;
    grid: {
        size: [number, number];
        data: number[];
    }[];
    selected: number;

    public static getSize(data: TetrominoData): [number, number] {
        return data.grid[data.selected].size;
    }

    public static getData(data: TetrominoData): number[] {
        return data.grid[data.selected].data;
    }

    public static clone(data: TetrominoData) {
        return Object.assign({}, data);
    }

    public static getAllRotations(data: TetrominoData): TetrominoData[] {
        return data.grid.map((v, i, a) => {
            let clone = TetrominoData.clone(data);
            clone.selected = i;
            return clone;
        });
    }
}

@ccclass('TetrominoPiece')
export class TetrominoPiece extends Component {



    @property(UITransform)
    private appearance: UITransform;
    @property(Node)
    private gridPivot: Node;
    @property(Node)
    private previewHost: Node;
    @property(Node)
    private blockHost: Node;
    @property(TetrominoPlayerInteractable)
    private interactable: TetrominoPlayerInteractable;

    private _data: TetrominoData;
    private _cellSize: Vec2 = new Vec2();
    private _previewBlocks: Node[];
    private _allBlocks: PieceBlock[];
    private _blockMap: Map<number, PieceBlock>;

    protected onLoad(): void {
        this._allBlocks = [];
        this._blockMap = new Map<number, PieceBlock>;

        this._previewBlocks = [];
        for (let child of this.previewHost.children) {
            this._previewBlocks.push(child);
        }
        this.previewHost.active = false;
    }

    public onMoveStart(event: EventTouch): void {
        this.node.worldScale = Vec3.ONE;

        let screenPos = event.getLocation();
        let pos = PuzzleGameManager.instance.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y));
        this.appearance.node.position = v3(0);
        this.node.worldPosition = pos;
    }

    public onMove(event: EventTouch): void {
        let screenPos = event.getLocation();
        let pos = PuzzleGameManager.instance.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y));
        this.node.worldPosition = pos;

        // Show preview
        let cell = PuzzleGameManager.instance.puzzleGrid.getCellThatContainsInGrid(this.gridPivot.getWorldPosition());
        if (cell !== null && PuzzleGameManager.instance.puzzleGrid.checkCanAttachPieceAtCell(this, cell))
        {
            this.previewHost.active = true;
            this.previewHost.setWorldPosition(cell.node.getWorldPosition());
        }
        else
        {
            this.previewHost.active = false;
            this.previewHost.position = this.gridPivot.position;
        }
    }



    public onMoveEnd(event: EventTouch): void {
        let cell = PuzzleGameManager.instance.puzzleGrid.getCellThatContainsInGrid(this.gridPivot.getWorldPosition());
        if (cell !== null)
        {
            let {attached,clearedLine} = PuzzleGameManager.instance.puzzleGrid.attachBlocksFromPiece(this, cell);
            if (attached)
            {
                this.node.active = false;
                // if (clearedLine)
                // {
                //     console.warn("called with timeout");
                //     setTimeout(() => PuzzleGameManager.instance.onPlayerPlayedAPiece(), PuzzleGameManager.instance.lineClearAnimTime * 1000);
                // }
                // else
                // {
                //     console.warn("called");
                //     PuzzleGameManager.instance.onPlayerPlayedAPiece();
                // }
            }
        }
        else
        {

        }

        this.node.position = Vec3.ZERO;
        this.appearance.node.position = Vec3.ZERO;
        this.node.scale = Vec3.ONE;


    }

    setData(data: TetrominoData) {
        this._data = data;
        this.resize();
        this.refreshPieceBlocks();
        this.refreshPreviews();
    }

    public toIndex(x: number, y: number)
    {
        return x + TetrominoData.getSize(this._data)[0] * y;
    }

    private refreshPieceBlocks()
    {
        //let count = 0;
        console.log("========");
        this._blockMap = new Map<number, PieceBlock>();
        for (let y = 0; y < TetrominoData.getSize(this._data)[1]; ++y)
        {
            for (let x = 0; x < TetrominoData.getSize(this._data)[0]; ++x)
            {
                let i = this.toIndex(x, y);
                if (TetrominoData.getData(this._data)[i] === 0)
                {
                    continue;
                }

                this._allBlocks.push(PuzzleGameManager.instance.getPieceBlock());

                let block = this._allBlocks[this._allBlocks.length-1];
                block.node.getComponent(PieceBlock).holder = this.node;
                block.node.parent = this.blockHost;
                console.log("{"+x,y+"}");
                
                block.node.position = this.getPositionOfCoord(x, y);
                this._blockMap.set(i, block);
                block.node.active = true;

                // ++count;
            }
        }
        console.log("========");

        // for (let i = count; i < this._allBlocks.length; ++i)
        // {
        //     this._allBlocks[i].node.active = false;
        // }
    }

    private refreshPreviews()
    {
        this.previewHost.position = this.gridPivot.position;
        for (let i = 0; i < this._previewBlocks.length; ++i)
        {
            let previewBlock = this._previewBlocks[i];
            if (i < this._allBlocks.length)
            {
                previewBlock.active = this._allBlocks[i] && this._allBlocks[i].node.active;
                previewBlock.worldPosition = this._allBlocks[i].node.worldPosition;
                previewBlock.getComponent(Sprite).spriteFrame = this._allBlocks[i].spriteFrame;
            }
            else
            {
                previewBlock.active = false;
            }
        }

        this.previewHost.active = false;
    }

    private getNewPieceBlock(): PieceBlock {
        return PuzzleGameManager.instance.getPieceBlock();
    }

    private getPositionOfCoord(x: number, y: number): Vec3
    {
        return new Vec3(this._cellSize.x * x + this.gridPivot.position.x, this.gridPivot.position.y - this._cellSize.y * y, this.gridPivot.position.z);
    }

    resize() {
        let transform = this.getComponent(UITransform);
        let tx = TetrominoData.getSize(this._data)[0] - 1;
        let ty = TetrominoData.getSize(this._data)[1] - 1;
        transform.contentSize = new Size(this._cellSize.x * 5, this._cellSize.y * 5);
        this.appearance.contentSize = new Size(this._cellSize.x * 5, this._cellSize.y * 5);

        this.gridPivot.position = new Vec3(-this._cellSize.x * tx / 2, this._cellSize.y * ty / 2);
        this.previewHost.position = this.gridPivot.position;
    }

    setSize(cellSize: number): void {
        this._cellSize = new Vec2(cellSize, cellSize);
        for (let previewBlock of this._previewBlocks) {
            previewBlock.getComponent(UITransform).contentSize = new Size(cellSize, cellSize);
        }
    }

    public resetPosition() {
        this.node.position = Vec3.ZERO;
        this.node.scale = Vec3.ONE;
    }

    public convertToIndex(x: number, y: number) {
        return x + TetrominoData.getSize(this._data)[0] * y;
    }

    public convertToCoordinate(index: number): { x: number, y: number } {
        return {
            x: index % TetrominoData.getSize(this._data)[0],
            y: Math.floor(index / TetrominoData.getSize(this._data)[0])
        }
    }
}


