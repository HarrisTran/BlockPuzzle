import { _decorator, Animation, Component, director, Graphics, instantiate, Label, Node, Prefab, ProgressBar, Sprite, tween, Vec3, Widget } from 'cc';
import { bezierTangent, delay, randomControlPoints } from '../Utilities';
import { GameOverPanel } from './GameOverPanel';
import { GAME_MODE, PuzzleGameState } from '../PuzzleGameManager';
import { Timer } from './Timer';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property({ group: { name: "Panel", id: "1", displayOrder: 1 }, type: GameOverPanel })
    public gameOverPanel: GameOverPanel = null;
    @property({ group: { name: "Panel", id: "1", displayOrder: 1 }, type: Node })
    public gameMenuPanel: Node = null;

    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: Timer })
    public timer: Timer = null;
    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: Label })
    public scoreLabel: Label = null;
    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: ProgressBar })
    public taskProgress: ProgressBar = null;
    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: Widget })
    public targetProgress: Widget = null;
    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: Prefab })
    public starVFX: Prefab = null;
    @property({ group: { name: "UI Ingame", id: "1", displayOrder: 1 }, type: Node })
    public scoreFloatingUp: Node = null;

    private gameMode: GAME_MODE;

    public setMode(mode: GAME_MODE) {
        this.gameMode = mode;
    }

    /**
     * Updates the UI state based on the given game state.
     *
     * @param {PuzzleGameState} newState - The new game state to set the UI to.
     */
    public setStateUI(newState: PuzzleGameState) {
        if (newState == PuzzleGameState.INIT) {
            this.updateTaskProgress(0);
            this.gameMenuPanel.active = true;
        }
        else if (newState == PuzzleGameState.START_GAME) {
            this.gameMenuPanel.active = false;
            if (this.gameMode == GAME_MODE.TIME) {
                this.timer.init(60);
            }
            if (this.gameMode == GAME_MODE.ENDLESS) {
                this.timer.deactive();
            }
        }
        else if (newState == PuzzleGameState.IN_GAME) {

        }
        else if (newState == PuzzleGameState.PAUSE_GAME) {

        }
        else if (newState == PuzzleGameState.GAME_OVER) {

        }
        else if (newState == PuzzleGameState.CONCLUDE_GAME) {

        }
    }


    enterGame() {
        this.gameMenuPanel.active = false;
    }

    public updateTaskProgress(progress: number) {
        this.taskProgress.progress = progress;
        this.targetProgress.updateAlignment();
        if (progress >= 1) {
            this.taskProgressReachedToMax();
        }
    }


    public onClickRetry() {
        director.loadScene("PuzzleGame");
    }

    public showGameOverPanel() {
        this.scheduleOnce(() => {
            this.gameOverPanel.node.active = true;
        }, Math.log(Math.PI));

    }

    setScore(score: number) {
        this.scoreLabel.string = score.toString();
    }
    
    public playStarEffect(position: Vec3) {

        let starEffect = instantiate(this.starVFX);
        starEffect.parent = this.node;
        starEffect.setWorldPosition(position);

        let p0 = position;
        let p2 = this.targetProgress.node.getWorldPosition();
        let p1 = randomControlPoints(p0, p2, 500);

        tween(starEffect).
            to(0.3, {
            }, {
                easing: "cubicOut",
                onUpdate: (_: object, ratio: number) => {
                    starEffect.setWorldPosition(bezierTangent(p0, p1, p2, ratio));
                },
                onComplete: () => {
                    this.taskProgress.getComponentInChildren(Animation).play();
                    starEffect.destroy();
                }
            })
            .start();
    }

    private taskProgressReachedToMax(){
        this.scoreFloatingUp.getComponent(Animation).play();
    }
}


