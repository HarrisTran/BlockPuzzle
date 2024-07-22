import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Label) scoreText: Label = null;

    public onGameStart(){
        this.node.getChildByName("GameOver").active = false;
    }

    public onGameOver(){
        this.node.getChildByName("GameOver").active = true;
    }

    public onClickRetry(){
        director.loadScene("PuzzleGame");
    }

    setScore(score: number) {
        this.scoreText.string = score.toString();
    }
}


