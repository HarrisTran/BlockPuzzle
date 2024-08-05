import { JsonAsset } from "cc";
import { randomInList } from "./Utilities";
import { TetrominoData } from "./TetrominoPiece";



export class DataGameManager {

    public endlessDataLoaded: string[][] = [];
    private _indexEndless: number = 0;

    public PredefinedTetrominoPieces: Record<string, TetrominoData> = {};
    public ComboRepository: {
        "No": number,
        "Condition": [number, number][],
        "Total": number,
        "Reward": number
    }[] = [];

    public constructor(block: any, endlessData: JsonAsset, comboData: JsonAsset) {
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
        // Defined Combo Data
        comboData.json.forEach(data => {
            this.ComboRepository.push({
                "No": data.No,
                "Condition": data.Condition.map(c => [c.id, c.count]),
                "Total": data.Condition.reduce((a, b) => a + b.count, 0),
                "Reward" : data.Reward
            })
        })
        
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

    private evaluateComboIsCompleted() {
        let headComboCondition = this.ComboRepository[0].Condition;
        let currentProgress = headComboCondition.reduce((a, b) => a + b[1], 0);
        let percent = 1 - currentProgress / this.ComboRepository[0].Total;
        
        return percent >= 1 ? {
            percent: percent,
            bonus: this.ComboRepository.shift().Reward
        }:{
            percent: percent,
            bonus: 0
        }

        
    }

    public updateHeadComboCount(id: number) {
        this.ComboRepository[0].Condition.forEach(condition => {
            if (condition[0] == id) {
                condition[1]--;
                if (condition[1] < 0) condition[1] = 0;
            }
        })
        return this.evaluateComboIsCompleted();
    }


}
