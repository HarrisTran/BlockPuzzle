import { _decorator, Component, director, Label, Node, Sprite } from 'cc';
import { TimeMode } from './TimeMode';
import { delay } from '../Utilities';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Node) gameOverPanel: Node = null;
    @property(Node) gameMenuPanel: Node =  null;
    @property(TimeMode) timeModePanel: TimeMode = null;
    @property(Label) scoreText: Label = null;
    @property(Sprite) taskProgress: Sprite = null;

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
    }


    public onClickRetry(){
        director.loadScene("PuzzleGame");
    }

    public async showGameOverPanel() {
        await delay(1)
        this.gameOverPanel.active = true;
    }

    setScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


