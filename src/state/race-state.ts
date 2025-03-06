import { Race } from "../models/race";
import * as DataStorage from '../utils/data-storage'
import { validateRaceInput } from "../utils/validation";

type Listener<T> = (items: T[]) => void;
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
      }
}

export class RaceState extends State<Race> {
    public races: Race[] = [];
    private static instance: RaceState;

    private constructor() {
        super();
    }

    // singleton RaceState
    static getInstance() {
        if (this.instance) {
          return this.instance;
        }
        this.instance = new RaceState();
        return this.instance;
      }

    addRace(newRace: Race){
        validateRaceInput(newRace, this.races, true);
        this.races.push(newRace);
        DataStorage.saveData('races', JSON.stringify(this.races));

        this.updateListeners();
    }

    editRace(raceToUpdate: Race){
        validateRaceInput(raceToUpdate, this.races, false);
        this.races = this.races.filter(race => race.id !== raceToUpdate.id);
        this.races.push(raceToUpdate);

        DataStorage.saveData('races', JSON.stringify(this.races));
        console.log('current race list after editRace', this.races);
        this.updateListeners();
    }

    getRace(raceId: string){
        return this.races.find(race => race.id === raceId);
    }

    deleteRace(){}

    private updateListeners(){
        for (const listenerFn of this.listeners) {
            listenerFn(this.races.slice());
        }
    }
}

export const raceState = RaceState.getInstance();