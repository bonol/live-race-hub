import * as DataStorage from '../utils/data-storage';
import { validateRaceInput } from "../utils/validation";
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
    addRace(newRace) {
        validateRaceInput(newRace, this.races, true);
        this.races.push(newRace);
        DataStorage.saveData('races', JSON.stringify(this.races));
        this.updateListeners();
    }
    editRace(raceToUpdate) {
        validateRaceInput(raceToUpdate, this.races, false);
        this.races = this.races.filter(race => race.id !== raceToUpdate.id);
        this.races.push(raceToUpdate);
        DataStorage.saveData('races', JSON.stringify(this.races));
        console.log('current race list after editRace', this.races);
        this.updateListeners();
    }
    getRace(raceId) {
        return this.races.find(race => race.id === raceId);
    }
    deleteRace() { }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.races.slice());
        }
    }
}
export const raceState = RaceState.getInstance();
