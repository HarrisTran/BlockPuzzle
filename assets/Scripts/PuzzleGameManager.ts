import { _decorator, Camera, Canvas, Component, Director, director, game, Node, NodePool, UITransform } from 'cc';
import { PuzzlePlayerControl } from './PuzzlePlayerControl';
import { PuzzleGrid } from './PuzzleGrid';
import { TetrominoQueue } from './TetrominoQueue';
const { ccclass, property } = _decorator;
enum PuzzleGameState
{
    NONE = 0,               // Invalid, begin state
    INIT,                   // Initialize things (board, controls, etc.)
    START_GAME,             // The game is started
    IN_GAME,                // In game
    PAUSE_GAME,             // The game is paused
    GAME_OVER,              // The game is over
    CONCLUDE_GAME           // The player concludes the game, by choosing restart or quit.
}
@ccclass('PuzzleGameManager')
export class PuzzleGameManager extends Component {
    private static _instance: PuzzleGameManager;

    public static get instance(): PuzzleGameManager
    {
        return this._instance;
    }

    @property(Canvas) public canvas: Canvas = null;
    @property(PuzzlePlayerControl) public playerControl: PuzzlePlayerControl = null;
    @property(PuzzleGrid) public puzzleGrid: PuzzleGrid = null;
    @property(TetrominoQueue) public tetrominoQueue: TetrominoQueue = null;

    private _state: PuzzleGameState;
    public camera : Camera;
    public pieceNodePool : NodePool;

    protected onLoad(): void {
        PuzzleGameManager._instance = this;
        this.camera = this.canvas.cameraComponent;
        this._state = PuzzleGameState.NONE;
    }

    protected start(): void {
        this.setState(PuzzleGameState.INIT);
    }

    public setState(newState: PuzzleGameState){
        if(this._state != newState){
            this._state = newState;
            console.log("Puzzle Game State requested switched to " + PuzzleGameState[newState]);
            if(newState == PuzzleGameState.INIT){
                this.puzzleGrid.calculateGridToFitScreenSize(this.canvas.node.getComponent(UITransform).width);
                this.pieceNodePool = new NodePool();
                this.playerControl.initialize();
                this.setState(PuzzleGameState.START_GAME);
            }
            else if(newState == PuzzleGameState.START_GAME){
                this.puzzleGrid.clear();
                this.puzzleGrid.activate();
                this.tetrominoQueue

            }
            else if(newState == PuzzleGameState.IN_GAME){

            }
            else if(newState == PuzzleGameState.PAUSE_GAME){

            }
            else if(newState == PuzzleGameState.GAME_OVER){

            }
            else if(newState == PuzzleGameState.CONCLUDE_GAME){
                
            }
        }
    }
}


