import { _decorator, Camera, Canvas, Component, game, instantiate, JsonAsset, Prefab, UITransform } from 'cc';
import { ControlMode, PuzzlePlayerControl } from './PuzzlePlayerControl';
import { PuzzleGrid } from './PuzzleGrid';
import { TetrominoQueue } from './TetrominoQueue';
import { PieceBlock } from './PieceBlock';
import { GameUI } from './UI/GameUI';
import { DataGameManager } from './DataGameManager';
import { AudioManager, ENUM_AUDIO_CLIP } from './AudioManager';
const { ccclass, property } = _decorator;
export enum PuzzleGameState
{
    NONE = 0,               // Invalid, begin state
    INIT,                   // Initialize things (board, controls, etc.)
    START_GAME,             // The game is started
    IN_GAME,                // In game
    PAUSE_GAME,             // The game is paused
    GAME_OVER,              // The game is over
    CONCLUDE_GAME           // The player concludes the game, by choosing restart or quit.
}

export enum GAME_MODE {
    ENDLESS,
    TIME,
}

@ccclass('PuzzleGameManager')
export class PuzzleGameManager extends Component {
    private static _instance: PuzzleGameManager;

    public static get instance(): PuzzleGameManager
    {
        return this._instance;
    }

    @property(Canvas) public canvas: Canvas = null;
    @property(Camera) public camera: Camera = null;
    @property(PuzzlePlayerControl) public playerControl: PuzzlePlayerControl = null;
    @property(GameUI) public gameUI: GameUI = null;
    @property(PuzzleGrid) public puzzleGrid: PuzzleGrid = null;
    @property(TetrominoQueue) public tetrominoQueue: TetrominoQueue = null;
    @property(Prefab) public pieceBlock: Prefab = null;
    @property(JsonAsset) public BlockDataJson: JsonAsset = null;
    @property(JsonAsset) public EndlessDataJson: JsonAsset = null;

    public dataSource: DataGameManager;
    public gameMode : GAME_MODE = GAME_MODE.ENDLESS;

    private _state: PuzzleGameState;
    private _score: number = 0;
    private _currentLevel : number = 0;

    public updateCurrentLevel(){
        this._currentLevel++;
    }

    public get currentLevel(){
        return this._currentLevel;
    }

    // public pieceNodePool : NodePool;

    protected onLoad(): void {
        this.dataSource = new DataGameManager(this.BlockDataJson,this.EndlessDataJson);
        PuzzleGameManager._instance = this;
        this._state = PuzzleGameState.NONE;
    }

    protected start(): void {
        this.setState(PuzzleGameState.INIT);
    }

    public getPieceBlock(){
        return instantiate(this.pieceBlock).getComponent(PieceBlock);
    }

    public setState(newState: PuzzleGameState){
        if(this._state != newState){
            this._state = newState;
            console.log("Puzzle Game State requested switched to " + PuzzleGameState[newState]);
            if(newState == PuzzleGameState.INIT){
                this.puzzleGrid.calculateGridToFitScreenSize(this.canvas.node.getComponent(UITransform).width);
                // this.pieceNodePool = new NodePool();
                this.tetrominoQueue.initialize(this.puzzleGrid.cellPixelSize);
                this.playerControl.initialize();
                this.setState(PuzzleGameState.START_GAME);
            }
            else if(newState == PuzzleGameState.START_GAME){
                AudioManager.instance.playBGM();
                this.puzzleGrid.activate();
                this.tetrominoQueue.refreshAllPieces();
                this.setState(PuzzleGameState.IN_GAME);
            }
            else if(newState == PuzzleGameState.IN_GAME){
                this.playerControl.setControlMode(ControlMode.NORMAL);
            }
            else if(newState == PuzzleGameState.PAUSE_GAME){

            }
            else if(newState == PuzzleGameState.GAME_OVER){
                this.confirmGameEnd();
            }
            else if(newState == PuzzleGameState.CONCLUDE_GAME){
                this.gameUI.showGameOverPanel();                
            }
        }
    }

    onPlayerPlayedAPiece() {
        if (this.tetrominoQueue.shouldBeRefreshed()) {
            setTimeout(() => this.tetrominoQueue.refreshAllPieces(), 200);
        }
        else {
            if (!this.checkGridCanStillPlay()) {
                //await delay(2);
                this.setState(PuzzleGameState.GAME_OVER)
            };
        }
    }

    checkGridCanStillPlay() {
        for(let pie of PuzzleGameManager.instance.tetrominoQueue.getActivePieces()){
            let check = PuzzleGameManager.instance.puzzleGrid.checkCanAttachPieceInGrid(pie);
            if(check) return true;
        }
        return false;
    }

    addScore(value: number) {
        if(this._state == PuzzleGameState.IN_GAME){
            AudioManager.instance.playSfx(ENUM_AUDIO_CLIP.SCORE);
            this._score += value;
            this.gameUI.setScore(Math.floor(this._score));
        }
    }

    confirmGameEnd(){
        this.playerControl.setControlMode(ControlMode.DISABLED);
        AudioManager.instance.playSfx(ENUM_AUDIO_CLIP.END_GAME);
        this.setState(PuzzleGameState.CONCLUDE_GAME);
    }

}


