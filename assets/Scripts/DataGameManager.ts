import { JsonAsset } from "cc";
import { randomInList } from "./Utilities";
import { TetrominoData } from "./TetrominoPiece";



export class DataGameManager {

    public endlessDataLoaded: string[][] = [];
    private _indexEndless: number = 0;
    public PredefinedTetrominoPieces: Record<string, TetrominoData> = {};

    public constructor(block: any, endlessData: JsonAsset) {
        this.endlessDataLoaded = endlessData.json as string[][];

        // loop a record type
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
    }

    public getNextEndlessData(): string[] {
        let parts =  this.endlessDataLoaded[this._indexEndless][0].split("|");
        let extracted: string[] = [];
        for (let part of parts) {
            let ids = part.split(",");
            extracted.push(`polyomino_${randomInList(ids)}`);
        }
        this._indexEndless++;
        if (this._indexEndless >= this.endlessDataLoaded.length) this._indexEndless = 0;
        return extracted;
    }

}
