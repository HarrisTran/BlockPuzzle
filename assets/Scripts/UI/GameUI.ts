import { _decorator, Animation, Component, director, Label, Node, Sprite } from 'cc';
import { TimeMode } from './TimeMode';
import { delay } from '../Utilities';
import { GameOverPanel } from './GameOverPanel';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(GameOverPanel) gameOverPanel: GameOverPanel = null;
    @property(Node) gameMenuPanel: Node =  null;
    @property(TimeMode) timeModePanel: TimeMode = null;
    @property(Label) scoreText: Label = null;
    @property(Sprite) taskProgress: Sprite = null;
    @property(Animation) progressBarAnimation: Animation = null;

    protected start(): void {
        this.gameMenuPanel.active = true;
    }

    onClickEndlessMode(){
        this.timeModePanel.node.active = false;
        this.enterGame();
    }

    onClickTimeMode(){
        this.timeModePanel.startScreen(90);
        this.enterGame();
    }

    enterGame(){
        this.gameMenuPanel.active = false;
    }

    public updateTaskProgress(progress: number){
        this.taskProgress.fillRange = progress;
        this.progressBarAnimation.play();
    }


    public onClickRetry(){
        director.loadScene("PuzzleGame");
    }

    public showGameOverPanel() {
        this.gameOverPanel.node.active = true;
    }

    setScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


