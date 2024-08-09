export interface IObject {
    [key: string]: any;
}

export interface IUserInfo {
    id: string;
    displayName: string;
    promoCode: string;
    isSubscriber: boolean;
    avatarLink: string;
}

export interface IParticipationInfo {
    id: string;
    totalScore: number;
    myRank: number;
    gameStates: IObject;
    parameters: IObject;
}

export interface ILogger {
    log(...data: (number | string | boolean | undefined | null)[]): void;
    info(...data: (number | string | boolean | undefined | null)[]): void;
    warn(...data: (number | string | boolean | undefined | null)[]): void;
    error(...data: (number | string | boolean | undefined | null)[]): void;
    addBadge(badge: string, style?: { color?: string; backgroundColor?: string }): ILogger;
}

export interface IAnalyticsModule {
    logger: ILogger;
}

export interface IDataModule {
    getItem<T>(key: string): T | null;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
    clear(): void;
}

export interface IBroadCast {
    emit(eventType: EventType | string, data?: any): void;
    on<K extends keyof EventMap>(eventType: K | string, listener: EventMap[K], thisArg?: any): void;
    off<K extends keyof EventMap>(eventType: K | string, listener: EventMap[K], thisArg?: any): void;
}

export enum EventType {
    OnKeyDown = 'OnKeyDown',
    OnKeyUp = 'OnKeyUp',
    OnMouse = 'OnMouse',
    OnMouseDown = 'OnMouseDown',
    OnMouseUp = 'OnMouseUp',
    OnGameStart = 'OnGameStart',
    OnGameEnd = 'OnGameEnd',
}

export interface EventMap {
    [EventType.OnKeyDown]: (key: number) => void;
    [EventType.OnKeyUp]: (key: number) => void;
    [EventType.OnMouse]: (position: IVector2) => void;
    [EventType.OnMouseDown]: (button: number) => void;
    [EventType.OnMouseUp]: (button: number) => void;
    [EventType.OnGameStart]: () => void;
    [EventType.OnGameEnd]: (score: number) => void;
    [event: string]: (data: any) => void;
}

interface IVector2 {
    x: number;
    y: number;
}

export interface SDK {
    bundle: string;
    previousScore: number;
    currentScore: number;
    totalScore: number;
    userRank: number;
    isUseApi: boolean;
    tournamentData: IDataModule;
    userData: IDataModule;
    gameData: IDataModule;
    analytics: IAnalyticsModule;
    broadCast: IBroadCast;
    gameTime: number;
    updateScore(score: number): void;
    init(): Promise<void>;
    getUserInfo(): Promise<IUserInfo>;
    getLeaderBoard(start: number, count: number): Promise<IParticipationInfo[]>;
    startGame(): Promise<boolean>;
    endGame(): Promise<boolean>;
    getUserCoin(): Promise<number>;
    collectItem(itemId: string, quantity: number): Promise<void>;
}

enum InitState {
    UnInitialized,
    Initialized,
}

(window as any).P4P = {
    isUseApi: true,
};

class _P4PSDK implements SDK {
    private _initState: InitState = InitState.UnInitialized;
    private _sdk: SDK;

    private get sdk() {
        if (this._initState !== InitState.Initialized || !this._sdk) {
            throw new Error('P4P SDK is not initialized yet. Please call P4PSDK.init() first.');
        }
        return this._sdk;
    }

    public get tournamentData(): IDataModule {
        return this.sdk.tournamentData;
    }
    public get userData(): IDataModule {
        return this.sdk.userData;
    }
    public get gameData(): IDataModule {
        return this.sdk.gameData;
    }
    public get analytics(): IAnalyticsModule {
        return this.sdk.analytics;
    }
    public get broadCast(): IBroadCast {
        return this.sdk.broadCast;
    }
    public get bundle(): string {
        return this.sdk.bundle;
    }
    public get previousScore(): number {
        return this.sdk.previousScore;
    }
    public get currentScore(): number {
        return this.sdk.currentScore;
    }
    public get totalScore(): number {
        return this.sdk.totalScore;
    }
    public get userRank(): number {
        return this.sdk.userRank;
    }
    public get isUseApi(): boolean {
        return this.sdk.isUseApi;
    }
    public set isUseApi(value: boolean) {
        (window as any).P4P.isUseApi = value;
    }
    public get gameTime(): number {
        return this.sdk.gameTime;
    }

    private async loadSDK(): Promise<void> {
        return new Promise((resolve, reject) => {
            const tag = document.createElement('script');
            tag.type = 'module';
            tag.src = 'https://storage.googleapis.com/play-now-1aef8.appspot.com/SDKTEST/sdk.js';
            // tag.src = 'https://storage.googleapis.com/promogame/SDK/V2/sdk.js';
            tag.async = true;
            tag.onload = async () => {
                this._sdk = (globalThis as any).P4P.SDK;
                if (this._sdk) {
                    await this._sdk.init();
                    resolve();
                } else {
                    reject('P4P SDK is undefined');
                }
            };
            tag.onerror = (e) => {
                console.error('Failed to load P4PSDK JS. Please check your internet connection.');
                reject(e);
            };
            document.head.appendChild(tag);
        });
    }

    public async init(): Promise<void> {
        if (this._initState == InitState.Initialized) return;
        await this.loadSDK();
        this._initState = InitState.Initialized;
    }

    public setIsUseApi(value: boolean) {
        (window as any).P4P.isUseApi = value;
    }

    public updateScore(score: number): void {
        this.sdk.updateScore(score);
    }

    public getUserInfo(): Promise<IUserInfo> {
        return this.sdk.getUserInfo();
    }

    public getLeaderBoard(start: number, count: number) {
        return this.sdk.getLeaderBoard(start, count);
    }

    public startGame(): Promise<boolean> {
        return this.sdk.startGame();
    }
    public endGame(): Promise<boolean> {
        return this.sdk.endGame();
    }
    public getUserCoin(): Promise<number> {
        return this.sdk.getUserCoin();
    }
    public collectItem(itemId: string, quantity: number): Promise<void> {
        return this.sdk.collectItem(itemId, quantity);
    }
}

const P4PSDK: SDK = new _P4PSDK();

export default P4PSDK;