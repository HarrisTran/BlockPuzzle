import { JsonAsset } from "cc";
import { randomInList } from "./Utilities";
import { TetrominoData } from "./TetrominoPiece";

type Task = {[key: string] : {progress: number, total: number}};

interface Step {
    id: string;
    tasks: Task[];
    reward: number;
}

class TaskManager {
    private steps: Step[];
    private currentStepIndex : number;

    constructor(steps: Step[]) {
        this.steps = steps;
        this.currentStepIndex = 0;
        console.log(this.getProgressCurrentStep());
        
    }

    public getCurrentStep() : Step {
        return this.steps[this.currentStepIndex];
    }

    private areAllTasksCompleted() : boolean {
        return this.steps[this.currentStepIndex].tasks.every(task => task.progress >= task.total);
    }

    public completeTask(taskId: string, progress: number) {
        let reward : number = 0;
        let step = this.getCurrentStep();
        if(step){
            let task = step.tasks[taskId];
            if(task) {
                task[taskId] += progress;
                if(this.areAllTasksCompleted()) {
                    reward = step.reward;
                    this.movetoNextStep();
                    return reward;
                }
            }
        }
        return reward;
    }

    public getProgressCurrentStep() : number {
        let step = this.getCurrentStep();
        if(step) {
            let current = 0;
            let total = 0;
            step.tasks.map(task => {
                let key = Object.keys(task);
                current = key.reduce((a, b) => a + task[b].progress, 0);
                total = key.reduce((a, b) => a + task[b].total, 0);
            });
            console.log(current+"/"+total);
            return current / total;
        }
        return 0;
    }

    movetoNextStep() {
        this.currentStepIndex ++;
        if(this.currentStepIndex >= this.steps.length) {
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

        let steps : Step[] = [];
        for (let data in comboData.json) {
            let id = data;
            let tasks : Task[] = [];
            for(let x of comboData.json[data].Condition){
                tasks.push({
                    [x.id]: {progress: 0, total: x.count}
                });
            }
            let reward = comboData.json[data].Reward;
            steps.push({id, tasks, reward});
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

    // private evaluateStepIsCompleted() {
    //     // let headComboCondition = this.ComboRepository[0].Condition;
    //     // let currentProgress = headComboCondition.reduce((a, b) => a + b[1], 0);
    //     // let percent = 1 - currentProgress / this.ComboRepository[0].Total;

    //     // if(percent >= 1){
    //     //     let nextCombo = this.ComboRepository.shift();
    //     //     this.ComboRepository.push(nextCombo);
            
    //     //     return {
    //     //         percent: 1,
    //     //         bonus: nextCombo.Reward
    //     //     }
    //     // }
    //     // else{
    //     //     console.log(this.ComboRepository);
    //     //     return {
    //     //         percent: percent,
    //     //         bonus: 0
    //     //     }
    //     // }
    //     this.taskManager.
    // }

    
    /**
     * Updates the progress of a task with the given ID.
     *
     * @param {string} id - The ID of the task to update.
     * @return {number} The reward earned for completing the task, or 0 if the task was not completed.
     */
    public updateTaskProgress(id: string): number {
        return this.taskManager.completeTask(id, 1);
    }


}
