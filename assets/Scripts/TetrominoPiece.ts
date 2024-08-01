import { _decorator, Component, EventTouch, Node, Size, Sprite, SpriteFrame, UITransform, v3, Vec2, Vec3 } from 'cc';
import { PuzzleGameManager } from './PuzzleGameManager';
import { EPieceBlockType, PieceBlock } from './PieceBlock';
import { AudioManager, ENUM_AUDIO_CLIP } from './AudioManager';
const { ccclass, property } = _decorator;

export class TetrominoData {
    id: string;
    grid: {
        size: [number, number];
        data: number[];
    };

    public static getSize(data: TetrominoData): [number, number] {
        return data.grid.size;
    }

    public static getData(data: TetrominoData): number[] {
        return data.grid.data;
    }

    public static clone(data: TetrominoData) {
        return Object.assign({}, data);
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
    

    private _data: TetrominoData;
    private _representation: SpriteFrame;
    private _cellSize: Vec2 = new Vec2();
    private _previewBlocks: Node[];
    private _allBlocks: PieceBlock[];
    public blockMap: Map<number, PieceBlock>;

    protected onLoad(): void {
        this._allBlocks = [];
        this.blockMap = new Map<number, PieceBlock>;

        this._previewBlocks = [];
        for (let child of this.previewHost.children) {
            this._previewBlocks.push(child);
        }
        this.previewHost.active = false;
    }

    public onMoveStart(event: EventTouch): void {
        AudioManager.instance.playSfx(ENUM_AUDIO_CLIP.PICK_UP)
        this.node.worldScale = Vec3.ONE;

        let screenPos = event.getUILocation();
        //let pos = PuzzleGameManager.instance.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y));
        let pos = v3(screenPos.x,screenPos.y, 0)
        this.appearance.node.position = v3(0,this._cellSize.y * 2, 0);
        this.node.worldPosition = pos;
    }

    public onMove(event: EventTouch): void {
        let screenPos = event.getUILocation();
        //let pos = PuzzleGameManager.instance.camera.screenToWorld(new Vec3(screenPos.x, screenPos.y));
        let pos = v3(screenPos.x,screenPos.y, 0)
        this.node.worldPosition = pos;

        // Show preview
        let cell = PuzzleGameManager.instance.puzzleGrid.getCellThatContainsInGrid(this.gridPivot.getWorldPosition());
        
        if (cell && PuzzleGameManager.instance.puzzleGrid.checkCanAttachPieceAtCell(this, cell))
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
                AudioManager.instance.playSfx(ENUM_AUDIO_CLIP.PUT_DOWN);
                this.node.active = false;
                PuzzleGameManager.instance.onPlayerPlayedAPiece();
            }
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

    setSprite(sprite: SpriteFrame) {
        this._representation = sprite;
    }

    private refreshPieceBlocks()
    {
        this.blockMap = new Map<number, PieceBlock>();
        
        for (let y = 0; y < TetrominoData.getSize(this._data)[1]; ++y)
        {
            for (let x = 0; x < TetrominoData.getSize(this._data)[0]; ++x)
            {
                let i = this.convertToIndex(x, y);
                if (TetrominoData.getData(this._data)[i] == 0)
                {
                    continue;
                }

                this._allBlocks.push(PuzzleGameManager.instance.getPieceBlock());

                let block = this._allBlocks[this._allBlocks.length-1];
                block.sprite.spriteFrame = this._representation;
                block.type = TetrominoData.getData(this._data)[i];
                block.holder = this.node;
                block.node.parent = this.blockHost;
                
                block.node.position = this.getPositionOfCoord(x, y);
                this.blockMap.set(i, block);
                block.node.active = true;
            }
        }

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
                previewBlock.getComponent(Sprite).spriteFrame = this._representation;
            }
            else
            {
                previewBlock.active = false;
            }
        }

        this.previewHost.active = false;
    }


    cleanDataAndBlocks() {
        this._allBlocks = [];
        this.blockMap.clear();
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


