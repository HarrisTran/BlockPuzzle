import { JsonAsset } from "cc";
import { randomInList } from "./Utilities";
import { TetrominoData } from "./TetrominoPiece";
import { PuzzleGameManager } from "./PuzzleGameManager";

type Task = { [key: string]: { progress: number, total: number } };

interface Step {
    id: string;
    tasks: Task[];
    reward: number;
}

class TaskManager {
    private steps: Step[];
    private currentStepIndex: number;

    constructor(steps: Step[]) {
        this.steps = steps;
        this.currentStepIndex = 0;
    }

    public getCurrentStep(): Step {
        return this.steps[this.currentStepIndex];
    }

    private areAllTasksCompleted(): boolean {
        return this.getCurrentStep().tasks.every(task => {
            const [taskId] = Object.keys(task);
            const taskData = task[taskId];
            return taskData.progress >= taskData.total;
        });
    }

    public completeTask(taskId: string, progress: number) {
        let step = this.getCurrentStep();

        if (step) {
            let task = step.tasks.find(task => Object.keys(task)[0] === taskId);
            if (task) {
                task[taskId].progress += progress;
                if (this.areAllTasksCompleted()) {
                    PuzzleGameManager.instance.taskProgressReachedToMax();
                    this.movetoNextStep();
                }
            }
        }
    }

    public getProgressCurrentStep(): number {
        let step = this.getCurrentStep();
        if (step) {
            let current = 0;
            let total = 0;
            step.tasks.map(task => {
                let key = Object.keys(task);
                current = key.reduce((a, b) => a + task[b].progress, 0);
                total = key.reduce((a, b) => a + task[b].total, 0);
            });
            return current / total;
        }
        return 0;
    }

    movetoNextStep() {
        this.currentStepIndex++;
        if (this.currentStepIndex >= this.steps.length) {
            this.currentStepIndex = 0;
        }
    }
}



export class DataGameManager {

    public endlessDataLoaded: string[][] = [];
    private _indexEndless: number = 0;

    public PredefinedTetrominoPieces: Record<string, TetrominoData> = {};

    public taskManager: TaskManager;

    public constructor(block: any, endlessData: any, comboData: any) {

        this.endlessDataLoaded = endlessData.json as string[][];
        // Defined Tetrominoes Data
        for (let key in block.json) {
            let data = block.json[key];
            this.PredefinedTetrominoPieces[key] = {
                id: key,
                grid: {
                    size: data.grid.size,
                    data: data.grid.data,
                },
            }
        }

        let steps: Step[] = [];
        for (let data in comboData.json) {
            let id = data;
            let tasks: Task[] = [];
            for (let x of comboData.json[data].Condition) {
                tasks.push({
                    [x.id]: { progress: 0, total: x.count }
                });
            }
            let reward = comboData.json[data].Reward;
            steps.push({ id, tasks, reward });
        }
        this.taskManager = new TaskManager(steps);


    }

    public getNextEndlessData(): string[] {
        let parts = this.endlessDataLoaded[this._indexEndless][0].split("|");
        let extracted: string[] = [];
        for (let part of parts) {
            let ids = part.split(",");
            extracted.push(`polyomino_${randomInList(ids)}`);
        }
        this._indexEndless++;
        if (this._indexEndless >= this.endlessDataLoaded.length) this._indexEndless = 0;
        return extracted;
    }



    public updateTaskProgress(id: string){
        this.taskManager.completeTask(id, 1);
    }

    public getStepProgress(): number {
        let step = this.taskManager.getCurrentStep();
        const totalProgress = step.tasks.reduce((acc, task) => {
            const [taskId] = Object.keys(task);
            const taskData = task[taskId];
            return acc + taskData.progress/taskData.total;
        }, 0);

        const totalTasks = step.tasks.length;

        return totalProgress/totalTasks;
    }

    public getRewardScoreCurrentStep(){
        return this.taskManager.getCurrentStep().reward;
    }


}
