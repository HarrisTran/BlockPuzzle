import { _decorator, Camera, Canvas, Component, game, instantiate, JsonAsset, Animation, Label, Prefab, UITransform } from 'cc';
import { ControlMode, PuzzlePlayerControl } from './PuzzlePlayerControl';
import { PuzzleGrid } from './PuzzleGrid';
import { TetrominoQueue } from './TetrominoQueue';
import { PieceBlock } from './PieceBlock';
import { GameUI } from './UI/GameUI';
import { DataGameManager } from './DataGameManager';
import { AudioManager, ENUM_AUDIO_CLIP } from './AudioManager';
import P4PSDK from './SDK';
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

export enum GAME_EVENT {
    PLAY_STAR_EFFECT = "PlayStarEffect",
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

    @property({ group: { name: "Json Data", id: "1", displayOrder: 1 }, type: JsonAsset })
    public BlockDataJson: JsonAsset = null;
    @property({ group: { name: "Json Data", id: "1", displayOrder: 1 }, type: JsonAsset })
    public EndlessDataJson: JsonAsset = null;
    @property({ group: { name: "Json Data", id: "1", displayOrder: 1 }, type: JsonAsset })
    public ComboDataJson: JsonAsset = null;

    public dataSource: DataGameManager;
    private gameMode : GAME_MODE = GAME_MODE.ENDLESS;

    private _state: PuzzleGameState;
    private _score: number = 0;
    private _currentLevel : number = 0;

    public updateCurrentLevel(){
        this._currentLevel++;
    }

    public get currentLevel(){
        return this._currentLevel;
    }


    protected onLoad(): void {
        game.on(GAME_EVENT.PLAY_STAR_EFFECT,this.onPlayStarEffect.bind(this),this);
        this.dataSource = new DataGameManager(this.BlockDataJson,this.EndlessDataJson, this.ComboDataJson);
        PuzzleGameManager._instance = this;
        this._state = PuzzleGameState.NONE;
    }

    protected async start(): Promise<void> {
        this.setState(PuzzleGameState.INIT);
    }

    public getPieceBlock(){
        return instantiate(this.pieceBlock).getComponent(PieceBlock);
    }

    public async setState(newState: PuzzleGameState){
        if(this._state != newState){
            this._state = newState;
            this.gameUI.setStateUI(this._state);
            if(newState == PuzzleGameState.INIT){
                await P4PSDK.init();

                this.puzzleGrid.calculateGridToFitScreenSize(this.canvas.node.getComponent(UITransform).width);
                this.tetrominoQueue.initialize(this.puzzleGrid.cellPixelSize);
                this.playerControl.initialize();
            }
            else if(newState == PuzzleGameState.START_GAME){
                await P4PSDK.startGame();

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
            P4PSDK.updateScore(this._score);
            this.gameUI.setScore(Math.floor(this._score));
        }
    }

    confirmGameEnd(){
        this.playerControl.setControlMode(ControlMode.DISABLED);
        AudioManager.instance.playSfx(ENUM_AUDIO_CLIP.END_GAME);
        this.setState(PuzzleGameState.CONCLUDE_GAME);
    }

    onClickEndlessMode() {
        this.gameMode = GAME_MODE.ENDLESS;
        this.gameUI.setMode(this.gameMode);
        this.setState(PuzzleGameState.START_GAME);
    }

    onClickTimeMode() {
        this.gameMode = GAME_MODE.TIME;
        this.gameUI.setMode(this.gameMode);
        this.setState(PuzzleGameState.START_GAME);
    }

    onPlayStarEffect(data: any){
        let {position, progress} = data;
        this.gameUI.playStarEffect(position);
        this.gameUI.updateTaskProgress(progress);
    }

    public taskProgressReachedToMax(){
        let value = PuzzleGameManager.instance.dataSource.getRewardScoreCurrentStep();
        this.addScore(value);
        this.gameUI.scoreFloatingUp.getComponent(Label).string = `${value}`;
        this.gameUI.scoreFloatingUp.getComponent(Animation).play();
    }

}


