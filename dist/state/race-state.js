import { Race, RaceStatus } from "../models/race";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class RaceState extends State {
    constructor() {
        super();
        this.races = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new RaceState();
        return this.instance;
    }
    addRace(name, minParticipant, maxParticipant, racers) {
        const newRace = new Race(crypto.randomUUID.toString(), name, minParticipant, maxParticipant, RaceStatus.Ready, racers, []);
        this.races.push(newRace);
        localStorage.setItem('races', JSON.stringify(this.races));
        console.log('current race list', this.races);
        this.updateListeners();
    }
    editRace() { }
    deleteRace() { }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.races.slice());
        }
    }
}
export const raceState = RaceState.getInstance();
