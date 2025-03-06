import {v4 as uuid} from 'uuid';
import { RaceState } from "./race-state";
import { RaceStatus, Race } from "../models/race";

describe('RaceState', () => {
    beforeEach(() => {
        const state = RaceState.getInstance();
        state.races = [];
        localStorage.clear;
    });

    it('should add a new race and update localStorage', () => {
        const state = RaceState.getInstance();
        const racer1 = {
            id: uuid().toString(),
            name: 'Tommy',
            raceLane: 2,
        };
        const racer2 = {
            id: uuid().toString(),
            name: 'Ron',
            raceLane: 3,
        };
        const newRace = new Race(uuid().toString(), 'new race', 2, 8, RaceStatus.Ready, [racer1, racer2], []);
        
        state.addRace(newRace);
        expect(state.races.length).toBe(1);
        const race = state.races[0];
        expect(race.name).toBe('new race');
        expect(race.status).toBe(RaceStatus.Ready);

        // test localStorage update
        const storedRaces = JSON.parse(localStorage.getItem('races')!);
        expect(storedRaces.length).toBe(1);
        expect(storedRaces[0].name).toBe('new race');
    });
});