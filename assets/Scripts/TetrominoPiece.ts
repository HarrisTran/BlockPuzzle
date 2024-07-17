import { _decorator, Component, EventTouch, Node, Size, UITransform, v3, Vec2, Vec3 } from 'cc';
import { PuzzleGameManager } from './PuzzleGameManager';
import { PieceBlock } from './PieceBlock';
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
    private previewHost: Node;

    private _data: TetrominoData;
    private _cellSize: Vec2 = new Vec2();
    private _previewBlocks: Node[];
    private _allBlocks: PieceBlock[];
    private _blockMap: Map<number, PieceBlock>;

    protected onLoad(): void {
        this._allBlocks = [];
        this._blockMap = new Map<number, PieceBlock>;

        this._previewBlocks = [];
        for (let child of this.previewHost.children)
        {
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
        // let screenPos = event.getLocation();
        // let pos = PuzzleGameManager.instance.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y));
        // this.node.worldPosition = pos;

        // // Show preview
        // //let cell = this.raycastToGridCell();
        // if (cell !== null /*&& PuzzleGameManager.instance.checkCanAttachPieceAtCell(this, cell)*/)
        // {
        //     this.previewHost.active = true;
        //     this.previewHost.worldPosition = new Vec3(cell.node.worldPosition.x, cell.node.worldPosition.y, this.previewHost.worldPosition.z);
        // }
        // // else
        // // {
        // //     this.previewHost.active = false;
        // //     this.previewHost.position = this.gridPivot.position;
        // // }
    }



    public onMoveEnd(event: EventTouch): void {
        // let cell = this.raycastToGridCell();
        // if (cell !== null)
        // {
        //     let [attached, clearedLine] = PuzzleGameManager.instance.puzzleGrid.attachBlocksFromPiece(this, cell);
        //     if (attached)
        //     {
        //         this.pieceActive = false;
        //         if (clearedLine)
        //         {
        //             console.warn("called with timeout");
        //             setTimeout(() => PuzzleGameManager.instance.onPlayerPlayedAPiece(), PuzzleGameManager.instance.lineClearAnimTime * 1000);
        //         }
        //         else
        //         {
        //             console.warn("called");
        //             PuzzleGameManager.instance.onPlayerPlayedAPiece();
        //         }

        //     }
        // }
        // else
        // {

        // }

        // this.node.position = Vec3.ZERO;
        // this.appearance.node.position = Vec3.ZERO;
        // this.node.scale = Vec3.ONE;

    }

    setData(data: TetrominoData) {
        this._data = data;
        this.resize();
        this.refreshPieceBlocks();
        this.refreshPreviews();

    }
    
    setSize(cellSize: number): any {
        this._cellSize = new Vec2(cellSize, cellSize);
        for (let previewBlock of this._previewBlocks) {
            previewBlock.getComponent(UITransform).contentSize = new Size(cellSize, cellSize);
        }
    }

    public resetPosition() {
        this.node.position = Vec3.ZERO;
        this.node.scale = Vec3.ONE;
    }
}


