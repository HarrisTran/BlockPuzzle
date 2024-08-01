import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum ENUM_AUDIO_CLIP {
    BGM,
    BOOSTER,
    END_GAME,
    PICK_UP,
    PUT_DOWN,
    SCORE,
}

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager;

    public static get instance(): AudioManager
    {
        return this._instance;
    }
    @property({ group: { name: "AudioSources", id: "1", displayOrder: 1 }, type: AudioSource })
    public musicSource: AudioSource;
    @property({ group: { name: "AudioClip Repository", id: "1", displayOrder: 1 }, type: [AudioClip] })
    public audioClipList: AudioClip[] = [];

    private _audioClipSet: { [key: string]: AudioClip } = {};
    private _audioSourceSet: Map<ENUM_AUDIO_CLIP, AudioSource> = new Map();

    protected onLoad(): void {
        this._audioClipSet[ENUM_AUDIO_CLIP.BGM] = this.audioClipList[0];
        this._audioClipSet[ENUM_AUDIO_CLIP.BOOSTER] = this.audioClipList[1];
        this._audioClipSet[ENUM_AUDIO_CLIP.END_GAME] = this.audioClipList[2];
        this._audioClipSet[ENUM_AUDIO_CLIP.PICK_UP] = this.audioClipList[3];
        this._audioClipSet[ENUM_AUDIO_CLIP.PUT_DOWN] = this.audioClipList[4];
        this._audioClipSet[ENUM_AUDIO_CLIP.SCORE] = this.audioClipList[5];

        AudioManager._instance = this;
    }

    public playBGM() {
        this.musicSource.stop();
        this.musicSource.clip = this._audioClipSet[ENUM_AUDIO_CLIP.BGM];
        this.musicSource.play();
    }


    public playSfx(audioClipName: ENUM_AUDIO_CLIP, loop = false) {
        let sfxSource: AudioSource = null;
        if (this._audioSourceSet.has(audioClipName)) {
            sfxSource = this._audioSourceSet.get(audioClipName);
        } else {
            sfxSource = new AudioSource();
            this._audioSourceSet.set(audioClipName, sfxSource);
        }
        sfxSource.stop();
        sfxSource.clip = this._audioClipSet[audioClipName];
        sfxSource.loop = loop;
        if (loop) return;
        sfxSource.play();
    }

}


