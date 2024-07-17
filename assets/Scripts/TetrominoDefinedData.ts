import { TetrominoData } from "./TetrominoPiece";

export const PredefinedTetrominoPieces = new Array<TetrominoData>(
    {
		id: "tetromino_01",
		grid: [{
			size: [1, 1] as [number, number],
			data: [1]
		}],
		selected: 0
	},
    {
		id: "tetromino_02",
		grid: [{
			size: [2, 1] as [number, number],
			data: [1, 1]
		}, {
			size: [1, 2] as [number, number],
			data: [1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_03",
		grid: [{
			size: [2, 2] as [number, number],
			data:
				[1, 0,
				1, 1]
		}, {
			size: [2, 2] as [number, number],
			data:
				[1, 1,
				0, 1]
		}, {
			size: [2, 2] as [number, number],
			data:
				[0, 1,
				1, 1]
		}, {
			size: [2, 2] as [number, number],
			data:
				[1, 1,
				1, 0]
		}],
		selected: 0
	},
    {
		id: "tetromino_04",
		grid: [{
			size: [3, 1] as [number, number],
			data: [1, 1, 1]
		}, {
			size: [1, 3] as [number, number],
			data: [1, 1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_05",
		grid: [{
			size: [2, 2] as [number, number],
			data: [1, 1, 1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_06",
		grid: [{
			size: [4, 1] as [number, number],
			data: [1, 1, 1, 1]
		}, {
			size: [1, 4] as [number, number],
			data: [1, 1, 1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_07",
		grid: [{
			size: [3, 2] as [number, number],
			data:
				[1, 0, 0,
				1, 1, 1]
		}, {
			size: [2, 3] as [number, number],
			data:
				[1, 1,
				1, 0,
				1, 0]
		}, {
			size: [3, 2] as [number, number],
			data:
				[1, 1, 1,
				0, 0, 1]
		}, {
			size: [2, 3] as [number, number],
			data:
				[0, 1,
				0, 1,
				1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_08",
		grid: [{
			size: [3, 2] as [number, number],
			data:
				[0, 0, 1,
				1, 1, 1]
		}, {
			size: [2, 3] as [number, number],
			data:
				[1, 0,
				1, 0,
				1, 1]
		}, {
			size: [3, 2] as [number, number],
			data: 
				[1, 1, 1,
				1, 0, 0]
		}, {
			size: [2, 3] as [number, number],
			data:
				[1, 1,
				0, 1,
				0, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_09",
		grid: [{
			size: [3, 2] as [number, number],
			data:
				[0, 1, 0,
				1, 1, 1]
		}, {
			size: [2, 3] as [number, number],
			data:
				[1, 0,
				1, 1,
				1, 0]
		}, {
			size: [3, 2] as [number, number],
			data:
				[1, 1, 1,
				0, 1, 0]
		}, {
			size: [2, 3] as [number, number],
			data:
				[0, 1,
				1, 1,
				0, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_10",
		grid: [{
			size: [3, 2] as [number, number],
			data:
				[1, 1, 0,
				0, 1, 1]
		}, {
			size: [2, 3] as [number, number],
			data:
				[0, 1,
				1, 1,
				1, 0]
		}],
		selected: 0
	},
	{
		id: "tetromino_11",
		grid: [{
			size: [3, 2] as [number, number],
			data:
				[0, 1, 1,
				1, 1, 0]
		}, {
			size: [2, 3] as [number, number],
			data:
				[1, 0,
				1, 1,
				0, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_12",
		grid: [{
			size: [3, 3] as [number, number],
			data:
				[1, 0, 0,
				1, 0, 0,
				1, 1, 1]
		}, {
			size: [3, 3] as [number, number],
			data:
				[1, 1, 1,
				1, 0, 0,
				1, 0, 0]
		}, {
			size: [3, 3] as [number, number],
			data:
				[1, 1, 1,
				0, 0, 1,
				0, 0, 1]
		}, {
			size: [3, 3] as [number, number],
			data:
				[0, 0, 1,
				0, 0, 1,
				1, 1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_13",
		grid: [{
			size: [3, 3] as [number, number],
			data:
				[1, 1, 1,
				1, 1, 1,
				1, 1, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_14",
		grid: [{
			size: [3, 3] as [number, number],
			data:
				[1, 1, 1,
				0, 1, 0,
				0, 1, 0]
		}, {
			size: [3, 3] as [number, number],
			data:
				[0, 1, 0,
				0, 1, 0,
				1, 1, 1]
		}, {
			size: [3, 3] as [number, number],
			data:
				[1, 0, 0,
				1, 1, 1,
				1, 0, 0]
		}, {
			size: [3, 3] as [number, number],
			data:
				[0, 0, 1,
				1, 1, 1,
				0, 0, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_15",
		grid: [{
			size: [3, 3] as [number, number],
			data:
				[1, 1, 0,
				0, 1, 0,
				0, 1, 1]
		}, {
			size: [3, 3] as [number, number],
			data:
				[0, 1, 1,
				0, 1, 0,
				1, 1, 0]
		}, {
			size: [3, 3] as [number, number],
			data:
				[0, 0, 1,
				1, 1, 1,
				1, 0, 0]
		}, {
			size: [3, 3] as [number, number],
			data:
				[1, 0, 0,
				1, 1, 1,
				0, 0, 1]
		}],
		selected: 0
	},
    {
		id: "tetromino_16",
		grid: [{
			size: [3, 3] as [number, number],
			data:
				[0, 1, 0,
				1, 1, 1,
				0, 1, 0]
		}],
		selected: 0
	},
);