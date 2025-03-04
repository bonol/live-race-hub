import { Race, RaceStatus, Racer } from "../models/race";
import { v4 as uuid } from 'uuid';

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

    addRace(name: string, minParticipant: number, maxParticipant: number, racers: Racer[] ){
        const newRace = new Race(
            uuid().toString(),
            name,
            minParticipant,
            maxParticipant,
            RaceStatus.Ready,
            racers,
            []
        );
        this.races.push(newRace);
        localStorage.setItem('races', JSON.stringify(this.races));

        console.log('current race list', this.races);
        this.updateListeners();
    }

    editRace(){}

    deleteRace(){}

    private updateListeners(){
        for (const listenerFn of this.listeners) {
            listenerFn(this.races.slice());
        }
    }
}

export const raceState = RaceState.getInstance();