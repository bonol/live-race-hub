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
        if (this.isRaceNameTaken(newRace.name)) {
            throw new Error(`Race name ${newRace.name} already taken`);
        }
        this.races.push(newRace);
        localStorage.setItem('races', JSON.stringify(this.races));
        console.log('current race list', this.races);
        this.updateListeners();
    }
    isRaceNameTaken(name) {
        return this.races.some(race => race.name === name);
    }
    editRace() { }
    deleteRace() { }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.races.slice());
        }
    }
    updateLocalStorage(newRace) {
        const storedRacesJson = localStorage.getItem('races');
        console.log('storedRacesJson', storedRacesJson);
        if (storedRacesJson !== null) {
            const storedRaces = JSON.parse(storedRacesJson);
            console.log('storedRaces', storedRaces);
            localStorage.setItem('races', JSON.stringify(storedRaces.push(newRace)));
        }
        else {
            localStorage.setItem('races', JSON.stringify(this.races));
        }
    }
}
export const raceState = RaceState.getInstance();
